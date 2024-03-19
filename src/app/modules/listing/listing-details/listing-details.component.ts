import { DatePipe } from '@angular/common';
import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import {
  MatDatepicker,
  MatDatepickerInputEvent,
} from '@angular/material/datepicker';
import { ActivatedRoute, Router } from '@angular/router';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { TimeSlots } from 'src/app/constants/booking-timeslots';
import { Locations } from 'src/app/constants/locations';
import { NgxCarousalOptions } from 'src/app/constants/ngx-carousal-options';
import {
  AttendiesDropdown,
  ListingCoverImage,
  ListingReview,
  LocationList,
  UserData,
} from 'src/app/models/location.model';
import { ReservedDates, TimeSlot } from 'src/app/models/time-slot.model';
import { ListingDetails } from 'src/app/constants/listing-details.constant';
import { ListingPrice, Rule } from 'src/app/models/step-three.model';
import { LocalService } from 'src/app/services/local.service';
import { LocalConstant } from 'src/app/constants/local-constant';
import { ProjectService } from 'src/app/services/project.service';
import { LoginPopupComponent } from 'src/app/auth/login-popup/login-popup.component';
import { AuthService } from 'src/app/services/auth.service';
import { Project } from 'src/app/models/project.model';
import { MatDialog } from '@angular/material/dialog';
import { SharedService } from 'src/app/services/shared.service';
import { SnackBarService } from 'src/app/services/snack-bar.service';
import { EventsData } from 'src/app/constants/events';
import { EventList } from 'src/app/models/event.model';
import { SignalrClientService } from 'src/app/services/signalr-client.service';
import { BaseResonse, Pagination } from 'src/app/models/common.model';
import { ListingService } from 'src/app/services/listing.service';
import { CommonService } from 'src/app/services/common.service';
import { ErrorConstant } from 'src/app/constants/error.constant';

@Component({
  selector: 'app-listing-details',
  templateUrl: './listing-details.component.html',
  styleUrls: ['./listing-details.component.scss'],
})
export class ListingDetailsComponent implements OnInit {
  @Input() list: string;
  @ViewChild('basicDatepicker') basicDatepicker: MatDatepicker<Date>;
  descryptedListingId: number;
  listingDetails: LocationList;
  selectedStartTimeIdx = 0;
  totalHours: number = 0;
  endTimeIdx: number = 0;
  indexToStartFrom = 4;
  locations: LocationList[] = [...Locations.locatoinsList];
  startTimeSlots: TimeSlot[] = [...TimeSlots.startTimes];
  endOfDayTimeSlot: TimeSlot = { ...TimeSlots.endOfDayTimeSlot };
  availableEndTimeSlots: TimeSlot[] = TimeSlots.startTimes.slice(
    this.selectedStartTimeIdx
  );
  nextDayTimeSlots: TimeSlot[] = [...TimeSlots.nextDayTimeSlots];
  similarLocations: LocationList[] = [];
  bookingForm: FormGroup;
  startDate: string | null;
  today = new Date();
  isSubmitted = false;
  isBlinking = false;
  isBookedForNextDay = false;
  customOptions: OwlOptions = NgxCarousalOptions.eventBoxCustomOptions;
  coverImage: string;
  listingImages: string[] = [];
  chargesPerHour: number;
  disabledDates: Date[] = [];
  currency = 'AED';
  attendiesDropdown: AttendiesDropdown[] = ListingDetails.attendiesDropdown;
  showDropDown = false;
  selectedAttendies: AttendiesDropdown = this.attendiesDropdown[0];
  minimumHours: number = 0;
  siteRep = 100;
  processingFee = 44;
  categories: string[] = [];
  styles: string[] = [];
  locationRules: Rule[] = [];
  addtionalRules: string[] = [];
  amenities: string[] = [];
  crewAccess: string[] = [];
  features: string[] = [];
  interiors: string[] = [];
  isGalleryOpen = false;
  galleryImages: string[] = [];
  showNextDayTimeSlots = true;
  showMoreFeatures = false;
  showMoreInteriors = false;
  selectedProjectListings: number[] = [];
  availableDates: Date[] = [];
  reservedDates: ReservedDates[] = [];
  localReservedDates: ReservedDates[] = [];
  projects: Project[] = [];
  dummyImage = 'assets/images/dummy/default_image.png';
  maxDate: Date;
  isLoading = false;
  isTimeSlotsCreated = false;
  isNoInitialReservedDates = false;
  isInstantBooking = false;
  currentSelected: string | undefined;
  isMessaging = false;
  eventsList: EventList[] = EventsData.EventsList;
  activity = this.eventsList[0];
  currentUserId: string;
  recieverId: string;
  currentUserEmail: string;
  isInitiatingMsg = false;
  isPreview = false;
  isHost = false;
  userData: UserData;
  reviews: ListingReview[] = [];
  approxAverageRating = 5;
  exactAverageRating = 5;
  isSuperHost = false;
  similarLocationOptions: OwlOptions =
    NgxCarousalOptions.similarLocationsOptions;
  numberOfAttendees: string = '1-5 people';
  pagination: Pagination = {
    pageNumber: 1,
    pageSize: 5,
  };
  reviewsTotolCount = 0;

