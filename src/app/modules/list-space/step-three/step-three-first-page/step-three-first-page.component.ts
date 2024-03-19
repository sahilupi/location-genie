import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TimeSlots } from 'src/app/constants/booking-timeslots';
import { ListingStepperConstant } from 'src/app/constants/listing-stepper.constant';
import { Locations } from 'src/app/constants/locations';
import { StepThreeData } from 'src/app/constants/step-three.constant';
import { LocationList } from 'src/app/models/location.model';
import { OpeningHour, Rule } from 'src/app/models/step-three.model';
import { TimeSlot } from 'src/app/models/time-slot.model';
import { ListingStepThreeService } from 'src/app/services/listing-step-three.service';
import { SnackBarService } from 'src/app/services/snack-bar.service';
import { SpinnerService } from 'src/app/services/spinner.service';
@Component({
  selector: 'app-step-three-first-page',
  templateUrl: './step-three-first-page.component.html',
  styleUrls: ['./step-three-first-page.component.scss'],
})
export class StepThreeFirstPageComponent implements OnInit {
  @Input({ required: true }) listingId: string;

  backBtnRoute: string;
  nxtBtnRoute: string;
  // for rules
  rules = StepThreeData.rules;
  additionalRules: Rule[] = [];
  additionalRuleForm: FormGroup;
  // for Opening Hours
  selectedStartTimeIdx = 1;
  locations: LocationList[] = Locations.locatoinsList;
  startTimeSlots: TimeSlot[] = TimeSlots.startTimes;
  availableEndTimeSlots: TimeSlot[] = TimeSlots.startTimes.slice(
    this.selectedStartTimeIdx
  );
  nextDayTimeSlots: TimeSlot[] = TimeSlots.nextDayTimeSlots;
  endOfDayTimeSlot: TimeSlot = TimeSlots.endOfDayTimeSlot;
  days = TimeSlots.days;
  daysForm: FormGroup;
  stepperData = ListingStepperConstant.stepThree;

  constructor(
    private stepThreeService: ListingStepThreeService,
    private snackbar: SnackBarService,
    private router: Router,
    private spinner: SpinnerService
  ) {}

  async ngOnInit(): Promise<void> {
    this.spinner.show();
    try {
      this.startTimeSlots.push(this.endOfDayTimeSlot);
      this.backBtnRoute = `/become-a-host/${+this.listingId}`;
      this.nxtBtnRoute = `/become-a-host/${+this.listingId}/step-3/calendar`;
      await this.daysFormInit();
      await this.additionalRuleFormInit();
      if (this.listingId) {
        await this.getListingRules(Number(this.listingId));
        await this.getOpeningHours(Number(this.listingId));
      }
      this.spinner.hide();
    } catch (err) {
      this.spinner.hide();
    }
  }

  private async daysFormInit(): Promise<void> {
    this.daysForm = new FormGroup({
      days: new FormArray(
        this.days.map((day) => {
          return new FormGroup({
            name: new FormControl(day.name),
            checked: new FormControl(day.checked),
            startTime: new FormControl(this.startTimeSlots[0].value),
            endTime: new FormControl(this.nextDayTimeSlots.at(-1)?.value),
            availableEndTimeSlots: new FormControl(
              this.availableEndTimeSlots.concat(TimeSlots.endOfDayTimeSlot)
            ),
          });
        })
      ),
    });
  }

  private async getOpeningHours(id: number): Promise<void> {
    const response = await this.stepThreeService.getOpeningHours(id);
    if (response && response.success && response.data) {
      const data = response.data;
      const days = [
        {
          name: 'Sunday',
          checked: data.isOpenSunday,
          startTime: data.sundayOpenTime.split(';')[0],
          endTime: data.sundayOpenTime.split(';')[1],
        },
        {
          name: 'Monday',
          checked: data.isOpenMonday,
          startTime: data.mondayOpenTime.split(';')[0],
          endTime: data.mondayOpenTime.split(';')[1],
        },
        {
          name: 'Tuesday',
          checked: data.isOpenTuesday,
          startTime: data.tuesdayOpenTime.split(';')[0],
          endTime: data.tuesdayOpenTime.split(';')[1],
        },
        {
          name: 'Wednesday',
          checked: data.isOpenWednesday,
          startTime: data.wednesdayOpenTime.split(';')[0],
          endTime: data.wednesdayOpenTime.split(';')[1],
        },
        {
          name: 'Thursday',
          checked: data.isOpenThursday,
          startTime: data.thursdayOpenTime.split(';')[0],
          endTime: data.thursdayOpenTime.split(';')[1],
        },
        {
          name: 'Friday',
          checked: data.isOpenFriday,
          startTime: data.fridayOpenTime.split(';')[0],
          endTime: data.fridayOpenTime.split(';')[1],
        },
        {
          name: 'Saturday',
          checked: data.isOpenSaturday,
          startTime: data.saturdayOpenTime.split(';')[0],
          endTime: data.saturdayOpenTime.split(';')[1],
        },
      ];

      this.daysForm = new FormGroup({
        days: new FormArray(
          days.map((day) => {
            const availTimeStartIndex = this.startTimeSlots.findIndex(
              (slot) => slot.value === day.startTime
            );

            return new FormGroup({
              name: new FormControl(day.name),
              checked: new FormControl(day.checked),
              startTime: new FormControl(day.startTime),
              endTime: new FormControl(day.endTime),
              availableEndTimeSlots: new FormControl(
                this.availableEndTimeSlots.slice(availTimeStartIndex)
              ),
            });
          })
        ),
      });
    }
  }

  get daysControls() {
    return (this.daysForm.get('days') as FormArray).controls;
  }

  private async additionalRuleFormInit(): Promise<void> {
    this.additionalRuleForm = new FormGroup({
      name: new FormControl(null, [Validators.required]),
    });
  }

