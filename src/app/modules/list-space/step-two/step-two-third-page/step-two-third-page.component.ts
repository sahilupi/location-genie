import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { ListingStepperConstant } from 'src/app/constants/listing-stepper.constant';
import { StepTwoData } from 'src/app/constants/step-two.constants';
import { Types } from 'src/app/constants/types.constant';
import { Interior } from 'src/app/models/listing.model';
import { LocationType } from 'src/app/models/location-types.model';
import { ListingStepOneService } from 'src/app/services/listing-step-one.service';
import { ListingStepTwoService } from 'src/app/services/listing-step-two.service';
import { SpinnerService } from 'src/app/services/spinner.service';

@Component({
  selector: 'app-step-two-third-page',
  templateUrl: './step-two-third-page.component.html',
  styleUrls: ['./step-two-third-page.component.scss'],
})
export class StepTwoThirdPageComponent implements OnInit, OnDestroy {
  @Input({ required: true }) listingId: string;

  backBtnRoute: string;
  nxtBtnRoute: string;
  categoryType: number;
  selectedValues: string[];
  bathrooms = StepTwoData.bathrooms;
  ceilings = StepTwoData.ceilings;
  doors = StepTwoData.doors;
  exteriors = StepTwoData.exteriors;
  floors = StepTwoData.floors;
  interiors = StepTwoData.interiors;
  kitchens = StepTwoData.kitchens;
  sportsActivity = StepTwoData.sportsActivity;
  walls = StepTwoData.walls;
  waterFeatures = StepTwoData.waterFeatures;
  windows = StepTwoData.windows;
  airportHangars = StepTwoData.airportHangars;
  banks = StepTwoData.banks;
  breweries = StepTwoData.breweries;
  miscellaneous = StepTwoData.miscellaneous;
  medicalFeatures = StepTwoData.medicalFeatures;
  retailFeatures = StepTwoData.retailFeatures;
  wareHouseFeatures = StepTwoData.wareHouseFeatures;
  barberFeatures = StepTwoData.barberFeatures;
  barFeatures = StepTwoData.barFeatures;
  filmStudioFeatures = StepTwoData.filmStudioFeatures;
  generalStudioFeatures = StepTwoData.generalStudioFeatures;
  photographyStudioFeatures = StepTwoData.photographyStudioFeatures;
  recordingStudioFeatures = StepTwoData.recordingStudioFeatures;
  tvStudioFeatures = StepTwoData.tvStudioFeatures;
  restaurantFeatures = StepTwoData.restaurantFeatures;
  restaurantTypeFeatures = StepTwoData.restaurantTypeFeatures;
  schoolFeatures = StepTwoData.schoolFeatures;
  stepperData = ListingStepperConstant.stepTwo;
  subCategoriesLength = 0;
  keyFeaturesLength = 0;
  interiorsData: Interior[] = [];

  constructor(
    private stepTwoService: ListingStepTwoService,
    private stepOneService: ListingStepOneService,
    private router: Router,
    private spinner: SpinnerService
  ) {}

  async ngOnInit(): Promise<void> {
    this.spinner.show();
    try {
      this.backBtnRoute = `/become-a-host/${+this.listingId}/step-2/features`;
      this.nxtBtnRoute = `/become-a-host/${+this.listingId}/step-2/title`;
      await this.getInteriors(Number(this.listingId));
      await this.getSelectedListings(Number(this.listingId));
      await this.getSelectedFeatures(Number(this.listingId));
      await this.getSubCategories(Number(this.listingId));
      await this.getKeyFeatures(Number(this.listingId));
      this.updateBackBtnRoute();
      this.spinner.hide();
    } catch (error) {
      this.spinner.hide();
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
      this.interiorsData = response.data;
    }
  }

  private updateBackBtnRoute(): void {
    if (this.subCategoriesLength > 0) {
      this.backBtnRoute = `/become-a-host/${+this.listingId}/step-2/styles`;
    }
    if (this.keyFeaturesLength > 0) {
      this.backBtnRoute = `/become-a-host/${+this.listingId}/step-2/features`;
    }
    if (this.keyFeaturesLength <= 0 && this.subCategoriesLength <= 0) {
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
    //     break;
    //   case 3:
    //     if (
    //       this.selectedValues.includes('Photography Studio') ||
    //       this.selectedValues.includes('TV Studio')
    //     ) {
    //       this.backBtnRoute = `/become-a-host/${+this.listingId}`;
    //       break;
    //     }
    //     break;
    //   default:
    //     break;
    // }
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
    }
  }

