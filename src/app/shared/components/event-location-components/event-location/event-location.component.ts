import { Component, Input, Output, EventEmitter } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { LocationModel } from 'src/app/models/location.model';
import { ConfirmDialogComponent } from '../../confirm-dialog/confirm-dialog.component';
import { Locations } from 'src/app/constants/locations';

@Component({
  selector: 'app-event-location',
  templateUrl: './event-location.component.html',
  styleUrls: [
    './event-location.component.scss',
    '../event-locations/event-locations.component.scss',
  ],
})
export class EventLocationComponent {
  @Input() location: LocationModel = Locations.eventLocation;
  @Input({ required: true }) isEditingData = false;

  @Output() deleteLocationEmiiter = new EventEmitter<number | null>();

  constructor(
    public dialogRef: MatDialogRef<ConfirmDialogComponent>,
    private dialog: MatDialog
  ) { }

  onDeleteLocation(id: number): void {
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

    dialogRef.afterClosed().subscribe((dialogResult) => {
      if (dialogResult === true) {
        this.deleteLocationEmiiter.emit(id);
      }
    });
  }

  getRoute(data: LocationModel): string {
    return (
      '/book/' +
      data.title?.toLowerCase()?.split(' ')?.join('-') +
      '/' +
      btoa(String(data.id)) +
      '/events'
    );
  }
}
