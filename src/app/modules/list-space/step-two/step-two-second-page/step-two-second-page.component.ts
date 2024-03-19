import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ListingStepperConstant } from 'src/app/constants/listing-stepper.constant';
import {
  FilteredKeyFeature,
  KeyFeature,
  SelectedKeyFeatures,
  SelectedKeyFeaturesDetails,
} from 'src/app/models/listing.model';
import { LocationType } from 'src/app/models/location-types.model';
import { ListingStepOneService } from 'src/app/services/listing-step-one.service';
import { ListingStepTwoService } from 'src/app/services/listing-step-two.service';
import { SpinnerService } from 'src/app/services/spinner.service';

@Component({
  selector: 'app-step-two-second-page',
  templateUrl: './step-two-second-page.component.html',
  styleUrls: ['./step-two-second-page.component.scss'],
})
export class StepTwoSecondPageComponent implements OnInit {
  @Input({ required: true }) listingId: string;

  backBtnRoute: string;
  nxtBtnRoute: string;
  keyFeatures: KeyFeature[] = [];
  driveways: KeyFeature[] = [];
  elevators: KeyFeature[] = [];
  fireplaces: KeyFeature[] = [];
  gardenYards: KeyFeature[] = [];
  pools: KeyFeature[] = [];
  porches: KeyFeature[] = [];
  stairs: KeyFeature[] = [];
  views: KeyFeature[] = [];
  keyFeatureDetails: KeyFeature[] = [];
  stepperData = ListingStepperConstant.stepTwo;
  filteredkeyFeatureDetails: FilteredKeyFeature[] = [];
  categoryType: number;
  selectedValues: string[] = [];
  isDrivewayChecked = false;
  isElevatorChecked = false;
  isFireplaceChecked = false;
  isGardenYardChecked = false;
  isPoolChecked = false;
  isPorchChecked = false;
  isStairChecked = false;
  isViewChecked = false;
  subCategoriesLength = 0;
  keyFeaturesLength = 0;
  interiorsLength = 0;

  constructor(
    private stepTwoService: ListingStepTwoService,
    private stepOneService: ListingStepOneService,
    private router: Router,
    private spinner: SpinnerService
  ) {}

  async ngOnInit(): Promise<void> {
    this.spinner.show();
    try {
      this.backBtnRoute = `/become-a-host/${+this.listingId}/step-2/styles`;
      this.nxtBtnRoute = `/become-a-host/${+this.listingId}/step-2/interior`;
      await this.getSelectedListings(Number(this.listingId));
      await this.getKeyFeatures(Number(this.listingId));
      await this.getInteriors(Number(this.listingId));
      await this.getKeyFeatureDetails(Number(this.listingId));
      await this.getSelectedKeyFeatures(Number(this.listingId));
      await this.getSelectedKeyFeaturesDetails(Number(this.listingId));
      await this.getSubCategories(Number(this.listingId));
      await this.updateBackBtnRoute();
      await this.updateRoutes();
      this.spinner.hide();
    } catch (error) {
      this.spinner.hide();
    }
  }

  async updateRoutes(): Promise<void> {
    this.nxtBtnRoute = `/become-a-host/${+this.listingId}/step-2/title`;
    if (this.interiorsLength > 0) {
      this.nxtBtnRoute = `/become-a-host/${+this.listingId}/step-2/interior`;
    }
  }

  async updateBackBtnRoute(): Promise<void> {
    if (this.subCategoriesLength > 0) {
      this.backBtnRoute = `/become-a-host/${+this.listingId}/step-2/styles`;
    } else {
      this.backBtnRoute = `/become-a-host/${+this.listingId}`;
    }
    // switch (this.categoryType) {
    //   case 2:
    //     if (
    //       this.selectedValues.includes('Airport/Hangar') ||
    //       this.selectedValues.includes('Bank') ||
    //       this.selectedValues.includes('Brewery') ||
    //       this.selectedValues.includes("Doctor's Office/Hospital") ||
    //       this.selectedValues.includes('Retail/Small Business') ||
    //       this.selectedValues.includes('Warehouse')
    //     ) {
    //       this.backBtnRoute = `/become-a-host/${+this.listingId}`;
    //       break;
    //     }
    // }
  }

  private async getSubCategories(listingId: number): Promise<void> {
    const response = await this.stepTwoService.getSubcategoriesByCategory(
      listingId
    );
    if (response && response.success && response.data) {
      this.subCategoriesLength = response.data.length;
    }
  }

