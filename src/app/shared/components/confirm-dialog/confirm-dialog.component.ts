import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ConfirmDialogue } from 'src/app/models/popup-dialogue.model';
import { BookingService } from 'src/app/services/booking.service';
import { ListingService } from 'src/app/services/listing.service';

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.scss'],
})
export class ConfirmDialogComponent {
  title: string;
  message: string;
  cancelBtnText: string;
  confirmBtnText: string;
  isDeleting: boolean = true;
  isDeactivateListing: boolean = false;
  showCancelBtn: boolean = false;
  isLongText: boolean = false;
  isReasonRequired = false;
  isLoading = false;
  inputText: string = '';
  descriptionText: string;

  constructor(
    public dialogRef: MatDialogRef<ConfirmDialogComponent>,
    private bookingService: BookingService,
    private listingService: ListingService,
    @Inject(MAT_DIALOG_DATA) public data: ConfirmDialogue
  ) {
    this.isDeactivateListing = this.data.isDeactivateListing;
    this.title = data.title;
    this.message = data.message;
    this.cancelBtnText = data.cancelBtnText;
    this.confirmBtnText = data.confirmBtnText;
    this.descriptionText = this.isDeactivateListing
      ? 'Please describe why you are deactivate this listing?'
      : 'Please describe why you are rejecting this listing?';
    this.descriptionText = this.data.isActivateListing
      ? 'Please describe why you are Activate this listing?'
      : this.descriptionText;
    this.isDeleting = data.isDeleting;
    this.isReasonRequired = data.isReasonRequired;
    if (data.showCancelBtn) this.showCancelBtn = data.showCancelBtn;
    if (data.isLongText) this.isLongText = data.isLongText;
  }

  async onConfirm(): Promise<void> {
    if (
      this.isReasonRequired &&
      (!this.inputText || this.inputText.trim().length < 15)
    )
      return;
    if (
      this.isReasonRequired &&
      this.inputText &&
      this.inputText.trim().length >= 15
    ) {
      if (
        this.isReasonRequired &&
        this.data.isRejectingBooking &&
        this.inputText &&
        this.inputText.trim().length >= 15
      ) {
        this.isLoading = true;
        const response = await this.bookingService.createChargeFromCustomer(
          this.data.id,
          this.data.status ? 1 : 2,
          this.inputText
        );
        if (response && response.success) {
          this.dialogRef.close(response);
        }
        this.isLoading = false;
      } else if (this.inputText && this.inputText.trim().length >= 15) {
        this.isLoading = true;
        const response = await this.listingService.onRequestDeactivateListing(
          this.data.id,
          this.inputText,
          this.data.isDeactivateListing,
          this.data.isActivateListing
        );
        if (response && response.success) {
          this.dialogRef.close(response);
        }
        this.isLoading = false;
      } else {
        this.dialogRef.close(true);
      }
    } else {
      this.dialogRef.close(true);
    }
  }

  onDismiss(): void {
    this.dialogRef.close(false);
  }
}
