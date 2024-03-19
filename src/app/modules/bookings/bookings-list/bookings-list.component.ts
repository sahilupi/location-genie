import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { ActivatedRoute, Router } from '@angular/router';
import { Bookings } from 'src/app/constants/bookings.constant';
import { UserConstant } from 'src/app/constants/user.constant';
import { Booking } from 'src/app/models/booking.model';
import { Pagination } from 'src/app/models/common.model';
import { AuthService } from 'src/app/services/auth.service';
import { BookingService } from 'src/app/services/booking.service';

@Component({
  selector: 'app-bookings-list',
  templateUrl: './bookings-list.component.html',
  styleUrls: ['./bookings-list.component.scss'],
})
export class BookingsListComponent implements OnInit {
  bookings: Booking[] = [];
  bookingStatus = Bookings.bookingStatus;
  role = 'renter';
  selectedIndex = 0;
  currentBookingStatus: string;
  pagination: Pagination = {
    pageNumber: 1,
    pageSize: 10,
  };
  totalCount = 10;
  status = 0;
  isFirstTimeFetching = true;

  constructor(
    private bookingService: BookingService,
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
    private date: DatePipe,
    private router: Router
  ) {}

  async ngOnInit(): Promise<void> {
    const isHost = await this.authService.getHostInfo();
    if (isHost) {
      this.role = UserConstant.userRoles.host.toLowerCase();
      if (this.role === 'user') this.role = 'renter';
    }
    const queryParam = this.activatedRoute.snapshot.queryParams;
    if (!queryParam['tab']) {
      this.currentBookingStatus = 'upcoming';
      this.router.navigate([], {
        relativeTo: this.activatedRoute,
        queryParams: {
          role: this.role.toLowerCase(),
          tab: 'upcoming',
          pageNumber: this.pagination.pageNumber,
          pageSize: this.pagination.pageSize,
        },
        queryParamsHandling: 'merge',
      });

      const response = this.activatedRoute.snapshot.data['bookingList'];

      if (response && response.success && response.data) {
        this.bookings = [];
        this.totalCount = response.totalCount;
        response.data.forEach((res: any) => {
          let dates = [''];
          let times = [''];
          if (res.days) {
            dates = JSON.parse(res.days).map((day: any) =>
              this.date.transform(new Date(day.date), 'dd-MM-YYYY')
            );
            times = JSON.parse(res.days).map(
              (day: any) =>
                this.formatTime(day.startTime) +
                '-' +
                this.formatTime(day.endTime)
            );
          }

          const givenDate = new Date(
            parseInt(dates[0].substring(6, 10)),
            parseInt(dates[0].substring(3, 5)) - 1, // Subtract 1 from the month (months are 0-indexed in JavaScript)
            parseInt(dates[0].substring(0, 2))
          );
          const transformedCurrentTime = new Intl.DateTimeFormat('en-US', {
            hour: 'numeric',
            minute: 'numeric',
            hour12: true,
          }).format(new Date());

          const bookingTime = this.timeStringToMinutes(times[0].split('-')[0]);
          const currentTime = this.timeStringToMinutes(transformedCurrentTime);
          this.bookings.push({
            id: res.id,
            locationTitle: res.listing.locationTitle,
            dates: dates,
            times: times,
            fees: res.totalAmount,
            currency: {
              currencyCode: res.listingPrices.currency
                ? res.listingPrices.currency.currencyCode
                : 'AED',
              currencyName: res.listingPrices.currency
                ? res.listingPrices.currency.currencyName
                : 'United Arab Emirates Dirham',
              currencySymbol: res.listingPrices.currency
                ? res.listingPrices.currency.currencySymbol
                : 'د.إ',
              id: res.listingPrices.currency
                ? res.listingPrices.currency.id
                : '2',
            },
            projectName: res.projectName,
            isInstantBooking: res.listing.isInstantBooking,
            status: res.status,
            listingId: res.listing.id,
            createdDate: new Date(res.createdDate),
            isExpired:
              givenDate.setHours(0, 0, 0, 0) < new Date().setHours(0, 0, 0, 0)
                ? givenDate.setHours(0, 0, 0, 0) <
                  new Date().setHours(0, 0, 0, 0)
                : givenDate.setHours(0, 0, 0, 0) <=
                    new Date().setHours(0, 0, 0, 0) &&
                  bookingTime < currentTime,
            hostEmail: res.hostEmail,
            hostName: res.hostName,
            renterEmail: res.renterEmail,
            renterName: res.renterName,
            totalCountReviews: res.listing.totalCountReviews,
          });
        });
        this.bookings = this.bookings.sort(
          (a, b) => Number(b.createdDate) - Number(a.createdDate)
        );
      }
    }

    const pageNumber = queryParam['pageNumber'];
    const pageSize = queryParam['pageSize'];
    if (queryParam['tab'] && pageNumber && pageSize) {
      this.pagination.pageNumber = parseInt(pageNumber);
      this.pagination.pageSize = parseInt(pageSize);
      this.currentBookingStatus = queryParam['tab'];
      switch (queryParam['tab']) {
        case 'completed':
          this.selectedIndex = 2;
          this.status = 4;
          break;
        case 'upcoming':
          this.selectedIndex = 0;
          this.status = 1;
          break;
        case 'cancelled':
          this.selectedIndex = 3;
          this.status = 2;
          break;
        case 'requested':
          this.selectedIndex = 1;
          this.status = 3;
          break;
        case 'rejected':
          this.selectedIndex = 4;
          this.status = 5;
          break;
        default:
          this.selectedIndex = 5;
          this.status = 0;
          break;
      }
      this.router.navigate([], {
        relativeTo: this.activatedRoute,
        queryParams: {
          role: this.role.toLowerCase(),
          tab: queryParam['tab'],
          pageNumber: this.pagination.pageNumber,
          pageSize: this.pagination.pageSize,
        },
        queryParamsHandling: 'merge',
      });
      const response = this.activatedRoute.snapshot.data['bookingList'];
      if (response && response.success && response.data) {
        this.bookings = [];
        this.totalCount = response.totalCount;
        response.data.forEach((res: any) => {
          let dates = [''];
          let times = [''];
          if (res.days) {
            dates = JSON.parse(res.days).map((day: any) =>
              this.date.transform(new Date(day.date), 'dd-MM-YYYY')
            );
            times = JSON.parse(res.days).map(
              (day: any) =>
                this.formatTime(day.startTime) +
                '-' +
                this.formatTime(day.endTime)
            );
          }

          const givenDate = new Date(
            parseInt(dates[0].substring(6, 10)),
            parseInt(dates[0].substring(3, 5)) - 1, // Subtract 1 from the month (months are 0-indexed in JavaScript)
            parseInt(dates[0].substring(0, 2))
          );
          const transformedCurrentTime = new Intl.DateTimeFormat('en-US', {
            hour: 'numeric',
            minute: 'numeric',
            hour12: true,
          }).format(new Date());

          const bookingTime = this.timeStringToMinutes(times[0].split('-')[0]);
          const currentTime = this.timeStringToMinutes(transformedCurrentTime);
          this.bookings.push({
            id: res.id,
            locationTitle: res.listing.locationTitle,
            dates: dates,
            times: times,
            fees: res.totalAmount,
            currency: {
              currencyCode: res.listingPrices.currency
                ? res.listingPrices.currency.currencyCode
                : 'AED',
              currencyName: res.listingPrices.currency
                ? res.listingPrices.currency.currencyName
                : 'United Arab Emirates Dirham',
              currencySymbol: res.listingPrices.currency
                ? res.listingPrices.currency.currencySymbol
                : 'د.إ',
              id: res.listingPrices.currency
                ? res.listingPrices.currency.id
                : '2',
            },
            projectName: res.projectName,
            isInstantBooking: res.listing.isInstantBooking,
            status: res.status,
            listingId: res.listing.id,
            createdDate: new Date(res.createdDate),
            isExpired:
              givenDate.setHours(0, 0, 0, 0) < new Date().setHours(0, 0, 0, 0)
                ? givenDate.setHours(0, 0, 0, 0) <
                  new Date().setHours(0, 0, 0, 0)
                : givenDate.setHours(0, 0, 0, 0) <=
                    new Date().setHours(0, 0, 0, 0) &&
                  bookingTime < currentTime,
            hostEmail: res.hostEmail,
            hostName: res.hostName,
            renterEmail: res.renterEmail,
            renterName: res.renterName,
            totalCountReviews: res.listing.totalCountReviews,
          });
        });
        this.bookings = this.bookings.sort(
          (a, b) => Number(b.createdDate) - Number(a.createdDate)
        );
      }
      this.isFirstTimeFetching = false;
    }
  }