  private async getSelectedListings(id: number): Promise<void> {
    const resposnse = await this.stepOneService.getCheckedLocationCategory(id);
    if (resposnse && resposnse.success && resposnse.data) {
      const data = resposnse.data;
      this.categoryType = data.categoryType;
      this.selectedValues = data.locationCategoryIds.map(
        (loc: LocationType) => {
          return loc.listingLocationCategory.categoryName;
        }
      );
      // this.updateRoutes(selectedValues);
    }
  }

  private async getKeyFeatures(id: number): Promise<void> {
    const response = await this.stepTwoService.getKeyFeatures(id);
    if (
      response &&
      response.success &&
      response.data &&
      response.data.length > 0
    ) {
      this.keyFeatures = response.data;
      this.keyFeaturesLength = response.data.length;
      this.keyFeatures.map((feature, i) => {
        feature.type = 'type-' + i;
      });
    }
  }

  private async getKeyFeatureDetails(id: number): Promise<void> {
    const response = await this.stepTwoService.getAllKeyFeaturesDetails(id);
    if (
      response &&
      response.success &&
      response.data &&
      response.data.response.length > 0
    ) {
      this.keyFeatureDetails = response.data.response;
    }
  }

  private async getInteriors(listingId: number): Promise<void> {
    const response = await this.stepTwoService.getInteriors(listingId);
    if (response && response.success && response.data) {
      this.interiorsLength = response.data.length;
    }
  }

  private async getSelectedKeyFeatures(id: number): Promise<void> {
    const response = await this.stepTwoService.getSelectedKeyFeatures(id);
    if (
      response &&
      response.success &&
      response.data &&
      response.data.length > 0
    ) {
      const checkedFeatureIds = response.data.map(
        (item: KeyFeature) => item.id
      );
      if (this.keyFeatures)
        this.keyFeatures.map(async (feature) => {
          if (checkedFeatureIds.includes(feature.id)) {
            feature.checked = true;
            await this.toggleFeatures(feature);
          } else {
            feature.checked = false;
          }
        });
    }
  }

  private async getSelectedKeyFeaturesDetails(id: number): Promise<void> {
    const response = await this.stepTwoService.getSelectedKeyFeaturesDetails(
      id
    );
    if (
      response &&
      response.success &&
      response.data &&
      response.data.length > 0
    ) {
      const checkedFeatureIds = response.data.map(
        (item: KeyFeature) => item.keyFeaturesDetailsId
      );
      this.keyFeatureDetails.map(async (feature) => {
        if (checkedFeatureIds.includes(feature.id)) {
          feature.checked = true;
        } else {
          feature.checked = false;
        }
      });
    }
  }

  async updateSelectedKeyFeatures(flag?: string): Promise<void> {
    // filtering checked features
    const selectedFeatures = this.keyFeatures.filter(
      (feature) => feature.checked
    );
    // getting ids of checked features
    const selectedFeatureIds = selectedFeatures.map((feature) => feature.id);
    const data = {
      listingId: Number(this.listingId),
      selectedValues: selectedFeatureIds,
    };
    const response = await this.stepTwoService.updateSelectedKeyFeatures(data);
    if (response && response.success) {
      await this.updateSelectedKeyFeatureDetails(flag);
    }
  }

  async updateSelectedKeyFeatureDetails(flag?: string): Promise<void> {
    const checkedKeyfeatureDetails = this.keyFeatureDetails.filter(
      (feature) => feature.checked
    );
    const selectedKeyFeatureDetails: SelectedKeyFeatures[] = [];
    checkedKeyfeatureDetails.map((feature, i) => {
      const keyFeatureIds = selectedKeyFeatureDetails.map(
        (ftr) => ftr.keyFeaturesId
      );
      if (!keyFeatureIds.includes(Number(feature.keyFeaturesId))) {
        selectedKeyFeatureDetails.push({
          keyFeaturesId: Number(feature.keyFeaturesId),
          selectedValues: [feature.id],
        });
      }
      if (keyFeatureIds.includes(Number(feature.keyFeaturesId))) {
        const filteredKeyFeatureDetails = selectedKeyFeatureDetails.find(
          (item) => item.keyFeaturesId === Number(feature.keyFeaturesId)
        );
        if (filteredKeyFeatureDetails)
          filteredKeyFeatureDetails.selectedValues.push(Number(feature.id));
      }
    });
    const selectedFeaturesData: SelectedKeyFeaturesDetails = {
      listingId: Number(this.listingId),
      data: selectedKeyFeatureDetails,
    };
    const response = await this.stepTwoService.updateSelectedKeyFeaturesDetails(
      selectedFeaturesData
    );
    if (response && response.success) {
      if (flag) {
        this.router.navigateByUrl(`/become-a-host/${+this.listingId}`);
      } else {
        this.router.navigateByUrl(this.nxtBtnRoute);
      }
    }
  }

