import { Component, OnInit, Inject } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SuccessConstant } from 'src/app/constants/success.constant';
import { Types } from 'src/app/constants/types.constant';
import { HostBannerDialogue } from 'src/app/models/popup-dialogue.model';
import { HostService } from 'src/app/services/host.service';
import { SnackBarService } from 'src/app/services/snack-bar.service';

@Component({
  selector: 'app-edit-host-banner',
  templateUrl: './edit-host-banner.component.html',
  styleUrls: ['./edit-host-banner.component.scss'],
})
export class EditHostBannerComponent implements OnInit {
  editHostBannerForm: FormGroup;
  hostBannerImgUrl: string;
  heading = 'Add Host Banner';
  isSubmitted = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: HostBannerDialogue,
    public dialogRef: MatDialogRef<EditHostBannerComponent>,
    private hostService: HostService,
    private snackbar: SnackBarService
  ) {}

  async ngOnInit(): Promise<void> {
    await this.editFormInit();
    if (this.data.id) {
      this.heading = 'Edit Host Banner';
    }
  }

  get c(): { [key: string]: AbstractControl } {
    return this.editHostBannerForm.controls;
  }
  private async editFormInit(): Promise<void> {
    this.editHostBannerForm = new FormGroup({
      bannerId: new FormControl(this.data.id),
      title: new FormControl(this.data.title, [
        Validators.maxLength(30),
        Validators.required,
      ]),
      description: new FormControl(this.data.description, [
        Validators.maxLength(300),
        Validators.required,
      ]),
      link: new FormControl(this.data.link, [Validators.required]),
      linkText: new FormControl(this.data.linkText, [
        Validators.maxLength(20),
        Validators.required,
      ]),
      imageUrl: new FormControl(this.data.imageUrl, Validators.required),
      type: new FormControl(Types.HOST_BANNER_TYPE),
    });
    this.hostBannerImgUrl = this.data.imageUrl;
  }

  onImageSelect(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    const nameSplit = file?.name.split('.');
    const fileType = nameSplit?.at(-1);
    if (
      file &&
      (fileType?.toLowerCase() == 'png' ||
        fileType?.toLowerCase() == 'jpg' ||
        fileType?.toLowerCase() == 'jpeg')
    ) {
      this.editHostBannerForm.patchValue({
        imageUrl: file,
      });
      const fileReader = new FileReader();
      fileReader.onload = () => {
        const imagePreview = fileReader.result as string;
        this.hostBannerImgUrl = imagePreview;
      };
      fileReader.readAsDataURL(file);
    } else {
      this.snackbar.error(
        'Invalid File Type. File Type Should be Only PNG ,JPG And JPEG'
      );
      return;
    }
  }

  async onSubmitForm(): Promise<void> {
    this.isSubmitted = true;
    if (!this.editHostBannerForm.valid) return;
    const data = new FormData();
    const ctrls = this.editHostBannerForm.controls;
    Object.keys(ctrls).map((key) => {
      data.append(key, ctrls[key].value);
    });
    if (this.data.id) {
      const response = await this.hostService.updateHostBanner(data);
      if (response && response.success && response.data) {
        this.dialogRef.close(response.data);
        this.snackbar.success(SuccessConstant.DATA_UPDATED);
      }
    } else {
      const response = await this.hostService.addHostBanner(data);
      if (response && response.data && response.success) {
        this.dialogRef.close(response.data);
        this.snackbar.success(SuccessConstant.DATA_ADDED);
      }
    }
  }
}