  // this function is no longer used but kept for reference
  async updateSelectedFeatures(flag?: string): Promise<void> {
    // for bathrooms
    const selectedBathrooms = this.bathrooms.filter(
      (bathroom) => bathroom.checked
    );
    const selectedBathroomNames = selectedBathrooms.map(
      (bathroom) => bathroom.name
    );
    const serialisedBathrooms = selectedBathroomNames.join(';');

    // for ceiling
    const selectedCeiling = this.ceilings.filter((ceiling) => ceiling.checked);
    const selectedCeilingNames = selectedCeiling.map((ceiling) => ceiling.name);
    const serialisedCeiling = selectedCeilingNames.join(';');

    // for doors
    const selectedDoors = this.doors.filter((door) => door.checked);
    const selectedDoorsNames = selectedDoors.map((door) => door.name);
    const serialisedDoors = selectedDoorsNames.join(';');

    // for exterior
    const selectedExteriors = this.exteriors.filter(
      (exterior) => exterior.checked
    );
    const selectedExteriorsNames = selectedExteriors.map(
      (exterior) => exterior.name
    );
    const serialisedExteriors = selectedExteriorsNames.join(';');

    // for Floors
    const selectedFloors = this.floors.filter((floor) => floor.checked);
    const selectedFloorsNames = selectedFloors.map((floor) => floor.name);
    const serialisedFloors = selectedFloorsNames.join(';');

    // for interior
    const selectedInterior = this.interiors.filter(
      (interior) => interior.checked
    );
    const selectedInteriorNames = selectedInterior.map(
      (interior) => interior.name
    );
    const serialisedInterior = selectedInteriorNames.join(';');

    // for Kitchen
    const selectedKitchen = this.kitchens.filter((kitchen) => kitchen.checked);
    const selectedKitchenNames = selectedKitchen.map((kitchen) => kitchen.name);
    const serialisedKitchen = selectedKitchenNames.join(';');

    // for sports and activity
    const selectedSportsActivity = this.sportsActivity.filter(
      (sport) => sport.checked
    );
    const selectedSportsActivityNames = selectedSportsActivity.map(
      (sport) => sport.name
    );
    const serialisedSportsActivity = selectedSportsActivityNames.join(';');

    // for walls
    const selectedWalls = this.walls.filter((wall) => wall.checked);
    const selectedWallsNames = selectedWalls.map((wall) => wall.name);
    const serialisedWalls = selectedWallsNames.join(';');

    // for water features
    const selectedwaterFeatures = this.waterFeatures.filter(
      (feature) => feature.checked
    );
    const selectedwaterFeaturesNames = selectedwaterFeatures.map(
      (feature) => feature.name
    );
    const serialisedwaterFeatures = selectedwaterFeaturesNames.join(';');

    // for windows
    const selectedWindows = this.windows.filter((window) => window.checked);
    const selectedWindowsNames = selectedWindows.map((window) => window.name);
    const serialisedWindows = selectedWindowsNames.join(';');

    // for airport
    const selectedAirports = this.airportHangars.filter(
      (airport) => airport.checked
    );
    const selectedAirportNames = selectedAirports.map(
      (airport) => airport.name
    );
    const serialisedAirports = selectedAirportNames.join(';');

    // for banks
    const selectedBanks = this.banks.filter((bank) => bank.checked);
    const selectedBankNames = selectedBanks.map((bank) => bank.name);
    const serialisedBanks = selectedBankNames.join(';');

    // for breweries
    const selectedBrewery = this.breweries.filter((brewery) => brewery.checked);
    const selectedBreweryNames = selectedBrewery.map((brewery) => brewery.name);
    const serialisedBrewery = selectedBreweryNames.join(';');

    // for miscellaneous
    const selectedMiscellaneous = this.miscellaneous.filter(
      (miscellan) => miscellan.checked
    );
    const selectedMiscellaneousNames = selectedMiscellaneous.map(
      (miscellan) => miscellan.name
    );
    const serialisedMiscellaneous = selectedMiscellaneousNames.join(';');

    // for medical
    const selectedMedicalFeatures = this.medicalFeatures.filter(
      (medical) => medical.checked
    );
    const selectedMedicalNames = selectedMedicalFeatures.map(
      (medical) => medical.name
    );
    const serialisedMedical = selectedMedicalNames.join(';');

    // for retailFeatures
    const selectedRetailFeatures = this.retailFeatures.filter(
      (retail) => retail.checked
    );
    const selectedRetailNames = selectedRetailFeatures.map(
      (retail) => retail.name
    );
    const serialisedRetail = selectedRetailNames.join(';');

    // for wareHouseFeatures
    const selectedWareHouseFeatures = this.wareHouseFeatures.filter(
      (warehouse) => warehouse.checked
    );
    const selectedWareHouseNames = selectedWareHouseFeatures.map(
      (warehouse) => warehouse.name
    );
    const serialisedWareHouse = selectedWareHouseNames.join(';');

    // for barberFeatures
    const selectedbarberFeatures = this.barberFeatures.filter(
      (barber) => barber.checked
    );
    const selectedbarberNames = selectedbarberFeatures.map(
      (barber) => barber.name
    );
    const serialisedbarber = selectedbarberNames.join(';');

    // for barFeatures
    const selectedbarFeatures = this.barFeatures.filter((bar) => bar.checked);
    const selectedBarNames = selectedbarFeatures.map((bar) => bar.name);
    const serialisedBar = selectedBarNames.join(';');

    // for filmFeatures
    const selectedFilStudioFeatures = this.filmStudioFeatures.filter(
      (studio) => studio.checked
    );
    const selectedFilStudioNames = selectedFilStudioFeatures.map(
      (studio) => studio.name
    );
    const serialisedFilStudio = selectedFilStudioNames.join(';');

    // for generalStudioFeatures
    const selectedGeneralStudioFeatures = this.generalStudioFeatures.filter(
      (studio) => studio.checked
    );
    const selectedGeneralStudioNames = selectedGeneralStudioFeatures.map(
      (studio) => studio.name
    );
    const serialisedGeneralStudio = selectedGeneralStudioNames.join(';');

    // for photographyStudioFeatures
    const selectedPhotographyStudioFeatures =
      this.photographyStudioFeatures.filter((studio) => studio.checked);
    const selectedPhotographyStudioNames =
      selectedPhotographyStudioFeatures.map((studio) => studio.name);
    const serialisedPhotographyStudio =
      selectedPhotographyStudioNames.join(';');

    // for recordingStudioFeatures
    const selectedRecordingStudioFeatures = this.recordingStudioFeatures.filter(
      (studio) => studio.checked
    );
    const selectedRecordingStudioNames = selectedRecordingStudioFeatures.map(
      (studio) => studio.name
    );
    const serialisedRecordingStudio = selectedRecordingStudioNames.join(';');

    // for tvStudioFeatures
    const selectedTvStudioFeatures = this.tvStudioFeatures.filter(
      (studio) => studio.checked
    );
    const selectedTvStudioNames = selectedTvStudioFeatures.map(
      (studio) => studio.name
    );
    const serialisedTvStudio = selectedTvStudioNames.join(';');

    // for Restaurant/Cafe Features
    const selectedRestaurantFeatures = this.restaurantFeatures.filter(
      (cafe) => cafe.checked
    );
    const selectedRestaurantNames = selectedRestaurantFeatures.map(
      (cafe) => cafe.name
    );
    const serialisedRestaurant = selectedRestaurantNames.join(';');

    // for Restaurant/Cafe Type Features
    const selectedRestaurantTypeFeatures = this.restaurantTypeFeatures.filter(
      (cafe) => cafe.checked
    );
    const selectedRestaurantTypeNames = selectedRestaurantTypeFeatures.map(
      (cafe) => cafe.name
    );
    const serialisedRestaurantType = selectedRestaurantTypeNames.join(';');

    // for School Features
    const selectedSchoolFeatures = this.schoolFeatures.filter(
      (school) => school.checked
    );
    const selectedSchoolNames = selectedSchoolFeatures.map(
      (school) => school.name
    );
    const serialisedSchool = selectedSchoolNames.join(';');

    // creating payload
    const payload = {
      listingId: Number(this.listingId),
      data: [
        {
          name: Types.STEP2_BATHROOM,
          features: serialisedBathrooms,
        },
        {
          name: Types.STEP2_CEILING,
          features: serialisedCeiling,
        },
        {
          name: Types.STEP2_DOORS,
          features: serialisedDoors,
        },
        {
          name: Types.STEP2_EXTERIOR,
          features: serialisedExteriors,
        },
        {
          name: Types.STEP2_FLOOR,
          features: serialisedFloors,
        },
        {
          name: Types.STEP2_INTERIOR,
          features: serialisedInterior,
        },
        {
          name: Types.STEP2_KITCHEN,
          features: serialisedKitchen,
        },
        {
          name: Types.STEP2_SPORTS_ACTIVITY,
          features: serialisedSportsActivity,
        },
        {
          name: Types.STEP2_WALLS,
          features: serialisedWalls,
        },
        {
          name: Types.STEP2_WATER_FEATURES,
          features: serialisedwaterFeatures,
        },
        {
          name: Types.STEP2_WINDOW,
          features: serialisedWindows,
        },
        {
          name: Types.STEP2_AIRPORT_HANGAR,
          features: serialisedAirports,
        },
        {
          name: Types.STEP2_BANK,
          features: serialisedBanks,
        },
        {
          name: Types.STEP2_BREWERY,
          features: serialisedBrewery,
        },
        {
          name: Types.STEP2_MISCELLANEOUS,
          features: serialisedMiscellaneous,
        },
        {
          name: Types.STEP2_MEDICAL,
          features: serialisedMedical,
        },
        {
          name: Types.STEP2_RETAIL,
          features: serialisedRetail,
        },
        {
          name: Types.STEP2_WAREHOUSE,
          features: serialisedWareHouse,
        },
        {
          name: Types.STEP2_BARBER,
          features: serialisedbarber,
        },
        {
          name: Types.STEP2_BAR,
          features: serialisedBar,
        },
        {
          name: Types.STEP2_FILM_STUDIO,
          features: serialisedFilStudio,
        },
        {
          name: Types.STEP2_GENERAL_STUDIO,
          features: serialisedGeneralStudio,
        },
        {
          name: Types.STEP2_PHOTOGRAPHY_STUDIO,
          features: serialisedPhotographyStudio,
        },
        {
          name: Types.STEP2_RECORDING_STUDIO,
          features: serialisedRecordingStudio,
        },
        {
          name: Types.STEP2_TV_STUDIO,
          features: serialisedTvStudio,
        },
        {
          name: Types.STEP2_RESTAURANT,
          features: serialisedRestaurant,
        },
        {
          name: Types.STEP2_RESTAURANT_TYPE,
          features: serialisedRestaurantType,
        },
        {
          name: Types.STEP2_SCHOOL,
          features: serialisedSchool,
        },
      ],
    };
    const response = await this.stepTwoService.updateFeatures(payload);
    if (response) {
      if (flag) {
        this.router.navigateByUrl(`/become-a-host/${+this.listingId}`);
      } else {
        this.router.navigateByUrl(this.nxtBtnRoute);
      }
    }
  }

