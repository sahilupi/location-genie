import {
  Component,
  OnInit,
  Inject,
  ElementRef,
  ViewChild,
} from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { ImageCroppedEvent, ImageTransform } from 'ngx-image-cropper';
import { SnackBarService } from 'src/app/services/snack-bar.service';
import html2canvas from 'html2canvas';
import { ConfirmDialogComponent } from 'src/app/shared/components/confirm-dialog/confirm-dialog.component';
import { PersonalInfoService } from 'src/app/services/personal-info.service';
import { SharedService } from 'src/app/services/shared.service';
import { ErrorConstant } from 'src/app/constants/error.constant';

@Component({
  selector: 'app-edit-profile-image',
  templateUrl: './edit-profile-image.component.html',
  styleUrls: ['./edit-profile-image.component.scss'],
})
export class EditProfileImageComponent implements OnInit {
  @ViewChild('fileUpload', { static: false })
  fileUpload!: ElementRef<HTMLInputElement>;
  myfilename = '';
  imageUrl: string;
  imagefile!: File;
  imageChangedEvent: any = '';
  mainImage!: string;
  disablePic: boolean = true;
  uploaddiv: boolean = false;

  // ngx-image-crop properties
  croppedImage: string | null | undefined = '';
  scale: number = 1.0;
  canvasRotation = 0;
  rotation = 0;
  showCropper = false;
  containWithinAspectRatio = false;
  transform: ImageTransform = {};

  constructor(
    public dialogRef: MatDialogRef<EditProfileImageComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { email: string; image: string },
    private snackbar: SnackBarService,
    private dialog: MatDialog,
    private personalInfoService: PersonalInfoService,
    private sharedService: SharedService
  ) {
    this.mainImage = data.image;
  }

  async ngOnInit(): Promise<void> {
    this.imageUrl = this.data.image;
  }

  onUploadButtonClick() {
    this.fileUpload.nativeElement.click();
  }

  CloseDialog() {
    this.dialogRef.close(false);
  }

  saveImage() {
    html2canvas(document.querySelector('.cropper-container') as any).then(
      (canvas) => {
        const base64Image = canvas.toDataURL('image/jpeg', 1);
        const blobData = this.dataURItoBlob(base64Image);
        const file = new File([blobData], 'cropped_image.png', {
          type: 'image/png',
        });
        const formData = new FormData();
        formData.append('UploadProfileImgUrl', file);
        formData.append('Email', this.data.email);
        formData.append('FacebookProfileImgUrl', '');
        this.uploadFormData(formData);
      }
    );
  }

  fileChangeEvent(fileInput: any): void {
    this.disablePic = false;
    this.imageChangedEvent = fileInput;
    if (fileInput.target.files && fileInput.target.files[0]) {
      this.imagefile = fileInput.target.files[0];
      const nameSplit = this.imagefile.name.split('.');
      const fileType = nameSplit.at(-1);
      if (
        fileType &&
        (fileType.toLowerCase() === 'png' ||
          fileType.toLowerCase() === 'jpg' ||
          fileType.toLowerCase() === 'jpeg' ||
          fileType.toLowerCase() === 'jfif')
      ) {
        const fileSizeInMB = this.imagefile.size / (1024 * 1024);
        const maxFileSizeInMB = 25.1;
        const minFileSizeInMB = 0.01;

        if (fileSizeInMB >= maxFileSizeInMB || fileSizeInMB < minFileSizeInMB) {
          // Display an error message or handle the oversized file as per your requirement
          this.disablePic = true;
          this.snackbar.error(
            'Invalid File. Size should be between 10kb KB to 25 MB'
          );
          return;
        } else {
          this.myfilename = '';
          Array.from(fileInput.target.files).forEach((file: any) => {
            this.myfilename += file.name + '';
          });
          this.uploaddiv = true;

          const reader = new FileReader();
          reader.onload = (e: any) => {
            const image = new Image();
            image.src = e.target.result;
            image.onload = (rs) => {
              this.imageUrl = e.target.result;
            };
          };
          reader.readAsDataURL(fileInput.target.files[0]);
        }
      } else {
        this.snackbar.error(
          'Invalid File Type. File Type Should be Only PNG ,JPG, JFIF And JPEG'
        );
        return;
      }
    } else {
      this.myfilename = 'Select File';
    }
  }

