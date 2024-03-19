import { Component, Input, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormControl,
  FormGroup,
} from '@angular/forms';
import { Router } from '@angular/router';
import { ErrorConstant } from 'src/app/constants/error.constant';
import { ListingStepOne } from 'src/app/constants/listing-step-one.constant';
import { LocalConstant } from 'src/app/constants/local-constant';
import { CommonService } from 'src/app/services/common.service';
import { ListingStepOneService } from 'src/app/services/listing-step-one.service';
import { LocalService } from 'src/app/services/local.service';
import { SnackBarService } from 'src/app/services/snack-bar.service';
import { SpinnerService } from 'src/app/services/spinner.service';

@Component({
  selector: 'app-location-details-form',
  templateUrl: './location-details-form.component.html',
  styleUrls: ['./location-details-form.component.scss'],
})
export class LocationDetailsFormComponent implements OnInit {
  @Input({ required: true }) listingId: string;

  backBtnRoute: string;
  residentialForm: FormGroup;
  categoryType: number;
  accessAvailabilityParkingArray =
    ListingStepOne.accessAvailabilityParkingArray;
  truckMotarHomeParkingArray = ListingStepOne.truckMotarHomeParkingArray;
  amenitiesArray = ListingStepOne.amenitiesArray;
  quantity: number = 1;

  constructor(
    private listingStepOneService: ListingStepOneService,
    private router: Router,
    private localService: LocalService,
    public commonService: CommonService,
    private snackbar: SnackBarService,
    private spinner: SpinnerService
  ) {}

  async ngOnInit(): Promise<void> {
    this.spinner.show();
    try {
      this.categoryType = await this.localService.getLocalData(
        LocalConstant.LISTING_CATEGORY_TYPE
      );
      this.backBtnRoute = `/become-a-host/${+this
        .listingId}/step-1/location-type`;

      this.residentialFormInit();

      if (this.listingId) {
        await this.getLocationInfo(+this.listingId);
      }
      this.spinner.hide();
    } catch (error) {
      this.spinner.hide();
    }
  }

  private residentialFormInit(): void {
    this.residentialForm = new FormGroup({
      noOfBedRooms: new FormControl(),
      noOfBathRooms: new FormControl(),
      propertySize: new FormControl(),
      lotSize: new FormControl(),
      mainFloorNumber: new FormControl(),
      heightFeet: new FormControl(null),
      heightInches: new FormControl(null),
      widthFeet: new FormControl(null),
      widthInches: new FormControl(null),
      lengthFeet: new FormControl(null),
      lengthInches: new FormControl(null),
      carParkingSpace: new FormControl(),
      year: new FormControl(),
      make: new FormControl(null),
      model: new FormControl(null),
      accessAvailabilityParking: new FormArray([]),
      truckMotarHomeParking: new FormArray([]),
      parkingNearby: new FormControl(false),
      amenities: new FormArray([]),
    });
  }

  get c(): { [key: string]: AbstractControl } {
    return this.residentialForm.controls;
  }

  private async getLocationInfo(listingId: number): Promise<void> {
    const response = await this.listingStepOneService.getListingLocationInfo(
      listingId
    );
    if (response && response.success && response.data && response.data.data) {
      const data = response.data.data;
      this.accessAvailabilityParkingArray;
      this.residentialForm.patchValue({
        noOfBedRooms: data.noOfBedRooms,
        noOfBathRooms: data.noOfBathRooms,
        propertySize: data.propertySize,
        lotSize: data.lotSize,
        mainFloorNumber: data.mainFloorNumber,
        heightFeet: data.height ? data.height.split('-')[0] : null,
        heightInches: data.height ? data.height.split('-')[1] : null,
        widthFeet: data.width ? data.width.split('-')[0] : null,
        widthInches: data.width ? data.width.split('-')[1] : null,
        lengthFeet: data.length ? data.length.split('-')[0] : null,
        lengthInches: data.length ? data.length.split('-')[1] : null,
        carParkingSpace: data.carParkingSpace,
        year: data.year,
        make: data.make,
        model: data.model,
        parkingNearby: data.parkingNearby,
      });

      this.patchParkingFormArrayValues(
        data.accessAvailabilityParkingSerialized
      );
      this.patchTruckMotarFormArrayValues(data.truckMotarHomeParkingSerialized);
      this.patchAmenitiyFormArrayValues(data.amenitiesSerialized);
    }
  }