  timeStringToMinutes(timeString: any) {
    const [time, period] = timeString.split(' ');
    const [hour, minute] = time.split(':');
    const adjustedHour =
      period === 'PM' && hour !== '12'
        ? parseInt(hour, 10) + 12
        : parseInt(hour, 10);
    return adjustedHour * 60 + parseInt(minute, 10);
  }

  async getRequestedBookingByStatus(
    event?: string,
    selectedIndex?: number
  ): Promise<void> {
    if (selectedIndex === this.selectedIndex) return;
    const label = event;

    // @ts-ignore
    this.status = this.bookingStatus[label.toLowerCase()];
    if (!this.status && this.status !== 0) {
      this.status = 3;
    }
    this.pagination.pageNumber = 1;
    this.pagination.pageSize = 10;

    const response = await this.bookingService.getRequestedBookingByStatus(
      this.status,
      this.pagination
    );
    this.bookings = [];
    if (response && response.success && !response.data) {
      this.router.navigate([], {
        relativeTo: this.activatedRoute,
        queryParams: {
          role: this.role.toLowerCase(),
          tab: label,
          pageNumber: this.pagination.pageNumber,
          pageSize: this.pagination.pageSize,
        },
        queryParamsHandling: 'merge',
      });
      this.currentBookingStatus = String(label);
      if (selectedIndex || selectedIndex === 0)
        this.selectedIndex = selectedIndex;
    }
    if (response && response.success && response.data) {
      this.totalCount = Number(response.totalCount);
      setTimeout(() => {
        response.data.map((res: any) => {
          let dates = [''];
          let times = [''];
          if (res.days) {
            dates = JSON.parse(res.days).map((day: any) =>
              this.date.transform(new Date(day.date), 'dd-MM-YYYY')
            );
            times = JSON.parse(res.days).map(
              (day: any) =>
                this.formatTime(day.startTime) +
                '-' +
                this.formatTime(day.endTime)
            );
          }

          const givenDate = new Date(
            parseInt(dates[0].substring(6, 10)),
            parseInt(dates[0].substring(3, 5)) - 1, // Subtract 1 from the month (months are 0-indexed in JavaScript)
            parseInt(dates[0].substring(0, 2))
          );
          const transformedCurrentTime = new Intl.DateTimeFormat('en-US', {
            hour: 'numeric',
            minute: 'numeric',
            hour12: true,
          }).format(new Date());

          const bookingTime = this.timeStringToMinutes(times[0].split('-')[0]);
          const currentTime = this.timeStringToMinutes(transformedCurrentTime);
          this.bookings.push({
            id: res.id,
            locationTitle: res.listing.locationTitle,
            dates: dates,
            times: times,
            fees: res.totalAmount,
            currency: {
              currencyCode: res.listingPrices.currency
                ? res.listingPrices.currency.currencyCode
                : 'AED',
              currencyName: res.listingPrices.currency
                ? res.listingPrices.currency.currencyName
                : 'United Arab Emirates Dirham',
              currencySymbol: res.listingPrices.currency
                ? res.listingPrices.currency.currencySymbol
                : 'د.إ',
              id: res.listingPrices.currency
                ? res.listingPrices.currency.id
                : '2',
            },
            projectName: res.projectName,
            isInstantBooking: res.listing.isInstantBooking,
            status: res.status,
            listingId: res.listing.id,
            createdDate: new Date(res.createdDate),
            isExpired:
              givenDate.setHours(0, 0, 0, 0) < new Date().setHours(0, 0, 0, 0)
                ? givenDate.setHours(0, 0, 0, 0) <
                  new Date().setHours(0, 0, 0, 0)
                : givenDate.setHours(0, 0, 0, 0) <=
                    new Date().setHours(0, 0, 0, 0) &&
                  bookingTime < currentTime,
            hostEmail: res.hostEmail,
            hostName: res.hostName,
            renterEmail: res.renterEmail,
            renterName: res.renterName,
            totalCountReviews: res.listing.totalCountReviews,
          });
        });
        this.bookings = this.bookings.sort(
          (a, b) => Number(b.createdDate) - Number(a.createdDate)
        );
      });

      this.currentBookingStatus = String(label);
      this.pagination.pageNumber = 1;
      this.pagination.pageSize = 10;
      this.router.navigate([], {
        relativeTo: this.activatedRoute,
        queryParams: {
          role: this.role.toLowerCase(),
          tab: label,
          pageNumber: this.pagination.pageNumber,
          pageSize: this.pagination.pageSize,
        },
        queryParamsHandling: 'merge',
      });
      if (selectedIndex || selectedIndex === 0) {
        this.selectedIndex = selectedIndex;
      }
    }
  }

