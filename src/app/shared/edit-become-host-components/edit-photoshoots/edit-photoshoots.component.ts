import { Component, OnInit, Inject, EventEmitter, Output } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { Types } from 'src/app/constants/types.constant';
import { StepsModel } from 'src/app/models/become-host.model';
import { PhotoshootsDialogue } from 'src/app/models/popup-dialogue.model';
import { CommonService } from 'src/app/services/common.service';
import { HostService } from 'src/app/services/host.service';
import { ConfirmDialogComponent } from '../../components/confirm-dialog/confirm-dialog.component';
import { SnackBarService } from 'src/app/services/snack-bar.service';

@Component({
  selector: 'app-edit-photoshoots',
  templateUrl: './edit-photoshoots.component.html',
  styleUrls: ['./edit-photoshoots.component.scss'],
})
export class EditPhotoshootsComponent implements OnInit {
  @Output() deletePhotoEmiiter = new EventEmitter<number | null>();
  editPhotoshootForm: FormGroup;
  imgUrl: string;
  occupiedPositions: number[];
  heading: string = 'Add Photoshoots';
  type = Types.HOST_PHOTOS_TYPE;
  isSubmitted = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: PhotoshootsDialogue,
    public dialogRef: MatDialogRef<EditPhotoshootsComponent>,
    public commonService: CommonService,
    private hostService: HostService,
    private dialog: MatDialog,
    private snackBar: SnackBarService
  ) {}

  async ngOnInit(): Promise<void> {
    if (this.data.title) this.heading = this.data.title;
    if (this.data.positions) {
      this.occupiedPositions = this.data.positions.filter(
        (pos: number) => pos !== null && pos !== 0
      );
    }
    // if (this.data.originalArraydata) {
    //   this.occupiedPositions = this.data.originalArraydata.filter(
    //     (data: StepsModel) => data.id !== null && data.id !== 0
    //   );
    // }
    await this.editPhotosFormInit();
  }

  private async editPhotosFormInit(): Promise<void> {
    if (this.data.isEditingData) {
      const modifiedPhotoshoots = this.data.photoshoots.filter(
        (photoshoot: StepsModel) => photoshoot !== undefined
      );
      this.editPhotoshootForm = new FormGroup({
        header: new FormControl(
          this.data.header ? this.data.header : null,
          Validators.maxLength(35)
        ),
        type: new FormControl(this.data.type ? this.data.type : null),
        photoShoots: new FormArray(
          modifiedPhotoshoots.map((element: StepsModel) => {
            return new FormGroup({
              id: new FormControl(element.id),
              title: new FormControl(element.title, Validators.maxLength(30)),
              description: new FormControl(
                element.description,
                Validators.maxLength(150)
              ),
              position: new FormControl(element.position),
              imagePreview: new FormControl(element.imageUrl),
              imageUrl: new FormControl(null),
            });
          })
        ),
      });
    } else {
      this.editPhotoshootForm = new FormGroup({
        header: new FormControl(null),
        type: new FormControl(this.data.type ? this.data.type : null),
        photoShoots: new FormArray([
          new FormGroup({
            title: new FormControl(null, [
              Validators.required,
              Validators.maxLength(30),
            ]),
            description: new FormControl(null, [
              Validators.maxLength(150),
              Validators.required,
            ]),
            position: new FormControl(null),
            imagePreview: new FormControl(null),
            imageUrl: new FormControl(null, Validators.required),
          }),
        ]),
      });
    }

    if (this.data.isEditingData) {
      this.heading = 'Edit Photoshoots';
      this.editPhotoshootForm.get('imageUrl')?.clearValidators();
      this.editPhotoshootForm.get('position')?.clearValidators();
    }
    this.setValidators();
  }

  get c(): { [key: string]: AbstractControl } {
    return this.editPhotoshootForm.controls;
  }

  onImageSelect(event: Event, index: number): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    const nameSplit = file?.name.split('.');
    const fileType = nameSplit?.at(-1);
    if (
      file &&
      (fileType?.toLowerCase() == 'png' ||
        fileType?.toLowerCase() == 'jpg' ||
        fileType?.toLowerCase() == 'jpeg')
    ) {
      this.photosControls[index].get('imageUrl')?.patchValue(file);

      const fileReader = new FileReader();
      fileReader.onload = () => {
        const imageUrl = fileReader.result as string;
        this.photosControls[index].get('imagePreview')?.patchValue(imageUrl);
      };
      fileReader.readAsDataURL(file);
    } else {
      this.snackBar.error(
        'Invalid File Type. File Type Should be Only PNG ,JPG And JPEG'
      );
      return;
    }
  }

  onDeleteEvent(index: number): void {
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
        (<FormArray>this.editPhotoshootForm.get('photoShoots')).removeAt(index);
      }
    });
  }

  onAddEvent(): void {
    (<FormArray>this.editPhotoshootForm.get('photoShoots')).push(
      new FormGroup({
        title: new FormControl(null, [
          Validators.required,
          Validators.maxLength(30),
        ]),
        description: new FormControl(null, [
          Validators.maxLength(150),
          Validators.required,
        ]),
        position: new FormControl(null),
        imagePreview: new FormControl(null),
        imageUrl: new FormControl(null, Validators.required),
      })
    );
    this.setValidators();
  }

  get photosControls() {
    return (this.editPhotoshootForm.get('photoShoots') as FormArray).controls;
  }

  get isPositionOccupied(): boolean {
    const isPositionsOccupied = this.photosControls.map((ctrl, i) => {
      ctrl.value.position = +ctrl.value.position;
      if (
        (this.photosControls.includes(ctrl.value.position) ||
          this.occupiedPositions?.includes(+ctrl.value.position)) &&
        (this.data.photoshoots && this.data.photoshoots[i].position) !==
          +ctrl.value.position &&
        +ctrl.value.position !== 0
      ) {
        return true;
      } else {
        return false;
      }
    });
    return isPositionsOccupied.some((position) => position);
  }

  async onSubmitForm(): Promise<void> {
    this.isSubmitted = true;
    if (!this.editPhotoshootForm.valid) return;
    if (!this.isPositionOccupied) {
      const ctrls = this.editPhotoshootForm.controls;
      const arrayCtrls = (
        this.editPhotoshootForm.get('photoShoots') as FormArray
      ).controls;
      const formData = new FormData();
      // data.append('type', this.data.type);
      arrayCtrls.map((control, index) => {
        const objData = control.value;
        const imageKey = 'image' + (index + 1);
        objData.image = imageKey;
        Object.keys(objData).map((key) => {
          if (key === 'imageUrl') {
            formData.append('image' + (index + 1), objData[key]);
          }
        });
      });

      Object.keys(ctrls).map((key) => {
        if (key === 'photoShoots') {
          formData.append(key, JSON.stringify(ctrls[key].value));
        }
        if (key !== 'photoShoots') {
          formData.append(key, ctrls[key].value);
        }
      });

      if (!this.data.isEditingData) {
        const response = await this.hostService.addHostPhotoshoots(formData);
        if (response && response.data && response.data.length > 0) {
          const responseData = response.data;
          this.dialogRef.close(responseData);
        }
      }
      if (this.data.isEditingData) {
        const response = await this.hostService.updateHostPhotoshoots(formData);
        if (response && response.data && response.data.length > 0) {
          this.dialogRef.close(response.data);
        }
      }
    }
  }

  private setValidators(): void {
    if (!this.data.isEditingData && this.data.showPositionInput) {
      this.editPhotoshootForm
        .get('imageUrl')
        ?.setValidators(Validators.required);
      this.photosControls.map((ctrl) => {
        ctrl
          .get('position')
          ?.setValidators([
            Validators.required,
            Validators.max(this.data.max),
            Validators.min(1),
          ]);
      });
    }
  }
}
