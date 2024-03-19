import { Component, Inject, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { EventList } from 'src/app/models/event.model';
import { SpaceDialogue } from 'src/app/models/popup-dialogue.model';
import { CommonService } from 'src/app/services/common.service';
import { HomeService } from 'src/app/services/home.service';
import { SnackBarService } from 'src/app/services/snack-bar.service';

@Component({
  selector: 'app-edit-space',
  templateUrl: './edit-space.component.html',
  styleUrls: ['./edit-space.component.scss'],
})
export class EditSpaceComponent implements OnInit {
  editSpaceForm: FormGroup;
  spaceImgUrl: string;
  heading: string = 'Add Space';
  ocupiedPositions: number[];
  allActivities: EventList[] = [];
  isSubmitted = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: SpaceDialogue,
    public dialogRef: MatDialogRef<EditSpaceComponent>,
    private homeService: HomeService,
    public commonService: CommonService,
    private snackBar: SnackBarService
  ) {}

  ngOnInit(): void {
    this.ocupiedPositions = this.data.positions.filter(
      (pos: number) => pos !== null
    );
    this.editFormInit();
    if (this.data.id) {
      this.heading = 'Edit Space';
      this.editSpaceForm.get('imageUrl')?.clearValidators();
    } else {
      this.editSpaceForm.get('imageUrl')?.setValidators(Validators.required);
    }
    this.allActivities = [...this.data.allActivities];
    this.allActivities = this.allActivities.filter((activity) => activity.id);
  }

  get c(): { [key: string]: AbstractControl } {
    return this.editSpaceForm.controls;
  }

  private editFormInit(): void {
    this.editSpaceForm = new FormGroup({
      text: new FormControl(
        this.data && this.data.text ? this.data.text : null,
        [Validators.required, Validators.maxLength(30)]
      ),
      categoryId: new FormControl(
        this.data && this.data.id ? this.data.id : null
      ),
      position: new FormControl(
        this.data && this.data.position ? this.data.position : null,
        [Validators.max(10), Validators.min(1), Validators.required]
      ),
      linkText: new FormControl(
        this.data && this.data.text ? this.data.text : null
      ),
      activities: new FormControl(
        this.data && this.data.activities
          ? this.data.activities.split(',').map(Number)
          : null,
        [Validators.required]
      ),
      imageUrl: new FormControl(null),
      type: new FormControl(this.data ? this.data.type : null),
      typeName: new FormControl(this.data ? this.data.typeName : null),
    });
    this.spaceImgUrl = this.data ? this.data.imageUrl : '';
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
      this.editSpaceForm.patchValue({
        imageUrl: file,
      });
      const fileReader = new FileReader();
      fileReader.onload = () => {
        const imagePreview = fileReader.result as string;
        this.spaceImgUrl = imagePreview;
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
    this.isSubmitted = true;
    if (
      this.ocupiedPositions.includes(+this.editSpaceForm.value.position) &&
      this.data.position !== +this.editSpaceForm.value.position
    ) {
      return;
    }
    if (!this.editSpaceForm.valid || !this.spaceImgUrl) return;
    const data = new FormData();
    const ctrls = this.editSpaceForm.controls;
    Object.keys(ctrls).map((key) => {
      data.append(key, ctrls[key].value);
    });
    // return;
    if (this.data && this.data.id) {
      const response = await this.homeService.updateHomeSpaces(data);
      if (response && response.success && response.data) {
        this.dialogRef.close(response.data);
      }
    } else {
      const response = await this.homeService.addHomeSpaces(data);
      if (response && response.success && response.data) {
        this.dialogRef.close(response.data);
      }
    }
  }
}
