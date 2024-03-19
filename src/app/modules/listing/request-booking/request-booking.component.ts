import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { ActivatedRoute, Router } from '@angular/router';
import { TimeSlots } from 'src/app/constants/booking-timeslots';
import { ListingDetails } from 'src/app/constants/listing-details.constant';
import { Locations } from 'src/app/constants/locations';
import { EventList } from 'src/app/models/event.model';
import { AttendiesDropdown, LocationList } from 'src/app/models/location.model';
import { ReservedDates, TimeSlot } from 'src/app/models/time-slot.model';
import { LocalService } from 'src/app/services/local.service';
import { LocalConstant } from 'src/app/constants/local-constant';
import { RequestBooking } from 'src/app/models/listing.model';
import { ListingService } from 'src/app/services/listing.service';
import {
  StripeCardCvcComponent,
  StripeCardExpiryComponent,
  StripeCardNumberComponent,
  StripeService,
} from 'ngx-stripe';
import { DEFAULT_COUNTRY } from 'src/app/constants/country-code.constant';
import { Country } from 'src/app/models/common.model';
import { CountryData } from 'src/app/constants/country-list';
import {
  StripeCardElementOptions,
  StripeElementsOptions,
} from '@stripe/stripe-js';
import { StripeCardOptions } from 'src/app/constants/stripe.constant';
import { SuccessConstant } from 'src/app/constants/success.constant';
import { SnackBarService } from 'src/app/services/snack-bar.service';
import { PersonalInfoService } from 'src/app/services/personal-info.service';
import { FilterPipe } from 'src/app/pipes/filter.pipe';
import { CommonService } from 'src/app/services/common.service';
import { CardData } from 'src/app/models/credit-card.model';
import { AuthService } from 'src/app/services/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { LoginPopupComponent } from 'src/app/auth/login-popup/login-popup.component';
import { ListingStepThreeService } from 'src/app/services/listing-step-three.service';

@Component({
  selector: 'app-request-booking',
  templateUrl: './request-booking.component.html',
  styleUrls: ['./request-booking.component.scss'],
  providers: [FilterPipe],
})
export class RequestBookingComponent implements OnInit {
  @Input() list: string;
  @ViewChild(StripeCardNumberComponent) cardNumber: StripeCardNumberComponent;
  @ViewChild(StripeCardExpiryComponent) cardExpiry: StripeCardExpiryComponent;
  @ViewChild(StripeCardCvcComponent) cardCvc: StripeCardCvcComponent;
  listingDetails: LocationList;
  currency = 'USD';
  attendiesDropdown: AttendiesDropdown[] = ListingDetails.attendiesDropdown;
  selectedAttendies: AttendiesDropdown = this.attendiesDropdown[0];
  eventsList: EventList[] = [];
  activity = this.eventsList[0];
  chargesPerHour: number;
  disabledDates: Date[] = [];
  minimumHours: number = 0;
  processingFee = 44;
  selectedStartTimeIdx = 0;
  totalHours: number = 0;
  endTimeIdx: number = 0;
  indexToStartFrom = 4;
  locations: LocationList[] = Locations.locatoinsList;
  startTimeSlots: TimeSlot[] = TimeSlots.startTimes;
  endOfDayTimeSlot: TimeSlot = TimeSlots.endOfDayTimeSlot;
  availableEndTimeSlots: TimeSlot[] = TimeSlots.startTimes.slice(
    this.selectedStartTimeIdx
  );
  nextDayTimeSlots: TimeSlot[] = TimeSlots.nextDayTimeSlots;
  similarLocations: LocationList[] = Locations.locatoinsList.slice(5, 8);
  projectForm: FormGroup;
  bookingForm: FormGroup;
  startDate: string | null;
  today = new Date();
  isSubmittedProjectForm = false;
  isSubmittedStripeForm = false;
  isAddingBooking = false;
  isBookedForNextDay = false;
  showNextDayTimeSlots = true;
  isProjectDetailsCompleted = false;
  showProjectDetails = true;
  isCardFocused = false;
  isBooking = false;
  isInstantBooking = false;
  cardNumberValidations = {
    isCardNumberTouched: false,
    isCardNumberEmpty: true,
    isCardNumberComplete: false,
  };
  cardCvcValidations = {
    isCardCvcTouched: false,
    isCardCvcEmpty: true,
    isCardCvcComplete: false,
  };
  cardExpiryValidations = {
    isCardExpiryTouched: false,
    isCardExpiryEmpty: true,
    isCardExpiryComplete: false,
  };

  // stripe properties
  @ViewChild(StripeCardNumberComponent) card: StripeCardNumberComponent;
  defaultCountry: Country = DEFAULT_COUNTRY;
  stripeForm: FormGroup;
  tokenId: string;
  showCountryList: boolean = false;
  countriesList: Country[] = CountryData;
  email: string;
  cardOptions: StripeCardElementOptions = StripeCardOptions.cardOptions;
  elementsOptions: StripeElementsOptions = StripeCardOptions.elementsOptions;
  isLoading = false;
  isFutureDate = false;
  maxlengthCVC = 3;
  cards: CardData[];
  checkedCardId: string;
  showCards = true;
  reservedDates: ReservedDates[] = [];
  localReservedDates: ReservedDates[] = [];
  availableDates: Date[] = [];
  isTimeSlotsCreated = false;
  isNoInitialReservedDates = false;
  currentSelected: string | undefined;

