import { Component, Input, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { ListingStepperConstant } from 'src/app/constants/listing-stepper.constant';
import { ListingStepOneService } from 'src/app/services/listing-step-one.service';
import { ListingStepTwoService } from 'src/app/services/listing-step-two.service';
import { SpinnerService } from 'src/app/services/spinner.service';

@Component({
  selector: 'app-step-two-fourth-page',
  templateUrl: './step-two-fourth-page.component.html',
  styleUrls: ['./step-two-fourth-page.component.scss'],
})
export class StepTwoFourthPageComponent implements OnInit {
  @Input({ required: true }) listingId: string;

  backBtnRoute: string;
  nxtBtnRoute: string;
  titleForm: FormGroup;
  isSubmitted = false;
  stepperData = ListingStepperConstant.stepTwo;
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
      this.backBtnRoute = `/become-a-host/${+this.listingId}/step-2/interior`;
      this.nxtBtnRoute = `/become-a-host/${+this.listingId}/step-2/photos`;
      await this.buildForm();
      await this.getSubCategories(Number(this.listingId));
      await this.getKeyFeatures(Number(this.listingId));
      await this.getInteriors(Number(this.listingId));
      await this.getLocationInfo();
      this.spinner.hide();
    } catch (error) {
      this.spinner.hide();
    }
  }

  private async buildForm(): Promise<void> {
    this.titleForm = new FormGroup({
      listingId: new FormControl(Number(this.listingId)),
      description: new FormControl(null, [
        Validators.required,
        Validators.minLength(100),
      ]),
      title: new FormControl(null, [Validators.required]),
    });
  }

  get c(): { [key: string]: AbstractControl } {
    return this.titleForm.controls;
  }

  private async getLocationInfo(): Promise<void> {
    const response = await this.stepOneService.getListingLocationInfo(
      Number(this.listingId)
    );

    if (response && response.success && response.data.data) {
      const data = response.data.data;
      this.updateBackRoutes();
      this.titleForm.patchValue({
        description: data.locationDescription,
        title: data.locationTitle,
      });
    }
  }

  private updateBackRoutes(): void {
    this.backBtnRoute = `/become-a-host/${+this.listingId}`;
    if (this.subCategoriesLength > 0) {
      this.backBtnRoute = `/become-a-host/${+this.listingId}/step-2/styles`;
    }
    if (this.keyFeaturesLength > 0) {
      this.backBtnRoute = `/become-a-host/${+this.listingId}/step-2/features`;
    }
    if (this.interiorsLength > 0) {
      this.backBtnRoute = `/become-a-host/${+this.listingId}/step-2/interior`;
    }
  }

  async updateTitleAndDescription(flag?: string): Promise<void> {
    this.isSubmitted = true;
    if (this.titleForm.invalid) return;
    const data = this.titleForm.value;
    const response = await this.stepTwoService.updateTitleAndDescription(data);
    if (response && response.success && response.data) {
      if (flag) {
        this.router.navigateByUrl(`/become-a-host/${+this.listingId}`);
      } else {
        this.router.navigateByUrl(this.nxtBtnRoute);
      }
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
}
