import { Component, Input, Output, EventEmitter } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../confirm-dialog/confirm-dialog.component';
import { SpaceCategoryModel } from 'src/app/models/home-edit.model';

@Component({
  selector: 'app-space',
  templateUrl: './space.component.html',
  styleUrls: ['./space.component.scss'],
})
export class SpaceComponent {
  @Input() data: SpaceCategoryModel;
  @Input() isEditingData = false;
  @Input() type: string;

  @Output() deleteSpaceEmiiter = new EventEmitter<number | null>();
  @Output() editSpaceEmiiter = new EventEmitter<SpaceCategoryModel>();

  constructor(
    public dialogRef: MatDialogRef<ConfirmDialogComponent>,
    private dialog: MatDialog
  ) { }

  onEditSpace(data: SpaceCategoryModel): void {
    this.editSpaceEmiiter.emit(data);
  }

  onDeleteSpace(id: number | null): void {
    const dialogData = {
      title: 'Confirm Delete?',
      message: 'Are you sure you want to delete?',
      cancelBtnText: 'Cancel',
      confirmBtnText: 'Delete',
      isDeleting: true,
    };

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '450px',
      data: { ...dialogData },
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((dialogResult) => {
      if (dialogResult === true) {
        this.deleteSpaceEmiiter.emit(id);
      }
    });
  }

  getRoute(data: SpaceCategoryModel): string {
    return (
      '/book/' +
      data.text?.toLowerCase()?.split(' ')?.join('-') +
      '/' +
      btoa(String(data.id)) +
      '/spaces'
    );
  }
}
