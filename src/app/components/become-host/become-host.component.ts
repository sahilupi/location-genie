import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router, RouterModule } from '@angular/router';
import { BecomeHost } from 'src/app/constants/become-host';
import { Types } from 'src/app/constants/types.constant';
import { EditTitleService } from 'src/app/services/edit-title.service';
import { EditHostBannerComponent } from 'src/app/shared/edit-become-host-components/edit-host-banner/edit-host-banner.component';
import { EditPhotoshootsComponent } from 'src/app/shared/edit-become-host-components/edit-photoshoots/edit-photoshoots.component';
import { EditTitleComponent } from 'src/app/shared/edit-home-components/edit-title/edit-title.component';
import { HostService } from 'src/app/services/host.service';
import { SnackBarService } from 'src/app/services/snack-bar.service';
import { ConfirmDialogComponent } from 'src/app/shared/components/confirm-dialog/confirm-dialog.component';
import { Tiles } from 'src/app/models/home-edit.model';
import { LocationModel } from 'src/app/models/location.model';
import { StepsModel } from 'src/app/models/become-host.model';
import { TitleModel } from 'src/app/models/title.model';
import { SuccessConstant } from 'src/app/constants/success.constant';
import { CommonModule } from '@angular/common';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-become-host',
  templateUrl: './become-host.component.html',
  styleUrls: ['./become-host.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule],
})
export class BecomeHostComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() data: Tiles;

  @Output() deletePhotoEmiiter = new EventEmitter<number | null>();
  bannerData = BecomeHost.bannerData;
  photoshoots = BecomeHost.photoShoots;
  dummyPhotoshoots = BecomeHost.photoShoots;
  header = BecomeHost.header;
  step1Header = BecomeHost.step1Header;
  step2Header: string | undefined = BecomeHost.step2Header;
  step3Header = BecomeHost.step3Header;
  step1: StepsModel[] = BecomeHost.step1;
  step1Dummy: StepsModel[] = BecomeHost.step1;
  step2: StepsModel[] = BecomeHost.step2;
  step2Dummy: StepsModel[] = BecomeHost.step2;
  step3: StepsModel[] = BecomeHost.step3;
  step3Dummy: StepsModel[] = BecomeHost.step3;
  workStepsHeader: TitleModel = BecomeHost.workStepsHeader;
  getStartedHeader: TitleModel = BecomeHost.getStartedHeader;
  dummyPhotoshoot = BecomeHost.dummyPhotoshoot;
  occupiedPositions: number[];
  isEditingData = false;
  isImageRequired = true;

  constructor(
    private router: Router,
    public dialogRef: MatDialogRef<EditHostBannerComponent>,
    private dialog: MatDialog,
    private titleService: EditTitleService,
    private snackbar: SnackBarService,
    private hostService: HostService,
    private sharedService: SharedService
  ) {}

  async ngOnInit(): Promise<void> {
    this.isEditingData = this.router.url.includes('edit') ? true : false;
    await this.getAllHostData();
    // await this.getWorkTitle();
    // await this.getStartedTitle();
  }

  ngAfterViewInit(): void {
    this.sharedService.setStickyHeader(true);
  }

  isShowingAddBtn(type: string): number {
    switch (type) {
      case 'photoshoots':
        const photoshoots = this.photoshoots.filter((photoshoot) => {
          if (photoshoot) return photoshoot.id !== 0 && photoshoot.id !== null;
          else return [];
        });
        const modifiedPhotos = photoshoots.filter(
          (photoshoot) => photoshoot !== undefined
        );
        return modifiedPhotos.length;

      case 'step1':
        const step1 = this.step1.filter((data) => {
          if (data) return data.id !== 0 && data.id !== null;
          else return [];
        });
        const modifiedstep1 = step1.filter(
          (photoshoot) => photoshoot !== undefined
        );
        return modifiedstep1.length;

      case 'step2':
        const step2 = this.step2.filter((data) => {
          if (data) return data.id !== 0 && data.id !== null;
          else return [];
        });
        const modifiedstep2 = step2.filter(
          (photoshoot) => photoshoot !== undefined
        );
        return modifiedstep2.length;

      case 'step3':
        const step3 = this.step3.filter((data) => {
          if (data) return data.id !== 0 && data.id !== null;
          else return [];
        });
        const modifiedstep3 = step3.filter(
          (photoshoot) => photoshoot !== undefined
        );
        return modifiedstep3.length;

      default:
        return 0;
    }
  }

  private async getWorkTitle(): Promise<void> {
    const response = await this.titleService.getTitle(Types.WORK_HEADER_TYPE);
    if (response && response.data && response.data.length > 0) {
      const data = response.data.at(-1);
      this.workStepsHeader.categoryId = data.id;
      this.workStepsHeader.type = data.type;
      this.workStepsHeader.typeName = data.typeName;
    }
  }

  private async getStartedTitle(): Promise<void> {
    const response = await this.titleService.getTitle(
      Types.GET_STARTED_HEADER_TYPE
    );
    if (response && response.data && response.data.length > 0) {
      const data = response.data.at(-1);
      this.getStartedHeader.categoryId = data.id;
      this.getStartedHeader.type = data.type;
      this.getStartedHeader.typeName = data.typeName;
    }
  }

  async onGetHostBanner(data: LocationModel[]): Promise<void> {
    if (data && data.length > 0) {
      const modifiedData = data[data.length - 1];
      this.bannerData.id = modifiedData.id;
      this.bannerData.title = modifiedData.title;
      this.bannerData.description = modifiedData.description;
      this.bannerData.imageUrl = String(modifiedData.imagePath?.imageFullPath);
      this.bannerData.link = modifiedData.link;
    }
  }

  private async getAllHostData(): Promise<void> {
    const response = await this.hostService.getAllHostData();
    if (response && response.data && response.data.length > 0) {
      // for Banner
      const banner = response.data.filter(
        (item: LocationModel) => item.type === Types.HOST_BANNER_TYPE
      );
      this.onGetHostBanner(banner);

      // for photoshoots
      const photoshoots = response.data.filter(
        (item: StepsModel) => item.type === Types.HOST_PHOTOS_TYPE
      );
      this.header =
        photoshoots.at(-1) && photoshoots.at(-1).header
          ? photoshoots.at(-1).header
          : this.header;
      const positions = photoshoots.map((item: StepsModel) => {
        if (item.imagePath) {
          item.imageUrl = item.imagePath.imageFullPath;
        }
        return item.position;
      });

      this.photoshoots = [];
      for (let i = 1; i <= 3; i++) {
        if (positions.some((el: number) => el === i)) {
          const photoshoot = photoshoots.find(
            (item: StepsModel) => item.position === i
          );
          this.photoshoots[i - 1] = photoshoot;
        } else {
          this.photoshoots.push(BecomeHost.photoShoots[i - 1]);
        }
      }

      // for step 1
      this.step1 = [];
      const step1 = response.data.filter((item: StepsModel) => {
        if (item.imagePath) {
          item.imageUrl = item.imagePath.imageFullPath;
        }
        return item.type === Types.STEP1_PHOTOS_TYPE;
      });
      this.step1 = step1;
      this.step1Header =
        step1.at(-1) && step1.at(-1).header
          ? step1.at(-1).header
          : this.step1Header;
      if (this.step1.length < 2) {
        this.step1Dummy = [];
        for (let i = 0; i < 2 - step1.length; i++) {
          this.step1Dummy.push(BecomeHost.step1[i]);
        }
      }

      // for step 2
      this.step2 = [];
      const step2 = response.data.filter((item: StepsModel) => {
        if (item.imagePath) {
          item.imageUrl = item.imagePath.imageFullPath;
        }
        return item.type === Types.STEP2_PHOTOS_TYPE;
      });
      this.step2 = step2;
      this.step2Header =
        step2.at(-1) && step2.at(-1).header
          ? step2.at(-1).header
          : this.step2Header;

      if (this.step2.length < 3) {
        this.step2Dummy = [];
        const length = 3 - step2.length;
        for (let i = 0; i < length; i++) {
          this.step2Dummy.push(BecomeHost.step2[i]);
        }
      }

      // for step 3
      this.step3 = [];
      const step3 = response.data.filter((item: StepsModel) => {
        if (item.imagePath) {
          item.imageUrl = item.imagePath.imageFullPath;
        }
        return item.type === Types.STEP3_PHOTOS_TYPE;
      });
      this.step3 = step3;
      this.step3Header =
        step3.at(-1) && step3.at(-1).header
          ? step3.at(-1).header
          : this.step3Header;

      this.step3Dummy = [];
      if (this.step3.length < 2) {
        const length = 2 - step3.length;
        for (let i = 0; i < length; i++) {
          this.step3Dummy.push(BecomeHost.step3[i]);
        }
      }
    }
  }

  onEditBanner(): void {
    const dialogRef = this.dialog.open(EditHostBannerComponent, {
      width: '600px',
      data: this.bannerData,
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((res) => {
      if (res) {
        this.bannerData = res;
        this.bannerData.imageUrl = res.imagePath.imageFullPath;
      }
    });
  }

  onEditPhotoShoots(): void {
    let positions = [0];
    if (this.photoshoots) {
      positions = this.photoshoots.map((photoshoot) => {
        if (photoshoot) return photoshoot.position;
        else return 0;
      });
    }
    const photoshoots = this.photoshoots.filter((item) => {
      if (item) return item.position !== 0;
      else return [];
    });
    const data = {
      photoshoots: photoshoots,
      header: this.header,
      type: Types.HOST_PHOTOS_TYPE,
      isEditingData: true,
      showPositionInput: true,
      positions: positions,
      max: 3,
    };
    const dialogRef = this.dialog.open(EditPhotoshootsComponent, {
      width: '600px',
      data: data,
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe(async (res) => {
      if (res && res.length > 0) {
        if (!this.photoshoots) {
          this.photoshoots = [];
        }
        const response = await this.hostService.getBecomeHostByType(
          Types.HOST_PHOTOS_TYPE
        );
        const photoshoots = response.data;
        this.header =
          photoshoots.at(-1) && photoshoots.at(-1).header
            ? photoshoots.at(-1).header
            : this.header;
        const positions = photoshoots.map((item: StepsModel) => {
          if (item.imagePath) {
            item.imageUrl = item.imagePath.imageFullPath;
          }
          return item.position;
        });

        this.photoshoots = [];
        for (let i = 1; i <= 3; i++) {
          if (positions.some((el: number) => el === i)) {
            const photoshoot = photoshoots.find(
              (item: StepsModel) => item.position === i
            );
            this.photoshoots[i - 1] = photoshoot;
          } else {
            this.photoshoots.push(BecomeHost.photoShoots[i - 1]);
          }
        }
        this.snackbar.success(SuccessConstant.PHOTOSHOOT_UPDATED);
      }
    });
  }

  onAddHostPhotoshoots(): void {
    let positions = [0];
    if (this.photoshoots) {
      positions = this.photoshoots.map((photoshoot) => {
        if (photoshoot) return photoshoot.position;
        else return 0;
      });
    }
    const dialogRef = this.dialog.open(EditPhotoshootsComponent, {
      width: '600px',
      data: {
        type: Types.HOST_PHOTOS_TYPE,
        isEditingData: false,
        positions: positions,
        showPositionInput: true,
        max: 3,
      },
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((res) => {
      if (res && res.length > 0) {
        if (!this.photoshoots) {
          this.photoshoots = [];
        }
        this.header = res.at(-1).header ? res.at(-1).header : this.header;
        {
          const photoshoots = res.filter(
            (item: StepsModel) => item.type === Types.HOST_PHOTOS_TYPE
          );
          const positions = photoshoots.map((item: StepsModel) => {
            if (item.imagePath) {
              item.imageUrl = item.imagePath.imageFullPath;
            }
            return item.position;
          });
          for (let i = 1; i <= 3; i++) {
            if (positions.some((el: number) => el === i)) {
              const photoshoot = photoshoots.find(
                (item: StepsModel) => item.position === i
              );
              this.photoshoots[i - 1] = photoshoot;
            }
          }
        }
        this.snackbar.success(SuccessConstant.DATA_ADDED);
      }
    });
  }

  onEditStep1(): void {
    const step1Data = this.step1.filter((item) => item.id !== 0);
    const data = {
      photoshoots: step1Data,
      type: Types.STEP1_PHOTOS_TYPE,
      header: this.step1Header,
      isEditingData: true,
      showPositionInput: false,
      max: 2,
    };
    const dialogRef = this.dialog.open(EditPhotoshootsComponent, {
      width: '600px',
      data: data,
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe(async (res) => {
      if (res && res.length > 0) {
        const response = await this.hostService.getBecomeHostByType(
          Types.STEP1_PHOTOS_TYPE
        );
        if (response && response.data && response.data.length > 0) {
          // this.step1 = [];
          const step1 = response.data.map((item: StepsModel) => {
            if (item.imagePath) {
              item.imageUrl = item.imagePath.imageFullPath;
            }
            return item;
          });
          this.step1 = step1;
          this.step1Header =
            step1.at(-1) && step1.at(-1).header
              ? step1.at(-1).header
              : this.step1Header;
          if (this.step1.length < 2) {
            this.step1Dummy = [];
            for (let i = 0; i < 2 - step1.length; i++) {
              this.step1Dummy.push(BecomeHost.step1[i]);
            }
          }
          this.snackbar.success(SuccessConstant.DATA_UPDATED);
        }
      }
    });
  }

  onAddStep1(): void {
    let originalArraydata: StepsModel[] = [];
    if (this.step1) {
      originalArraydata = this.step1.filter((photoshoot) => {
        return photoshoot.id !== null && photoshoot.id !== 0;
      });
    }
    const dialogRef = this.dialog.open(EditPhotoshootsComponent, {
      width: '600px',
      data: {
        type: Types.STEP1_PHOTOS_TYPE,
        isEditingData: false,
        showPositionInput: false,
        header: this.step1Header,
        positions: originalArraydata,
        max: 2,
        title: 'Add Step',
      },
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((res) => {
      if (res && res.length > 0) {
        this.step1Dummy = [];
        if (!this.step1) {
          this.step1 = [];
        }
        res.map((item: StepsModel) => {
          if (item.imagePath) {
            item.imageUrl = item.imagePath.imageFullPath;
          }
          this.step1.push(item);
        });

        if (this.step1.length < 2) {
          for (let i = 1; i <= 2 - this.step1.length; i++) {
            this.step1Dummy.push(this.dummyPhotoshoot);
          }
        }

        this.snackbar.success(SuccessConstant.DATA_ADDED);
      }
    });
  }

  onEditStep2(): void {
    const step2Photos = this.step2.filter((item) => item.id !== 0);
    const data = {
      photoshoots: step2Photos,
      type: Types.STEP2_PHOTOS_TYPE,
      header: this.step2Header,
      isEditingData: true,
      showPositionInput: false,
      max: 3,
    };
    const dialogRef = this.dialog.open(EditPhotoshootsComponent, {
      width: '600px',
      data: data,
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe(async (res) => {
      if (res && res.length > 0) {
        const response = await this.hostService.getBecomeHostByType(
          Types.STEP2_PHOTOS_TYPE
        );
        if (response && response.data && response.data.length > 0) {
          // this.step2 = [];
          const step2 = response.data.map((item: StepsModel) => {
            if (item.imagePath) {
              item.imageUrl = item.imagePath.imageFullPath;
            }
            return item;
          });
          this.step2 = step2;
          this.step2Header =
            step2[step2.length - 1] && step2[step2.length - 1].header
              ? step2[step2.length - 1].header
              : this.step2Header;
          if (this.step2.length < 2) {
            this.step2Dummy = [];
            for (let i = 0; i < 2 - step2.length; i++) {
              this.step2Dummy.push(BecomeHost.step2[i]);
            }
          }
          this.snackbar.success(SuccessConstant.DATA_UPDATED);
        }
      }
    });
  }

  onAddStep2(): void {
    let originalArraydata: StepsModel[] = [];
    if (this.step2) {
      originalArraydata = this.step2.filter((photoshoot) => {
        return photoshoot.id !== null && photoshoot.id !== 0;
      });
    }
    const dialogRef = this.dialog.open(EditPhotoshootsComponent, {
      width: '600px',
      data: {
        type: Types.STEP2_PHOTOS_TYPE,
        isEditingData: false,
        showPositionInput: false,
        header: this.step2Header,
        positions: originalArraydata,
        max: 3,
        title: 'Add Step',
      },
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((res) => {
      if (res && res.length > 0) {
        this.step2Dummy = [];
        if (!this.step2) {
          this.step2 = [];
        }
        res.map((item: StepsModel) => {
          if (item.imagePath) {
            item.imageUrl = item.imagePath.imageFullPath;
          }
          this.step2.push(item);
        });

        if (this.step2.length < 3) {
          for (let i = 1; i <= 3 - this.step2.length; i++) {
            this.step2Dummy.push(this.dummyPhotoshoot);
          }
        }

        this.snackbar.success(SuccessConstant.DATA_ADDED);
      }
    });
  }

  onEditStep3(): void {
    const step3 = this.step3.filter((item) => item.id !== 0);
    const data = {
      photoshoots: step3,
      type: Types.STEP3_PHOTOS_TYPE,
      header: this.step3Header,
      isEditingData: true,
      showPositionInput: false,
      max: 2,
    };
    const dialogRef = this.dialog.open(EditPhotoshootsComponent, {
      width: '600px',
      data: data,
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe(async (res) => {
      if (res && res.length > 0) {
        const response = await this.hostService.getBecomeHostByType(
          Types.STEP3_PHOTOS_TYPE
        );
        if (response && response.data && response.data.length > 0) {
          // this.step3 = [];
          const step3 = response.data.map((item: StepsModel) => {
            if (item.imagePath) {
              item.imageUrl = item.imagePath.imageFullPath;
            }
            return item;
          });
          this.step3 = step3;
          this.step3Header =
            step3[step3.length - 1] && step3[step3.length - 1].header
              ? step3[step3.length - 1].header
              : this.step3Header;
          if (this.step3.length < 2) {
            this.step3Dummy = [];
            for (let i = 0; i < 2 - step3.length; i++) {
              this.step3Dummy.push(BecomeHost.step3[i]);
            }
          }
          this.snackbar.success(SuccessConstant.DATA_UPDATED);
        }
      }
    });
  }

  onAddStep3(): void {
    let originalArraydata: StepsModel[] = [];
    if (this.step3) {
      originalArraydata = this.step3.filter((photoshoot) => {
        return photoshoot.id !== null && photoshoot.id !== 0;
      });
    }
    const dialogRef = this.dialog.open(EditPhotoshootsComponent, {
      width: '600px',
      data: {
        type: Types.STEP3_PHOTOS_TYPE,
        isEditingData: false,
        showPositionInput: false,
        header: this.step3Header,
        positions: originalArraydata,
        max: 2,
        title: 'Add Step',
      },
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((res) => {
      if (res && res.length > 0) {
        this.step3Dummy = [];
        if (!this.step3) {
          this.step3 = [];
        }
        res.map((item: StepsModel) => {
          if (item.imagePath) {
            item.imageUrl = item.imagePath.imageFullPath;
          }
          this.step3.push(item);
        });

        if (this.step3.length < 2) {
          for (let i = 1; i <= 2 - this.step3.length; i++) {
            this.step3Dummy.push(this.dummyPhotoshoot);
          }
        }

        this.snackbar.success(SuccessConstant.DATA_ADDED);
      }
    });
  }

  onDeleteData(id?: number): void {
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
        this.onDeleteLocation(Number(id));
      }
    });
  }

  onEditTitle(headerData: TitleModel): void {
    const dialogRef = this.dialog.open(EditTitleComponent, {
      width: '600px',
      data: headerData,
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((res) => {
      if (res && res.typeName && res.type === this.workStepsHeader.type) {
        this.workStepsHeader.categoryId = res.id;
        this.workStepsHeader.typeName = res.typeName;
      }
      if (res && res.typeName && res.type === this.getStartedHeader.type) {
        this.getStartedHeader.categoryId = res.id;
        this.getStartedHeader.typeName = res.typeName;
      }
    });
  }

  async onDeleteLocation(id: number): Promise<void> {
    const response = await this.hostService.deleteHostPhotoshoots(id);
    if (response && response.data && response.success) {
      // for photoshoots
      if (response.data.type === Types.HOST_PHOTOS_TYPE) {
        this.photoshoots[+response.data.position - 1] = this.dummyPhotoshoot;
        this.snackbar.success(SuccessConstant.DELETE_SUCCESS);
      }
      // for step 1
      if (response.data.type === Types.STEP1_PHOTOS_TYPE) {
        this.step1 = this.step1.filter((item) => item.id !== response.data.id);
        if (!this.step1) {
          this.step1 = [];
        }
        if (this.step1.length < 2) {
          for (let i = 1; i <= 2 - this.step1.length; i++) {
            this.step1Dummy.push(this.dummyPhotoshoot);
          }
        }
        this.snackbar.success(SuccessConstant.DELETE_SUCCESS);
      }
      // for step 2
      if (response.data.type === Types.STEP2_PHOTOS_TYPE) {
        this.step2 = this.step2.filter((item) => item.id !== response.data.id);
        if (!this.step2) {
          this.step2 = [];
        }
        if (this.step2.length < 3) {
          for (let i = 1; i <= 3 - this.step2.length; i++) {
            this.step1Dummy.push(this.dummyPhotoshoot);
          }
        }
        this.snackbar.success(SuccessConstant.DELETE_SUCCESS);
      }
      // for step 3
      if (response.data.type === Types.STEP3_PHOTOS_TYPE) {
        this.step3 = this.step3.filter((item) => item.id !== response.data.id);
        if (!this.step3) {
          this.step3 = [];
        }
        if (this.step3.length < 2) {
          for (let i = 1; i <= 2 - this.step3.length; i++) {
            this.step3Dummy.push(this.dummyPhotoshoot);
          }
        }
        this.snackbar.success(SuccessConstant.DELETE_SUCCESS);
      }
    }
  }

  ngOnDestroy(): void {
    this.sharedService.setStickyHeader(false);
  }
}
