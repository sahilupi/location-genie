import { Component, OnInit, Inject } from '@angular/core';
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
import { SpaceCategoryModel } from 'src/app/models/home-edit.model';
import { EventsDialogue } from 'src/app/models/popup-dialogue.model';
import { HomeService } from 'src/app/services/home.service';
import { ConfirmDialogComponent } from '../../components/confirm-dialog/confirm-dialog.component';
import { SnackBarService } from 'src/app/services/snack-bar.service';
import { EventList } from 'src/app/models/event.model';

@Component({
  selector: 'app-edit-events',
  templateUrl: './edit-events.component.html',
  styleUrls: ['./edit-events.component.scss'],
})
export class EditEventsComponent implements OnInit {
  editEventsForm: FormGroup;
  heading: string = 'Add Events';
  occupiedPositions: number[];
  allActivities: EventList[] = [];
  isSubmitted = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: EventsDialogue,
    public dialogRef: MatDialogRef<EditEventsComponent>,
    private dialog: MatDialog,
    private homeService: HomeService,
    private snackBar: SnackBarService
  ) {}

  async ngOnInit(): Promise<void> {
    this.occupiedPositions = this.data.positions.filter(
      (pos: number) => pos !== null && pos !== 0
    );
    await this.editEventsFormInit();
    if (this.data.isEditingData) this.heading = 'Edit Events';
    this.allActivities = [...this.data.allActivities];
    this.allActivities = this.allActivities.filter((activity) => activity.id);
  }

  get c(): { [key: string]: AbstractControl } {
    return this.editEventsForm.controls;
  }

  private async editEventsFormInit(): Promise<void> {
    if (
      this.data &&
      this.data.locations &&
      this.data.locations.length > 0 &&
      this.data.isEditingData
    ) {
      this.editEventsForm = new FormGroup({
        header: new FormControl(
          this.data.header ? this.data.header : null,
          Validators.maxLength(60)
        ),
        subHeader: new FormControl(
          this.data.subHeader ? this.data.subHeader : null,
          Validators.maxLength(120)
        ),
        type: new FormControl(this.data.type ? this.data.type : null),
        tilesData: new FormArray(
          this.data.locations.map((element: SpaceCategoryModel) => {
            return new FormGroup({
              tileId: new FormControl(element.id),
              title: new FormControl(element.title, [
                Validators.required,
                Validators.maxLength(30),
              ]),
              linkText: new FormControl(element.linkText, [
                Validators.required,
              ]),
              link: new FormControl(JSON.parse(String(element.link)), [
                Validators.required,
              ]),
              imageUrl: new FormControl(null),
              imagePreview: new FormControl(element.imageUrl),
              position: new FormControl(element.position, [
                Validators.max(this.data.max),
                Validators.min(1),
                Validators.required,
              ]),
            });
          })
        ),
      });
    } else {
      this.editEventsForm = new FormGroup({
        header: new FormControl(null),
        subHeader: new FormControl(null),
        type: new FormControl(this.data.type ? this.data.type : null),
        tilesData: new FormArray([
          new FormGroup({
            title: new FormControl(null, [
              Validators.required,
              Validators.maxLength(30),
            ]),
            linkText: new FormControl(null, [Validators.required]),
            link: new FormControl(null, [Validators.required]),
            imageUrl: new FormControl(null, [Validators.required]),
            imagePreview: new FormControl(null),
            position: new FormControl(null, [
              Validators.max(this.data.max),
              Validators.min(1),
              Validators.required,
            ]),
          }),
        ]),
      });
    }
  }

  onImageSelect(event: Event, index: number): void {
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
      this.eventsControls[index].get('imageUrl')?.patchValue(file);

      const fileReader = new FileReader();
      fileReader.onload = () => {
        const imageUrl = fileReader.result as string;
        this.eventsControls[index].get('imagePreview')?.patchValue(imageUrl);
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
        (<FormArray>this.editEventsForm.get('tilesData')).removeAt(index);
      }
    });
  }

  onAddEvent(): void {
    (<FormArray>this.editEventsForm.get('tilesData')).push(
      new FormGroup({
        title: new FormControl(null, [
          Validators.required,
          Validators.maxLength(30),
        ]),
        linkText: new FormControl(null, [Validators.required]),
        link: new FormControl(null, [Validators.required]),
        imageUrl: new FormControl(null, [Validators.required]),
        imagePreview: new FormControl(null),
        position: new FormControl(null, [
          Validators.max(this.data.max),
          Validators.min(1),
          Validators.required,
        ]),
      })
    );
  }

  get eventsControls() {
    return (this.editEventsForm.get('tilesData') as FormArray).controls;
  }

  get isPositionOccupied(): boolean {
    const isPositionOccupied = this.eventsControls.map((ctrl, i) => {
      ctrl.value.position = +ctrl.value.position;
      if (
        (this.eventsControls.includes(ctrl.value.position) ||
          this.occupiedPositions.includes(+ctrl.value.position)) &&
        (this.data.locations && this.data.locations[i].position) !==
          +ctrl.value.position &&
        +ctrl.value.position !== 0
      ) {
        return true;
      } else {
        return false;
      }
    });
    return isPositionOccupied.some((position) => position);
  }

  async onSubmitForm(): Promise<void> {
    this.isSubmitted = true;
    if (!this.editEventsForm.valid) return;
    if (!this.isPositionOccupied && !this.checkPositionExists()) {
      this.isSubmitted = true;
      // getting root level controls of Form
      const ctrls = this.editEventsForm.controls;
      // getting controls of tilesdata formarray
      const arrayCtrls = (this.editEventsForm.get('tilesData') as FormArray)
        .controls;
      const data = new FormData();
      // modifying tilesdata as per backend requirement
      let ctrlsArray: any[] = [];
      arrayCtrls.map((control, index) => {
        const objData = control.value;
        const imageKey = 'image' + (index + 1);
        objData.image = imageKey;
        objData.imagePreview = null;
        ctrlsArray.push(objData);
        Object.keys(objData).map((key) => {
          if (key === 'imageUrl') {
            data.append('image' + (index + 1), objData[key]);
          }
        });
      });
      // stringify tilesData
      Object.keys(ctrls).map((key: string) => {
        if (key === 'tilesData') {
          data.append(key, JSON.stringify(ctrlsArray));
        }
        if (key !== 'tilesData') {
          data.append(key, ctrls[key].value);
        }
      });
      // add
      if (!this.data.isEditingData) {
        const response = await this.homeService.addHomeTielsData(data);
        if (response && response.data && response.data.length > 0) {
          this.dialogRef.close(response.data);
        }
      }
      // update
      if (this.data.isEditingData) {
        const response = await this.homeService.upadteHomeTielsData(data);
        if (response && response.data && response.data.length > 0) {
          this.dialogRef.close(response.data);
        }
      }
    }
  }

  checkPositionExists(): boolean {
    let existedValues = this.eventsControls.map((ctrl) => +ctrl.value.position);
    existedValues = existedValues.filter((pos) => pos !== 0);
    return new Set(existedValues).size !== existedValues.length;
  }
}