  async onUpdatedSelectedInteriors(flag?: string): Promise<void> {
    const selectedIds: number[] = [];
    this.interiorsData.map((intData) => {
      intData.listingLocationInteriorFeature.map((intDetail) => {
        if (intDetail.isSelected) selectedIds.push(intDetail.id);
      });
    });
    const payload = {
      listingId: Number(this.listingId),
      interiorFeatureIds: selectedIds,
    };
    const response = await this.stepTwoService.updateInteriors(payload);
    if (response) {
      if (flag) {
        this.router.navigateByUrl(`/become-a-host/${+this.listingId}`);
      } else {
        this.router.navigateByUrl(this.nxtBtnRoute);
      }
    }
  }

  async getSelectedFeatures(id: number): Promise<void> {
    const response = await this.stepTwoService.getFeatures(id);

    if (response && response.success && response.data.data) {
      const data = response.data.data;
      this.categoryType = response.data.categoryType;
      // for bathrooms
      const selectedBathrooms = data[
        Types.STEP2_BATHROOM.charAt(0).toLowerCase() +
          Types.STEP2_BATHROOM.slice(1)
      ]
        ? data[
            Types.STEP2_BATHROOM.charAt(0).toLowerCase() +
              Types.STEP2_BATHROOM.slice(1)
          ].split(';')
        : '';
      if (selectedBathrooms) {
        this.bathrooms.map((bathroom) => {
          if (selectedBathrooms.includes(bathroom.name)) {
            bathroom.checked = true;
          } else {
            bathroom.checked = false;
          }
        });
      }

      // for ceiling
      const selectedCeilings = data[
        Types.STEP2_CEILING.charAt(0).toLowerCase() +
          Types.STEP2_CEILING.slice(1)
      ]
        ? data[
            Types.STEP2_CEILING.charAt(0).toLowerCase() +
              Types.STEP2_CEILING.slice(1)
          ].split(';')
        : '';
      if (selectedCeilings) {
        this.ceilings.map((ceiling) => {
          if (selectedCeilings.includes(ceiling.name)) {
            ceiling.checked = true;
          } else {
            ceiling.checked = false;
          }
        });
      }

      // for doors
      const selectedDoors = data[
        Types.STEP2_DOORS.charAt(0).toLowerCase() + Types.STEP2_DOORS.slice(1)
      ]
        ? data[
            Types.STEP2_DOORS.charAt(0).toLowerCase() +
              Types.STEP2_DOORS.slice(1)
          ].split(';')
        : '';
      if (selectedDoors) {
        this.doors.map((door) => {
          if (selectedDoors.includes(door.name)) {
            door.checked = true;
          } else {
            door.checked = false;
          }
        });
      }

      // for exterior
      const selectedExteriors = data[
        Types.STEP2_EXTERIOR.charAt(0).toLowerCase() +
          Types.STEP2_EXTERIOR.slice(1)
      ]
        ? data[
            Types.STEP2_EXTERIOR.charAt(0).toLowerCase() +
              Types.STEP2_EXTERIOR.slice(1)
          ].split(';')
        : '';
      if (selectedExteriors) {
        this.exteriors.map((exterior) => {
          if (selectedExteriors.includes(exterior.name)) {
            exterior.checked = true;
          } else {
            exterior.checked = false;
          }
        });
      }

      // for floors
      const selectedFloors = data[
        Types.STEP2_FLOOR.charAt(0).toLowerCase() + Types.STEP2_FLOOR.slice(1)
      ]
        ? data[
            Types.STEP2_FLOOR.charAt(0).toLowerCase() +
              Types.STEP2_FLOOR.slice(1)
          ].split(';')
        : '';
      if (selectedFloors) {
        this.floors.map((floor) => {
          if (selectedFloors.includes(floor.name)) {
            floor.checked = true;
          } else {
            floor.checked = false;
          }
        });
      }

      // for interior
      const selectedInterior = data[
        Types.STEP2_INTERIOR.charAt(0).toLowerCase() +
          Types.STEP2_INTERIOR.slice(1)
      ]
        ? data[
            Types.STEP2_INTERIOR.charAt(0).toLowerCase() +
              Types.STEP2_INTERIOR.slice(1)
          ].split(';')
        : '';
      if (selectedInterior) {
        this.interiors.map((interior) => {
          if (selectedInterior.includes(interior.name)) {
            interior.checked = true;
          } else {
            interior.checked = false;
          }
        });
      }

      // for kitchen
      const selectedKitchen = data[
        Types.STEP2_KITCHEN.charAt(0).toLowerCase() +
          Types.STEP2_KITCHEN.slice(1)
      ]
        ? data[
            Types.STEP2_KITCHEN.charAt(0).toLowerCase() +
              Types.STEP2_KITCHEN.slice(1)
          ].split(';')
        : '';
      if (selectedKitchen) {
        this.kitchens.map((kitchen) => {
          if (selectedKitchen.includes(kitchen.name)) {
            kitchen.checked = true;
          } else {
            kitchen.checked = false;
          }
        });
      }

      // for sports and activity
      const selectedSportsActivity = data[
        Types.STEP2_SPORTS_ACTIVITY.charAt(0).toLowerCase() +
          Types.STEP2_SPORTS_ACTIVITY.slice(1)
      ]
        ? data[
            Types.STEP2_SPORTS_ACTIVITY.charAt(0).toLowerCase() +
              Types.STEP2_SPORTS_ACTIVITY.slice(1)
          ].split(';')
        : '';
      if (selectedSportsActivity) {
        this.sportsActivity.map((sport) => {
          if (selectedSportsActivity.includes(sport.name)) {
            sport.checked = true;
          } else {
            sport.checked = false;
          }
        });
      }

      // for Walls
      const selectedWalls = data[
        Types.STEP2_WALLS.charAt(0).toLowerCase() + Types.STEP2_WALLS.slice(1)
      ]
        ? data[
            Types.STEP2_WALLS.charAt(0).toLowerCase() +
              Types.STEP2_WALLS.slice(1)
          ].split(';')
        : '';
      if (selectedWalls) {
        this.walls.map((wall) => {
          if (selectedWalls.includes(wall.name)) {
            wall.checked = true;
          } else {
            wall.checked = false;
          }
        });
      }

      // for water features
      const selectedWaterFeatures = data[
        Types.STEP2_WATER_FEATURES.charAt(0).toLowerCase() +
          Types.STEP2_WATER_FEATURES.slice(1)
      ]
        ? data[
            Types.STEP2_WATER_FEATURES.charAt(0).toLowerCase() +
              Types.STEP2_WATER_FEATURES.slice(1)
          ].split(';')
        : '';
      if (selectedWaterFeatures) {
        this.waterFeatures.map((feature) => {
          if (selectedWaterFeatures.includes(feature.name)) {
            feature.checked = true;
          } else {
            feature.checked = false;
          }
        });
      }

      // for windows
      const selectedWindows = data[
        Types.STEP2_WINDOW.charAt(0).toLowerCase() + Types.STEP2_WINDOW.slice(1)
      ]
        ? data[
            Types.STEP2_WINDOW.charAt(0).toLowerCase() +
              Types.STEP2_WINDOW.slice(1)
          ].split(';')
        : '';
      if (selectedWindows) {
        this.windows.map((windpw) => {
          if (selectedWindows.includes(windpw.name)) {
            windpw.checked = true;
          } else {
            windpw.checked = false;
          }
        });
      }

      // for airports
      const selectedAirports = data[
        Types.STEP2_AIRPORT_HANGAR.charAt(0).toLowerCase() +
          Types.STEP2_AIRPORT_HANGAR.slice(1)
      ]
        ? data[
            Types.STEP2_AIRPORT_HANGAR.charAt(0).toLowerCase() +
              Types.STEP2_AIRPORT_HANGAR.slice(1)
          ].split(';')
        : '';
      if (selectedAirports) {
        this.airportHangars.map((airport) => {
          if (selectedAirports.includes(airport.name)) {
            airport.checked = true;
          } else {
            airport.checked = false;
          }
        });
      }

      // for banks
      const selectedBanks = data[
        Types.STEP2_BANK.charAt(0).toLowerCase() + Types.STEP2_BANK.slice(1)
      ]
        ? data[
            Types.STEP2_BANK.charAt(0).toLowerCase() + Types.STEP2_BANK.slice(1)
          ].split(';')
        : '';
      if (selectedBanks) {
        this.banks.map((bank) => {
          if (selectedBanks.includes(bank.name)) {
            bank.checked = true;
          } else {
            bank.checked = false;
          }
        });
      }

      // for breweries
      const selectedBreweries = data[
        Types.STEP2_BREWERY.charAt(0).toLowerCase() +
          Types.STEP2_BREWERY.slice(1)
      ]
        ? data[
            Types.STEP2_BREWERY.charAt(0).toLowerCase() +
              Types.STEP2_BREWERY.slice(1)
          ].split(';')
        : '';
      if (selectedBreweries) {
        this.breweries.map((brewery) => {
          if (selectedBreweries.includes(brewery.name)) {
            brewery.checked = true;
          } else {
            brewery.checked = false;
          }
        });
      }

      // for miscellaneous
      const selectedMiscellaneous = data[
        Types.STEP2_MISCELLANEOUS.charAt(0).toLowerCase() +
          Types.STEP2_MISCELLANEOUS.slice(1)
      ]
        ? data[
            Types.STEP2_MISCELLANEOUS.charAt(0).toLowerCase() +
              Types.STEP2_MISCELLANEOUS.slice(1)
          ].split(';')
        : '';
      if (selectedMiscellaneous) {
        this.miscellaneous.map((miscellan) => {
          if (selectedMiscellaneous.includes(miscellan.name)) {
            miscellan.checked = true;
          } else {
            miscellan.checked = false;
          }
        });
      }

      // for medical
      const selectedMedicals = data[
        Types.STEP2_MEDICAL.charAt(0).toLowerCase() +
          Types.STEP2_MEDICAL.slice(1)
      ]
        ? data[
            Types.STEP2_MEDICAL.charAt(0).toLowerCase() +
              Types.STEP2_MEDICAL.slice(1)
          ].split(';')
        : '';
      if (selectedMedicals) {
        this.medicalFeatures.map((medical) => {
          if (selectedMedicals.includes(medical.name)) {
            medical.checked = true;
          } else {
            medical.checked = false;
          }
        });
      }

      // for retail
      const selectedRetails = data[
        Types.STEP2_RETAIL.charAt(0).toLowerCase() + Types.STEP2_RETAIL.slice(1)
      ]
        ? data[
            Types.STEP2_RETAIL.charAt(0).toLowerCase() +
              Types.STEP2_RETAIL.slice(1)
          ].split(';')
        : '';
      if (selectedRetails) {
        this.retailFeatures.map((retail) => {
          if (selectedRetails.includes(retail.name)) {
            retail.checked = true;
          } else {
            retail.checked = false;
          }
        });
      }

      // for warehouse
      const selectedWarehouse = data[
        Types.STEP2_WAREHOUSE.charAt(0).toLowerCase() +
          Types.STEP2_WAREHOUSE.slice(1)
      ]
        ? data[
            Types.STEP2_WAREHOUSE.charAt(0).toLowerCase() +
              Types.STEP2_WAREHOUSE.slice(1)
          ].split(';')
        : '';
      if (selectedWarehouse) {
        this.wareHouseFeatures.map((warehouse) => {
          if (selectedWarehouse.includes(warehouse.name)) {
            warehouse.checked = true;
          } else {
            warehouse.checked = false;
          }
        });
      }

      // for Barber
      const selectedBarber = data[
        Types.STEP2_BARBER.charAt(0).toLowerCase() + Types.STEP2_BARBER.slice(1)
      ]
        ? data[
            Types.STEP2_BARBER.charAt(0).toLowerCase() +
              Types.STEP2_BARBER.slice(1)
          ].split(';')
        : '';
      if (selectedBarber) {
        this.barberFeatures.map((barber) => {
          if (selectedBarber.includes(barber.name)) {
            barber.checked = true;
          } else {
            barber.checked = false;
          }
        });
      }

      // for bar and club
      const selectedBar = data[
        Types.STEP2_BAR.charAt(0).toLowerCase() + Types.STEP2_BAR.slice(1)
      ]
        ? data[
            Types.STEP2_BAR.charAt(0).toLowerCase() + Types.STEP2_BAR.slice(1)
          ].split(';')
        : '';
      if (selectedBar) {
        this.barFeatures.map((bar) => {
          if (selectedBar.includes(bar.name)) {
            bar.checked = true;
          } else {
            bar.checked = false;
          }
        });
      }

      // for FilmStudio
      const selectedFilmStudio = data[
        Types.STEP2_FILM_STUDIO.charAt(0).toLowerCase() +
          Types.STEP2_FILM_STUDIO.slice(1)
      ]
        ? data[
            Types.STEP2_FILM_STUDIO.charAt(0).toLowerCase() +
              Types.STEP2_FILM_STUDIO.slice(1)
          ].split(';')
        : '';
      if (selectedFilmStudio) {
        this.filmStudioFeatures.map((studio) => {
          if (selectedFilmStudio.includes(studio.name)) {
            studio.checked = true;
          } else {
            studio.checked = false;
          }
        });
      }

      // for GeneralStudio
      const selectedGeneralStudio = data[
        Types.STEP2_GENERAL_STUDIO.charAt(0).toLowerCase() +
          Types.STEP2_GENERAL_STUDIO.slice(1)
      ]
        ? data[
            Types.STEP2_GENERAL_STUDIO.charAt(0).toLowerCase() +
              Types.STEP2_GENERAL_STUDIO.slice(1)
          ].split(';')
        : '';
      if (selectedGeneralStudio) {
        this.generalStudioFeatures.map((studio) => {
          if (selectedGeneralStudio.includes(studio.name)) {
            studio.checked = true;
          } else {
            studio.checked = false;
          }
        });
      }

      // for Photo Studio
      const selectedPhotographyStudio = data[
        Types.STEP2_PHOTOGRAPHY_STUDIO.charAt(0).toLowerCase() +
          Types.STEP2_PHOTOGRAPHY_STUDIO.slice(1)
      ]
        ? data[
            Types.STEP2_PHOTOGRAPHY_STUDIO.charAt(0).toLowerCase() +
              Types.STEP2_PHOTOGRAPHY_STUDIO.slice(1)
          ].split(';')
        : '';
      if (selectedPhotographyStudio) {
        this.photographyStudioFeatures.map((studio) => {
          if (selectedPhotographyStudio.includes(studio.name)) {
            studio.checked = true;
          } else {
            studio.checked = false;
          }
        });
      }

      // for Recording Studio
      const selectedRecordingStudio = data[
        Types.STEP2_RECORDING_STUDIO.charAt(0).toLowerCase() +
          Types.STEP2_RECORDING_STUDIO.slice(1)
      ]
        ? data[
            Types.STEP2_RECORDING_STUDIO.charAt(0).toLowerCase() +
              Types.STEP2_RECORDING_STUDIO.slice(1)
          ].split(';')
        : '';
      if (selectedRecordingStudio) {
        this.recordingStudioFeatures.map((studio) => {
          if (selectedRecordingStudio.includes(studio.name)) {
            studio.checked = true;
          } else {
            studio.checked = false;
          }
        });
      }

      // for Tv Studio
      const selectedTvStudio = data[
        Types.STEP2_TV_STUDIO.charAt(0).toLowerCase() +
          Types.STEP2_TV_STUDIO.slice(1)
      ]
        ? data[
            Types.STEP2_TV_STUDIO.charAt(0).toLowerCase() +
              Types.STEP2_TV_STUDIO.slice(1)
          ].split(';')
        : '';
      if (selectedTvStudio) {
        this.tvStudioFeatures.map((studio) => {
          if (selectedTvStudio.includes(studio.name)) {
            studio.checked = true;
          } else {
            studio.checked = false;
          }
        });
      }

      // for Restaurant/Cafe
      const selectedRestaurant = data[
        Types.STEP2_RESTAURANT.charAt(0).toLowerCase() +
          Types.STEP2_RESTAURANT.slice(1)
      ]
        ? data[
            Types.STEP2_RESTAURANT.charAt(0).toLowerCase() +
              Types.STEP2_RESTAURANT.slice(1)
          ].split(';')
        : '';
      if (selectedRestaurant) {
        this.restaurantFeatures.map((cafe) => {
          if (selectedRestaurant.includes(cafe.name)) {
            cafe.checked = true;
          } else {
            cafe.checked = false;
          }
        });
      }

      // for Restaurant/Cafe Type
      const selectedRestaurantTypes = data[
        Types.STEP2_RESTAURANT_TYPE.charAt(0).toLowerCase() +
          Types.STEP2_RESTAURANT_TYPE.slice(1)
      ]
        ? data[
            Types.STEP2_RESTAURANT_TYPE.charAt(0).toLowerCase() +
              Types.STEP2_RESTAURANT_TYPE.slice(1)
          ].split(';')
        : '';
      if (selectedRestaurantTypes) {
        this.restaurantTypeFeatures.map((cafe) => {
          if (selectedRestaurant.includes(cafe.name)) {
            cafe.checked = true;
          } else {
            cafe.checked = false;
          }
        });
      }

      // for School
      const selectedSchoolTypes = data[
        Types.STEP2_SCHOOL.charAt(0).toLowerCase() + Types.STEP2_SCHOOL.slice(1)
      ]
        ? data[
            Types.STEP2_SCHOOL.charAt(0).toLowerCase() +
              Types.STEP2_SCHOOL.slice(1)
          ].split(';')
        : '';
      if (selectedSchoolTypes) {
        this.schoolFeatures.map((school) => {
          if (selectedSchoolTypes.includes(school.name)) {
            school.checked = true;
          } else {
            school.checked = false;
          }
        });
      }
    }
  }

