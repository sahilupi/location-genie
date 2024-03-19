import { Component, OnInit, inject } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { debounceTime } from 'rxjs';
import { Pagination } from 'src/app/models/common.model';
import { SpaceCategoryModel } from 'src/app/models/home-edit.model';
import { LocationList, PopularLocation } from 'src/app/models/location.model';
import { HomeService } from 'src/app/services/home.service';

@Component({
  selector: 'app-edit-popular-location',
  templateUrl: './edit-popular-location.component.html',
  styleUrls: ['./edit-popular-location.component.scss'],
})
export class EditPopularLocationComponent implements OnInit {
  private homeService = inject(HomeService);
  private previousCheckedLocations: PopularLocation[] = [];
  private totalCount: number = 20;
  private selecedPopularLocations: any[] = [];
  private pagination: Pagination = {
    pageNumber: 1,
    pageSize: 20,
  };
  locations: LocationList[] = [];
  checkedLocations: LocationList[] = [];
  isLoading = false;
  dummyImage = 'assets/images/dummy/default_image.png';
  isPaginationLoading = false;
  isSearching = false;
  searchCtrl: FormControl = new FormControl();
  search = '';

  constructor(public dialogRef: MatDialogRef<EditPopularLocationComponent>) {}

  async ngOnInit(): Promise<void> {
    this.isLoading = true;
    try {
      await this.getAllListings();
      await this.getAllPopularLocations();
      this.isLoading = false;
      const element = document.getElementById(
        'dialog-content-popular-locations'
      );
      if (
        element &&
        element.scrollTop + element.clientHeight >= element.scrollHeight
      ) {
        this.isPaginationLoading = true;
        this.pagination.pageNumber++;
        await this.getAllListings();
        await this.patchSelectedLocations();
        this.isPaginationLoading = false;
      }

      this.searchCtrl.valueChanges
        .pipe(debounceTime(400))
        .subscribe(async (searchTerm) => {
          this.isSearching = true;
          this.search = searchTerm.trim().toLowerCase();
          if (!this.search) this.locations = [];
          this.pagination = {
            pageNumber: 1,
            pageSize: 20,
          };
          await this.getAllListings(this.search);
          await this.patchSelectedLocations();
          this.isSearching = false;
        });
    } catch (error) {
      this.isLoading = false;
    } finally {
      this.isLoading = false;
    }
  }

  async onScrollDown(event: Event): Promise<void> {
    const element = event.target as HTMLElement;
    if (
      this.totalCount > this.locations.length &&
      element.scrollTop + element.clientHeight >= element.scrollHeight
    ) {
      // You've reached the bottom of the dialog
      this.isPaginationLoading = true;
      this.pagination.pageNumber++;
      await this.getAllListings();
      await this.patchSelectedLocations();
      this.isPaginationLoading = false;
    }
  }

  private async getAllListings(search?: string): Promise<void> {
    const response = await this.homeService.getAllListings(
      this.pagination,
      this.search
    );
    if (response && response.data) {
      this.totalCount = Number(response.totalCount);
      const data = response.data;
      // data.map((listing: LocationList) => {
      //   listing.images = [this.dummyImage, this.dummyImage];
      //   listing.image = this.dummyImage;
      // });
      if (search) {
        this.locations = [...data];
      } else if (!search) {
        this.locations = [...this.locations, ...data];
      }
    }
  }

  private async getAllPopularLocations(): Promise<void> {
    const response = await this.homeService.getAllPopularLocations();
    if (response && response.data) {
      const data = response.data;

      data.map((listing: LocationList) => {
        this.previousCheckedLocations.push({
          position: Number(listing.position),
          listingId: Number(listing.listingId),
        });
        listing.images = [this.dummyImage, this.dummyImage];
        listing.image = this.dummyImage;
      });
      this.selecedPopularLocations = [...data];
      // for checking the previously selected positions
      await this.patchSelectedLocations();
    }
  }

  private async patchSelectedLocations(): Promise<void> {
    if (this.locations) {
      for (let i = 0; i < this.locations.length; i++) {
        if (
          this.selecedPopularLocations.some(
            (loc: SpaceCategoryModel) =>
              Number(loc.listingId) === Number(this.locations[i].listingId)
          )
        ) {
          this.selecedPopularLocations.some(
            (loc: SpaceCategoryModel, index: number) => {
              const foundedLoc = this.locations.find(
                (lo) => Number(lo.listingId) === Number(loc.listingId)
              );
              if (foundedLoc) {
                foundedLoc.checked = true;
                foundedLoc.position = this.selecedPopularLocations[index]
                  ? this.selecedPopularLocations[index].position
                  : this.selecedPopularLocations[index - 1].position;
                this.getChecked(foundedLoc, true);
              }
            }
          );
        }
      }
    }
  }

  getChecked(location: LocationList, isEmpty: boolean): void {
    if (isEmpty) {
      this.checkedLocations = [];
    }
    this.locations.map((loc: LocationList) => {
      if (loc.checked && !this.checkedLocations.includes(loc)) {
        this.checkedLocations.push(loc);
      }
    });
    this.checkedLocations.map((loc, i) => {
      if (loc.listingId === location.listingId && loc.checked) {
        location.position = i + 1;
      }
      if (loc.listingId === location.listingId && !loc.checked) {
        this.checkedLocations.splice(i, 1);
        location.position = undefined;
      }
    });

    this.checkedLocations.map((loc, i) => {
      loc.position = i + 1;
    });
  }

  async onSave(): Promise<void> {
    // if (
    //   this.previousCheckedLocations &&
    //   this.previousCheckedLocations.length > 0
    // ) {
    //   this.checkedLocations.map((loc, i) => {
    //     if (
    //       this.previousCheckedLocations &&
    //       this.previousCheckedLocations.length > 0
    //     ) {
    //       if (this.previousCheckedLocations[i]) {
    //         this.previousCheckedLocations[i].position;
    //         this.previousCheckedLocations[i].listingId = Number(loc.id);
    //       } else {
    //         this.previousCheckedLocations.push({
    //           position: Number(loc.position),
    //           listingId: Number(loc.id),
    //         });
    //       }
    //     }
    //   });
    // } else {
    //   this.checkedLocations.map((loc) => {
    //     this.previousCheckedLocations.push({
    //       position: Number(loc.position),
    //       listingId: Number(loc.id),
    //     });
    //   });
    // }
    const checkLocations: PopularLocation[] = [];
    this.checkedLocations.forEach((loc) => {
      checkLocations.push({
        position: Number(loc.position),
        listingId: Number(loc.listingId),
      });
    });
    if (!checkLocations || checkLocations.length <= 0) return;
    const response = await this.homeService.addUpdatePopularDestinations(
      checkLocations
    );
    if (response && response.data) {
      this.dialogRef.close(response.data.data);
    }
  }
}
