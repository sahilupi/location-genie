import { Component, Input } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { EditEventsComponent } from '../../../edit-home-components/edit-events/edit-events.component';
import { SnackBarService } from 'src/app/services/snack-bar.service';
import { Types } from 'src/app/constants/types.constant';
import { LocationModel } from 'src/app/models/location.model';
import { HomeService } from 'src/app/services/home.service';
import { LocationCategory } from 'src/app/constants/location-types.constant';
import { SpaceCategoryModel } from 'src/app/models/home-edit.model';
import { Locations } from 'src/app/constants/locations';
import { SuccessConstant } from 'src/app/constants/success.constant';
import { EventList } from 'src/app/models/event.model';

@Component({
  selector: 'app-event-locations',
  templateUrl: './event-locations.component.html',
  styleUrls: ['./event-locations.component.scss'],
})
export class EventLocationsComponent {
  @Input() isEditingData = false;
  @Input() locations: LocationModel[];
  @Input() header = Locations.eventLocationHeader;
  @Input() subHeader = Locations.eventLocationSubHeader;
  @Input({ required: true }) allActivities: EventList[] = [];
  @Input({ required: true }) popularActivities: EventList[] = [
    ...Locations.popularActivities,
  ];
  occupiedPositions: number[];

  constructor(
    public dialogRef: MatDialogRef<EditEventsComponent>,
    private dialog: MatDialog,
    private snackbar: SnackBarService,
    private homeService: HomeService
  ) {}

  onEditLocations(): void {
    let positions = [0];
    if (this.locations) {
      positions = this.locations.map((location) => {
        return location.position;
      });
    }
    const locations = this.locations.filter((loc) => loc.position !== 0);
    const data = {
      locations: locations,
      header: this.header,
      subHeader: this.subHeader,
      type: Types.LOCALHOST_EVENT_TYPE,
      isEditingData: true,
      positions: positions,
      max: 6,
      allActivities: [...this.allActivities],
    };

    const dialogRef = this.dialog.open(EditEventsComponent, {
      width: '600px',
      data: data,
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe(async (res) => {
      if (res && res.length > 0) {
        const response = await this.homeService.getTilesDataByType(
          Types.LOCALHOST_EVENT_TYPE
        );
        const eventLocations = response.data;
        if (
          eventLocations &&
          eventLocations.length > 0 &&
          eventLocations?.at(-1)?.header
        ) {
          this.header = eventLocations?.at(-1)?.header;
          this.subHeader = eventLocations?.at(-1)?.subHeader;
        }

        const positions = eventLocations.map((loc: SpaceCategoryModel) => {
          if (loc.imagePath) {
            loc.imageUrl = loc.imagePath.imageFullPath;
          }
          return loc.position;
        });

        this.locations = [];
        for (let i = 1; i <= 6; i++) {
          if (positions.some((el: number) => el === i)) {
            const location = eventLocations.find(
              (loc: SpaceCategoryModel) => loc.position === i
            );
            this.locations[i - 1] = location;
          } else {
            this.locations.push(LocationCategory.dummyLocation);
          }
        }

        // this.header = res ? res.at(-1).header : this.header;
        // this.subHeader = res ? res.at(-1).subHeader : this.subHeader;
        // if (!this.locations) {
        //   this.locations = [];
        // }
        // {
        //   const positions = res.map((loc: SpaceCategoryModel, i: number) => {
        //     if (!loc.imagePath) {
        //       if (loc.position) {
        //         loc.imageUrl = this.locations[i + 1].imageUrl;
        //       }
        //     }
        //     if (loc.imagePath) {
        //       loc.imageUrl = loc.imagePath.imageFullPath;
        //     }
        //     return loc.position;
        //   });

        //   for (let i = 1; i <= 6; i++) {
        //     if (positions.some((el: number) => el === i)) {
        //       const destination = res.find((loc: any) => {
        //         if (loc.imagePath) {
        //           loc.imageUrl = loc.imagePath.imageFullPath;
        //         }
        //         return loc.position === i;
        //       });
        //       this.locations[i - 1] = destination;
        //     } else {
        //       this.locations[i - 1] = LocationCategory.dummyLocation;
        //     }
        //   }
        // }
        this.snackbar.success(SuccessConstant.LOCATION_UPDATE);
      }
    });
  }

  onAddLocations(): void {
    let positions = [0];
    if (this.locations) {
      positions = this.locations.map((location) => {
        return location.position;
      });
    }

    const dialogRef = this.dialog.open(EditEventsComponent, {
      width: '600px',
      data: {
        type: Types.LOCALHOST_EVENT_TYPE,
        isEditingData: false,
        positions: positions,
        max: 6,
        allActivities: [...this.allActivities],
      },
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((res) => {
      if (res && res.length > 0) {
        this.header = res.header ? res.header : this.header;
        this.subHeader = res.subHeader ? res.subHeader : this.subHeader;
        if (!this.locations) {
          this.locations = [];
        }
        {
          const positions = res.map((loc: SpaceCategoryModel) => {
            if (loc.imagePath) {
              loc.imageUrl = loc.imagePath.imageFullPath;
            }
            return loc.position;
          });

          for (let i = 0; i <= 6; i++) {
            if (positions.some((el: number) => +el === i)) {
              const location = res.find(
                (loc: SpaceCategoryModel) => loc.position === i
              );
              this.locations[i - 1] = location;
            }
          }
        }
      }
    });
  }

  async onDeleteLocation(id: number | null): Promise<void> {
    const response = await this.homeService.deleteProfessionalLocation(id);
    if (response && response.data && response.success) {
      this.locations[+response.data.position - 1] =
        LocationCategory.dummyLocation;
      this.snackbar.success(SuccessConstant.DELETE_SUCCESS);
    }
  }

  isShowingEditButton(): number {
    const arr = this.locations?.filter(
      (loc) => loc.id !== null && loc.id !== 0
    );
    return arr?.length;
  }

  getOccupiedPositions(): number {
    let positions: number[] = [];
    if (this.locations) {
      positions = this.locations.map((location) => {
        return location.position;
      });
    }
    this.occupiedPositions = positions.filter(
      (pos: number) => pos !== null && pos !== 0
    );
    return this.occupiedPositions.length;
  }
}
