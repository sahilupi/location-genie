import { Component, Input } from '@angular/core';
import { EditHomeBannerComponent } from '../../edit-home-components/edit-home-banner/edit-home-banner.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { SnackBarService } from 'src/app/services/snack-bar.service';
import { BannerModel } from 'src/app/models/home-edit.model';
import { SuccessConstant } from 'src/app/constants/success.constant';
import { EventList } from 'src/app/models/event.model';
import { Locations } from 'src/app/constants/locations';

@Component({
  selector: 'app-banner',
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.scss'],
})
export class BannerComponent {
  @Input({ required: true }) bannerData: BannerModel;
  @Input() isActivitySearch: boolean = false;
  @Input() bannerImage = 'assets/images/home/hero-banner.png';
  @Input() isEditingData = false;
  @Input({ required: true }) allActivities: EventList[] = [];
  @Input({ required: true }) popularActivities: EventList[] = [
    ...Locations.popularActivities,
  ];

  constructor(
    public dialogRef: MatDialogRef<EditHomeBannerComponent>,
    private dialog: MatDialog,
    private snackbar: SnackBarService
  ) {}

  onEditBanner(): void {
    const dialogRef = this.dialog.open(EditHomeBannerComponent, {
      width: '600px',
      data: {
        bannerData: { ...this.bannerData },
        isEditing: this.bannerData.bannerId ? true : false,
      },
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((res) => {
      if (res) {
        this.bannerData = {
          bannerId: res.id,
          text: res.text,
          linkText: res.linkText,
          link: res.link,
          type: res.type,
          typeName: res.typeName,
          title: res.title ? res.title : this.bannerData.title,
          imageUrl:
            res.imagePath && res.imagePath.imageFullPath
              ? res.imagePath.imageFullPath
              : this.bannerImage,
        };
        this.snackbar.success(SuccessConstant.BANNER_UPDATE);
      }
    });
  }
}