  constructor(
    private activatedRoute: ActivatedRoute,
    private datepipe: DatePipe,
    private router: Router,
    private localService: LocalService,
    private projectService: ProjectService,
    private authService: AuthService,
    private dialog: MatDialog,
    private sharedService: SharedService,
    private _signalrClientService: SignalrClientService,
    private snackbar: SnackBarService,
    private listingService: ListingService,
    public commonService: CommonService
  ) {
    this.maxDate = new Date(
      this.today.getFullYear() + 2,
      this.today.getMonth(),
      this.today.getDate()
    );
  }

  async ngOnInit(): Promise<void> {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    window.scrollTo({
      top: 0,
      behavior: 'auto',
    });
    this.descryptedListingId = Number(atob(this.list));
    if (this.router.url.includes('preview')) this.isPreview = true;
    // this.listingDetailsInit();
    try {
      this.selectedProjectListings = [
        ...this.projectService.selectedProjectListings,
      ];
      const response: BaseResonse =
        this.activatedRoute.snapshot.data['listingData'];
      await this.initFunctions(response);
      await this.bookingFormInit();
      await this.getCurrentUser();
      await this.isHostLoggedIn();
      this.galleryImages = [this.coverImage, ...this.listingImages];
    } catch (error) { }
  }

  private async initFunctions(response: BaseResonse): Promise<void> {
    this.listingDetails = response.data;
    this.isInstantBooking = response.data.isInstantBooking;
    this.reservedDates = response.data.bookingDaysData.response;
    this.localReservedDates = response.data.bookingDaysData.response;
    this.userData = response.data.users;

    this.recieverId = response.data.users.userId;
    if (
      response.data.listingPrice &&
      response.data.listingPrice.currency &&
      response.data.listingPrice.currency.currencySymbol
    )
      this.currency = response.data.listingPrice.currency.currencySymbol;

    if (this.reservedDates.length <= 0) this.isNoInitialReservedDates = true;
    this.updateListingData();
    await this.getListingReviews();
    await this.getSimilarLocations();
  }

  private async isHostLoggedIn(): Promise<void> {
    if (await this.authService.getHostInfo()) {
      this.isHost = true;
    }
  }

  private async getListingReviews(): Promise<void> {
    const listingId = atob(this.list);
    const response = await this.listingService.getListingReviews(
      Number(listingId),
      this.pagination
    );
    if (
      response &&
      response.success &&
      response &&
      response.data &&
      response.data.length
    ) {
      if (response.totalCount) {
        this.reviewsTotolCount = response.totalCount;
      }
      this.isSuperHost = response.data[0].isSuperHost;
      this.approxAverageRating = response.data[0].overallRating;
      this.reviews = response.data.map(
        (data: {
          reviews: ListingReview;
          firstName: string;
          lastName: string;
          profilePic: string;
          email: string;
        }) => {
          return {
            ...data.reviews,
            firstName: data.firstName,
            email: data.email,
            lastName: data.lastName,
            userImg: data.profilePic,
          };
        }
      );
      this.exactAverageRating = Number(this.approxAverageRating.toFixed(1));
    }
  }

  protected async loadMoreReviews(): Promise<void> {
    this.pagination = {
      ...this.pagination,
      pageNumber: this.pagination.pageNumber + 1,
    };

    const listingId = atob(this.list);
    const response = await this.listingService.getListingReviews(
      Number(listingId),
      this.pagination
    );
    if (
      response &&
      response.success &&
      response &&
      response.data &&
      response.data.length
    ) {
      response.data.forEach(
        (data: {
          reviews: ListingReview;
          firstName: string;
          lastName: string;
          profilePic: string;
          email: string;
        }) => {
          this.reviews.push({
            ...data.reviews,
            firstName: data.firstName,
            email: data.email,
            lastName: data.lastName,
            userImg: data.profilePic,
          });
        }
      );
      // const reviewRates = this.reviews.map((review) => review.rating);
      // this.exactAverageRating = Number(
      //   (reviewRates.reduce((a, b) => a + b, 0) / reviewRates.length).toFixed(1)
      // );

      // this.approxAverageRating = Math.round(this.exactAverageRating);
    }
  }