  private formatTime(time: string): string {
    if (time === '24:00') {
      return '12:00 AM';
    }

    // Check if the time is in the format "next-day-xx:xx"
    if (time.startsWith('next-day-')) {
      const [nextDayTime] = time.split('-').slice(2); // Extract the time portion
      return `Next Day ${this.formatNextDayTime(nextDayTime)}`;
    }

    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours, 10);
    const minute = parseInt(minutes, 10);

    // Determine AM or PM based on the hour
    const period = hour >= 12 ? 'PM' : 'AM';

    // Convert 24-hour time to 12-hour time and add AM/PM
    const formattedHour = (hour % 12 === 0 ? 12 : hour % 12).toString();
    const formattedMinute = minute.toString().padStart(2, '0');

    return `${formattedHour}:${formattedMinute} ${period}`;
  }

  private formatNextDayTime(time: string): string {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours, 10);
    const minute = parseInt(minutes, 10);

    // Determine AM or PM based on the hour
    const period = hour >= 12 ? 'PM' : 'AM';

    // Convert 24-hour time to 12-hour time and add AM/PM
    const formattedHour = (hour % 12 === 0 ? 12 : hour % 12).toString();
    const formattedMinute = minute.toString().padStart(2, '0');

    return `${formattedHour}:${formattedMinute} ${period}`;
  }

  async onPageChange(event: PageEvent): Promise<void> {
    this.pagination.pageNumber = event.pageIndex + 1;
    this.pagination.pageSize = event.pageSize;
    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams: {
        pageNumber: this.pagination.pageNumber,
        pageSize: this.pagination.pageSize,
      },
      queryParamsHandling: 'merge',
    });

    const response = await this.bookingService.getRequestedBookingByStatus(
      this.status,
      this.pagination
    );
    if (response && response.data) {
      this.bookings = [];
      response.data.map((res: any) => {
        let dates = [''];
        let times = [''];
        if (res.days) {
          dates = JSON.parse(res.days).map((day: any) =>
            this.date.transform(new Date(day.date), 'dd-MM-YYYY')
          );
          times = JSON.parse(res.days).map(
            (day: any) =>
              this.formatTime(day.startTime) +
              '-' +
              this.formatTime(day.endTime)
          );
        }
        const givenDate = new Date(
          parseInt(dates[0].substring(6, 10)),
          parseInt(dates[0].substring(3, 5)) - 1, // Subtract 1 from the month (months are 0-indexed in JavaScript)
          parseInt(dates[0].substring(0, 2))
        );
        const transformedCurrentTime = new Intl.DateTimeFormat('en-US', {
          hour: 'numeric',
          minute: 'numeric',
          hour12: true,
        }).format(new Date());

        const bookingTime = this.timeStringToMinutes(times[0].split('-')[0]);
        const currentTime = this.timeStringToMinutes(transformedCurrentTime);
        this.bookings.push({
          id: res.id,
          locationTitle: res.listing.locationTitle,
          dates: dates,
          times: times,
          fees: res.totalAmount,
          currency: {
            currencyCode: res.listingPrices.currency
              ? res.listingPrices.currency.currencyCode
              : 'AED',
            currencyName: res.listingPrices.currency
              ? res.listingPrices.currency.currencyName
              : 'United Arab Emirates Dirham',
            currencySymbol: res.listingPrices.currency
              ? res.listingPrices.currency.currencySymbol
              : 'د.إ',
            id: res.listingPrices.currency
              ? res.listingPrices.currency.id
              : '2',
          },
          projectName: res.projectName,
          isInstantBooking: res.listing.isInstantBooking,
          status: res.status,
          listingId: res.listing.id,
          createdDate: new Date(res.createdDate),
          isExpired:
            givenDate.setHours(0, 0, 0, 0) < new Date().setHours(0, 0, 0, 0)
              ? givenDate.setHours(0, 0, 0, 0) < new Date().setHours(0, 0, 0, 0)
              : givenDate.setHours(0, 0, 0, 0) <=
                  new Date().setHours(0, 0, 0, 0) && bookingTime < currentTime,
          hostEmail: res.hostEmail,
          hostName: res.hostName,
          renterEmail: res.renterEmail,
          renterName: res.renterName,
          totalCountReviews: res.listing.totalCountReviews,
        });
      });
      this.bookings = this.bookings.sort(
        (a, b) => Number(b.createdDate) - Number(a.createdDate)
      );
    }
  }
}