  previousData() {
    this.imageUrl = this.mainImage ? this.mainImage : '';
    this.myfilename = '';
    this.dialogRef.close();
  }

  closeBtnClick() {
    this.dialogRef.close();
  }

  async uploadFormData(formData: FormData) {
    const result = await this.personalInfoService.updateProfileImage(formData);
    if (result && result.success) {
      // this.personalInfoService.updateProfileImage(result.data[0].image);
      this.dialogRef.close({ isSuccess: true, result: result });
      this.myfilename = '';
    }
  }

  async deleteImage() {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '460px',
      disableClose: true,
      data: {
        title: 'Confirm Delete',
        message: 'Are you sure you want to delete image ?',
        cancelBtnText: 'Cancel',
        confirmBtnText: 'Delete',
        isDeleting: true,
      },
    });
    dialogRef.afterClosed().subscribe(async (res: boolean) => {
      if (res) {
        const response = await this.personalInfoService.deleteProfileImage(
          this.data.email
        );
        if (response && response.success) {
          this.imageUrl = '';
          this.sharedService.updateHeaderImageUrl(this.imageUrl);
          // this.sharedService.updateHeaderImageUrl(this.userImageUrl);
        }
        // const result = await this.patientService.deletePatientImage(this.id);
        // if (result && result.isSuccess) {
        //   const patientData = await this.patientService.getPatientById(this.id);
        //   this.imageUrl = patientData.data.image;
        //   this.imageUrl = '';
        //   this.delFlag = false;
        //   this.practiceImageService.updateProfileImageUrl(this.imageUrl);
        // }
      }
    });
  }

  dataURItoBlob(dataURI: string) {
    const byteString = atob(dataURI.split(',')[1]);
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab]);
  }

  // ngx-image-cropper functions
  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.objectUrl;
  }

  imageLoaded() {
    this.showCropper = true;
  }

  // handle image load
  loadImageFailed() {
    this.snackbar.error(ErrorConstant.SOMETHING_WENT_WRONG);
  }

  rotateLeft() {
    this.canvasRotation--;
    this.flipAfterRotate();
  }

  rotateRight() {
    this.canvasRotation++;
    this.flipAfterRotate();
  }

  private flipAfterRotate() {
    const flippedH = this.transform.flipH;
    const flippedV = this.transform.flipV;
    this.transform = {
      ...this.transform,
      flipH: flippedV,
      flipV: flippedH,
    };
  }

  flipHorizontal() {
    this.transform = {
      ...this.transform,
      flipH: !this.transform.flipH,
    };
  }

  flipVertical() {
    this.transform = {
      ...this.transform,
      flipV: !this.transform.flipV,
    };
  }

  resetImage() {
    this.scale = 1;
    this.rotation = 0;
    this.canvasRotation = 0;
    this.transform = {};
  }

  zoomOut() {
    this.scale -= 0.1;
    this.transform = {
      ...this.transform,
      scale: this.scale,
    };
  }

  zoomIn() {
    this.scale += 0.1;
    this.transform = {
      ...this.transform,
      scale: this.scale,
    };
  }

  toggleContainWithinAspectRatio() {
    this.containWithinAspectRatio = !this.containWithinAspectRatio;
  }

  updateRotation() {
    this.transform = {
      ...this.transform,
      rotate: this.rotation,
    };
  }

  rightRotate() {
    this.transform = {
      ...this.transform,
      rotate: this.rotation++,
    };
  }
  leftRotate() {
    this.transform = {
      ...this.transform,
      rotate: this.rotation--,
    };
  }
}