  private async getSimilarLocations(): Promise<void> {
    const listingId = atob(this.list);
    const response = await this.listingService.getSimilarLocations(
      Number(listingId)
    );
    if (
      response &&
      response.success &&
      response.data &&
      response.data.response
    ) {
      response.data.response.forEach(
        (element: {
          listing: LocationList;
          listingPrice: ListingPrice;
          coverImagePaths: ListingCoverImage[];
        }) => {
          const location = element;
          const listing = location.listing;
          listing.listing = location.listing;
          listing.listingId = Number(location.listing.id);
          listing.listing.image = location.coverImagePaths[0]?.imageFullPath;
          listing.listingPrice = element.listingPrice;
          this.similarLocations.push(listing);
        }
      );
    }
  }

  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = date.getMonth() + 1; // Months are zero-based
    const day = date.getDate();

    return `${year}-${month.toString().padStart(2, '0')}-${day
      .toString()
      .padStart(2, '0')}`;
  }

  private formatDateToLong(date: Date): string {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    // @ts-ignore
    return date.toLocaleDateString('en-US', options);
  }

  // do not change the code inside this function at any cost
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
                        <div class="position-relative d-inline-flex">
                        <span>12</span>
                        <div class="vertical-line"></div>
                        </div>
                        <div class="first-am">am</div>
                        <div class="position-relative d-inline-flex" >
                        <span>1</span>
                        <div class="vertical-line" style="left: 1px;"></div>
                        </div>
                        <div class="position-relative d-inline-flex">
                        <span>2</span>
                        <div class="vertical-line"></div>
                        </div>
                        <div class="position-relative d-inline-flex">
                        <span>3</span>
                        <div class="vertical-line"></div>
                        </div>
                        <div class="position-relative d-inline-flex">
                        <span>4</span>
                        <div class="vertical-line"></div>
                        </div>
                        <div class="position-relative d-inline-flex">
                        <span>5</span>
                        <div class="vertical-line"></div>
                        </div>
                        <div class="position-relative d-inline-flex">
                        <span>6</span>
                        <div class="vertical-line"></div>
                        </div>
                        <div class="position-relative d-inline-flex">
                        <span>7</span>
                        <div class="vertical-line"></div>
                        </div>
                        <div class="position-relative d-inline-flex">
                        <span>8</span>
                        <div class="vertical-line"></div>
                        </div>
                        <div class="position-relative d-inline-flex">
                        <span>9</span>
                        <div class="vertical-line"></div>
                        </div>
                        <div class="position-relative d-inline-flex">
                        <span>10</span>
                        <div class="vertical-line" style="left: 5px;"></div>
                        </div>
                        <div class="position-relative d-inline-flex">
                        <span>11</span>
                        <div class="vertical-line"  style="left: 3px;"></div>
                        </div>
                        <div class="position-relative d-inline-flex">
                        <span>12</span>
                        <div class="vertical-line"></div>
                        </div>
                        <div class="first-pm">pm</div>
                        <div class="position-relative d-inline-flex">
                        <span>1</span>
                        <div class="vertical-line" style="left: 1px;"></div>
                        </div>
                        <div class="position-relative d-inline-flex">
                        <span>2</span>
                        <div class="vertical-line"></div>
                        </div>
                        <div class="position-relative d-inline-flex">
                        <span>3</span>
                        <div class="vertical-line"></div>
                        </div>
                        <div class="position-relative d-inline-flex">
                        <span>4</span>
                        <div class="vertical-line"></div>
                        </div>
                        <div class="position-relative d-inline-flex">
                        <span>5</span>
                        <div class="vertical-line"></div>
                        </div>
                        <div class="position-relative d-inline-flex">
                        <span>6</span>
                        <div class="vertical-line"></div>
                        </div>
                        <div class="position-relative d-inline-flex">
                        <span>7</span>
                        <div class="vertical-line"></div>
                        </div>
                        <div class="position-relative d-inline-flex">
                        <span>8</span>
                        <div class="vertical-line"></div>
                        </div>
                        <div class="position-relative d-inline-flex">
                        <span>9</span>
                        <div class="vertical-line"></div>
                        </div>
                        <div class="position-relative d-inline-flex">
                        <span>10</span>
                        <div class="vertical-line" style="left: 5px;"></div>
                        </div>
                        <div class="position-relative d-inline-flex">
                        <span>11</span>
                        <div class="vertical-line"  style="left: 3px;"></div>
                        </div>
                        <div class="position-relative d-inline-flex">
                        <span>12</span>
                        <div class="vertical-line"></div>
                        </div>
                        <div class="second-am">am</div>
                        <div class="blocked-parent">
                        <div class="blocked-bar"></div>
                        <div class="blocked-bar--text">Blocked or unavailable</div>
                        </div>
                        `;

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

            timeSlots.forEach((timeSlot) => {
              if (
                !leftPer ||
                leftPer > (Number(timeSlot.ranges.start.slice(0, 2)) * 100) / 24
              ) {
                leftPer =
                  (Number(timeSlot.ranges.start.slice(0, 2)) * 100) / 24;
              }
              if (leftPer < 35) {
                leftPer = leftPer + 1;
              }
              if (leftPer < 30) {
                leftPer = leftPer + 1.9;
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
            width: ${12 * totalHours}px !important; 
            max-width: calc(95% - ${leftPer}%) !important ;
            left: ${leftPer}%!important;
            position: absolute !important;
            bottom: 85px !important;
            background: grey !important;
            height: 6px !important;
            border-radius: 3px !important;
            visibility: hidden;
          } 
          .vertical-line {
            border-left: 1px solid #727276ba;
            height: 26px;
            position: absolute;
            top: 14px;
            left: 4px;
            border-radius: 16px;
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
            const blockedEl = document.querySelector(`.blocked-parent`);
            el[0].addEventListener('mouseover', () => {
              if (timeEl instanceof HTMLElement) {
                timeEl.style.visibility = 'visible';
              }
              if (blockedEl instanceof HTMLElement) {
                blockedEl.style.visibility = 'visible';
              }
            });
            el[0].addEventListener('mouseleave', () => {
              if (timeEl instanceof HTMLElement) {
                timeEl.style.visibility = 'hidden';
              }
              if (blockedEl instanceof HTMLElement) {
                blockedEl.style.visibility = 'hidden';
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

  // private async getLocalListing(): Promise<void> {
  //   const response = await this.localService.getLocalData(
  //     LocalConstant.LISTING_DATA
  //   );
  //   if (response) {
  //     this.selectedAttendies = JSON.parse(response.castAndCrew);
  //     const days = JSON.parse(response.days);
  //     this.bookingForm = new FormGroup({
  //       bookings: new FormArray(
  //         days.map((day: any) => {
  //           return new FormGroup({
  //             date: new FormControl(day.date, Validators.required),
  //             startTime: new FormControl(day.startTime, Validators.required),
  //             startTimeSlots: new FormControl(day.startTimeSlots, [
  //               Validators.required,
  //             ]),
  //             endTime: new FormControl(
  //               {
  //                 value: day.endTime,
  //                 disabled: false,
  //               },
  //               [Validators.required]
  //             ),
  //             availableEndTimeSlots: new FormControl(
  //               day.availableEndTimeSlots,
  //               Validators.required
  //             ),
  //           });
  //         })
  //       ),
  //     });
  //     this.totalHours = response.totalHours;
  //   }
  // }

  private updateListingData(): void {
    this.minimumHours = Number(this.listingDetails.listingPrice?.minimumHours);
    // getting cover image
    if (this.listingDetails.listingImagePathIds) {
      const foundCoverImageData = this.listingDetails.listingImagePathIds.find(
        (imageData) => {
          return (
            imageData.coverImagePathId > 0 &&
            imageData.coverImagePathId !== null
          );
        }
      );
      if (foundCoverImageData) {
        this.coverImage = foundCoverImageData.imagePath?.imageFullPath;
      }

      // getting all images except cover image
      const listingImages = this.listingDetails.listingImagePathIds.filter(
        (imageData) => {
          return (
            imageData.coverImagePathId == 0 ||
            imageData.coverImagePathId == null
          );
        }
      );

      this.listingImages = listingImages.map(
        (image) => image?.imagePath?.imageFullPath
      );
    }

    // getting charges per hour
    if (this.listingDetails.listingPrice?.oneToFivePeople) {
      const activities = JSON.parse(
        this.listingDetails.listingPrice?.oneToFivePeople
      );
      this.chargesPerHour = activities.meeting;
    }

    // getting disabled dates
    if (this.listingDetails.listingCalendar?.blockedDates) {
      const dates = JSON.parse(
        this.listingDetails.listingCalendar?.blockedDates
      );
      dates.forEach((date: Date) => {
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
            this.numberOfAttendees = this.attendiesDropdown[0].text;
            break;
          case this.attendiesDropdown[1].text:
            this.attendiesDropdown[1].available =
              listingData.isSixToFifteenPeople;
            this.attendiesDropdown[1].charges = JSON.parse(
              listingData.sixToFifteenPeople
            ).meeting;
            if (listingData.isSixToFifteenPeople) {
              this.numberOfAttendees = this.attendiesDropdown[1].text;
            }
            break;
          case this.attendiesDropdown[2].text:
            this.attendiesDropdown[2].available =
              listingData.isSixteenToThirtyPeople;
            this.attendiesDropdown[2].charges = JSON.parse(
              listingData.sixteenToThirtyPeople
            ).meeting;
            if (listingData.isSixteenToThirtyPeople) {
              this.numberOfAttendees = this.attendiesDropdown[2].text;
            }
            break;
          case this.attendiesDropdown[3].text:
            this.attendiesDropdown[3].available =
              listingData.isThirtyOneToFortyFivePeople;
            this.attendiesDropdown[3].charges = JSON.parse(
              listingData.thirtyOneToFortyFivePeople
            ).meeting;
            if (listingData.isThirtyOneToFortyFivePeople) {
              this.numberOfAttendees = this.attendiesDropdown[3].text;
            }
            break;
          case this.attendiesDropdown[4].text:
            this.attendiesDropdown[4].available =
              listingData.isFortySixToSixtyPeople;
            this.attendiesDropdown[4].charges = JSON.parse(
              listingData.fortySixToSixtyPeople
            ).meeting;
            if (listingData.isFortySixToSixtyPeople) {
              this.numberOfAttendees = this.attendiesDropdown[4].text;
            }
            break;
          case this.attendiesDropdown[5].text:
            this.attendiesDropdown[5].available =
              listingData.isSixtyAndAbovePeople;
            this.attendiesDropdown[5].charges = JSON.parse(
              listingData.sixtyAndAbovePeople
            ).meeting;
            if (listingData.isSixtyAndAbovePeople) {
              this.numberOfAttendees = this.attendiesDropdown[5].text;
            }
            break;

          default:
            break;
        }
      });
    }

    // getting category and styles
    if (this.listingDetails.listingLocationCategoryIds) {
      this.listingDetails.listingLocationCategoryIds.map((listing) => {
        this.categories.push(listing.listingLocationCategory.categoryName);
      });
    }

    if (this.listingDetails.listingLocationSubCategoryIds) {
      this.listingDetails.listingLocationSubCategoryIds.map((subcategory) => {
        this.styles.push(
          subcategory.listingLocationSubCategory.subCategoryName
        );
      });
    }

    // Location Rules
    if (this.listingDetails.listingLocationRules) {
      if (typeof this.listingDetails.listingLocationRules.rules === 'string') {
        JSON.parse(this.listingDetails.listingLocationRules.rules).map(
          (rule: Rule) => {
            if (!rule.checked) {
              const modifiedRuleArray = rule.name.split(' ');
              const newModifiedRuleArray = [
                ...modifiedRuleArray.slice(0, -1),
                'not',
                ...modifiedRuleArray.slice(-1),
              ];
              rule.name = newModifiedRuleArray.join(' ');
            }
            this.locationRules.push(rule);
          }
        );
      }
      if (
        typeof this.listingDetails.listingLocationRules.additionalRules ===
        'string'
      ) {
        this.addtionalRules = JSON.parse(
          this.listingDetails.listingLocationRules.additionalRules
        );
      }

      // Amenities
      if (
        this.listingDetails.listingLocationInfos?.amenitiesSerialized &&
        this.listingDetails.listingLocationInfos?.amenitiesSerialized.length > 0
      ) {
        this.listingDetails.listingLocationInfos?.amenitiesSerialized.map(
          (amenty) => {
            if (amenty) {
              const modifiedAmenty = amenty.split('-').join(' ');
              this.amenities.push(modifiedAmenty);
            }
          }
        );
      }

      // Crew access
      if (
        this.listingDetails.listingLocationInfos
          ?.accessAvailabilityParkingSerialized &&
        this.listingDetails.listingLocationInfos
          ?.accessAvailabilityParkingSerialized.length > 0
      ) {
        this.listingDetails.listingLocationInfos?.accessAvailabilityParkingSerialized.map(
          (access) => {
            if (access) {
              const modifiedAccess = access.split('-').join(' ');
              this.crewAccess.push(modifiedAccess);
            }
          }
        );
      }

      // features details
      if (this.listingDetails?.listingLocationKeyFeaturesDetails) {
        this.listingDetails?.listingLocationKeyFeaturesDetails.map(
          (feature) => {
            this.features.push(feature.name);
          }
        );
        if (this.features.length > 6) {
          this.showMoreFeatures = true;
        }
      }

      // interiors
      if (this.listingDetails?.listingLocationInteriorFeature) {
        this.listingDetails?.listingLocationInteriorFeature.map((interior) => {
          this.interiors.push(interior.name);
        });
        if (this.interiors.length > 6) {
          this.showMoreInteriors = true;
        }
      }
    }
  }

  // private listingDetailsInit(): void {
  //   this.activatedRoute.params.subscribe((params: Params) => {
  //     const listingData = this.locations.find(
  //       (loc) => loc.slug === params['list']
  //     );
  //     if (listingData) {
  //       this.listingDetails = listingData;
  //       this.title.setTitle(this.listingDetails.locationTitle);
  //     }
  //   });
  // }

  private async bookingFormInit(): Promise<void> {
    const startTimes = JSON.stringify(this.startTimeSlots);
    const availableEndTimeSlots = JSON.stringify(this.availableEndTimeSlots);
    const nextDayTimeSlots = JSON.stringify(this.nextDayTimeSlots);
    this.bookingForm = new FormGroup({
      bookings: new FormArray([
        new FormGroup({
          date: new FormControl(null, Validators.required),
          startTime: new FormControl(null, Validators.required),
          startTimeSlots: new FormControl(JSON.parse(startTimes), [
            Validators.required,
          ]),
          nextDayTimeSlots: new FormControl(JSON.parse(nextDayTimeSlots), [
            Validators.required,
          ]),
          endTime: new FormControl(
            {
              value: null,
              disabled: true,
            },
            [Validators.required]
          ),
          availableEndTimeSlots: new FormControl(
            JSON.parse(availableEndTimeSlots),
            Validators.required
          ),
        }),
      ]),
    });
  }

  get bookingControls() {
    return (this.bookingForm.get('bookings') as FormArray).controls;
  }

  get bookingArray() {
    return this.bookingForm.get('bookings') as FormArray;
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
    this.checkValidations();
    const lastValueFromArray =
      this.bookingControls[this.bookingControls.length - 1].value;

    const startTimes = JSON.stringify(this.startTimeSlots);
    const nextDayTimeSlots = JSON.stringify(this.nextDayTimeSlots);
    let nextDateToAdd = new Date(
      new Date(lastValueFromArray.date).setDate(
        lastValueFromArray.date.getDate() + 1
      )
    );

    this.disabledDates.forEach((disabledDate) => {
      const nextDate = this.datepipe.transform(
        new Date(new Date(nextDateToAdd)),
        'MM-dd-yyyy'
      );
      const disbledDate = this.datepipe.transform(
        new Date(new Date(disabledDate)),
        'MM-dd-yyyy'
      );
      if (nextDate === disbledDate) {
        nextDateToAdd = new Date(
          new Date(nextDateToAdd).setDate(nextDateToAdd.getDate() + 1)
        );
      }
    });
    if (
      !lastValueFromArray.date ||
      !lastValueFromArray.startTime ||
      !lastValueFromArray.endTime
    ) {
      this.isSubmitted = true;
      return;
    }

    (<FormArray>this.bookingForm.get('bookings')).push(
      new FormGroup({
        date: new FormControl(nextDateToAdd, Validators.required),
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
    const index = this.bookingControls.length - 1;
    const date = nextDateToAdd;
    this.enableDisableTimeSlots(index, date);
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
      // .slice(this.selectedStartTimeIdx + this.minimumHours)
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
    // this.bookingControls[index].value.startTimeSlots.map(
    //   (startTime: TimeSlot) => {
    //     startTime.disabled = false;
    //   }
    // );
    (<FormArray>this.bookingForm.get('bookings')).removeAt(index);
    this.onSetTotalHours();
  }

  onDateChange(event: MatDatepickerInputEvent<Date>, index: number): void {
    this.isSubmitted = false;
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
    const formatTo = this.datepipe.transform(date, 'yyyy-MM-dd');
    this.startDate = formatTo;
    const currentTime = new Date();
    if (this.currentSelected !== date?.toISOString()) {
      this.bookingControls[index].value.startTimeSlots.map(
        (startTime: TimeSlot, i: number) => {
          startTime.disabled = false;
        }
      );
    }
    this.currentSelected = date?.toISOString();
    // enable disable time slots according to reseverd dates
    this.enableDisableTimeSlots(index, date);

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

    // const previousSameDates = this.bookingControls.filter(
    //   (ctrl) => ctrl.value.date.toISOString() === event.value?.toISOString()
    // );
    // if (previousSameDates.length > 1) {
    //   const disabledDates = previousSameDates.at(-1)?.value.startTimeSlots;
    // }
    // const previousFormArray = this.bookingControls[index - 1];
    // const previousDate = previousFormArray?.value.date;
    // const previousDateTransformed = this.datepipe.transform(
    //   previousDate,
    //   'yyyy-MM-dd'
    // );
    // if (previousDate && previousDateTransformed === this.startDate) {
    //   const previousStartTime = this.bookingControls[index - 1].value.startTime;
    //   const previousEndTime = this.bookingControls[index - 1].value.endTime;
    //   const startTimeIndex = this.bookingControls[
    //     index
    //   ].value.startTimeSlots.findIndex(
    //     (time: TimeSlot) => time.value === previousStartTime
    //   );
    //   const endTimeIndexinStartTimeSlots = this.bookingControls[
    //     index
    //   ].value.startTimeSlots.findIndex(
    //     (time: TimeSlot) => time.value === previousEndTime
    //   );
    //   if (endTimeIndexinStartTimeSlots > 0) {
    //     for (let i = startTimeIndex; i < endTimeIndexinStartTimeSlots; i++) {
    //       this.bookingControls[index].value.startTimeSlots[i].disabled = true;
    //     }
    //   } else {
    //     for (
    //       let i = startTimeIndex;
    //       i < this.bookingControls[index].value.startTimeSlots.length;
    //       i++
    //     ) {
    //       this.bookingControls[index].value.startTimeSlots[i].disabled = true;
    //     }
    //   }
    // } else {
    //   for (
    //     let i = 0;
    //     i < this.bookingControls[index].value.startTimeSlots.length;
    //     i++
    //   ) {
    //     this.bookingControls[index].value.startTimeSlots[i].disabled = false;
    //   }
    // }
  }

  private enableDisableTimeSlots(index: number, date: Date | null): void {
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
    dialogRef.afterClosed().subscribe(async () => {
      if (await this.authService.isUserLoggedIn()) {
        location.reload();
      }
    });
  }

  async onSubmitForm(): Promise<void> {
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
    if (this.isHost) {
      await this.setHostToLocal();
    }
    if (this.currentUserId === this.recieverId) {
      this.snackbar.info('You are the host of this listing');
      return;
    }
    this.isSubmitted = true;
    this.isBlinking = true;
    setTimeout(() => {
      this.isBlinking = false;
    }, 800);
    this.checkValidations();
    if (this.bookingForm.valid && this.totalHours < this.minimumHours) {
      this.snackbar.error(`Please select minimum ${this.minimumHours} hours`);
      return;
    }

    if (this.bookingForm.valid && this.totalHours >= this.minimumHours) {
      const totalAmount =
        this.processingFee +
        // this.siteRep +
        this.selectedAttendies.charges * this.totalHours;
      const payload = {
        listingId: Number(this.list),
        projectName: '',
        renterOrCompany: '',
        activity: '',
        castAndCrew: JSON.stringify(this.selectedAttendies),
        aboutProject: '',
        days: JSON.stringify(this.bookingForm.value.bookings),
        totalHours: this.totalHours,
        amountPerHour: this.selectedAttendies.charges,
        totalAmount: totalAmount,
        processingFee: this.processingFee,
        exactCount: totalAmount,
        userPaymentInfoId: 0,
        stripeCardToken: '',
        reservedDates: JSON.stringify([
          ...this.reservedDates,
          ...this.localReservedDates,
        ]),
      };

      await this.localService.setLocalData(LocalConstant.LISTING_DATA, payload);
      location.href = '/listing/request-booking/' + this.list;
    }
  }

  onResetForm(): void {
    this.bookingForm.reset();
    this.onSetTotalHours();
  }

  getStartTime(selectedTime: string | undefined): TimeSlot | undefined {
    const startTime = selectedTime?.split(';')[0];
    return this.startTimeSlots.find((time) => time.value === startTime);
  }

  getEndTime(selectedTime: string | undefined): TimeSlot | undefined {
    const startTime = selectedTime?.split(';')[1];
    if (this.startTimeSlots.find((time) => time.value === startTime)) {
      return this.startTimeSlots.find((time) => time.value === startTime);
    } else if (this.endOfDayTimeSlot.value === startTime) {
      return this.endOfDayTimeSlot;
    } else {
      return this.nextDayTimeSlots.find((time) => time.value === startTime);
    }
  }

  async getProjects(): Promise<void> {
    if (!(await this.authService.isUserLoggedIn())) {
      this.projects = [];
      this.dialog.open(LoginPopupComponent, {
        width: '600px',
        disableClose: true,
        autoFocus: false,
        data: {
          isLoggingIn: true,
        },
      });
    }
    if (await this.authService.isUserLoggedIn()) {
      this.isLoading = true;
      const response = await this.projectService.getProjects();
      if (response && response.success && response.data) {
        this.projects = response.data;
      }
      this.isLoading = false;
    }
  }

  private async getSelectedProjectListings() {
    const response = await this.projectService.getAllSelectedProjectLocations();
    if (
      response &&
      response.success &&
      response.data &&
      response.data.listingId
    ) {
      this.projectService.selectedProjectListings = response.data.listingId;
      this.selectedProjectListings = response.data.listingId;

      this.sharedService.setSelectedProjectListings(response.data.listingId);
    }
  }

  async onAddLocationToProject(
    projectId: number,
    isSelected: boolean,
    listingId?: string
  ): Promise<void> {
    if (await this.authService.isUserLoggedIn()) {
      const payload = {
        projectId,
        listingId: Number(atob(String(listingId))),
        isSelected: isSelected,
      };
      const response = await this.projectService.onAddLocationToProject(
        payload
      );
      if (response && response.success) {
        await this.getSelectedProjectListings();
        if (listingId) await this.getProjects();
        this.snackbar.success(response.data);
      }
    }
  }

  onChangeActivity(data: EventList): void {
    this.activity = data;
  }

  // onToggleMessage(): void {
  //   this.isMessaging = !this.isMessaging;
  //   this.isSubmitted = false;
  //   // this.bookingForm.reset();
  //   window.scrollTo({
  //     top: 0,
  //     behavior: 'auto',
  //   });
  // }

  // onInitiateMessage() {
  //   this.isSubmitted = true;
  //   if (!this.bookingForm.valid) return;
  // }

  private async getCurrentUser(): Promise<void> {
    const userData = await this.localService.getLocalData(
      LocalConstant.USER_DATA
    );
    if (userData) {
      const userPayload = JSON.parse(atob(userData.access_token.split('.')[1]));

      this.currentUserId = userPayload.sub;
      this._signalrClientService.emitCurrentUserId.next(this.currentUserId);
      this.currentUserEmail = userPayload.email;
      this._signalrClientService.currentUserId = this.currentUserId;
      this._signalrClientService.currentUserEmail = this.currentUserEmail;
      await this.getSelectedProjectListings();
    }
  }

  async setHostToLocal(): Promise<boolean> {
    const response = await this.authService.switchRole(
      this.currentUserEmail,
      true,
      false
    );
    if (response && response.success) {
      const userData = response.data;
      await this.localService.setLocalData(LocalConstant.USER_DATA, userData);
      await this.localService.removeLocalData(LocalConstant.IS_HOST);
      return true;
    } else {
      return false;
    }
  }

  async addContactToChat(): Promise<void> {
    await this.setHostToLocal();
    if (!(await this.authService.isUserLoggedIn())) {
      this.openLoginDlg(true);
      return;
    }

    if (this.currentUserId === this.recieverId) {
      this.snackbar.info('You are the host of this listing');
      return;
    }
    this.isInitiatingMsg = true;
    try {
      await this._signalrClientService.openConnection(
        this.currentUserId,
        this.recieverId
      );
      location.href = `/messages?s=${this.currentUserId}&r=${this.recieverId}`;

      this.isInitiatingMsg = false;
    } catch (error) {
      this.snackbar.error(ErrorConstant.CONNECTION_ERROR);
      this.isInitiatingMsg = false;
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