  patchTruckMotarFormArrayValues(
    truckMotarHomeParkingSerialized: string[]
  ): void {
    const formArray: FormArray = this.residentialForm.get(
      'truckMotarHomeParking'
    ) as FormArray;
    this.truckMotarHomeParkingArray.map((ctrl) => {
      if (
        truckMotarHomeParkingSerialized &&
        truckMotarHomeParkingSerialized.includes(ctrl.value)
      ) {
        ctrl.checked = true;
        formArray.push(new FormControl(ctrl.value));
      } else {
        ctrl.checked = false;
      }
    });
  }

  patchParkingFormArrayValues(
    accessAvailabilityParkingSerialized: string[]
  ): void {
    const formArray: FormArray = this.residentialForm.get(
      'accessAvailabilityParking'
    ) as FormArray;
    this.accessAvailabilityParkingArray.map((ctrl) => {
      if (
        accessAvailabilityParkingSerialized &&
        accessAvailabilityParkingSerialized.includes(ctrl.value)
      ) {
        ctrl.checked = true;
        formArray.push(new FormControl(ctrl.value));
      } else {
        ctrl.checked = false;
      }
    });
  }

  patchAmenitiyFormArrayValues(amenitiesSerialized: string[]): void {
    const formArray: FormArray = this.residentialForm.get(
      'amenities'
    ) as FormArray;
    this.amenitiesArray.map((ctrl) => {
      if (amenitiesSerialized && amenitiesSerialized.includes(ctrl.value)) {
        ctrl.checked = true;
        formArray.push(new FormControl(ctrl.value));
      } else {
        ctrl.checked = false;
      }
    });
  }

  onCheckBoxChange(event: Event, formArrayName: string): void {
    const formArray: FormArray = this.residentialForm.get(
      formArrayName
    ) as FormArray;

    /* Selected */
    const eventTarget = event.target as HTMLInputElement;
    if (eventTarget.checked) {
      // Add a new control in the arrayForm
      formArray.push(new FormControl(eventTarget.value));
    } else {
      /* unselected */
      // find the unselected element
      let i: number = 0;
      formArray.controls.map((ctrl) => {
        if (ctrl.value == eventTarget.value) {
          // Remove the unselected element from the arrayForm
          formArray.removeAt(i);
          return;
        }
        i++;
      });
    }
  }

  noZeroInput(obj: any): boolean {
    let isValid = true;
    for (const key in obj) {
      if (String(obj.hasOwnProperty(key) && obj[key]) === '0') {
        this.snackbar.error(ErrorConstant.NO_ZERO_ALLOWED);
        isValid = false;
      }
    }
    return isValid;
  }

  async onSubmitForm(): Promise<void> {
    if (!this.noZeroInput(this.residentialForm.value)) {
      return;
    }
    const data = this.residentialForm.value;
    data.listingId = +this.listingId;
    data.categoryType = +this.categoryType;
    const response =
      await this.listingStepOneService.updateListingLocationDetails(data);
    if (response && response.success) {
      this.router.navigateByUrl(`/become-a-host/${this.listingId}`);
    }
  }

  onUpdateQuantity(
    event: { value: number; flag: string },
    controlName: string
  ) {
    if (event.flag === 'dec' && +this.c[controlName].value > 1) {
      this.residentialForm.patchValue({
        [controlName]: +this.c[controlName].value - 1,
      });
    }
    if (event.flag === 'dec' && +this.c[controlName].value === 1) {
      this.residentialForm.patchValue({
        [controlName]: null,
      });
    }
    if (event.flag === 'inc') {
      this.residentialForm.patchValue({
        [controlName]: +this.c[controlName].value + 1,
      });
    }
  }
}
