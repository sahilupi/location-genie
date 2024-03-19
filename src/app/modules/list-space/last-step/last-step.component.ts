import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { LocalConstant } from 'src/app/constants/local-constant';
import { LocationType } from 'src/app/models/location-types.model';
import { LocationList } from 'src/app/models/location.model';
import { ListingStepOneService } from 'src/app/services/listing-step-one.service';
import { ListingStepTwoService } from 'src/app/services/listing-step-two.service';
import { ListingService } from 'src/app/services/listing.service';
import { LocalService } from 'src/app/services/local.service';
import { SharedService } from 'src/app/services/shared.service';
import { SnackBarService } from 'src/app/services/snack-bar.service';
import { SpinnerService } from 'src/app/services/spinner.service';
import { ConfirmDialogComponent } from 'src/app/shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-last-step',
  templateUrl: './last-step.component.html',
  styleUrls: ['./last-step.component.scss'],
})
export class LastStepComponent {
  @Input() listingId: number;

  step1Route: string;
  step2Route: string;
  step3Route: string;
  categoryType: number;
  isStepOneCompleted = false;
  isStepTwoCompleted = false;
  isStepThreeCompleted = false;
  listing: LocationList;
  coverImage: string;
  isTutorialComplete = false;
  validationMsg = 'You need to complete hosting guide first';
  subCategoriesLength = 0;
  keyFeaturesLength = 0;
  interiorsLength = 0;
  isLoading = false;
  encryptedListingId: string;

  constructor(
    private stepOneService: ListingStepOneService,
    private stepTwoService: ListingStepTwoService,
    private sharedService: SharedService,
    private snackbar: SnackBarService,
    private dialog: MatDialog,
    private localService: LocalService,
    private router: Router,
    private listingService: ListingService,
    private spinner: SpinnerService
  ) {
    setTimeout(() => {
      this.sharedService.setHideHeader(false);
    }, 0);
  }

  async ngOnInit(): Promise<void> {
    this.spinner.show();
    try {
      this.step1Route = `/become-a-host/${+this.listingId}/step-1/address`;
      this.step2Route = `/become-a-host/${+this.listingId}/step-2/styles`;
      this.step3Route = `/become-a-host/${+this.listingId}/step-3/rules-crews`;
      await this.getInteriors(Number(this.listingId));
      await this.getSubCategories(Number(this.listingId));
      await this.getKeyFeatures(Number(this.listingId));
      await this.getListingDetails();
      await this.getSelectedListings();
      this.spinner.hide();
    } catch (error) {
      this.spinner.hide();
    }

    this.encryptedListingId = btoa(String(this.listingId));
  }

  private async getSelectedListings(): Promise<void> {
    const resposnse = await this.stepOneService.getCheckedLocationCategory(
      +this.listingId
    );
    if (resposnse && resposnse.success && resposnse.data) {
      const data = resposnse.data;
      this.categoryType = data.categoryType;
      this.isTutorialComplete = data.isHostingGuide;
      const selectedValues = data.locationCategoryIds.map(
        (loc: LocationType) => {
          if (loc.listing && loc.listing.isStepOneCompleted)
            this.isStepOneCompleted = loc.listing.isStepOneCompleted;
          if (loc.listing && loc.listing.isStepTwoCompleted)
            this.isStepTwoCompleted = loc.listing.isStepTwoCompleted;
          if (loc.listing && loc.listing.isStepThreeCompleted)
            this.isStepThreeCompleted = loc.listing.isStepThreeCompleted;
          return loc.listingLocationCategory.categoryName;
        }
      );
      this.updateRoutes(selectedValues);
    }
  }

  private async getListingDetails(): Promise<void> {
    const response = await this.listingService.getListingDetails(
      Number(this.listingId),
      true
    );
    if (response && response.success && response.data) {
      this.listing = response.data;
      const coverImg = this.listing.listingImagePathIds?.find(
        (image) => image.coverImagePathId
      );
      if (coverImg) {
        this.coverImage = coverImg.imagePath.imageFullPath;
      }
    }
  }

