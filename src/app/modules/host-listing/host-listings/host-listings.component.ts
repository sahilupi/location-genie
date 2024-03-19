import { Component } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { ActivatedRoute, Router } from '@angular/router';
import { BecomeHost } from 'src/app/constants/become-host';
import { ListingDetails } from 'src/app/constants/listing-details.constant';
import { LocalConstant } from 'src/app/constants/local-constant';
import { BaseResonse, Pagination } from 'src/app/models/common.model';
import { ListingsData } from 'src/app/models/listing.model';
import { HostListing } from 'src/app/models/location.model';
import { ListingService } from 'src/app/services/listing.service';
import { LocalService } from 'src/app/services/local.service';
import { ConfirmDialogComponent } from 'src/app/shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-host-listings',
  templateUrl: './host-listings.component.html',
  styleUrls: ['./host-listings.component.scss'],
})
export class HostListingsComponent {
  allListings: ListingsData[] = [];
  listingStatus = [...ListingDetails.listingStatus];
  listingStatusBtns = [...BecomeHost.listingStatusBtns];
  isFetchingFirstTime = true;
  isLoading = false;
  pagination: Pagination = {
    pageNumber: 1,
    pageSize: 10,
  };
  totalCount: number = 10;
  status = 0;
  email: string;
  dummyImage = 'assets/images/dummy/default_image.png';
  selectedStatus = 'All listings';
  addListingBtn = 'Add Listing';