  constructor(
    private activatedRoute: ActivatedRoute,
    private datepipe: DatePipe,
    private localService: LocalService,
    private authService: AuthService,
    private listingService: ListingService,
    private stripeService: StripeService,
    private personalInfoService: PersonalInfoService,
    private snackbar: SnackBarService,
    private filter: FilterPipe,
    protected commonService: CommonService,
    protected stepThreeService: ListingStepThreeService,
    private router: Router,
    private dialog: MatDialog
  ) { }

  async ngOnInit(): Promise<void> {
    this.isLoading = true;
    try {
      this.listingDetails =
        this.activatedRoute.snapshot.data['listingData'].data;

      this.isInstantBooking =
        this.activatedRoute.snapshot.data['listingData'].data.isInstantBooking;

      this.reservedDates =
        this.activatedRoute.snapshot.data[
          'listingData'
        ].data.bookingDaysData.response;

      this.localReservedDates =
        this.activatedRoute.snapshot.data[
          'listingData'
        ].data.bookingDaysData.response;

      if (
        this.activatedRoute.snapshot.data['listingData'].data.listingPrice &&
        this.activatedRoute.snapshot.data['listingData'].data.listingPrice
          .currency?.currencySymbol
      ) {
        this.currency =
          this.activatedRoute.snapshot.data[
            'listingData'
          ].data.listingPrice.currency.currencySymbol;
      }

      this.updateListingData();
      await this.projectFormInit();
      await this.bookingFormInit();
      await this.stripeFormInit();
      await this.getLocalListing();
      // await this.getRequestedBooking(Number(this.list));
      await this.getPaymentMethod();
      await this.getSelectedActivitiesByEvent(+atob(this.list));
      setTimeout(() => {
        this.handleCardValidations();
      }, 100);
    } catch (error) {
    } finally {
      this.isLoading = false;
    }
  }

  private handleCardValidations(): void {
    this.cardNumber.change.subscribe((result) => {
      this.cardNumberValidations = {
        isCardNumberTouched: true,
        isCardNumberComplete: result.complete,
        isCardNumberEmpty: result.empty,
      };
    });
    this.cardCvc.change.subscribe((result) => {
      this.cardCvcValidations = {
        isCardCvcTouched: true,
        isCardCvcComplete: result.complete,
        isCardCvcEmpty: result.empty,
      };
    });
    this.cardExpiry.change.subscribe((result) => {
      this.cardExpiryValidations = {
        isCardExpiryTouched: true,
        isCardExpiryComplete: result.complete,
        isCardExpiryEmpty: result.empty,
      };
    });
  }

  private async projectFormInit(): Promise<void> {
    this.projectForm = new FormGroup({
      projectName: new FormControl(null, [Validators.required]),
      renterCompany: new FormControl(null, [Validators.required]),
      aboutProject: new FormControl(null, [Validators.required]),
    });
  }

  private async bookingFormInit(): Promise<void> {
    const startTimes = JSON.stringify(this.startTimeSlots);
    const availableEndTimeSlots = JSON.stringify(this.availableEndTimeSlots);
    const nextDayTimeSlots = JSON.stringify(this.nextDayTimeSlots);
    this.bookingForm = new FormGroup({
      bookings: new FormArray([
        new FormGroup({
          date: new FormControl(null, Validators.required),
          startTime: new FormControl(null, Validators.required),
          startTimeSlots: new FormControl(JSON.parse(startTimes)),
          nextDayTimeSlots: new FormControl(JSON.parse(nextDayTimeSlots)),
          endTime: new FormControl(
            {
              value: null,
              disabled: true,
            },
            [Validators.required]
          ),
          availableEndTimeSlots: new FormControl(
            JSON.parse(availableEndTimeSlots)
          ),
        }),
      ]),
    });
  }

  private async getLocalListing(): Promise<void> {
    const response = await this.localService.getLocalData(
      LocalConstant.LISTING_DATA
    );
    if (response) {
      this.selectedAttendies = JSON.parse(response.castAndCrew);
      this.reservedDates = JSON.parse(response.reservedDates);

      const days = JSON.parse(response.days);
      this.bookingForm = new FormGroup({
        bookings: new FormArray(
          days.map((day: any) => {
            const startTimes = JSON.stringify(day.startTimeSlots);
            const availableEndTimeSlots = JSON.stringify(
              day.availableEndTimeSlots
            );
            const nextDayTimeSlots = JSON.stringify(day.nextDayTimeSlots);
            return new FormGroup({
              date: new FormControl(day.date, Validators.required),
              startTime: new FormControl(day.startTime, Validators.required),
              startTimeSlots: new FormControl(JSON.parse(startTimes)),
              endTime: new FormControl(
                {
                  value: day.endTime,
                  disabled: false,
                },
                [Validators.required]
              ),
              nextDayTimeSlots: new FormControl(JSON.parse(nextDayTimeSlots)),
              availableEndTimeSlots: new FormControl(
                JSON.parse(availableEndTimeSlots)
              ),
            });
          })
        ),
      });
      this.totalHours = response.totalHours;
    }
  }