  ngOnDestroy(): void {
    this.bathrooms.map((bathroom) => {
      bathroom.checked = false;
    });

    this.ceilings.map((ceiling) => {
      ceiling.checked = false;
    });

    this.doors.map((door) => {
      door.checked = false;
    });

    this.exteriors.map((exterior) => {
      exterior.checked = false;
    });

    this.floors.map((floor) => {
      floor.checked = false;
    });

    this.interiors.map((interior) => {
      interior.checked = false;
    });

    this.kitchens.map((kitchen) => {
      kitchen.checked = false;
    });

    this.sportsActivity.map((sport) => {
      sport.checked = false;
    });

    this.walls.map((wall) => {
      wall.checked = false;
    });

    this.waterFeatures.map((feature) => {
      feature.checked = false;
    });

    this.windows.map((windpw) => {
      windpw.checked = false;
    });

    this.airportHangars.map((airport) => {
      airport.checked = false;
    });

    this.banks.map((bank) => {
      bank.checked = false;
    });

    this.breweries.map((brewery) => {
      brewery.checked = false;
    });

    this.miscellaneous.map((miscellan) => {
      miscellan.checked = false;
    });

    this.medicalFeatures.map((medical) => {
      medical.checked = false;
    });

    this.retailFeatures.map((retail) => {
      retail.checked = false;
    });

    this.wareHouseFeatures.map((warehouse) => {
      warehouse.checked = false;
    });

    this.barberFeatures.map((barber) => {
      barber.checked = false;
    });

    this.barFeatures.map((bar) => {
      bar.checked = false;
    });

    this.filmStudioFeatures.map((studio) => {
      studio.checked = false;
    });

    this.generalStudioFeatures.map((studio) => {
      studio.checked = false;
    });

    this.photographyStudioFeatures.map((studio) => {
      studio.checked = false;
    });

    this.recordingStudioFeatures.map((studio) => {
      studio.checked = false;
    });

    this.tvStudioFeatures.map((studio) => {
      studio.checked = false;
    });

    this.restaurantFeatures.map((cafe) => {
      cafe.checked = false;
    });

    this.restaurantTypeFeatures.map((cafe) => {
      cafe.checked = false;
    });

    this.schoolFeatures.map((school) => {
      school.checked = false;
    });
  }
}
