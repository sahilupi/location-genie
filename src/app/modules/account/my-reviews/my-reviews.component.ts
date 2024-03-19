import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ErrorConstant } from 'src/app/constants/error.constant';
import { UserListingReview } from 'src/app/models/location.model';
import { CommonService } from 'src/app/services/common.service';
import { AddReviewComponent } from '../../bookings/add-review/add-review.component';
import { SnackBarService } from 'src/app/services/snack-bar.service';
import { Pagination } from 'src/app/models/common.model';
import { PersonalInfoService } from 'src/app/services/personal-info.service';
import { SpinnerService } from 'src/app/services/spinner.service';

@Component({
  selector: 'app-my-reviews',
  templateUrl: './my-reviews.component.html',
  styleUrls: ['./my-reviews.component.scss'],
})
export class MyReviewsComponent implements OnInit {
  listingId = 0;
  reviewsTotolCount = 0;
  reviews: UserListingReview[] = [];
  pagination: Pagination = {
    pageNumber: 1,
    pageSize: 5,
  };
  isLoading = false;

  constructor(
    protected commonService: CommonService,
    private dialog: MatDialog,
    private snackbar: SnackBarService,
    private personalInfoService: PersonalInfoService,
    private spinner: SpinnerService
  ) {}

  async ngOnInit(): Promise<void> {
    this.spinner.show();
    this.isLoading = true;
    try {
      await this.getAllReviews();
      this.spinner.hide();
      this.isLoading = false;
    } catch (error) {
      this.spinner.hide();
      this.isLoading = false;
    }
  }

  private async getAllReviews(): Promise<void> {
    const response = await this.personalInfoService.getAllReviewsByUser();
    if (
      response &&
      response.success &&
      response.data &&
      response.data.length > 0
    ) {
      this.reviews = [...response.data];
    }
  }

  protected onAddUpdateReview(
    listingId: number,
    isEditing: boolean,
    reviewId?: number
  ): void {
    if (isEditing) {
      const foundReview = this.reviews.find(
        (review) => review.reviewId === reviewId
      );
      if (foundReview) {
        const review = {
          commentText: foundReview.userReview,
          rating: foundReview.userRating,
          id: foundReview.reviewId,
        };
        const dialogData = {
          listingId,
          isEditing,
          review: review,
        };

        const dialogRef = this.dialog.open(AddReviewComponent, {
          width: '600px',
          data: dialogData,
          disableClose: true,
        });
        dialogRef.afterClosed().subscribe(async (dialogRes) => {
          if (isEditing && dialogRes) {
            const reviewIdx = this.reviews.findIndex(
              (review) => review.reviewId === reviewId
            );
            if (reviewIdx >= 0) {
              this.reviews[reviewIdx] = {
                ...this.reviews[reviewIdx],
                userReview: dialogRes.commentText,
                userRating: dialogRes.rating,
              };
            }
          }
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
        // await this.getListingReviewsByUser(this.listingId);
      });
    }
  }

  protected async loadMoreReviews(): Promise<void> {
    this.pagination = {
      ...this.pagination,
      pageNumber: this.pagination.pageNumber + 1,
    };

    // const response = await this.listingService.getListingReviewsByUser(
    //   Number(this.listingId),
    //   this.pagination
    // );
    // if (
    //   response &&
    //   response.success &&
    //   response &&
    //   response.data &&
    //   response.data.length
    // ) {
    //   response.data.forEach(
    //     (data: {
    //       reviews: ListingReview;
    //       firstName: string;
    //       lastName: string;
    //       profilePic: string;
    //       email: string;
    //     }) => {
    //       this.reviews.push({
    //         ...data.reviews,
    //         firstName: data.firstName,
    //         email: data.email,
    //         lastName: data.lastName,
    //         userImg: data.profilePic,
    //       });
    //     }
    //   );
    // }
  }

  getEncodedListingId(listingId: number): string {
    return btoa(String(listingId));
  }
}
