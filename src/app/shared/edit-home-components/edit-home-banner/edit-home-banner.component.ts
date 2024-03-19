import { Component, OnInit, Inject } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ErrorConstant } from 'src/app/constants/error.constant';
import { BannerModel } from 'src/app/models/home-edit.model';
import { HomeService } from 'src/app/services/home.service';
import { SnackBarService } from 'src/app/services/snack-bar.service';

@Component({
  selector: 'app-edit-home-banner',
  templateUrl: './edit-home-banner.component.html',
  styleUrls: ['./edit-home-banner.component.scss'],
})
export class EditHomeBannerComponent implements OnInit {
  edithomeBannerForm: FormGroup;
  imagePreview: string;
  heading: string = 'Add Banner';
  isSubmitted = false;

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: { isEditing: boolean; bannerData: BannerModel },
    public dialogRef: MatDialogRef<EditHomeBannerComponent>,
    private homeService: HomeService,
    private snackBar: SnackBarService
  ) {}

  async ngOnInit(): Promise<void> {
    await this.editFormInit();
    if (this.data.isEditing) this.heading = 'Edit Banner';
  }

  get c(): { [key: string]: AbstractControl } {
    return this.edithomeBannerForm.controls;
  }

  private async editFormInit(): Promise<void> {
    const data = this.data.bannerData;
    this.edithomeBannerForm = new FormGroup({
      bannerId: new FormControl(
        this.data.isEditing && data.bannerId ? data.bannerId : null
      ),
      text: new FormControl(
        this.data.isEditing ? data.text : data.text ? data.text : null,
        [Validators.maxLength(120), Validators.required]
      ),
      link: new FormControl(
        this.data.isEditing ? data.link : data.link ? data.link : null,
        [Validators.maxLength(30), Validators.required]
      ),
      linkText: new FormControl(
        this.data.isEditing
          ? data.linkText
          : data.linkText
          ? data.linkText
          : null,
        [Validators.maxLength(30), Validators.required]
      ),
      imageUrl: new FormControl(null, [
        !this.data.isEditing ? Validators.required : Validators.nullValidator,
      ]),
      type: new FormControl(data.type),
      typeName: new FormControl(data.typeName),
    });
    this.imagePreview = this.data.isEditing
      ? data.imageUrl
      : data.imageUrl
      ? data.imageUrl
      : '';
  }

  onImageSelect(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    const nameSplit = file?.name.split('.');
    const fileType = nameSplit?.at(-1);
    if (
      file &&
      (fileType?.toLowerCase() == 'png' ||
        fileType?.toLowerCase() == 'jpg' ||
        fileType?.toLowerCase() == 'jpeg' ||
        fileType?.toLowerCase() == 'webp')
    ) {
      this.edithomeBannerForm.patchValue({
        imageUrl: file,
      });
      const fileReader = new FileReader();
      fileReader.onload = () => {
        const imagePreview = fileReader.result as string;
        this.imagePreview = imagePreview;
      };
      fileReader.readAsDataURL(file);
    } else {
      this.snackBar.error(
        'Invalid File Type. File Type Should be Only PNG ,JPG And JPEG'
      );
      return;
    }
  }

  async onSubmitForm(): Promise<void> {
    if (
      !this.edithomeBannerForm.valid ||
      !this.edithomeBannerForm.value.imageUrl
    )
      return;
    this.isSubmitted = true;
    // const data = this.edithomeBannerForm.value;
    // data.bannerImage = this.imagePreview;
    const data = new FormData();
    const ctrls = this.edithomeBannerForm.controls;
    Object.keys(ctrls).map((key) => {
      data.append(key, ctrls[key].value);
    });

    if (this.data.bannerData.bannerId) {
      const response = await this.homeService.updateHomeBanner(data);
      if (response && response.success && response.data) {
        this.dialogRef.close(response.data);
      } else {
        this.snackBar.error(ErrorConstant.SOME_ISSUE);
      }
    } else {
      const response = await this.homeService.addHomeBanner(data);
      if (response && response.success && response.data) {
        this.dialogRef.close(response.data);
      } else {
        this.snackBar.error(ErrorConstant.SOME_ISSUE);
      }
    }
  }
}
