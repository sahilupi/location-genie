import { Component, Input, EventEmitter, Output } from '@angular/core';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { NgxCarousalOptions } from 'src/app/constants/ngx-carousal-options';
import { EditSpaceComponent } from '../../../edit-home-components/edit-space/edit-space.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { SnackBarService } from 'src/app/services/snack-bar.service';
import { SpaceCategoryModel } from 'src/app/models/home-edit.model';
import { HomeService } from 'src/app/services/home.service';
import { Spaces } from 'src/app/constants/spaces.constant';
import { TitleModel } from 'src/app/models/title.model';
import { SuccessConstant } from 'src/app/constants/success.constant';
import { EventList } from 'src/app/models/event.model';
import { Locations } from 'src/app/constants/locations';

@Component({
  selector: 'app-spaces',
  templateUrl: './spaces.component.html',
  styleUrls: ['./spaces.component.scss'],
})
export class SpacesComponent {
  @Input({ required: true }) spaces: SpaceCategoryModel[] = [];
  @Input({ required: true }) type: string;
  @Input({ required: true }) title = Spaces.sourceSpaceTitle;
  @Input() isEditingData = false;
  @Input({ required: true }) allActivities: EventList[] = [];
  @Input({ required: true }) popularActivities: EventList[] = [
    ...Locations.popularActivities,
  ];

  @Output() deleteSpaceEmitter = new EventEmitter<number>();
  @Output() editTitleEmiiter = new EventEmitter<TitleModel>();

  dummySpace = Spaces.dummySpace;
  customOptions: OwlOptions = NgxCarousalOptions.spaceCustomOptions;
  occupiedPositions: number[];

  constructor(
    public dialogRef: MatDialogRef<EditSpaceComponent>,
    private dialog: MatDialog,
    private snackbar: SnackBarService,
    private homeService: HomeService
  ) {}

  onAddLocation(): void {
    const positions = this.spaces.map((space) => space.position);
    const modData = {
      type: this.type,
      typeName: this.type,
      positions: [...positions],
      allActivities: [...this.allActivities],
    };
    const dialogRef = this.dialog.open(EditSpaceComponent, {
      width: '600px',
      data: modData,
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((res) => {
      if (res && res.text) {
        if (!this.spaces) {
          this.spaces = [];
        }
        res.imageUrl = res.imagePath.imageFullPath;
        this.spaces[+res.position - 1] = res;
        this.snackbar.success(SuccessConstant.EVENT_ADDED);
      }
    });
  }

  async onDeleteSpace(id: number | null): Promise<void> {
    const response = await this.homeService.deleteSourceSpace(id);
    if (response && response.data && response.success) {
      this.spaces[+response.data.position - 1] = this.dummySpace;
      this.snackbar.success(SuccessConstant.DELETE_SUCCESS);
    }
  }

  onEditSpaceTitle(data: TitleModel): void {
    this.editTitleEmiiter.emit(data);
  }

  onEditSpace(data: SpaceCategoryModel): void {
    const positions = this.spaces.map((space) => space.position);
    const modData = {
      ...data,
      type: this.type,
      positions: [...positions],
      allActivities: [...this.allActivities],
    };
    const dialogRef = this.dialog.open(EditSpaceComponent, {
      width: '600px',
      data: modData,
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((res) => {
      if (res) {
        const updatedSpaceIndex = this.spaces.findIndex(
          (space) => space.id === res.id
        );
        if (updatedSpaceIndex >= 0) {
          this.spaces[updatedSpaceIndex] = this.dummySpace;
        }
        res.imageUrl = res.imagePath.imageFullPath;
        this.spaces[+res.position - 1] = res;
        this.snackbar.success(SuccessConstant.EVENT_UPDATED);
      }
    });
  }

  getOccupiedPositions(): number {
    let positions: number[] = [];
    if (this.spaces) {
      positions = this.spaces.map((space) => Number(space.position));
    }
    this.occupiedPositions = positions.filter(
      (pos: number) => pos !== null && pos !== 0
    );
    return this.occupiedPositions.length;
  }
}
