import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ListingStyle } from 'src/app/constants/list-styles.constant';
import { ListingStepperConstant } from 'src/app/constants/listing-stepper.constant';
import {
  ListingCheckedSubCategory,
  ListingSubCategory,
} from 'src/app/models/listing.model';
import { LocationType } from 'src/app/models/location-types.model';
import { ListingStepOneService } from 'src/app/services/listing-step-one.service';
import { ListingStepTwoService } from 'src/app/services/listing-step-two.service';
import { SpinnerService } from 'src/app/services/spinner.service';

@Component({
  selector: 'app-step-two-one-page',
  templateUrl: './step-two-one-page.component.html',
  styleUrls: ['./step-two-one-page.component.scss'],
})
export class StepTwoOnePageComponent implements OnInit {
  @Input({ required: true }) listingId: string;

  backBtnRoute: string;
  nxtBtnRoute: string;
  listingSubCategories: ListingSubCategory[];
  selectedValues: number[] = [];
  selectedFeatures: string[] = [];
  categoryType: number;
  basicStyles = ListingStyle.baseStyles;
  stepperData = ListingStepperConstant.stepTwo;

  constructor(
    private stepTwoService: ListingStepTwoService,
    private stepOneService: ListingStepOneService,
    private router: Router,
    private spinner: SpinnerService
  ) {}

  async ngOnInit(): Promise<void> {
    this.spinner.show();
    try {
      this.backBtnRoute = `/become-a-host/${+this.listingId}`;
      this.nxtBtnRoute = `/become-a-host/${+this
        .listingId}/step-2/features/car-style`;
      if (this.listingId) {
        await this.getSubCategories(Number(this.listingId));
        await this.getCheckedSubcategories(Number(this.listingId));
        await this.getSelectedListings(Number(this.listingId));
      }
      this.spinner.hide();
    } catch (error) {
      this.spinner.hide();
    }
  }

  private async getSelectedListings(id: number): Promise<void> {
    const resposnse = await this.stepOneService.getCheckedLocationCategory(id);
    if (resposnse && resposnse.success && resposnse.data) {
      this.categoryType = resposnse.data.categoryType;
      this.selectedFeatures = resposnse.data.locationCategoryIds.map(
        (loc: LocationType) => {
          return loc.listingLocationCategory.categoryName;
        }
      );
    }
  }

  private async getSubCategories(listingId: number): Promise<void> {
    const response = await this.stepTwoService.getSubcategoriesByCategory(
      listingId
    );
    if (response && response.success && response.data) {
      this.categoryType = response.data[0].categoryType;
      this.listingSubCategories = response.data;
      this.listingSubCategories.map((category) => (category.checked = false));
    }
  }

  private async getCheckedSubcategories(listingId: number): Promise<void> {
    const response =
      await this.stepTwoService.getCheckedSubcategoriesByCategory(listingId);
    if (
      response &&
      response.success &&
      response.data &&
      response.data.data &&
      response.data.data.length > 0
    ) {
      const checkedValueIds = response.data.data.map(
        (item: ListingCheckedSubCategory) => item.listingLocationSubCategoryId
      );
      if (this.listingSubCategories)
        this.listingSubCategories.map((item) => {
          if (checkedValueIds.includes(item.id)) {
            item.checked = true;
          }
        });
    }
  }

  async updateSubcategories(): Promise<void> {
    const selectedValuesData = this.listingSubCategories.filter(
      (category) => category.checked
    );
    this.selectedValues = selectedValuesData.map((category) => category.id);
    const data = {
      listingId: Number(this.listingId),
      selectedValues: this.selectedValues,
    };
    const response = await this.stepTwoService.updateSubcategories(data);
    if (response && response.success) {
      const categoryType = this.categoryType;
      switch (categoryType) {
        case 1:
          const residentialRoute = `/become-a-host/${+this
            .listingId}/step-2/features`;
          this.router.navigateByUrl(residentialRoute);
          break;

        case 2:
          let commercialRoute = `/become-a-host/${+this
            .listingId}/step-2/features`;
          if (
            (this.selectedFeatures[0] === 'Gallery' &&
              this.selectedFeatures.length === 1) ||
            (this.selectedFeatures[0] === 'Museum' &&
              this.selectedFeatures.length === 1) ||
            (this.selectedFeatures[0] === 'Theater' &&
              this.selectedFeatures.length === 1)
          ) {
            commercialRoute = `/become-a-host/${+this
              .listingId}/step-2/interior`;
            this.router.navigateByUrl(commercialRoute);
            break;
          }
          if (
            (this.selectedFeatures[0] === 'Industrial Buildings' &&
              this.selectedFeatures.length === 1) ||
            (this.selectedFeatures[0] === 'Salon/Spa' &&
              this.selectedFeatures.length === 1)
          ) {
            commercialRoute = `/become-a-host/${+this.listingId}/step-2/title`;
            this.router.navigateByUrl(commercialRoute);
            break;
          } else if (this.selectedFeatures.includes('Barber Shop')) {
            commercialRoute = `/become-a-host/${+this
              .listingId}/step-2/interior`;
          }
          this.router.navigateByUrl(commercialRoute);
          break;

        case 3:
          let studioRoute = `/become-a-host/${+this.listingId}/step-2/features`;
          if (
            this.selectedFeatures[0] === 'TV Studio/Stage' &&
            this.selectedFeatures.length === 1
          ) {
            studioRoute = `/become-a-host/${+this.listingId}/step-2/interior`;
            this.router.navigateByUrl(studioRoute);
            break;
          } else {
            this.router.navigateByUrl(studioRoute);
            break;
          }

        case 4:
          const transportRoute = `/become-a-host/${+this
            .listingId}/step-2/title`;
          this.router.navigateByUrl(transportRoute);
          break;

        default:
          break;
      }
      return;
    }
  }

  async updateStyles(flag?: string): Promise<void> {
    const selectedValuesData = this.listingSubCategories.filter(
      (category) => category.checked
    );
    this.selectedValues = selectedValuesData.map((category) => category.id);
    const data = {
      listingId: Number(this.listingId),
      selectedValues: this.selectedValues,
    };
    const response = await this.stepTwoService.updateSubcategories(data);
    if (response && response.success) {
      if (flag) {
        this.router.navigateByUrl(`/become-a-host/${+this.listingId}`);
        return;
      }
      const categoryType = response.data.at(-1).categoryType;
      switch (categoryType) {
        case 1:
          const residentialRoute = `/become-a-host/${+this
            .listingId}/step-2/features`;
          this.router.navigateByUrl(residentialRoute);
          break;
        case 2:
          let commercialsRoute = `/become-a-host/${+this
            .listingId}/step-2/features`;
          if (
            this.selectedFeatures[0] === 'Gallery' &&
            this.selectedFeatures.length === 1
          ) {
            commercialsRoute = `/become-a-host/${+this
              .listingId}/step-2/interior`;
          }

          this.router.navigateByUrl(commercialsRoute);
          break;
        case 4:
          const transportRoute = `/become-a-host/${+this
            .listingId}/step-2/title`;
          this.router.navigateByUrl(transportRoute);
          break;

        default:
          break;
      }
      return;
    }
  }
}