  private async stripeFormInit(): Promise<void> {
    this.stripeForm = new FormGroup({
      name: new FormControl(null, [Validators.required]),
      monthYear: new FormControl(null),
      card: new FormControl(null),
      zip: new FormControl(null, [Validators.required]),
      cvc: new FormControl(null),
      countryName: new FormControl(this.defaultCountry.name, [
        Validators.required,
      ]),
      countryCode: new FormControl(this.defaultCountry.code),
    });
    if (await this.authService.isUserLoggedIn()) {
      const userData = await this.localService.getLocalData(
        LocalConstant.USER_DATA
      );
      this.email = userData.user_name;
    }

    // to focus into selcted counrty name
    const names = this.countriesList.map((country) => country.name);
    document
      .getElementsByClassName('autocomplete-content-item-id')
    [names.indexOf(this.defaultCountry.name)]?.scrollIntoView();

    window.scrollTo({
      top: 0,
    });
  }

  // private async getRequestedBooking(id: number): Promise<void> {
  //   const response = await this.listingService.getRequestedBooking(id);
  // }

  private updateListingData(): void {
    // getting cover image
    if (this.listingDetails.listingImagePathIds) {
      // const foundCoverImageData = this.listingDetails.listingImagePathIds.find(
      //   (imageData) => {
      //     return (
      //       imageData.coverImagePathId > 0 &&
      //       imageData.coverImagePathId !== null
      //     );
      //   }
      // );

      this.minimumHours = Number(
        this.listingDetails.listingPrice?.minimumHours
      );
    }

    // getting disabled dates
    if (this.listingDetails.listingCalendar?.blockedDates) {
      const dates = JSON.parse(
        this.listingDetails.listingCalendar?.blockedDates
      );
      dates.map((date: Date) => {
        const disabledDate = new Date(date);
        this.disabledDates.push(disabledDate);
      });
      if (this.listingDetails.listingCalendar?.availableDates) {
        this.availableDates = [];
        const availableDates = JSON.parse(
          this.listingDetails.listingCalendar?.availableDates
        );
        availableDates.map((blockedDate: Date) => {
          this.availableDates.push(new Date(blockedDate));
        });
      }
    }
    if (this.listingDetails.listingCalendar?.isBlockAllWeekends) {
      const currentDate = new Date();
      const endDate = new Date(currentDate.getFullYear() + 2, 11, 31); // Two years from now

      while (currentDate <= endDate) {
        if (currentDate.getDay() === 0 || currentDate.getDay() === 6) {
          // 0 represents Sunday, and 6 represents Saturday
          this.disabledDates.push(new Date(currentDate));
        }

        currentDate.setDate(currentDate.getDate() + 1); // Move to the next day
      }
    }
    if (this.listingDetails.listingCalendar?.isBlockAllBuisnessDays) {
      const currentDate = new Date();
      const endDate = new Date(currentDate.getFullYear() + 2, 11, 31); // Two years from now
      const weekdays = [1, 2, 3, 4, 5];
      while (currentDate <= endDate) {
        if (weekdays.includes(currentDate.getDay())) {
          this.disabledDates.push(new Date(currentDate));
        }
        currentDate.setDate(currentDate.getDate() + 1); // Move to the next day
      }
    }

    const avDates = this.availableDates.map((date) =>
      date.toISOString().slice(0, 10)
    );

    this.disabledDates = this.disabledDates.filter(
      (date) => !avDates.includes(date.toISOString().slice(0, 10))
    );

    // disable/ enable attendies dropdown values
    const listingData = this.listingDetails.listingPrice;
    if (listingData) {
      this.attendiesDropdown.map((attendy) => {
        switch (attendy.text) {
          case this.attendiesDropdown[0].text:
            this.attendiesDropdown[0].available = true;
            this.attendiesDropdown[0].charges = JSON.parse(
              listingData.oneToFivePeople
            ).meeting;
            break;
          case this.attendiesDropdown[1].text:
            this.attendiesDropdown[1].available =
              listingData.isSixToFifteenPeople;
            this.attendiesDropdown[1].charges = JSON.parse(
              listingData.sixToFifteenPeople
            ).meeting;
            break;
          case this.attendiesDropdown[2].text:
            this.attendiesDropdown[2].available =
              listingData.isSixteenToThirtyPeople;
            this.attendiesDropdown[2].charges = JSON.parse(
              listingData.sixteenToThirtyPeople
            ).meeting;
            break;
          case this.attendiesDropdown[3].text:
            this.attendiesDropdown[3].available =
              listingData.isThirtyOneToFortyFivePeople;
            this.attendiesDropdown[3].charges = JSON.parse(
              listingData.thirtyOneToFortyFivePeople
            ).meeting;
            break;
          case this.attendiesDropdown[4].text:
            this.attendiesDropdown[4].available =
              listingData.isFortySixToSixtyPeople;
            this.attendiesDropdown[4].charges = JSON.parse(
              listingData.fortySixToSixtyPeople
            ).meeting;
            break;
          case this.attendiesDropdown[5].text:
            this.attendiesDropdown[5].available =
              listingData.isSixtyAndAbovePeople;
            this.attendiesDropdown[5].charges = JSON.parse(
              listingData.sixtyAndAbovePeople
            ).meeting;
            break;

          default:
            break;
        }
      });
    }
  }

  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = date.getMonth() + 1; // Months are zero-based
    const day = date.getDate();

