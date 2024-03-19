import {
  Component,
  Inject,
  OnInit,
  ElementRef,
  Renderer2,
} from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { ListingReview } from 'src/app/models/location.model';
import { ListingService } from 'src/app/services/listing.service';
import { SnackBarService } from 'src/app/services/snack-bar.service';
import { ConfirmDialogComponent } from 'src/app/shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-add-review',
  templateUrl: './add-review.component.html',
  styleUrls: ['./add-review.component.scss'],
})
export class AddReviewComponent implements OnInit {
  title = 'Add';
  confirmText = 'Add';
  isLoading = false;
  reviewForm: FormGroup;
  stars = [0, 1, 2, 3, 4];
  isSubmitted = false;

  constructor(
    public dialogRef: MatDialogRef<AddReviewComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      listingId: number;
      isEditing: boolean;
      review: ListingReview;
    },
    private dialog: MatDialog,
    private eRef: ElementRef,
    private renderer: Renderer2,
    private listingService: ListingService,
    private snackbar: SnackBarService
  ) {}

  async ngOnInit(): Promise<void> {
    await this.reviewFormInit();
    if (this.data.isEditing) {
      this.title = 'Update';
      this.confirmText = 'Update';
    }
  }

  private async reviewFormInit(): Promise<void> {
    this.reviewForm = new FormGroup({
      commentText: new FormControl('', [
        Validators.required,
        Validators.maxLength(1000),
      ]),
      rating: new FormControl(0, [Validators.required]),
    });
    if (this.data.isEditing) {
      this.reviewForm.patchValue({
        commentText: this.data.review.commentText,
        rating: this.data.review.rating,
      });
      setTimeout(() => {
        this.setRating(this.data.review.rating - 1);
      });
    } else {
      setTimeout(() => {
        this.setRating(0);
      });
    }
  }

  setRating(rating: number): void {
    const svgs = this.eRef.nativeElement.querySelectorAll('svg.star');
    for (let i = 0, j = svgs.length; i < j; i++) {
      if (i <= rating) {
        this.renderer.addClass(svgs[i], 'active');
        this.reviewForm.patchValue({
          rating: rating + 1,
        });
      } else {
        this.renderer.removeClass(svgs[i], 'active');
        this.reviewForm.patchValue({
          rating: rating + 1,
        });
      }
    }
  }

  get c(): { [key: string]: AbstractControl } {
    return this.reviewForm.controls;
  }

  onConfirm(): void {
    this.isSubmitted = true;
    if (
      !this.reviewForm.valid ||
      !this.reviewForm.value.commentText ||
      !this.reviewForm.value.commentText.trim() ||
      !this.reviewForm.value.rating
    )
      return;

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '460px',
      disableClose: true,
      data: {
        title: `Confirm to ${this.data.isEditing ? 'update' : 'post'} review ?`,
        message: `Are you sure you want to ${
          this.data.isEditing ? 'update' : 'add'
        } review`,
        cancelBtnText: 'Cancel',
        confirmBtnText: `${
          this.data.isEditing ? 'Update review' : 'Post review'
        }`,
        isDeleting: false,
      },
    });
    dialogRef.afterClosed().subscribe(async (res) => {
      if (res) {
        const payload = {
          listingId: this.data.listingId,
          commentText: this.reviewForm.value.commentText.trim(),
          rating: this.reviewForm.value.rating,
          reviewId: this.data.isEditing ? this.data.review.id : 0,
        };
        const response = await this.listingService.postListingReview(payload);
        if (
          response &&
          response.success &&
          response.data &&
          response.data.message
        ) {
          this.snackbar.success(response.data.message);
          await this.listingService.updateToSuperHost(this.data.listingId);
          if (this.data.isEditing) {
            this.dialogRef.close(payload);
          } else {
            this.dialogRef.close(true);
          }
        }
      }
    });
  }
}