  updateRoutes(selectedValues: string[]): void {
    this.step2Route = `/become-a-host/${+this.listingId}/step-2/title`;
    if (this.interiorsLength > 0) {
      this.step2Route = `/become-a-host/${+this.listingId}/step-2/interior`;
    }
    if (this.keyFeaturesLength > 0) {
      this.step2Route = `/become-a-host/${+this.listingId}/step-2/features`;
    }
    if (this.subCategoriesLength > 0) {
      this.step2Route = `/become-a-host/${+this.listingId}/step-2/styles`;
    }

    // switch (this.categoryType) {
    //   case 1:
    //     // if (this.subCategoriesLength > 0) {
    //     //   this.step2Route = `/become-a-host/${+this.listingId}/step-2/styles`;
    //     // }
    //     break;
    //   case 2:
    //     // for title page
    //     if (selectedValues[0] === 'Cemetery' && selectedValues.length === 1) {
    //       this.step2Route = `/become-a-host/${+this.listingId}/step-2/title`;
    //       break;
    //     } else if (
    //       selectedValues.includes('Bar/Club') ||
    //       selectedValues.includes('Barber Shop') ||
    //       selectedValues.includes('Church/Temple') ||
    //       selectedValues.includes('Event Space') ||
    //       selectedValues.includes('Event Space') ||
    //       selectedValues.includes('Farm/Ranch') ||
    //       selectedValues.includes('Dance/Fitness/Gym') ||
    //       selectedValues.includes('Dance/Fitness/Gym') ||
    //       selectedValues.includes('Gallery') ||
    //       selectedValues.includes('Hotel/Motel') ||
    //       selectedValues.includes('Hotel/Motel') ||
    //       selectedValues.includes('Industrial Buildings') || // styles will be different
    //       selectedValues.includes('Museum') ||
    //       selectedValues.includes('Office') || // styles will be different
    //       selectedValues.includes('Restaurant/Cafe') ||
    //       selectedValues.includes('Restaurant/Cafe') ||
    //       selectedValues.includes('Salon/Spa') ||
    //       selectedValues.includes('School/University/Dormitory') ||
    //       selectedValues.includes('Theater') ||
    //       selectedValues.includes('Winery')
    //     ) {
    //       this.step2Route = `/become-a-host/${+this.listingId}/step-2/styles`;
    //       break;
    //       // for features
    //     } else if (
    //       selectedValues.includes('Airport/Hangar') ||
    //       selectedValues.includes('Bank') ||
    //       selectedValues.includes('Brewery') ||
    //       selectedValues.includes("Doctor's Office/Hospital") ||
    //       selectedValues.includes('Retail/Small Business') ||
    //       selectedValues.includes('Warehouse')
    //     ) {
    //       this.step2Route = `/become-a-host/${+this.listingId}/step-2/interior`;
    //       break;
    //       // for key features
    //     } else {
    //       this.step2Route = `/become-a-host/${+this.listingId}/step-2/features`;
    //     }
    //     break;
    //   case 3:
    //     if (
    //       (selectedValues[0] === 'TV Studio/Stage' &&
    //         selectedValues.length === 1) ||
    //       (selectedValues[0] === 'Photography Studio' &&
    //         selectedValues.length === 1) ||
    //       (selectedValues[0] === 'Recording Studio' &&
    //         selectedValues.length === 1) ||
    //       (selectedValues[0] === 'TV Studio/Stage' &&
    //         selectedValues.length === 1) ||
    //       (selectedValues[0] === 'Film Studio' && selectedValues.length === 1)
    //     ) {
    //       this.step2Route = `/become-a-host/${+this.listingId}/step-2/interior`;
    //       break;
    //     } else if (selectedValues.includes('Loft Studio')) {
    //       this.step2Route = `/become-a-host/${+this.listingId}/step-2/features`;
    //       break;
    //     } else {
    //       this.step2Route = `/become-a-host/${+this.listingId}/step-2/interior`;
    //       break;
    //     }
    //   case 4:
    //     if (selectedValues[0] === 'Train' && selectedValues.length === 1) {
    //       this.step2Route = `/become-a-host/${+this.listingId}/step-2/title`;
    //       break;
    //     }
    //     break;
    //   default:
    //     break;
    // }
  }

  async onPublishListing(): Promise<void> {
    if (
      !this.listing.listingImagePathIds ||
      this.listing.listingImagePathIds?.length < 5
    ) {
      const dialogData = {
        title: 'You need at least 5 photos.',
        message:
          'You need to upload atleast 5 photos (in "Set the scene" step) to get your listing published.',
        cancelBtnText: 'Upload later',
        confirmBtnText: 'Upload photos now',
        showCancelBtn: true,
      };

      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        width: '550px',
        data: dialogData,
        disableClose: false,
      });

      dialogRef.afterClosed().subscribe((res) => {
        if (res === true) {
          this.router.navigateByUrl(
            `/become-a-host/${this.listingId}/step-2/photos`
          );
        }
      });
    } else if (
      this.listing.listingImagePathIds &&
      this.listing.listingImagePathIds?.length >= 5
    ) {
      const dialogData = {
        title: 'Are you ready to Publish?',
        message: 'Are you sure want to publish your Listing?',
        cancelBtnText: 'Cancel',
        confirmBtnText: 'Yes, publish it',
        showCancelBtn: true,
      };

      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        width: '550px',
        data: dialogData,
        disableClose: true,
      });
      dialogRef.afterClosed().subscribe(async (res: boolean) => {
        if (res) {
          const response = await this.listingService.onPublishListing(
            Number(this.listingId)
          );
          if (response && response.success) {
            this.listing.listingStatus = 2;
            this.snackbar.success('You listing is submitted for review');
          }
        }
      });
    }
  }

  private async getSubCategories(listingId: number): Promise<void> {
    const response = await this.stepTwoService.getSubcategoriesByCategory(
      listingId
    );
    if (response && response.success && response.data) {
      this.subCategoriesLength = response.data.length;
    }
  }

  private async getKeyFeatures(listingId: number): Promise<void> {
    const response = await this.stepTwoService.getKeyFeatures(listingId);
    if (response && response.success && response.data) {
      this.keyFeaturesLength = response.data.length;
    }
  }

  private async getInteriors(listingId: number): Promise<void> {
    const response = await this.stepTwoService.getInteriors(listingId);
    if (response && response.success && response.data) {
      this.interiorsLength = response.data.length;
    }
  }

  async onStartHostingGuide(): Promise<void> {
    await this.localService.setLocalData(
      LocalConstant.REDIRECT_URL,
      location.pathname
    );
    this.router.navigateByUrl('/tutorial/slides/slide-1');
  }
}