    return `${year}-${month.toString().padStart(2, '0')}-${day
      .toString()
      .padStart(2, '0')}`;
  }

  formatDateToLong(date: Date): string {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    // @ts-ignore
    return date.toLocaleDateString('en-US', options);
  }

  dateClassCallback = (date: Date): string => {
    const formattedDate = this.formatDate(date);
    const sameDates = this.reservedDates.map((resDate) =>
      this.formatDate(new Date(resDate.date))
    );

    if (sameDates.includes(formattedDate)) {
      let timeLine: any;
      if (!this.isTimeSlotsCreated) {
        const calendar = document.getElementsByClassName(
          'mat-datepicker-content'
        );
        const timeSlotsEl = document.createElement('div');
        timeSlotsEl.classList.add('bottom-timer');
        timeSlotsEl.innerHTML = `
                        <span>12</span>
                        <div class="first-am">am</div>
                        <span>1</span>
                        <span>2</span>
                        <span>3</span>
                        <span>4</span>
                        <span>5</span>
                        <span>6</span>
                        <span>7</span>
                        <span>8</span>
                        <span>9</span>
                        <span>10</span>
                        <span>11</span>
                        <span>12</span>
                        <div class="first-pm">pm</div>
                        <span>1</span>
                        <span>2</span>
                        <span>3</span>
                        <span>4</span>
                        <span>5</span>
                        <span>6</span>
                        <span>7</span>
                        <span>8</span>
                        <span>9</span>
                        <span>10</span>
                        <span>11</span>
                        <span>12</span>
                        <div class="second-am">am</div>`;

        if (calendar[0]) {
          calendar[0].appendChild(timeSlotsEl);
        }
      }
      this.isTimeSlotsCreated = true;
      const calendar = document.getElementsByClassName(
        'mat-datepicker-content'
      );

      if (calendar[0]) {
        timeLine = document.createElement('div');
        timeLine.innerHTML = `
        <div class="timeline--hours">
         </div>`;
        calendar[0].appendChild(timeLine);
      }

      let totalHours = 0;
      let dateForHour: string;
      let leftPer = 0;
      setTimeout(() => {
        const element = document.querySelector(
          `[aria-label="${this.formatDateToLong(date)}"]`
        );
        if (element) {
          const cellDate = this.formatDateToLong(date);
          if (sameDates.includes(this.formatDate(new Date(cellDate)))) {
            const timeSlots = this.reservedDates.filter(
              (resDate) =>
                this.formatDate(new Date(cellDate)) ===
                this.formatDate(new Date(resDate.date))
            );

            timeSlots.map((timeSlot) => {
              if (!leftPer) {
                leftPer =
                  (Number(timeSlot.ranges.start.slice(0, 2)) * 100) / 24;
              }
              dateForHour = timeSlot.date.toString().slice(0, 10);

              totalHours += timeSlot.ranges.end.includes('next-day')
                ? 24 -
                Number(timeSlot.ranges.start.slice(0, 2)) +
                Number(timeSlot.ranges.end.split('next-day-')[1].slice(0, 2))
                : Number(timeSlot.ranges.end.slice(0, 2)) -
                Number(timeSlot.ranges.start.slice(0, 2));
            });

            timeLine?.classList.add(
              `timeline--hours__${totalHours}-${dateForHour}`
            );
            const div = document.createElement('div');
            div.classList.add('events');
            const innerDiv = document.createElement('div');
            const hoursPer = 100 - (totalHours * 100) / 24;

            innerDiv.classList.add(
              'has-hours',
              `has-hours__${totalHours}-${dateForHour}`
            );

            const styleElem = document.head.appendChild(
              document.createElement('style')
            );

            styleElem.innerHTML = `
            .has-hours__${totalHours}-${dateForHour}::after { 
              right: ${hoursPer < 0 ? 0 : hoursPer}% !important; 
            }

            .timeline--hours__${totalHours}-${dateForHour} { 
            width: ${6 * totalHours}px; 
            max-width: calc(95% - ${leftPer}%) ;
            left: ${leftPer}%!important;
            position: absolute;
            bottom: 45px;
            background: grey;
            height: 6px;
            border-radius: 3px;
            visibility: hidden;
          } 
          `;

            div.appendChild(innerDiv);
            element.classList.add(
              `special-event__${totalHours}-${dateForHour}`
            );
            element.appendChild(div);
          }

          const el = document.getElementsByClassName(
            `special-event__${totalHours}-${dateForHour}`
          );
          if (el[0]) {
            const timeEl = document.querySelector(
              `.timeline--hours__${totalHours}-${dateForHour}`
            );
            el[0].addEventListener('mouseover', () => {
              if (timeEl instanceof HTMLElement) {
                timeEl.style.visibility = 'visible';
              }
            });
            el[0].addEventListener('mouseleave', () => {
              if (timeEl instanceof HTMLElement) {
                timeEl.style.visibility = 'hidden';
              }
            });
          }
        }
      }, 0);
      totalHours = 0;
      return `special-event__${totalHours}`;
    }

    return '';
  };

  get bookingControls() {
    return (this.bookingForm.get('bookings') as FormArray).controls;
  }

  get bookingsArray() {
    return this.bookingForm.get('bookings') as FormArray;
  }

  get bookingCtl() {
    return this.bookingForm.controls;
  }

  get projectCtl() {
    return this.projectForm.controls;
  }

  get c() {
    return this.stripeForm.controls;
  }

  disableDates = (date: Date | null): boolean => {
    if (date) {
      return !this.disabledDates.some((disabledDate) =>
        this.isSameDate(date, disabledDate)
      );
    }
    return true;
  };

  private isSameDate(date1: Date, date2: Date): boolean {
    return (
      date1.getDate() === date2.getDate() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getFullYear() === date2.getFullYear()
    );
  }

  onAddBooking(): void {
    this.isAddingBooking = true;
    const lastValueFromArray =
      this.bookingControls[this.bookingControls.length - 1].value;
    const startTimes = JSON.stringify(this.startTimeSlots);
    const nextDayTimeSlots = JSON.stringify(this.nextDayTimeSlots);
    if (
      !lastValueFromArray.date ||
      !lastValueFromArray.startTime ||
      !lastValueFromArray.endTime
    ) {
      return;
    }
    (<FormArray>this.bookingForm.get('bookings')).push(
      new FormGroup({
        date: new FormControl(
          new Date(
            new Date(lastValueFromArray.date).setDate(
              new Date(lastValueFromArray.date).getDate() + 1
            )
          ),
          Validators.required
        ),
        startTime: new FormControl(null, Validators.required),
        startTimeSlots: new FormControl(JSON.parse(startTimes), [
          Validators.required,
        ]),
        nextDayTimeSlots: new FormControl(JSON.parse(nextDayTimeSlots), [
          Validators.required,
        ]),
        endTime: new FormControl(
          { value: null, disabled: true },
          Validators.required
        ),
        availableEndTimeSlots: new FormControl(
          [...this.availableEndTimeSlots],
          Validators.required
        ),
      })
    );
  }

  enableEndTime(index: number, event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    let availableEndTimeSlots = [];
    const currentStartTimeSlots =
      this.bookingControls[index].value.startTimeSlots;
    this.selectedStartTimeIdx = currentStartTimeSlots.findIndex(
      (slot: TimeSlot) => slot.value === value
    );

    const disabledSlots = currentStartTimeSlots.filter(
      (time: TimeSlot) => time.disabled
    );

    const disabledSlotIndex = currentStartTimeSlots.findIndex(
      (time: TimeSlot) => time.disabled
    );

    if (
      disabledSlots.length > 0 &&
      currentStartTimeSlots[this.selectedStartTimeIdx].value <
      disabledSlots[0].value
    ) {
      this.showNextDayTimeSlots = false;
      availableEndTimeSlots = currentStartTimeSlots.slice(
        this.selectedStartTimeIdx + 1,
        disabledSlotIndex + 1
      );
    } else {
      this.showNextDayTimeSlots = true;
      availableEndTimeSlots = currentStartTimeSlots
        .slice(this.selectedStartTimeIdx + 1)
        .concat(TimeSlots.endOfDayTimeSlot);
    }

    this.bookingControls[index]
      .get('availableEndTimeSlots')
      ?.patchValue(availableEndTimeSlots);
    this.bookingControls[index].get('endTime')?.enable();
    this.onSetTotalHours();
  }

  onSetTotalHours(index?: number): void {
    if (this.bookingControls[Number(index)]) {
      const currentDate = new Date(
        this.bookingControls[Number(index)].value.date
      );
      const idx = Number(index);
      for (let i = idx; i < this.bookingControls.length; i++) {
        if (
          currentDate.toString() ===
          new Date(this.bookingControls[i].value.date).toString() &&
          idx !== i
        ) {
          this.bookingControls[i].patchValue({
            date: null,
            startTime: null,
            endTime: null,
          });
        }
      }
    }
    if ((index && index + 1 >= this.bookingControls.length) || index == 0) {
      const booking = this.bookingControls[index].value;
      if (this.localReservedDates[index] && this.isNoInitialReservedDates) {
        this.localReservedDates[index] = {
          date: new Date(booking.date).toISOString(),
          ranges: {
            start: booking.startTime,
            end: booking.endTime,
          },
        };
      } else {
        this.localReservedDates.push({
          date: new Date(booking.date).toISOString(),
          ranges: {
            start: booking.startTime,
            end: booking.endTime,
          },
        });
      }
    }
    this.totalHours = 0;
    this.bookingControls.map((ctrl) => {
      // for next day
      if (
        this.nextDayTimeSlots.findIndex(
          (slot) => slot.value === ctrl.value.endTime
        ) >= 0
      ) {
        const nextDayTimeIdx = this.nextDayTimeSlots.findIndex(
          (slot) => slot.value === ctrl.value.endTime
        );
        this.totalHours =
          this.totalHours +
          (this.startTimeSlots.length -
            this.startTimeSlots.findIndex(
              (slot) => slot.value === ctrl.value.startTime
            ) +
            nextDayTimeIdx +
            1);
        this.isBookedForNextDay = true;
        return;
        // for end of current day
      } else if (ctrl.value.endTime !== '24:00' && ctrl.value.startTime) {
        this.totalHours =
          this.totalHours +
          (+ctrl.value.endTime?.slice(0, 2) -
            +ctrl.value.startTime?.slice(0, 2));
        this.isBookedForNextDay = false;
        return;
        // for remaining slots of current day
      } else {
        this.totalHours =
          this.totalHours +
          (+ctrl.value.endTime?.slice(0, 2) -
            +ctrl.value.startTime?.slice(0, 2));
      }
    });

    if (this.totalHours < 0) this.totalHours = 0;
  }

  onDeleteBooking(index: number): void {
    this.reservedDates = this.reservedDates.filter((_, i) => i !== index);

    (<FormArray>this.bookingForm.get('bookings')).removeAt(index);
    this.onSetTotalHours();
  }

  onDateChange(event: MatDatepickerInputEvent<Date>, index: number): void {
    this.isAddingBooking = false;
    const formatTo = this.datepipe.transform(event.value, 'yyyy-MM-dd');
    this.startDate = formatTo;
    const date = event.value;

    if (this.bookingControls[Number(index)]) {
      const currentDate = new Date(String(date));
      const idx = Number(index);
      for (let i = 0; i < this.bookingControls.length; i++) {
        if (
          currentDate.toString() ===
          new Date(this.bookingControls[i].value.date).toString() &&
          idx !== i
        ) {
          this.bookingControls[i + 1].patchValue({
            startTime: null,
            endTime: null,
          });
        }
      }
      this.bookingControls[index].patchValue({
        startTime: null,
        endTime: null,
      });
    }
    const currentTime = new Date();
    if (this.currentSelected !== event.value?.toISOString()) {
      this.bookingControls[index].value.startTimeSlots.map(
        (startTime: TimeSlot, i: number) => {
          startTime.disabled = false;
        }
      );
    }
    this.currentSelected = event.value?.toISOString();
    this.localReservedDates.map((resDate) => {
      if (new Date(resDate.date).toISOString() === date?.toISOString()) {
        this.bookingControls[index].value.startTimeSlots.map(
          (startTime: TimeSlot, i: number) => {
            if (startTime.value === resDate.ranges.start) {
              let endTimeIdx = this.startTimeSlots.findIndex(
                (startTime) => startTime.value === resDate.ranges.end
              );
              if (endTimeIdx >= 0) {
                for (let idx = i; idx < endTimeIdx; idx++) {
                  this.bookingControls[index].value.startTimeSlots[
                    idx
                  ].disabled = true;
                }
              }

              if (endTimeIdx < 0) {
                if (resDate.ranges.end === this.endOfDayTimeSlot.value) {
                  endTimeIdx = this.startTimeSlots.length;
                }
                for (let idx = i; idx <= endTimeIdx - 1; idx++) {
                  this.bookingControls[index].value.startTimeSlots[
                    idx
                  ].disabled = true;
                }
              }
              if (endTimeIdx < 0) {
                endTimeIdx = this.nextDayTimeSlots.findIndex(
                  (nextDayTime) => nextDayTime.value === resDate.ranges.end
                );

                for (
                  let idx = i;
                  idx <=
                  this.bookingControls[index].value.startTimeSlots.length - 1;
                  idx++
                ) {
                  this.bookingControls[index].value.startTimeSlots[
                    idx
                  ].disabled = true;
                }
                for (let idx = i; idx <= endTimeIdx; idx++) {
                  this.bookingControls[index].value.nextDayTimeSlots[
                    idx
                  ].disabled = true;
                }
              }
            }
          }
        );
      }
    });

    const reserveddates = this.localReservedDates.map((resDate) =>
      new Date(resDate.date).toISOString()
    );
    if (date && !reserveddates.includes(date.toISOString())) {
      this.bookingControls[index].value.startTimeSlots.map(
        (startTime: TimeSlot) => {
          startTime.disabled = false;
        }
      );
    }
    this.bookingControls[index].value.startTimeSlots.forEach(
      (startTime: TimeSlot) => {
        const timeValue = new Date(`${formatTo}T${startTime.value}`);
        startTime.disabled = startTime.disabled || timeValue < currentTime;
      }
    );
  }

  async onSubmitForm(): Promise<void> {
    this.isSubmittedProjectForm = true;
    if (this.projectForm.valid) {
      this.isProjectDetailsCompleted = true;
      this.showProjectDetails = false;
    }
    setTimeout(() => {
      this.handleCardValidations();
    }, 1000);
  }

  onResetForm(): void {
    this.bookingForm.reset();
    this.onSetTotalHours();
  }

  onToggleProjectDetails(flag: string): void {
    if (flag === 'show') {
      this.showProjectDetails = true;
    }
    if (flag === 'hide') {
      this.isProjectDetailsCompleted ? (this.showProjectDetails = false) : null;
    }
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }

  onChangeAttendies(data: AttendiesDropdown): void {
    this.selectedAttendies = data;
  }

  onChangeActivity(data: EventList): void {
    this.activity = data;
  }

  // stripe methods

  private async getPaymentMethod(): Promise<void> {
    const response = await this.personalInfoService.getPaymentCards();
    if (response && response.success) {
      this.cards = response.data.response;
      if (!this.cards || this.cards.length <= 0) {
        this.showCards = false;
      }
    } else {
      this.showCards = false;
    }
  }

  onFilterCountry(event: any): void {
    this.countriesList = CountryData;
    const key = event.keyCode;
    if (key === 8 || key === 46) {
      this.countriesList = this.filter.transform(
        this.countriesList,
        event.target.value
      );
    } else {
      this.countriesList = this.filter.transform(
        this.countriesList,
        event.target.value
      );
    }
  }

  updateMonthValidation(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    const month = this.stripeForm.value.monthYear;

    if (month && month.charAt(0) > 1) {
      this.stripeForm.patchValue({
        monthYear: '0' + value,
      });
      this.stripeForm.value.monthYear = '0' + value;
    }
    if (month && month.slice(0, 2) > 12) {
      this.stripeForm.patchValue({
        monthYear: '0' + month,
      });
      this.stripeForm.value.monthYear = '0' + value;
    }
    if (month.length > 3) {
      this.getDiff(month);
    }
  }

  parseDate(e: string): Date {
    if (e.length == 3) {
      e = '0' + e;
    }
    return new Date(`${e.substring(0, 2)}/1/${e.slice(-2)}`);
  }

  getDiff(e: string): void {
    let curr = new Date();
    let dt = this.parseDate(e);
    // if future date is minimum 1 month
    if (
      (dt.getMonth() - curr.getMonth() + 12) *
      (dt.getFullYear() - curr.getFullYear()) >=
      1
    ) {
      this.isFutureDate = true;
    } else {
      this.isFutureDate = false;
    }
  }

  onFocusCountry(): void {
    this.showCountryList = true;
    // this.stripeForm.patchValue({
    //   countryName: '',
    //   countryCode: '',
    // });
  }

  onBlurCountry(): void {
    this.showCountryList = false;
    this.stripeForm.patchValue({
      countryName: this.defaultCountry.name,
    });
    this.stripeForm.patchValue({
      countryCode: this.defaultCountry.code,
    });
    this.countriesList = CountryData;
  }

  onSelectCountry(countryName: string, countryCode: string): void {
    this.stripeForm.patchValue({
      countryName: countryName,
      countryCode: countryCode,
    });
    this.defaultCountry.name = countryName;
    this.defaultCountry.code = countryCode;
    this.countriesList = CountryData;
  }

  get cardInvalid(): boolean {
    return (
      (this.c['card'].value &&
        this.c['card'].value.length === 16 &&
        !this.commonService.luhnCheck(this.c['card'].value)) ||
      (this.c['card'].value &&
        this.c['card'].value.length === 15 &&
        !this.commonService.isValidAmexCard(this.c['card'].value))
    );
  }

  onToggleCards(data: boolean): void {
    this.showCards = data;
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
    setTimeout(() => {
      this.handleCardValidations();
    }, 1000);
  }

  private openLoginDlg(isLoggingIn: boolean): void {
    const dialogRef = this.dialog.open(LoginPopupComponent, {
      width: '600px',
      disableClose: true,
      autoFocus: false,
      data: {
        isLoggingIn: isLoggingIn,
      },
    });
    dialogRef.afterClosed().subscribe(async (response: boolean) => {
      if (await this.authService.isUserLoggedIn()) {
        const userData = await this.localService.getLocalData(
          LocalConstant.USER_DATA
        );
        this.email = userData.user_name;
        await this.onRequestBooking();
      }
    });
  }

  async onRequestBooking(): Promise<void> {
    const date = new Date()
    const hour = date.getHours();
    const min = date.getMinutes();
    const time = (hour + ':' + min).toString();
    const bookingsData = this.bookingForm.value.bookings.map(
      (booking: { date: string; endTime: string; startTime: string }) => {
        return {
          date: this.datepipe.transform(new Date(booking.date), 'YYYY-MM-dd'),
          startTime: booking.startTime,
          endTime: booking.endTime,
        };
      }
    );
    const tranformedDate = this.datepipe.transform(date, 'YYYY-MM-dd')
    bookingsData.forEach((item: { date: string; endTime: string; startTime: string }) => {
      const startTimeValue = item.startTime;
      if (startTimeValue < time && item.date === tranformedDate) {
        this.snackbar.error('Please select Future Time slots.');
        return;
      }
    })
    if (!(await this.authService.isUserLoggedIn())) {
      this.openLoginDlg(true);
      return;
    }
    this.isSubmittedStripeForm = true;
    this.checkValidations();
    if (
      this.cards &&
      this.cards.length > 0 &&
      this.showCards &&
      !this.checkedCardId
    ) {
      this.snackbar.error('Please select a card!');
      return;
    }
    if (
      (!this.stripeForm.valid && !this.showCards) ||
      (this.showCards && !this.checkedCardId) ||
      this.bookingForm.invalid
    ) {
      return;
    }

    if (this.bookingForm.valid && this.totalHours < this.minimumHours) {
      this.snackbar.error(`Please select minimum ${this.minimumHours} hours`);
      return;
    }

    // const bookingsData = this.bookingForm.value.bookings.map(
    //   (booking: { date: string; endTime: string; startTime: string }) => {
    //     return {
    //       date: this.datepipe.transform(new Date(booking.date), 'YYYY-MM-dd'),
    //       startTime: booking.startTime,
    //       endTime: booking.endTime,
    //     };
    //   }
    // );

    if (this.showCards && this.checkedCardId) {
      this.isBooking = true;
      const totalAmount =
        this.processingFee + this.selectedAttendies.charges * this.totalHours;
      const payload: RequestBooking = {
        listingId: Number(atob(this.list)),
        projectName: this.projectForm.value.projectName,
        renterOrCompany: this.projectForm.value.renterCompany,
        activity: JSON.stringify(this.activity),
        castAndCrew: JSON.stringify(this.selectedAttendies),
        aboutProject: this.projectForm.value.aboutProject,
        days: JSON.stringify(bookingsData),
        totalHours: this.totalHours,
        amountPerHour: this.selectedAttendies.charges,
        totalAmount: totalAmount,
        processingFee: this.processingFee,
        exactCount: totalAmount,
        selectedToken: this.checkedCardId,
        //userPaymentInfoId: 0,
        // cardNumber: this.stripeForm.value.card,
        // expiryMonth: this.stripeForm.value.monthYear.slice(0, 2),
        // expiryYear: this.stripeForm.value.monthYear.slice(2),
        // cvc: this.stripeForm.value.cvc,
        // nameOnCard: this.stripeForm.value.name,
        // countryAndRegion: this.stripeForm.value.countryCode,
        // zipCode: this.stripeForm.value.zip,
        //cardSourceId: 'string',
      };
      const response = await this.listingService.onRequestBooking(payload);
      if (response && response.success) {
        if (this.isInstantBooking) {
          this.snackbar.success(SuccessConstant.LISTNG_BOOKED);
          this.router.navigateByUrl(
            `/bookings/${btoa(response.data.response.id)}/success?type=instant`
          );
        } else {
          this.snackbar.success(SuccessConstant.LISTNG_REQUESTED);
          this.router.navigateByUrl(
            `/bookings/${btoa(response.data.response.id)}/success?type=request`
          );
        }
        // this.router.navigateByUrl('/');
      }
      this.isBooking = false;
    } else {
      this.isBooking = true;

      this.createToken();
    }
  }

  private createToken(): void {
    const name = this.stripeForm.value.name;
    const country = this.stripeForm.value.countryName;
    const zip = this.stripeForm.value.zip;
    this.isSubmittedStripeForm = true;

    if (
      this.stripeForm.invalid ||
      !this.cardExpiryValidations.isCardExpiryComplete ||
      !this.cardCvcValidations.isCardCvcComplete ||
      !this.cardNumberValidations.isCardNumberComplete
    ) {
      this.isLoading = false;
      return;
    }
    this.isLoading = true;

    // this.spinner.show();
    const bookingsData = this.bookingForm.value.bookings.map(
      (booking: { date: string; endTime: string; startTime: string }) => {
        return {
          date: this.datepipe.transform(new Date(booking.date), 'YYYY-MM-dd'),
          startTime: booking.startTime,
          endTime: booking.endTime,
        };
      }
    );
    this.stripeService
      .createToken(this.cardNumber.element, {
        name: name,
        address_country: country,
        address_zip: zip,
      })
      .subscribe({
        next: async (result) => {
          if (result.token) {
            this.tokenId = String(result.token.id);
            const totalAmount =
              this.processingFee +
              this.selectedAttendies.charges * this.totalHours;
            const payload: RequestBooking = {
              listingId: Number(atob(this.list)),
              projectName: this.projectForm.value.projectName,
              renterOrCompany: this.projectForm.value.renterCompany,
              activity: JSON.stringify(this.activity),
              castAndCrew: JSON.stringify(this.selectedAttendies),
              aboutProject: this.projectForm.value.aboutProject,
              days: JSON.stringify(bookingsData),
              totalHours: this.totalHours,
              amountPerHour: this.selectedAttendies.charges,
              totalAmount: totalAmount,
              processingFee: this.processingFee,
              exactCount: totalAmount,
              token: this.tokenId,
              // cardNumber: this.stripeForm.value.card,
              // expiryMonth: this.stripeForm.value.monthYear.slice(0, 2),
              // expiryYear: this.stripeForm.value.monthYear.slice(2),
              // cvc: this.stripeForm.value.cvc,
              // nameOnCard: this.stripeForm.value.name,
              // countryAndRegion: this.stripeForm.value.countryCode,
              // zipCode: this.stripeForm.value.zip,
              //cardSourceId: 'string',
            };
            const response = await this.listingService.onRequestBooking(
              payload
            );
            if (response && response.success) {
              // this.snackbar.success(SuccessConstant.LISTNG_BOOKED);
              // this.router.navigateByUrl('/');
              if (this.isInstantBooking) {
                this.snackbar.success(SuccessConstant.LISTNG_BOOKED);
                this.router.navigateByUrl(
                  `/bookings/${btoa(
                    response.data.response.id
                  )}/success?type=instant`
                );
              } else {
                this.snackbar.success(SuccessConstant.LISTNG_REQUESTED);
                this.router.navigateByUrl(
                  `/bookings/${btoa(
                    response.data.response.id
                  )}/success?type=request`
                );
              }
              this.isLoading = false;
            }
            this.isLoading = false;
            this.isBooking = false;
          } else if (result.error) {
            this.isLoading = false;
            this.isBooking = false;
            this.snackbar.error(String(result.error.message));
          }
        },
        error: () => {
          this.isLoading = false;
          this.isBooking = false;
        },
      });
  }

  get bookingArray() {
    return this.bookingForm.get('bookings') as FormArray;
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
        selectedActivities.forEach((activity: EventList) => {
          this.eventsList.push(activity);
        });
        this.activity = this.eventsList[0];
      }
    }
  }

  private checkValidations(): void {
    for (const control of this.bookingArray.controls) {
      for (const key of Object.keys(control.value)) {
        const lastIdx = this.bookingControls.length - 1;

        if (this.bookingArray.controls[lastIdx].invalid) {
          const invalidControl = document.querySelector(
            '[formControlName="' + key + '"]'
          );
          invalidControl?.scrollIntoView({
            block: 'center',
            behavior: 'smooth',
          });
          if (!this.bookingArray.controls[lastIdx].value.date) {
            this.bookingArray.controls[lastIdx].markAllAsTouched();
            (invalidControl as any)?.click();
          }

          break;
        }
      }
    }
  }
}
