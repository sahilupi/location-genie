import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnDestroy,
} from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Locations } from 'src/app/constants/locations';
import { LocationList } from 'src/app/models/location.model';
import { EditPopularLocationComponent } from '../../../edit-home-components/edit-popular-location/edit-popular-location.component';
import { SnackBarService } from 'src/app/services/snack-bar.service';
import { TitleModel } from 'src/app/models/title.model';
import { Spaces } from 'src/app/constants/spaces.constant';
import { SuccessConstant } from 'src/app/constants/success.constant';
import { SharedService } from 'src/app/services/shared.service';
import { Subscription } from 'rxjs';
import { ProjectService } from 'src/app/services/project.service';

@Component({
  selector: 'app-popular-locations',
  templateUrl: './popular-locations.component.html',
  styleUrls: ['./popular-locations.component.scss'],
})
export class PopularLocationsComponent implements OnDestroy {
  @Input({ required: true }) locations: LocationList[];
  @Input({ required: true }) title = Spaces.popularLocationTitle;
  @Input({ required: true }) subTitle = Spaces.popularLocationSubTitle;
  @Input() isEditingData = false;

  @Output() editTitleEmiiter = new EventEmitter<TitleModel>();

  dummyImage = 'assets/images/dummy/default_image.png';
  selectedProjectListings: number[] = [];
  selectedProjectListingSub$: Subscription;

  constructor(
    public dialogRef: MatDialogRef<EditPopularLocationComponent>,
    private dialog: MatDialog,
    private snackbar: SnackBarService,
    private sharedService: SharedService,
    private projectService: ProjectService
  ) {
    if (this.projectService.selectedProjectListings.length > 0) {
      this.selectedProjectListings =
        this.projectService.selectedProjectListings;
    } else {
      this.selectedProjectListingSub$ = this.sharedService
        .getSelectedProjectListings()
        .subscribe((res) => {
          this.selectedProjectListings = res;
        });
    }
  }

  onUpdatePostions(): void {
    const dialogRef = this.dialog.open(EditPopularLocationComponent, {
      width: '900px',
      data: { locations: this.locations },
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((res) => {
      if (res) {
        const data = res;
        data.map((listing: LocationList) => {
          listing.images = [];
          listing.image = listing.image ? listing.image : this.dummyImage;
          const listingImages = listing.listingImagePathIds?.sort(
            (a, b) => b.coverImagePathId - a.coverImagePathId
          );
          listingImages?.map((imagePathId) => {
            listing.images.push(imagePathId.imagePath.imageFullPath);
          });
        });
        this.locations = data;
        if (this.locations.length < 10) {
          const length = 10 - this.locations.length;
          for (let i = 1; i <= length; i++) {
            this.locations.push(Locations.locatoinsList[0]);
          }
        }
        this.snackbar.success(SuccessConstant.LOCATION_UPDATE);
      }
    });
  }

  onEditTitle(data: TitleModel): void {
    this.editTitleEmiiter.emit(data);
  }

  ngOnDestroy(): void {
    this.selectedProjectListingSub$?.unsubscribe();
  }
}
