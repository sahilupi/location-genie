import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ListingStepperConstant } from 'src/app/constants/listing-stepper.constant';
import { ActivityAttendies } from 'src/app/models/step-three.model';
import { CommonService } from 'src/app/services/common.service';
import { ListingStepThreeService } from 'src/app/services/listing-step-three.service';
import { SpinnerService } from 'src/app/services/spinner.service';

@Component({
  selector: 'app-step-three-third-page',
  templateUrl: './step-three-third-page.component.html',
  styleUrls: ['./step-three-third-page.component.scss'],
})
export class StepThreeThirdPageComponent implements OnInit {
  @Input({ required: true }) listingId: string;
  @ViewChild('activities') activities: ElementRef;

  backBtnRoute: string;
  nxtBtnRoute: string;
  welcomeGuide = { message: '' };
  activityForm: FormGroup;
  isSubmitted = false;
  validationMsg = `A published listing should have at least one activity. Please choose how
  guests will use your location.`;
  stepperData = ListingStepperConstant.stepThree;

  constructor(
    private stepThreeService: ListingStepThreeService,
    protected commonService: CommonService,
    private router: Router,
    private spinner: SpinnerService
  ) {}

  async ngOnInit(): Promise<void> {
    this.spinner.show();
    try {
      this.backBtnRoute = `/become-a-host/${+this.listingId}/step-3/calendar`;
      this.nxtBtnRoute = `/become-a-host/${+this.listingId}/step-3/pricing`;
      await this.activityFormInit();
      await this.getWelcomeGuide(Number(this.listingId));
      await this.getActivityAttendies(Number(this.listingId));
      this.spinner.hide();
    } catch (error) {
      this.spinner.hide();
    }
  }

  private async activityFormInit(): Promise<void> {
    this.activityForm = new FormGroup({
      production: new FormControl(false),
      event: new FormControl(false),
      meeting: new FormControl(false),
      numberOfAttendees: new FormControl(999),
    });
  }

  private async getWelcomeGuide(id: number): Promise<void> {
    const response = await this.stepThreeService.getWelcomeGuide(id);
    if (response && response.success && response.data) {
      this.welcomeGuide.message = response.data;
    }
  }

  private async getActivityAttendies(id: number): Promise<void> {
    const response = await this.stepThreeService.getActivityAttendies(id);
    if (response && response.success && response.data) {
      const data = response.data;
      this.activityForm.patchValue({
        production: data.isProduction,
        event: data.isEvent,
        meeting: data.isMeeting,
        numberOfAttendees: data.numberOfAttendees,
      });
    }
  }

  async onUpdateWelcomeGuide(
    value: { message: string },
    flag?: string
  ): Promise<void> {
    this.isSubmitted = true;
    setTimeout(() => {
      this.isSubmitted = false;
    }, 800);
    if (
      !this.activityForm.valid ||
      (!this.activityForm.value.production &&
        !this.activityForm.value.event &&
        !this.activityForm.value.meeting)
    ) {
      const activitiesEl = this.activities.nativeElement as HTMLElement;
      if (activitiesEl) {
        activitiesEl.scrollIntoView({
          block: 'start',
          behavior: 'smooth',
        });
      }
      return;
    }
    const welcomeRes = await this.stepThreeService.updateWelcomeGuide(
      Number(this.listingId),
      value.message
    );
    const payload: ActivityAttendies = {
      listingId: Number(this.listingId),
      isProduction: this.activityForm.value.production,
      isEvent: this.activityForm.value.event,
      isMeeting: this.activityForm.value.meeting,
      numberOfAttendees: +this.activityForm.value.numberOfAttendees,
    };

    const activityRes = await this.stepThreeService.updateActivityAttendies(
      payload
    );

    if (
      welcomeRes &&
      welcomeRes.success &&
      activityRes &&
      activityRes.success
    ) {
      if (flag) {
        this.router.navigateByUrl(`/become-a-host/${+this.listingId}`);
      } else {
        this.router.navigateByUrl(this.nxtBtnRoute);
      }
    }
  }
}
