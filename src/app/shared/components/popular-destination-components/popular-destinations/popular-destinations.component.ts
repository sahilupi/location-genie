import { Component, Input } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { EditEventsComponent } from '../../../edit-home-components/edit-events/edit-events.component';
import { SnackBarService } from 'src/app/services/snack-bar.service';
import { LocationModel } from 'src/app/models/location.model';
import { Types } from 'src/app/constants/types.constant';
import { SpaceCategoryModel } from 'src/app/models/home-edit.model';
import { HomeService } from 'src/app/services/home.service';
import { LocationCategory } from 'src/app/constants/location-types.constant';
import { Locations } from 'src/app/constants/locations';
import { SuccessConstant } from 'src/app/constants/success.constant';
import { EventList } from 'src/app/models/event.model';

@Component({
  selector: 'app-popular-destinations',
  templateUrl: './popular-destinations.component.html',
  styleUrls: ['./popular-destinations.component.scss'],
})
export class PopularDestinationsComponent {
  @Input() isEditingData = false;
  @Input() header = Locations.popularDestinationHeader;
  @Input() destinations: LocationModel[] = [];
  @Input({ required: true }) allActivities: EventList[] = [];
  @Input({ required: true }) popularActivities: EventList[] = [
    ...Locations.popularActivities,
  ];

  occupiedPositions: number[];
  dummyLocation = LocationCategory.dummyLocation;

  constructor(
    public dialogRef: MatDialogRef<EditEventsComponent>,
    private dialog: MatDialog,
    private snackbar: SnackBarService,
    private homeService: HomeService
  ) {}

  onEditDestinations(): void {
    let positions = [0];
    if (this.destinations) {
      positions = this.destinations.map((location) => {
        return location.position;
      });
    }
    const locations = this.destinations.filter((loc) => loc.position !== 0);
    const data = {
      locations: locations,
      header: this.header,
      type: Types.POPULAR_DESTINATIONS_EVENT_TYPE,
      isEditingData: true,
      positions: positions,
      max: 4,
      allActivities: [...this.allActivities],
    };
    const dialogRef = this.dialog.open(EditEventsComponent, {
      width: '600px',
      data: data,
      disableClose: true,
    });

    // dialogRef.afterClosed().subscribe((res) => {
    //   if (res && res.length > 0) {
    //     this.header = res.at(-1).header ? res.at(-1).header : this.header;
    //     if (!this.destinations) {
    //       this.destinations = [];
    //     }
    //     {
    //       const positions = res.map((loc: SpaceCategoryModel, i: number) => {
    //         if (!loc.imagePath) {
    //           if (loc.position) {
    //             loc.imageUrl = this.destinations[i + 1].imageUrl;
    //           }
    //         }
    //         if (loc.imagePath) {
    //           loc.imageUrl = loc.imagePath.imageFullPath;
    //         }
    //         return loc.position;
    //       });

    //       for (let i = 0; i <= 4; i++) {
    //         if (positions.some((el: number) => el === i)) {
    //           const destination = res.find(
    //             (loc: SpaceCategoryModel, i: number) => {
    //               return loc.position === i;
    //             }
    //           );
    //           this.destinations[i - 1] = destination;
    //         } else {
    //           this.destinations[i - 1] = this.dummyLocation;
    //         }
    //       }
    //     }
    //     this.snackbar.success(SuccessConstant.LOCATION_UPDATE);
    //   }
    // });

    dialogRef.afterClosed().subscribe(async (res) => {
      if (res) {
        if (res && res.length > 0) {
          const response = await this.homeService.getTilesDataByType(
            Types.POPULAR_DESTINATIONS_EVENT_TYPE
          );

          const destinations = response.data;
          if (
            destinations &&
            destinations.length > 0 &&
            destinations.at(-1).header
          ) {
            this.header = destinations?.at(-1)?.header;
          }
          const positions = destinations.map((loc: SpaceCategoryModel) => {
            if (loc.imagePath) {
              loc.imageUrl = loc.imagePath.imageFullPath;
            }
            return loc.position;
          });

          this.destinations = [];
          for (let i = 1; i <= 4; i++) {
            if (positions.some((el: number) => el === i)) {
              const location = destinations.find(
                (loc: SpaceCategoryModel) => loc.position === i
              );
              this.destinations[i - 1] = location;
            } else {
              this.destinations.push(this.dummyLocation);
            }
          }
          this.snackbar.success(SuccessConstant.LOCATION_UPDATE);
        }
      }
    });
  }

  onAddDestinations(): void {
    let positions = [0];
    if (this.destinations) {
      positions = this.destinations.map((location) => {
        return location.position;
      });
    }
    const dialogRef = this.dialog.open(EditEventsComponent, {
      width: '600px',
      data: {
        type: Types.POPULAR_DESTINATIONS_EVENT_TYPE,
        isEditingData: false,
        positions: positions,
        max: 4,
        allActivities: [...this.allActivities],
      },
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((res) => {
      if (res && res.length > 0) {
        if (!this.destinations) {
          this.destinations = [];
        }
        {
          const positions = res.map((loc: SpaceCategoryModel) => {
            if (loc.imagePath) {
              loc.imageUrl = loc.imagePath.imageFullPath;
            }
            return loc.position;
          });

          for (let i = 1; i <= 4; i++) {
            if (positions.some((el: number) => el === i)) {
              const location = res.find((loc: SpaceCategoryModel) => {
                return loc.position === i;
              });
              this.destinations[i - 1] = location;
            }
          }
        }
      }
    });
  }

  async onDeleteDestination(id: number | null): Promise<void> {
    const response = await this.homeService.deleteProfessionalLocation(id);
    if (response && response.data && response.success) {
      this.destinations[+response.data.position - 1] = this.dummyLocation;

      this.snackbar.success(SuccessConstant.DELETE_SUCCESS);
    }
  }

  isShowingEditButton(): number {
    const arr = this.destinations?.filter(
      (loc) => loc?.id !== null && loc?.id !== 0
    );
    return arr?.length;
  }

  getOccupiedPositions(): number {
    let positions: number[] = [];
    if (this.destinations) {
      positions = this.destinations.map((location) => {
        return location?.position;
      });
    }
    this.occupiedPositions = positions.filter(
      (pos: number) => pos !== null && pos !== 0
    );
    return this.occupiedPositions.length;
  }
}
