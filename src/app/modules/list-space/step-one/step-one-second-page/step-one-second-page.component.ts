import { Component, OnInit, Input } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ListingStepperConstant } from 'src/app/constants/listing-stepper.constant';
import { LocalConstant } from 'src/app/constants/local-constant';
import { LocationCategory } from 'src/app/constants/location-types.constant';
import {
  LocationKind,
  LocationType,
} from 'src/app/models/location-types.model';
import { ListingStepOneService } from 'src/app/services/listing-step-one.service';
import { LocalService } from 'src/app/services/local.service';
import { SpinnerService } from 'src/app/services/spinner.service';
import { ConfirmDialogComponent } from 'src/app/shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-step-one-second-page',
  templateUrl: './step-one-second-page.component.html',
  styleUrls: ['./step-one-second-page.component.scss'],
})
export class StepOneSecondPageComponent implements OnInit {
  @Input() listingId: number;

  backBtnRoute: string;
  showLocationTypes = false;
  isDisabledType = false;
  isDisabledBtn = true;
  selectedValues: number[] = [];
  categoryType: number;
  locationKinds: LocationKind[] = LocationCategory.locationCategories;
  locationTypes: LocationType[] = [];
  availableLocationTypes: LocationType[] = [];
  stepperData = ListingStepperConstant.stepOne;
  isChangingType = false;

  constructor(
    private listingStepOneService: ListingStepOneService,
    private router: Router,
    private localService: LocalService,
    public dialogRef: MatDialogRef<ConfirmDialogComponent>,
    private dialog: MatDialog,
    private spinner: SpinnerService
  ) {}

  async ngOnInit(): Promise<void> {
    this.spinner.show();
    try {
      this.backBtnRoute = `/become-a-host/${this.listingId}/step-1/verify-address`;
      await this.getAllLocationTypes();
      if (this.listingId) await this.getCheckedCategories(this.listingId);
      if (this.categoryType) {
        await this.localService.setLocalData(
          LocalConstant.LISTING_CATEGORY_TYPE,
          this.categoryType
        );
      }
      this.checkDisableOnInit();
      this.spinner.hide();
    } catch (err) {
      this.spinner.hide();
    }
  }

  private async getAllLocationTypes(): Promise<void> {
    this.locationTypes = [];
    const response = await this.listingStepOneService.getAllLocationTypes();
    if (
      response &&
      response.success &&
      response.data &&
      response.data.length > 0
    ) {
      response.data.map((item: LocationType) => {
        item.checked = false;
        this.locationTypes.push(item);
      });
    }
  }

  private async getCheckedCategories(listingId: number): Promise<void> {
    this.selectedValues = [];
    const response =
      await this.listingStepOneService.getCheckedLocationCategory(listingId);
    if (
      response &&
      response.data &&
      response.data.locationCategoryIds &&
      response.data.locationCategoryIds.length > 0
    ) {
      this.categoryType = response.data.categoryType;
      this.isChangingType = true;
      this.availableLocationTypes = this.locationTypes.filter(
        (type) => type.categoryType === this.categoryType
      );

      response.data.locationCategoryIds.map((item: LocationType) => {
        this.selectedValues.push(Number(item.listingLocationCategoryId));
      });

      this.availableLocationTypes.map((item) => {
        if (this.selectedValues.includes(item.id)) {
          item.checked = true;
        }
      });

      if (this.selectedValues && this.selectedValues.length >= 2) {
        this.isDisabledType = true;
        this.isDisabledBtn = false;
      }
      this.showLocationTypes = true;
    }
  }

  onGetLocationType(id: number): void {
    if (this.isChangingType) {
      const dialogData = {
        title: 'Are you sure you want to change your location type?',
        message:
          'All the features and styles you checked and filled out will be reset.',
        cancelBtnText: 'Cancel',
        confirmBtnText: 'Continue',
        showCancelBtn: true,
        isDeleting: false,
        isLongText: true,
      };

      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        width: '500px',
        data: dialogData,
        disableClose: true,
      });

      dialogRef.afterClosed().subscribe(async (dialogResult) => {
        if (dialogResult === true) {
          this.selectedValues = [];
          this.isDisabledType = false;
          this.isDisabledBtn = true;
          this.categoryType = id;
          this.availableLocationTypes = this.locationTypes.filter((type) => {
            type.checked = false;
            return type.categoryType === id;
          });
          this.showLocationTypes = true;
          this.isChangingType = false;
        } else {
          location.reload();
          this.isChangingType = false;
        }
      });
    } else {
      this.selectedValues = [];
      this.isDisabledType = false;
      this.isDisabledBtn = true;
      this.categoryType = id;
      this.availableLocationTypes = this.locationTypes.filter((type) => {
        type.checked = false;
        return type.categoryType === id;
      });
      this.showLocationTypes = true;
    }
  }

  checkDisableOnInit(): void {
    this.selectedValues = [];
    if (this.availableLocationTypes && this.availableLocationTypes.length) {
      this.availableLocationTypes.map((type) => {
        if (type.checked) {
          this.selectedValues.push(type.id);
        }
      });
      this.isDisabledType =
        this.availableLocationTypes.filter((type) => type.checked).length >= 2;
      this.isDisabledBtn =
        this.availableLocationTypes.filter((type) => type.checked).length <= 0;
    }
  }

  checkDisable(): void {
    if (this.isChangingType) {
      const dialogData = {
        title: 'Are you sure you want to change your location type?',
        message:
          'All the features and styles you checked and filled out will be reset.',
        cancelBtnText: 'Cancel',
        confirmBtnText: 'Continue',
        showCancelBtn: true,
        isDeleting: false,
        isLongText: true,
      };

      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        width: '500px',
        data: dialogData,
        disableClose: true,
      });

      dialogRef.afterClosed().subscribe(async (dialogResult) => {
        if (dialogResult === true) {
          this.selectedValues = [];
          this.availableLocationTypes.map((type) => {
            if (type.checked) {
              this.selectedValues.push(type.id);
            }
          });
          this.isDisabledType =
            this.availableLocationTypes.filter((type) => type.checked).length >=
            2;
          this.isDisabledBtn =
            this.availableLocationTypes.filter((type) => type.checked).length <=
            0;
          this.isChangingType = false;
        } else {
          location.reload();
          this.isChangingType = false;
        }
      });
    } else {
      this.selectedValues = [];
      this.availableLocationTypes.map((type) => {
        if (type.checked) {
          this.selectedValues.push(type.id);
        }
      });
      this.isDisabledType =
        this.availableLocationTypes.filter((type) => type.checked).length >= 2;
      this.isDisabledBtn =
        this.availableLocationTypes.filter((type) => type.checked).length <= 0;
    }
  }

  async onUpdatedLocationCategory(flag?: string): Promise<void> {
    if (!this.selectedValues || this.selectedValues.length <= 0) return;
    const data = {
      listingId: +this.listingId,
      categoryType: this.categoryType,
      selectedValues: this.selectedValues,
    };
    const response =
      await this.listingStepOneService.updateListingLocationCategory(data);
    if (response && response.success) {
      await this.localService.setLocalData(
        LocalConstant.LISTING_CATEGORY_TYPE,
        +response.data[0].categoryType
      );
      if (flag) {
        this.router.navigateByUrl(`/become-a-host/${this.listingId}`);
      } else {
        this.router.navigateByUrl(
          `/become-a-host/${this.listingId}/step-1/location-details`
        );
      }
    }
  }
}
