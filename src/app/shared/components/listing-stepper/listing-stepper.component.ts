import { Component, Input, OnInit } from '@angular/core';
import { ListingStepper } from 'src/app/models/listing-stepper.model';

@Component({
  selector: 'app-listing-stepper',
  templateUrl: './listing-stepper.component.html',
  styleUrls: ['./listing-stepper.component.scss'],
})
export class ListingStepperComponent implements OnInit {
  @Input({ required: true }) stepperData: ListingStepper = {
    title: 'Location Crew/opening hours',
    des: 'Set your opening hours to let guests know what times your location is open to host bookings (i.e. your general availability).',
  };
  @Input({ required: true }) idx = 1; // value of i in array.
  @Input({ required: true }) activeIdx = 1; // index on which active class will be added.
  @Input({ required: true }) totalSteppers = 5; // index on which active class will be added.

  percentage: number;
  isMobileScreen = false;

  ngOnInit(): void {
    this.percentage = ((this.idx + 1) * 100) / this.totalSteppers;
    if (window.innerWidth < 767) {
      this.isMobileScreen = true;
    } else {
      this.isMobileScreen = false;
    }
  }
}
