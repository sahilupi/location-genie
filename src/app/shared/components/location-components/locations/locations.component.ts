import { Component, Input } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { EditEventsComponent } from '../../../edit-home-components/edit-events/edit-events.component';
import { SnackBarService } from 'src/app/services/snack-bar.service';
import { Types } from 'src/app/constants/types.constant';
import { LocationCategory } from 'src/app/constants/location-types.constant';
import { HomeService } from 'src/app/services/home.service';
import { SpaceCategoryModel } from 'src/app/models/home-edit.model';
import { LocationModel } from 'src/app/models/location.model';
import { SuccessConstant } from 'src/app/constants/success.constant';
import { EventList } from 'src/app/models/event.model';
import { Locations } from 'src/app/constants/locations';

@Component({
  selector: 'app-locations',
  templateUrl: './locations.component.html',
  styleUrls: ['./locations.component.scss'],
})
export class LocationsComponent {
  @Input() isEditingData = false;
  @Input() header = LocationCategory.header;
  @Input() subHeader = LocationCategory.subHeader;
  @Input() locations: LocationModel[] = [];
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

  onEditEvents(): void {
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
      type: Types.PROFESSIONAL_EVENT_TYPE,
      isEditingData: true,
      positions: positions,
      max: 2,
      allActivities: [...this.allActivities],
    };
    const dialogRef = this.dialog.open(EditEventsComponent, {
      width: '600px',
      data: data,
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe(async (res) => {
      if (res) {
        if (res && res.length > 0) {
          const response = await this.homeService.getTilesDataByType(
            Types.PROFESSIONAL_EVENT_TYPE
          );
          const professionalLocations = response.data;
          if (
            professionalLocations &&
            professionalLocations.length > 0 &&
            professionalLocations?.at(-1)?.header
          ) {
            this.header = professionalLocations?.at(-1)?.header;
          }
          if (
            professionalLocations &&
            professionalLocations.length > 0 &&
            professionalLocations?.at(-1)?.subHeader
          ) {
            this.subHeader = professionalLocations?.at(-1)?.subHeader;
          }
          this.locations = [];
          const positions = professionalLocations.map(
            (loc: SpaceCategoryModel) => {
              if (loc.imagePath) {
                loc.imageUrl = loc.imagePath.imageFullPath;
              }
              return loc.position;
            }
          );

          for (let i = 1; i <= 2; i++) {
            if (positions.some((el: number) => el === i)) {
              const location = professionalLocations.find(
                (loc: LocationModel) => loc.position === i
              );
              this.locations[i - 1] = location;
            } else {
              this.locations.push(LocationCategory.dummyLocation);
            }
          }
          this.snackbar.success(SuccessConstant.LOCATION_UPDATE);
        }
      }
    });
  }

  onAddDestinations(): void {
    let positions = [0];
    if (this.locations) {
      positions = this.locations.map((location) => {
        return location.position;
      });
    }
    const dialogRef = this.dialog.open(EditEventsComponent, {
      width: '600px',
      data: {
        type: Types.PROFESSIONAL_EVENT_TYPE,
        isEditingData: false,
        positions: positions,
        max: 2,
        allActivities: [...this.allActivities],
      },
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((res) => {
      if (res && res.length > 0) {
        if (!this.locations) {
          this.locations = [];
        }
        {
          const positions = res.map((loc: SpaceCategoryModel, i: number) => {
            if (!loc.imagePath) {
              if (loc.position) {
                loc.imageUrl = this.locations[i + 1].imageUrl;
              }
            }
            if (loc.imagePath) {
              loc.imageUrl = loc.imagePath.imageFullPath;
            }
            return loc.position;
          });

          for (let i = 1; i <= 2; i++) {
            if (positions.some((el: number) => el === i)) {
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
      this.locations[response.data.position - 1] =
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