  async toggleFeatures(feature: KeyFeature): Promise<void> {
    if (feature.checked) {
      const keyFeatures = this.keyFeatureDetails.filter(
        (driveway) => driveway.keyFeaturesId === feature.id
      );
      this.filteredkeyFeatureDetails.push({
        title: feature.keyFeatureName,
        id: feature.id,
        keyFeatureDetails: keyFeatures,
      });
    } else if (!feature.checked) {
      this.filteredkeyFeatureDetails = this.filteredkeyFeatureDetails.filter(
        (filteredKF) => filteredKF.id !== feature.id
      );
    }

    // switch (feature.keyFeatureName) {
    //   case 'Driveway':
    //     this.driveways = this.keyFeatureDetails.filter(
    //       (driveway) => driveway.keyFeaturesId === feature.id
    //     );
    //     this.isDrivewayChecked = feature.checked ? true : false;
    //     if (!this.isDrivewayChecked) {
    //       this.driveways.map((driveway) => {
    //         driveway.checked = false;
    //       });
    //     }
    //     break;

    //   case 'Elevator':
    //     this.elevators = this.keyFeatureDetails.filter(
    //       (elevator) => elevator.keyFeaturesId === feature.id
    //     );
    //     this.isElevatorChecked = feature.checked ? true : false;
    //     if (!this.isElevatorChecked) {
    //       this.elevators.map((elevator) => {
    //         elevator.checked = false;
    //       });
    //     }
    //     break;

    //   case 'Fireplace':
    //     this.fireplaces = this.keyFeatureDetails.filter(
    //       (fireplace) => fireplace.keyFeaturesId === feature.id
    //     );
    //     this.isFireplaceChecked = feature.checked ? true : false;
    //     if (!this.isFireplaceChecked) {
    //       this.fireplaces.map((fireplace) => {
    //         fireplace.checked = false;
    //       });
    //     }
    //     break;

    //   case 'Garden/Yard':
    //     this.gardenYards = this.keyFeatureDetails.filter(
    //       (gardenYard) => gardenYard.keyFeaturesId === feature.id
    //     );
    //     this.isGardenYardChecked = feature.checked ? true : false;
    //     if (!this.isGardenYardChecked) {
    //       this.gardenYards.map((gardenYard) => {
    //         gardenYard.checked = false;
    //       });
    //     }
    //     break;

    //   case 'Pool':
    //     this.pools = this.keyFeatureDetails.filter(
    //       (pool) => pool.keyFeaturesId === feature.id
    //     );
    //     this.isPoolChecked = feature.checked ? true : false;
    //     if (!this.isPoolChecked) {
    //       this.pools.map((pool) => {
    //         pool.checked = false;
    //       });
    //     }
    //     break;

    //   case 'Porch':
    //     this.porches = this.keyFeatureDetails.filter(
    //       (porch) => porch.keyFeaturesId === feature.id
    //     );
    //     this.isPorchChecked = feature.checked ? true : false;
    //     if (!this.isPorchChecked) {
    //       this.porches.map((porch) => {
    //         porch.checked = false;
    //       });
    //     }
    //     break;

    //   case 'Stairs':
    //     this.stairs = this.keyFeatureDetails.filter(
    //       (stair) => stair.keyFeaturesId === feature.id
    //     );
    //     this.isStairChecked = feature.checked ? true : false;
    //     if (!this.isStairChecked) {
    //       this.stairs.map((stair) => {
    //         stair.checked = false;
    //       });
    //     }
    //     break;

    //   case 'View':
    //     this.views = this.keyFeatureDetails.filter(
    //       (view) => view.keyFeaturesId === feature.id
    //     );
    //     this.isViewChecked = feature.checked ? true : false;
    //     if (!this.isViewChecked) {
    //       this.views.map((view) => {
    //         view.checked = false;
    //       });
    //     }
    //     break;

    //   default:
    //     break;
    // }
  }
}