  constructor(
    private listingsService: ListingService,
    public dialogRef: MatDialogRef<ConfirmDialogComponent>,
    private dialog: MatDialog,
    private localService: LocalService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  async ngOnInit(): Promise<void> {
    const userData = await this.localService.getLocalData(
      LocalConstant.USER_DATA
    );
    this.email = userData.user_name;
    await this.fetchLatestListings();
    this.isFetchingFirstTime = true;
  }

  private async fetchLatestListings(): Promise<void> {
    this.activatedRoute.queryParams.subscribe(async (queryParam) => {
      const pageNumber = queryParam['pageNumber'];
      const pageSize = queryParam['pageSize'];
      switch (queryParam['status']) {
        case 'draft':
          this.selectedStatus = 'Drafts';
          break;
        case 'all':
          this.selectedStatus = 'All listings';
          break;
        case 'inreview':
          this.selectedStatus = 'In review';
          break;
        case 'rejected':
          this.selectedStatus = 'Rejected';
          break;
        case 'published':
          this.selectedStatus = 'Published';
          break;

        default:
          break;
      }
      const status = this.listingStatus.find(
        (listingSt) =>
          listingSt.name.split(' ').join('').toLowerCase() ===
          queryParam['status']
      );
      this.status = status ? status.id : 0;
      if (pageNumber && pageSize && (this.status || this.status === 0)) {
        this.pagination.pageNumber = parseInt(pageNumber);
        this.pagination.pageSize = parseInt(pageSize);
        this.isLoading = true;
        const response = await this.listingsService.getAllListings(
          this.email,
          this.pagination,
          this.status
        );
        if (response && response.data) {
          this.patchListingData(response);
        }
        this.isLoading = false;
      } else {
        this.isLoading = true;
        if (this.isFetchingFirstTime) {
          await this.getAllListings();
        } else if (!this.isFetchingFirstTime) {
          const response = await this.listingsService.getAllListings(
            this.email,
            this.pagination,
            this.status
          );
          if (response && response.data) {
            this.patchListingData(response);
          }
        }
        this.pagination.pageNumber = 1;
        this.pagination.pageSize = 10;
        this.isLoading = false;
      }
    });
  }

  private async getAllListings(): Promise<void> {
    const response = this.activatedRoute.snapshot.data['allListings'];
    if (
      response &&
      response.success &&
      response.data &&
      response.data.length > 0
    ) {
      this.patchListingData(response);
    }
  }

  private patchListingData(response: BaseResonse): void {
    this.allListings = [];
    this.totalCount = Number(response.totalCount);
    const data = [...response.data];
    data.forEach((list: HostListing) => {
      const listing = list.listing;
      this.allListings.push({
        locationTitle: listing.listingLocationInfo?.locationTitle
          ? listing.listingLocationInfo.locationTitle
          : 'Unnamed Listing',
        id: Number(listing.id),
        city: listing.listingAddress.city,
        country: listing.listingAddress.country,
        lastModifiedDate: listing.lastModifiedDate
          ? listing.lastModifiedDate
          : listing.createdDate,
        createdDate: listing.createdDate,
        coverImage: list.coverImagePaths[0]
          ? list.coverImagePaths[0].imageFullPath
          : this.dummyImage,
        status: listing.status,
        isStepOneCompleted: listing.isStepOneCompleted,
        isStepTwoCompleted: listing.isStepTwoCompleted,
        isStepThreeCompleted: listing.isStepThreeCompleted,
        isActive: listing.isActive,
        activateDeactivateHistory: {
          isActivateRequestByHost:
            list.activateDeactivateHistory && list.activateDeactivateHistory[0]
              ? list.activateDeactivateHistory.at(-1)?.isActivateRequestByHost
              : false,
          deActivateReasonByAdmin:
            list.activateDeactivateHistory && list.activateDeactivateHistory[0]
              ? list.activateDeactivateHistory[
                  list.activateDeactivateHistory.length - 1
                ]?.deActivateReasonByAdmin
              : '',
          deActivateReasonByHost:
            list.activateDeactivateHistory && list.activateDeactivateHistory[0]
              ? list.activateDeactivateHistory[
                  list.activateDeactivateHistory.length - 1
                ].deActivateReasonByHost
              : '',
          isDeactivateRequestByHost:
            list.activateDeactivateHistory && list.activateDeactivateHistory[0]
              ? list.activateDeactivateHistory[
                  list.activateDeactivateHistory.length - 1
                ].isDeactivateRequestByHost
              : false,
        },
      });
    });

    this.allListings.sort(
      (a, b) =>
        new Date(String(b.createdDate)).getTime() -
        new Date(String(a.createdDate)).getTime()
    );
  }

  async onDeleteListing(listingId: number): Promise<void> {
    const dialogData = {
      title: 'Confirm Delete?',
      message: 'Are you sure you want to delete?',
      cancelBtnText: 'Cancel',
      confirmBtnText: 'Delete',
      isDeleting: true,
    };

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '450px',
      data: dialogData,
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe(async (dialogResult) => {
      if (dialogResult === true) {
        const response = await this.listingsService.deleteListing(listingId);
        if (response && response.success) {
          await this.fetchLatestListings();
          this.allListings = this.allListings.filter(
            (listing) => listing.id !== listingId
          );
        }
      }
    });
  }

  async onActivateDeactiavteListing(
    listingId: number,
    flag: boolean
  ): Promise<void> {
    const deactivateToggle = flag === true ? false : true;
    const action = flag ? 'Activate' : 'Deactivate';

    const dialogData = {
      title: `Confirm ${action}?`,
      message: `Are you sure you want to ${action}?`,
      cancelBtnText: 'Cancel',
      confirmBtnText: `${action}`,
      isDeactivateListing: deactivateToggle,
      isReasonRequired: true,
      showCancelBtn: true,
      id: listingId,
      isActivateListing: flag,
    };

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '450px',
      data: dialogData,
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe(async (dialogResult) => {
      if (dialogResult) {
        const response = await this.listingsService.getAllListings(
          this.email,
          this.pagination,
          this.status
        );
        if (response && response.data) {
          this.patchListingData(response);
        }
      }
    });
  }

  getStatus(status?: number): string | undefined {
    const foundStatusData = this.listingStatus.find(
      (stat) => stat.id === status
    );
    return foundStatusData?.name;
  }

  getColorOfStatus(status?: number): string {
    let color = '#dc3545';
    switch (status) {
      case 1:
        color = '#736f6f';
        break;
      case 2:
        color = '#ffc107';
        break;
      case 3:
        color = '#32ba55';
        break;
      case 4:
        color = '#dc3545';
        break;

      default:
        color = '#dc3545';
        break;
    }
    return color;
  }

  async onPageChange(event: PageEvent): Promise<void> {
    this.pagination.pageNumber = event.pageIndex + 1;
    this.pagination.pageSize = event.pageSize;
    const status = this.listingStatus.find(
      (listingSt) => listingSt.id === this.status
    );
    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams: {
        pageNumber: this.pagination.pageNumber,
        pageSize: this.pagination.pageSize,
        status: status ? status.name.split(' ').join('').toLowerCase() : 'all',
      },
      queryParamsHandling: 'merge',
    });

    const response = await this.listingsService.getAllListings(
      this.email,
      this.pagination,
      this.status
    );
    if (response && response.data) {
      this.patchListingData(response);
    }
  }

  async onStatusChange(status: string, selectedStatus: string): Promise<void> {
    if (this.selectedStatus === selectedStatus) return;

    this.pagination.pageNumber = 1;
    this.pagination.pageSize = 10;

    const statusData = this.listingStatus.find(
      (listingSt) => listingSt.name.split(' ').join('').toLowerCase() === status
    );
    this.status = statusData ? statusData.id : 0;

    const response = await this.listingsService.getAllListings(
      this.email,
      this.pagination,
      this.status
    );
    if (response && response.data) {
      this.router.navigate([], {
        relativeTo: this.activatedRoute,
        queryParams: {
          pageNumber: this.pagination.pageNumber,
          pageSize: this.pagination.pageSize,
          status: status,
        },
        queryParamsHandling: 'merge',
      });
      this.patchListingData(response);
    }
  }

  encryptListingId(listing: number): string {
    return btoa(String(listing));
  }
}
