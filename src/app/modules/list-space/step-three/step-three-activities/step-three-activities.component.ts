import { Component, HostListener, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ListingStepperConstant } from 'src/app/constants/listing-stepper.constant';
import { EventList } from 'src/app/models/event.model';
import { FilterPipe } from 'src/app/pipes/filter.pipe';
import { ListingStepThreeService } from 'src/app/services/listing-step-three.service';
import { ListingService } from 'src/app/services/listing.service';
import { SnackBarService } from 'src/app/services/snack-bar.service';
import { SpinnerService } from 'src/app/services/spinner.service';

@Component({
  selector: 'app-step-three-activities',
  templateUrl: './step-three-activities.component.html',
  styleUrls: ['./step-three-activities.component.scss'],
  providers: [FilterPipe],
})
export class StepThreeActivitiesComponent implements OnInit {
  @Input({ required: true }) listingId: string;
  stepperData = ListingStepperConstant.stepThree;
  backBtnRoute: string;
  nxtBtnRoute: string;
  activities: EventList[] = [];
  tempActivities: EventList[] = [];
  checkedActivities: EventList[] = [];
  searchForm: FormGroup;
  showEventList: boolean = false;
  menuBtnClick: boolean = false;
  showAllActivities = false;
  popularActivities: EventList[] = [];
  tempPopularActivities: EventList[] = [];

  @HostListener('window:click', ['$event'])
  windowClick() {
    if (!this.menuBtnClick) {
      this.showEventList = false;
    } else {
      this.menuBtnClick = false;
    }
  }

  constructor(
    private router: Router,
    private stepThreeService: ListingStepThreeService,
    private spinner: SpinnerService,
    private snackbar: SnackBarService,
    private listingService: ListingService,
    private filter: FilterPipe
  ) {}

  async ngOnInit(): Promise<void> {
    this.spinner.show();
    try {
      await this.callSearchForm();
      this.backBtnRoute = `/become-a-host/${+this.listingId}/step-3/pricing`;
      this.nxtBtnRoute = `/become-a-host/${+this
        .listingId}/step-3/phone-number`;
      await this.getActivitiesByEvent(+this.listingId);
      await this.getAllPopularActivities();
      await this.getSelectedActivitiesByEvent(+this.listingId);
      this.checkSelected();
    } catch (error) {
    } finally {
      this.spinner.hide();
    }
  }

  private async callSearchForm(): Promise<void> {
    this.searchForm = new FormGroup({
      event: new FormControl(null),
    });

    this.searchForm.controls['event'].valueChanges.subscribe((value) => {
      this.onFilterActivities(value);
    });
  }

  onFocusEvent(): void {
    this.showEventList = true;
    this.searchForm.patchValue({
      event: '',
    });
  }

  toggleSelection(data: EventList, id?: string | number): void {
    const activity = this.activities.find((activity) => activity.id === id);
    const popularActivity = this.popularActivities.find(
      (activity) => activity.id === id
    );
    if (activity) {
      activity.checked = !activity.checked;
    }
    if (popularActivity) {
      popularActivity.checked = !popularActivity.checked;
    }
    if (data.checked) {
      if (!this.checkedActivities.find((item) => item.id === data.id)) {
        this.checkedActivities.push(data);
      }
    } else {
      this.checkedActivities = this.checkedActivities.filter(
        (value: EventList) => value.id !== data.id
      );
    }
  }

  preventCloseOnClick(): void {
    this.menuBtnClick = true;
  }

  private async getAllPopularActivities(): Promise<void> {
    const popularActivityResponse =
      await this.listingService.getPopularActivities();
    if (
      popularActivityResponse &&
      popularActivityResponse.success &&
      popularActivityResponse.data.response
    ) {
      const activityData = popularActivityResponse.data.response;
      activityData.forEach((activity: string) => {
        const parsedActivity = JSON.parse(activity);
        this.popularActivities.push({
          name: parsedActivity.name,
          value: parsedActivity.name,
          id: parsedActivity.id,
        });
      });

      this.tempPopularActivities = [...this.popularActivities];
    }
  }

  private async getActivitiesByEvent(id: number): Promise<void> {
    const response = await this.stepThreeService.getActivitiesByEvent(id);
    if (response && response.success && response.data.response) {
      const activityData = response.data.response;
      activityData.forEach((activity: { activityName: string; id: number }) => {
        this.activities.push({
          name: activity.activityName,
          value: activity.activityName,
          id: activity.id,
        });
      });
      this.tempActivities = [...this.activities];
    }
  }

  private async getSelectedActivitiesByEvent(id: number): Promise<void> {
    const response = await this.stepThreeService.getSelectedActivitiesByEvent(
      id
    );
    if (
      response &&
      response.success &&
      response.data &&
      response.data.response
    ) {
      const selectedActivities = JSON.parse(response.data.response);
      if (selectedActivities.length > 0) {
        const selectedIds = selectedActivities.map(
          (activity: EventList) => activity.id
        );
        this.activities.forEach((activity) => {
          if (selectedIds.includes(Number(activity.id))) {
            activity.checked = true;
          }
        });
        this.popularActivities.forEach((activity) => {
          if (selectedIds.includes(Number(activity.id))) {
            activity.checked = true;
          }
        });
      }
    }
  }

  async onSaveAndExit(): Promise<void> {
    const checkedActivitys = this.activities.filter(
      (activity) => activity.checked
    );
    if (checkedActivitys.length > 1) {
      const jsonCheckedActivitys = JSON.stringify(checkedActivitys);
      await this.stepThreeService.onUpdateActivitiesByEvent(
        +this.listingId,
        jsonCheckedActivitys
      );
    }
    this.router.navigateByUrl(`/become-a-host/${+this.listingId}`);
  }

  async onSubmit(): Promise<void> {
    const checkedActivitys = this.checkedActivities.filter(
      (activity) => activity.checked
    );
    if (checkedActivitys.length < 1) {
      this.snackbar.error('Please select atleast one activity');
      return;
    }
    const jsonCheckedActivitys = JSON.stringify(checkedActivitys);
    const response = await this.stepThreeService.onUpdateActivitiesByEvent(
      +this.listingId,
      jsonCheckedActivitys
    );
    if (response && response.success) {
      this.router.navigateByUrl(this.nxtBtnRoute);
    }
  }

  checkSelected(): void {
    this.checkedActivities = this.activities.filter(
      (activity) => activity.checked
    );
  }

  onFilterActivities(event: string): void {
    // for all activities
    this.activities = this.tempActivities;
    this.activities = this.filter.transform(this.activities, event);
    this.activities = [...this.activities, ...this.checkedActivities];
    this.activities = this.removeDuplicates(this.activities, 'name');

    // for popular activities;
    this.popularActivities = this.tempPopularActivities;
    this.popularActivities = this.filter.transform(
      this.popularActivities,
      event
    );
    this.popularActivities = [
      ...this.popularActivities,
      ...this.tempPopularActivities,
    ];
    this.popularActivities = this.removeDuplicates(
      this.popularActivities,
      'name'
    );
  }

  removeDuplicates(array: EventList[], key: string): EventList[] {
    const seen = {};
    return array.filter((item: EventList) => {
      //@ts-ignore
      const value = item[key];
      if (seen.hasOwnProperty(value)) {
        return false;
      } else {
        //@ts-ignore
        seen[value] = true;
        return true;
      }
    });
  }
}