  private async getListingRules(id: number): Promise<void> {
    const response = await this.stepThreeService.getListingRules(id);
    if (response && response.success && response.data) {
      const data = response.data;
      const parsedRules = JSON.parse(data.rules);
      const parsedAddionalRules = JSON.parse(data.additionalRules);
      parsedRules.map((resRule: Rule) => {
        const ruleIdx = this.rules.findIndex(
          (rule) => rule.name === resRule.name
        );
        this.rules[ruleIdx].checked = resRule.checked;
      });
      parsedAddionalRules.map((rule: string) => {
        this.additionalRules.push({
          name: rule,
        });
      });
    }
  }

  async onUpdateRules(): Promise<void> {
    const rules: Rule[] = [];
    const additionalRules: string[] = this.additionalRules.map(
      (rule) => rule.name
    );
    this.rules.map((rule) => {
      if (rule.checked !== null) {
        rules.push({
          name: rule.name,
          checked: rule.checked,
        });
      }
    });
    const stringifiedRules = JSON.stringify(rules);
    const stringifiedAdditionalRules = JSON.stringify(additionalRules);
    const response = await this.stepThreeService.updateListingRules(
      Number(this.listingId),
      stringifiedRules,
      stringifiedAdditionalRules
    );
    if (response && response.success) {
      await this.onUpdateOpeningHours();
    }
  }

  async onUpdateOpeningHours(flag?: string): Promise<void> {
    const rules: Rule[] = [];
    const additionalRules: string[] = this.additionalRules.map(
      (rule) => rule.name
    );
    this.rules.map((rule) => {
      if (rule.checked !== null) {
        rules.push({
          name: rule.name,
          checked: rule.checked,
        });
      }
    });
    const stringifiedRules = JSON.stringify(rules);
    const stringifiedAdditionalRules = JSON.stringify(additionalRules);
    const rulesResponse = await this.stepThreeService.updateListingRules(
      Number(this.listingId),
      stringifiedRules,
      stringifiedAdditionalRules
    );
    if (rulesResponse && rulesResponse.success) {
      const days = this.daysForm.get('days') as FormArray;
      const payLoad: OpeningHour = {
        listingId: Number(this.listingId),
        isOpenSunday: days.value[0].checked,
        isOpenMonday: days.value[1].checked,
        isOpenTuesday: days.value[2].checked,
        isOpenWednesday: days.value[3].checked,
        isOpenThursday: days.value[4].checked,
        isOpenFriday: days.value[5].checked,
        isOpenSaturday: days.value[6].checked,
        sundayOpenTime: days.value[0].startTime + ';' + days.value[0].endTime,
        mondayOpenTime: days.value[1].startTime + ';' + days.value[1].endTime,
        tuesdayOpenTime: days.value[2].startTime + ';' + days.value[2].endTime,
        wednesdayOpenTime:
          days.value[3].startTime + ';' + days.value[3].endTime,
        thursdayOpenTime: days.value[4].startTime + ';' + days.value[4].endTime,
        fridayOpenTime: days.value[5].startTime + ';' + days.value[5].endTime,
        saturdayOpenTime: days.value[6].startTime + ';' + days.value[6].endTime,
      };
      const response = await this.stepThreeService.updateOpeningHours(payLoad);
      if (response && response.success) {
        if (flag) {
          this.router.navigateByUrl(`/become-a-host/${+this.listingId}`);
        } else {
          this.router.navigateByUrl(this.nxtBtnRoute);
        }
      }
    }
  }

  onUpdateCheckedRules(ruleName: string, checkedValue: boolean): void {
    const foundRuleIdx = this.rules.findIndex((rule) => rule.name === ruleName);
    if (checkedValue && this.rules[foundRuleIdx].checked === checkedValue) {
      this.rules[foundRuleIdx].checked = null;
    } else if (
      !checkedValue &&
      this.rules[foundRuleIdx].checked === checkedValue
    ) {
      this.rules[foundRuleIdx].checked = null;
    } else {
      this.rules[foundRuleIdx].checked = checkedValue;
    }
  }

  onAddNewRule(): void {
    if (this.additionalRuleForm.valid) {
      const existingRules = this.rules.map((rule) => rule.name);
      const existingNewRules = this.additionalRules.map((rule) => rule.name);
      if (
        !existingRules.includes(this.additionalRuleForm.value.name) &&
        !existingNewRules.includes(this.additionalRuleForm.value.name)
      ) {
        this.additionalRules.push({ name: this.additionalRuleForm.value.name });
        this.additionalRuleForm.reset();
      } else {
        this.snackbar.info('Rule exists already');
      }
    }
  }

  onRemoveRule(name: string): void {
    this.additionalRules = this.additionalRules.filter(
      (rule) => rule.name !== name
    );
  }

  onChangeEndTime(index: number, startTime: string): void {
    if (startTime !== '24:00') {
      this.selectedStartTimeIdx = this.startTimeSlots.findIndex(
        (slot) => slot.value === startTime
      );
      const endTimeSlots = this.startTimeSlots.slice(
        this.selectedStartTimeIdx + 1
      );
      this.daysControls[index]
        .get('availableEndTimeSlots')
        ?.patchValue(endTimeSlots);
      if (
        this.daysControls[index].get('endTime')?.value < endTimeSlots[0].value
      ) {
        this.daysControls[index]
          .get('endTime')
          ?.patchValue(endTimeSlots[0].value);
      }
    }
    if (startTime === '24:00') {
      this.daysControls[index].get('availableEndTimeSlots')?.patchValue([]);
      this.daysControls[index]
        .get('endTime')
        ?.patchValue(this.nextDayTimeSlots[0].value);
    }
  }
}
