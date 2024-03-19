import { Component, Input } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { LocalConstant } from 'src/app/constants/local-constant';
import { Booking } from 'src/app/models/booking.model';
import { BookingService } from 'src/app/services/booking.service';
import { SnackBarService } from 'src/app/services/snack-bar.service';
import { ConfirmDialogComponent } from 'src/app/shared/components/confirm-dialog/confirm-dialog.component';
import { AddReviewComponent } from '../add-review/add-review.component';
import { translateAnimation } from 'src/app/shared/components/smooth-height/translate-animate.component';
import { ErrorConstant } from 'src/app/constants/error.constant';
import { SuccessConstant } from 'src/app/constants/success.constant';

@Component({
  selector: 'app-booking',
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.scss'],
  animations: [translateAnimation],
})
export class BookingComponent {
  @Input({ required: true }) bookings: Booking[];
  @Input({ required: true }) currentBookingStatus: string = 'all';
  @Input({ required: true }) role: string;
  isLoading = false;

  constructor(
    private bookingService: BookingService,
    private snackbar: SnackBarService,
    public dialogRef: MatDialogRef<ConfirmDialogComponent>,
    private dialog: MatDialog,
    private router: Router
  ) {}

  onUpdateBookingStatus(status: boolean, id: number): void {
    const dialogData = {
      title: `Confirm to ${status ? 'Accept' : 'Reject'} ?`,
      message: `Are you sure you want to ${
        status ? 'accept' : 'reject'
      }  this booking ?`,
      cancelBtnText: 'Cancel',
      confirmBtnText: `${status ? 'Accept' : 'Reject'}`,
      isDeleting: false,
      showCancelBtn: true,
      isReasonRequired: status ? false : true,
      id: id,
      status: status,
      isRejectingBooking: true,
    };

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '450px',
      data: dialogData,
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe(async (dialogRes) => {
      if (
        dialogRes &&
        dialogRes.success &&
        dialogRes.data.includes('Your Payment is Rejected by Host!!')
      ) {
        this.bookings = this.bookings.filter((booking) => booking.id !== id);
        this.snackbar.info(LocalConstant.BOOKING_REJECTED);
        this.router.navigateByUrl(
          `/bookings?role=${this.role}&tab=rejected&pageNumber=1&pageSize=10`
        );
        setTimeout(() => {
          location.reload();
        }, 10);
      }
      if (dialogRes === true) {
        this.isLoading = true;
        const response = await this.bookingService.createChargeFromCustomer(
          id,
          status ? 1 : 2
        );
        if (response && response.success) {
          if (status) {
            const foundedBooking = this.bookings.find(
              (booking) => booking.id === id
            );
            if (foundedBooking) {
              foundedBooking.status = 1;
            }
          }
          if (!status) {
            this.bookings = this.bookings.filter(
              (booking) => booking.id !== id
            );
            this.router.navigateByUrl(
              `/bookings?role=${this.role}&tab=cancelled&pageNumber=1&pageSize=10`
            );
            setTimeout(() => {
              location.reload();
            }, 10);
          }
          if (response.data === 'Your Payment is Rejected by Host!!') {
            this.snackbar.info(LocalConstant.BOOKING_REJECTED);
          } else {
            this.router.navigateByUrl(`/bookings/${btoa(String(id))}/success`);
            // this.snackbar.success(LocalConstant.BOOKING_ACCEPTED);
          }
        }
        this.isLoading = false;
      }
    });
  }

  onViewBooking(id: number) {
    const encryptedBookingId = btoa(String(id));
    this.router.navigate(['/bookings/', encryptedBookingId]);
  }

  onCancelBookingByRenter(id: number): void {
    const dialogData = {
      title: `Confirm to cancel ?`,
      message: `Are you sure you want to cancel? You can\'t undo this action!`,
      cancelBtnText: 'Do not Cancel',
      confirmBtnText: `Yes, cancel my booking`,
      isDeleting: false,
      showCancelBtn: true,
    };

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '450px',
      data: dialogData,
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe(async (dialogResult) => {
      if (dialogResult === true) {
        this.isLoading = true;
        const response = await this.bookingService.cancelBookingByRenter(
          id,
          true
        );
        if (response && response.success) {
          if (
            this.currentBookingStatus.toLowerCase() !== 'all' &&
            this.currentBookingStatus.toLowerCase() !== 'cancelled'
          ) {
            this.bookings = this.bookings.filter(
              (booking) => booking.id !== id
            );
          }
          // const foundedBooking = this.bookings.find(
          //   (booking) => booking.id === id
          // );
          // if (foundedBooking) {
          //   foundedBooking.status = 5;
          // }
          this.snackbar.info(LocalConstant.BOOKING_CANCELED);
          this.isLoading = false;
        } else {
          this.isLoading = false;
        }
      }
    });
  }

  getEncryptedId(id: number | undefined): string {
    return btoa(String(id));
  }

  onAddReview(listingId: number | undefined, isEditing: boolean): void {
    const dialogData = {
      listingId,
      isEditing,
    };

    this.dialog.open(AddReviewComponent, {
      width: '600px',
      data: dialogData,
      disableClose: true,
    });
  }

  onAddUpdateReview(listingId: number | undefined, index: number): void {
    const dialogData = {
      listingId,
    };

    const dialogRef = this.dialog.open(AddReviewComponent, {
      width: '600px',
      data: dialogData,
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(async () => {
      // await this.getListingReviewsByUser(this.listingId);
      this.bookings[index].totalCountReviews =
        Number(this.bookings[index].totalCountReviews) + 1;
      this.snackbar.success(SuccessConstant.REVIEW_ADDED);
    });
  }
}
