import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { Booking, DayData, UserModel } from 'src/app/models/booking.model';
import { AuthService } from 'src/app/services/auth.service';
import { CommonService } from 'src/app/services/common.service';
import { SpinnerService } from 'src/app/services/spinner.service';
import { ListingService } from 'src/app/services/listing.service';
import { SnackBarService } from 'src/app/services/snack-bar.service';
import { LocalService } from 'src/app/services/local.service';
import { ConfirmDialogComponent } from 'src/app/shared/components/confirm-dialog/confirm-dialog.component';
import { AddReviewComponent } from '../add-review/add-review.component';
import { SuccessConstant } from 'src/app/constants/success.constant';
import { ErrorConstant } from 'src/app/constants/error.constant';
import { LocalConstant } from 'src/app/constants/local-constant';
import { ListingReview } from 'src/app/models/location.model';
import { Bookings } from 'src/app/constants/bookings.constant';
import { Pagination } from 'src/app/models/common.model';
// @ts-ignore
import * as html2pdf from 'html2pdf.js';


@Component({
  selector: 'app-booking-detail',
  templateUrl: './booking-detail.component.html',
  styleUrls: ['./booking-detail.component.scss'],
})
export class BookingDetailComponent implements OnInit {
  bookedDays: DayData[];
  renterDetails: UserModel;
  hostDetails: UserModel;
  aboutProject: Booking;
  activityName: string;
  castAndCrew: string;
  isBookingSuccess = false;
  isHost = false;
  type: string;
  bookingStatus = 1;
  listingId = 0;
  reviews: ListingReview[] = [];
  bookingStatusObj = Bookings.bookingStatusObj;
  approxAverageRating = 5;
  exactAverageRating = 4.5;
  encryptedListingId: string;
  currentUserId: string = '';
  isSelf = false;
  statusCheck: string;
  reviewsTotolCount = 0;
  pagination: Pagination = {
    pageNumber: 1,
    pageSize: 5,
  };

  constructor(
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
    private router: Router,
    private dialog: MatDialog,
    public commonService: CommonService,
    private listingService: ListingService,
    private localService: LocalService,
    private snackbar: SnackBarService,
    private spinner: SpinnerService
  ) { }

  async ngOnInit(): Promise<void> {
    this.spinner.show();
    try {
      this.isBookingSuccess = this.router.url.includes('success');
      if (this.router.url.includes('type')) {
        this.type = this.router.url.split('=')[1];
      }
      await this.havingHostRole();
      await this.getCurrentUser();
      await this.getBookingDetails();
      this.spinner.hide();
    } catch (error) {
      this.spinner.hide();
    } finally {
      this.spinner.hide();
    }
  }

  private async getCurrentUser(): Promise<void> {
    const userData = await this.localService.getLocalData(
      LocalConstant.USER_DATA
    );
    const userPayload = JSON.parse(atob(userData.access_token.split('.')[1]));
    this.currentUserId = userPayload.sub;
  }

  async getBookingDetails(): Promise<void> {
    const response = this.activatedRoute.snapshot.data['bookingDetails'];
    if (response && response.success) {
      if (
        response.data.response.hostDetails &&
        response.data.response.hostDetails.userId &&
        response.data.response.hostDetails.userId === this.currentUserId
      ) {
        this.isSelf = true;
      }
      if (
        response.data.response.status ||
        response.data.response.status === 0
      ) {
        this.bookingStatus = response.data.response.status;
        this.statusCheck = this.getStatusName(this.bookingStatus);
      }
      if (response.data.response.listingId) {
        this.listingId = response.data.response.listingId;
        this.encryptedListingId = btoa(String(this.listingId));
        await this.getListingReviewsByUser(this.listingId);
      }
      this.aboutProject = response.data.response;
      if (this.aboutProject.renter)
        this.renterDetails = this.aboutProject.renter;

      if (this.aboutProject.hostDetails)
        this.hostDetails = this.aboutProject.hostDetails;

      if (this.aboutProject.activity) {
        // Extract the 'name' from activity
        const activityObject = JSON.parse(this.aboutProject.activity);
        this.activityName = activityObject.name;
      }
      if (this.aboutProject.castAndCrew) {
        //Extract the value from castandcrew
        const crew = JSON.parse(this.aboutProject.castAndCrew);
        this.castAndCrew = crew.value;
      }

      if (this.aboutProject.days) {
        const daysArray: DayData[] = JSON.parse(this.aboutProject.days);
        // Extract the date, startTime, and endTime from each object and format them
        const dateTimes = daysArray.map((day: DayData) => {
          return {
            date: new Date(new Date(day.date)),
            startTime: this.formatTime(day.startTime),
            endTime: this.formatTime(day.endTime),
          };
        });
        this.bookedDays = dateTimes;
      }
    }
  }

