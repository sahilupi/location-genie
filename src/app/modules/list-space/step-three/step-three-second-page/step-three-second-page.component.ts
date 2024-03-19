import {
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import {
  CalendarComponent,
  SelectionRange,
} from '@progress/kendo-angular-dateinputs';
import { ListingStepperConstant } from 'src/app/constants/listing-stepper.constant';
import { ListingStepThreeService } from 'src/app/services/listing-step-three.service';
import { SpinnerService } from 'src/app/services/spinner.service';

@Component({
  selector: 'app-step-three-second-page',
  templateUrl: './step-three-second-page.component.html',
  styleUrls: ['./step-three-second-page.component.scss'],
})
export class StepThreeSecondPageComponent implements OnInit {
  @Input({ required: true }) listingId: string;
  @ViewChild('calender') calender: CalendarComponent;

  backBtnRoute: string;
  nxtBtnRoute: string;
  today = new Date();
  minDate: Date;
  maxDate: Date;
  isWeekendsDisabled = false;
  isWeekDaysDisabled = false;
  isNotDisablingWeekends = true;
  isNotDisablingWeekDays = true;
  selectedRange: SelectionRange | any = {
    start: null,
    end: null,
  };
  disabledDates: Date[] = [];
  availableDates: Date[] = [];
  selectedDate: Date | null = null;
  isStartedSelecting = true;
  selectedDates: Date[] = [];
  stepperData = ListingStepperConstant.stepThree;
  isLoading = false;
  isInlineLoading = false;

  constructor(
    private stepThreeService: ListingStepThreeService,
    private cdRef: ChangeDetectorRef,
    private router: Router,
    private spinner: SpinnerService
  ) {
    this.minDate = new Date(
      this.today.getFullYear(),
      this.today.getMonth(),
      this.today.getDate() - this.today.getDate() + 1
    );
    this.maxDate = new Date(
      this.today.getFullYear() + 2,
      this.today.getMonth(),
      this.today.getDate()
    );
  }

  async ngOnInit(): Promise<void> {
    this.spinner.show();
    try {
      this.backBtnRoute = `/become-a-host/${+this
        .listingId}/step-3/rules-crews`;
      this.nxtBtnRoute = `/become-a-host/${+this.listingId}/step-3/activities`;
      await this.getCalendarData(Number(this.listingId));
      this.spinner.hide();
    } catch (error) {
      this.spinner.hide();
    }
  }

  isDateInPast(date: Date): boolean {
    return date < this.today;
  }

  onChangeUpperDates(startDate: HTMLInputElement, endDate: HTMLInputElement) {
    this.selectedRange.start = new Date(startDate.value);
    this.selectedRange.end = new Date(endDate.value);
  }

  isCurrentDate(date: Date): boolean {
    return date.toDateString() === this.today.toDateString();
  }

  private async getCalendarData(id: number): Promise<void> {
    const response = await this.stepThreeService.getCalendarData(id);
    if (response && response.success && response.data) {
      this.disabledDates = [];
      const data = response.data;
      let blockedDates = JSON.parse(data.blockedDates);
      if (data.availableDates && JSON.parse(data.availableDates).length > 0) {
        this.availableDates = [];
        const availableDates = JSON.parse(data.availableDates);

        availableDates.map((avDate: Date) => {
          this.availableDates.push(new Date(avDate));
        });
      }

      this.isWeekendsDisabled = data.isBlockAllWeekends;
      if (this.isWeekendsDisabled) {
        const currentDate = new Date();
        const endDate = new Date(currentDate.getFullYear() + 2, 11, 31); // Two years from now

        while (currentDate <= endDate) {
          // this.availableDates = this.availableDates.filter(
          //   (date) => date.getDay() === 0 || date.getDay() === 6
          // );
          if (currentDate.getDay() === 0 || currentDate.getDay() === 6) {
            // 0 represents Sunday, and 6 represents Saturday
            this.disabledDates.push(new Date(currentDate));
          }

          currentDate.setDate(currentDate.getDate() + 1); // Move to the next day
        }
      }
      // else {
      //   // Filter out the weekend dates (Saturdays and Sundays)
      //   this.disabledDates = this.disabledDates.filter(
      //     (date) => date.getDay() !== 0 && date.getDay() !== 6
      //   );
      // }

      // disalbing weekdays
      this.isWeekDaysDisabled = data.isBlockAllBuisnessDays;
      const weekdays = [1, 2, 3, 4, 5];
      const currentDate = new Date();
      const endDate = new Date(currentDate.getFullYear() + 2, 11, 31); // Two years from now
      if (this.isWeekDaysDisabled) {
        // this.availableDates = this.availableDates.filter(
        //   (date) => !weekdays.includes(date.getDay())
        // );
        while (currentDate <= endDate) {
          if (weekdays.includes(currentDate.getDay())) {
            this.disabledDates.push(new Date(currentDate));
          }
          currentDate.setDate(currentDate.getDate() + 1); // Move to the next day
        }
      }

      blockedDates.map((blockedDate: Date) => {
        this.disabledDates.push(new Date(blockedDate));
      });
    }

    for (let i = 1; i <= 31; i++) {
      const pastDate = new Date(
        this.today.getFullYear(),
        this.today.getMonth(),
        this.today.getDate() - i
      );
      this.disabledDates.push(new Date(pastDate));
    }

    const avDates = this.availableDates.map((date, i) => {
      return date.toISOString().slice(0, 10);
    });
    this.disabledDates = this.disabledDates.filter(
      (date) => !avDates.includes(date.toISOString().slice(0, 10))
    );
    this.calender.blur();
    this.cdRef.detectChanges();
  }

  generateDatesBetween(start: Date, end: Date): Date[] {
    const datesArray: Date[] = [];
    const currentDate = new Date(start);
    while (currentDate <= end) {
      datesArray.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }
    return datesArray;
  }

  onChange(e: SelectionRange): void {
    this.selectedRange = e;
  }

  async onBlockOrUnblockWeekends(isBlocking: boolean): Promise<void> {
    this.isLoading = true;
    this.isNotDisablingWeekends = isBlocking;
    this.isWeekendsDisabled = isBlocking;
    if (isBlocking) {
      this.availableDates = this.availableDates.filter(
        (date) => date.getDay() !== 0 && date.getDay() !== 6
      );
    }
    if (!isBlocking) {
      this.availableDates = this.availableDates.filter(
        (date) => date.getDay() !== 0 && date.getDay() !== 6
      );

      this.disabledDates = this.disabledDates.filter(
        (date) => date.getDay() !== 0 && date.getDay() !== 6
      );
    }

    const payload = {
      listingId: Number(this.listingId),
      blockAllWeekends: isBlocking,
    };

    const response = await this.stepThreeService.blockOrUnblockWeekends(
      payload
    );
    if (response && response.success) {
      const payload = {
        listingId: Number(this.listingId),
        blockedDates: [JSON.stringify(this.disabledDates)],
        availableDates: [JSON.stringify(this.availableDates)],
      };

      const response2 = await this.stepThreeService.updateBlockedAvailabledates(
        payload
      );
      if (response2 && response2.success) {
        await this.getCalendarData(Number(this.listingId));
        this.isInlineLoading = false;
      } else {
        this.isInlineLoading = false;
      }
      // await this.getCalendarData(Number(this.listingId));
      // this.isInlineLoading = false;
      this.isLoading = false;
    } else {
      this.isInlineLoading = false;
      this.isLoading = false;
    }
  }

  async onUnblockBlockWeekDays(isBlocking: boolean): Promise<void> {
    this.isLoading = true;
    this.isWeekDaysDisabled = isBlocking;
    this.isNotDisablingWeekDays = isBlocking;

    const weekdays = [1, 2, 3, 4, 5, 6];
    this.disabledDates = this.disabledDates.filter(
      (date) => !weekdays.includes(date.getDay())
    );
    this.availableDates = this.availableDates.filter(
      (date) => !weekdays.includes(date.getDay())
    );
    // if (isBlocking) {
    //   this.disabledDates = this.disabledDates.filter(
    //     (date) => !weekdays.includes(date.getDay())
    //   );
    //   this.availableDates = this.availableDates.filter(
    //     (date) => !weekdays.includes(date.getDay())
    //   );
    // } else {
    //   this.disabledDates = this.disabledDates.filter(
    //     (date) => !weekdays.includes(date.getDay())
    //   );
    // }

    const payload = {
      listingId: Number(this.listingId),
      blockAllBuisnessDays: isBlocking,
    };

    const response = await this.stepThreeService.blockOrUnblockWeekDays(
      payload
    );
    if (response && response.success) {
      let payload = {
        listingId: Number(this.listingId),
        blockedDates: [JSON.stringify(this.disabledDates)],
        availableDates: [JSON.stringify(this.availableDates)],
      };

      const response = await this.stepThreeService.updateBlockedAvailabledates(
        payload
      );
      if (response && response.success) {
        await this.getCalendarData(Number(this.listingId));
        this.isInlineLoading = false;
      } else {
        this.isInlineLoading = false;
      }

      this.isLoading = false;
    } else {
      this.isInlineLoading = false;
      this.isLoading = false;
    }
  }

  handleCalendarClick(event: MouseEvent): void {
    const target = event.target as HTMLButtonElement;
    const parentElement = target.parentElement;
    const selectedDate = parentElement?.getAttribute('title');
    //  && this.isBlocked(new Date(selectedDate))
    if (selectedDate) {
      if (
        new Date(selectedDate).toISOString() + 1 >=
        new Date().toISOString()
      ) {
        this.cdRef.detectChanges();
        // parentElement?.classList.add('k-selected');
        if (this.isStartedSelecting) {
          this.selectedRange.start = new Date(selectedDate);
        }
        if (!this.isStartedSelecting) {
          this.selectedRange.end = new Date(selectedDate);
        }
        if (this.selectedRange.start > this.selectedRange.end) {
          this.selectedRange.end = this.selectedRange.start;
        }
        this.isStartedSelecting = !this.isStartedSelecting;
        this.calender.blur();
        this.cdRef.detectChanges();
      }
    }
  }

  isBlocked(date: Date): boolean {
    return this.disabledDates.some((disabledDate) =>
      this.isSameDate(disabledDate, date)
    );
  }

  isSameDate(date1: Date, date2: Date): boolean {
    return date1.toISOString() === date2.toISOString();
  }

  checkIfDateAvailble(): boolean {
    let isAvailble = false;
    this.disabledDates.map((disableDate) => {
      if (
        disableDate.toISOString() === this.selectedRange.start.toISOString()
      ) {
        isAvailble = true;
        return;
      }
    });
    return isAvailble;
  }

  async onUpdateBlockedAndAvailableDates(flag: string): Promise<void> {
    this.isInlineLoading = true;
    const selectedDates = this.generateDatesBetween(
      new Date(this.selectedRange.start),
      new Date(this.selectedRange.end)
    );

    if (flag === 'available') {
      // selectedDates.map((selectedDate) => {
      //   this.availableDates = this.availableDates.filter(
      //     (date) => date.toISOString() !== new Date(selectedDate).toISOString()
      //   );
      // });
      // this.availableDates = [];
      selectedDates.map((selectedDate, i) => {
        this.availableDates.push(selectedDate);
      });
      // const last = this.availableDates.slice(1, 0)[0];
      // if (last) {
      // const lastDate = new Date(
      //   this.selectedRange.start.toISOString().slice()
      // ).setDate(this.selectedRange.start.getDate() + 1);
      // this.availableDates.unshift(new Date(lastDate));
      // }

      if (this.isWeekendsDisabled) {
        this.disabledDates = this.disabledDates.filter(
          (date) => date.getDay() !== 0 && date.getDay() !== 6
        );
        // this.availableDates = this.availableDates.filter(
        //   (date) => date.getDay() !== 0 && date.getDay() !== 6
        // );
      }
      if (this.isWeekDaysDisabled) {
        const weekdays = [1, 2, 3, 4, 5];

        this.disabledDates = this.disabledDates.filter(
          (date) => !weekdays.includes(date.getDay())
        );
        // this.availableDates = this.availableDates.filter(
        //   (date) => !weekdays.includes(date.getDay())
        // );
      }

      const payload = {
        listingId: Number(this.listingId),
        blockedDates: [JSON.stringify(this.disabledDates)],
        availableDates: [JSON.stringify(this.availableDates)],
      };
      const response = await this.stepThreeService.updateBlockedAvailabledates(
        payload
      );
      if (response && response.success) {
        await this.getCalendarData(Number(this.listingId));
        this.isInlineLoading = false;
      } else {
        this.isInlineLoading = false;
      }
    } else if (flag === 'block') {
      const disabledDates: Date[] = [];
      selectedDates.map((selectedDate) => {
        this.disabledDates.push(selectedDate);
      });

      const avDates = this.availableDates.map((date) =>
        date.toISOString().slice(0, 10)
      );

      const availableDates = disabledDates.filter(
        (date) => !avDates.includes(date.toISOString().slice(0, 10))
      );

      const payload = {
        listingId: Number(this.listingId),
        blockedDates: [JSON.stringify(this.disabledDates)],
        availableDates: [JSON.stringify(availableDates)],
      };
      const response = await this.stepThreeService.updateBlockedAvailabledates(
        payload
      );
      if (response && response.success) {
        // await this.getCalendarData(Number(this.listingId));
        location.reload();
        this.isInlineLoading = false;
      } else {
        this.isInlineLoading = false;
      }
    }
  }

  onNavigateToListing(): void {
    this.router.navigateByUrl(`/become-a-host/${+this.listingId}`);
  }
}
