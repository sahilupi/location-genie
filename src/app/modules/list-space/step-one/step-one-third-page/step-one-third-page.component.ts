import { Component, Input } from '@angular/core';
import { ListingStepperConstant } from 'src/app/constants/listing-stepper.constant';

@Component({
  selector: 'app-step-one-third-page',
  templateUrl: './step-one-third-page.component.html',
  styleUrls: ['./step-one-third-page.component.scss'],
})
export class StepOneThirdPageComponent {
  @Input({ required: true }) listingId: string;

  stepperData = ListingStepperConstant.stepOne;

  constructor() {}
}