  getStatusName(statusId: number): string {
    const status = this.bookingStatusObj[statusId];
    return status ? status : 'Unknown';
  }

  private async havingHostRole(): Promise<void> {
    if (await this.authService.getHostInfo()) {
      this.isHost = true;
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

  private async getListingReviewsByUser(listingId: number): Promise<void> {
    const response = await this.listingService.getListingReviewsByUser(
      listingId,
      this.pagination
    );
    if (response && response.success && response.data && response.data.length) {
      if (response.totalCount) {
        this.reviewsTotolCount = response.totalCount;
      }
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
    }
    this.exactAverageRating = Number(this.approxAverageRating.toFixed(1));
  }

  protected async loadMoreReviews(): Promise<void> {
    this.pagination = {
      ...this.pagination,
      pageNumber: this.pagination.pageNumber + 1,
    };

    const response = await this.listingService.getListingReviewsByUser(
      Number(this.listingId),
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
    }
  }

  onDownloadPdf(transaction: Booking): void {
    this.generatePDF([transaction]); // Pass the single transaction in an array
  }

  private generatePDF(data: Booking[]): void {
    data.forEach((transaction) => {
      const el = document.getElementById('content-download');
      const pdf = el?.innerHTML;
      const options = {
        margin: 10,
        filename: this.aboutProject.projectName + '.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'mm', format: 'a3', orientation: 'portrait' },
      };

      html2pdf()
        .from(pdf)
        .set(options)
        .outputPdf('datauristring')
        .then((pdfDataUri: string) => {
          // Trigger download using an anchor tag
          const link = document.createElement('a');
          link.href = pdfDataUri;
          link.download = this.aboutProject.projectName + '.pdf';
          link.click();
        });
    });
  }

  onAddUpdateReview(
    listingId: number,
    isEditing: boolean,
    reviewId?: number
  ): void {
    if (isEditing) {
      const foundReview = this.reviews.find((review) => review.id === reviewId);
      if (foundReview) {
        const dialogData = {
          listingId,
          isEditing,
          review: foundReview,
        };

        const dialogRef = this.dialog.open(AddReviewComponent, {
          width: '600px',
          data: dialogData,
          disableClose: true,
        });
        dialogRef.afterClosed().subscribe(async (dialogRes) => {
          if (isEditing && dialogRes) {
            const reviewIdx = this.reviews.findIndex(
              (review) => review.id === reviewId
            );
            if (reviewIdx >= 0) {
              this.reviews[reviewIdx] = {
                ...this.reviews[reviewIdx],
                commentText: dialogRes.commentText,
                rating: dialogRes.rating,
              };
            }
          }
          await this.getListingReviewsByUser(this.listingId);
        });
      } else {
        this.snackbar.error(ErrorConstant.SOME_ISSUE);
      }
    } else if (!isEditing) {
      const dialogData = {
        listingId,
        isEditing,
      };

      const dialogRef = this.dialog.open(AddReviewComponent, {
        width: '600px',
        data: dialogData,
        disableClose: true,
      });
      dialogRef.afterClosed().subscribe(async () => {
        await this.getListingReviewsByUser(this.listingId);
      });
    }
  }

  onDeleteReview(reviewId: number): void {
    const dialogData = {
      title: 'Confirm Delete?',
      message: 'Are you sure you want to delete?',
      cancelBtnText: 'Cancel',
      confirmBtnText: 'Delete',
      isDeleting: true,
    };

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '450px',
      data: dialogData,
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe(async (dialogResult) => {
      if (dialogResult === true) {
        const response = await this.listingService.deleteListingReview(
          reviewId
        );
        if (response && response.success) {
          this.reviews = this.reviews.filter(
            (review) => review.id !== reviewId
          );
          this.snackbar.success(SuccessConstant.DELETE_SUCCESS);
        }
      }
    });
  }
}
