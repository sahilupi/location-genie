import {
  Component,
  ViewChild,
  Input,
  OnInit,
  ViewChildren,
  QueryList,
} from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { ImagePosition, ListingImageData } from 'src/app/models/listing.model';
import { ListingStepTwoService } from 'src/app/services/listing-step-two.service';
import { Router } from '@angular/router';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ConfirmDialogComponent } from 'src/app/shared/components/confirm-dialog/confirm-dialog.component';
import {
  CdkDragEnter,
  CdkDropList,
  moveItemInArray,
} from '@angular/cdk/drag-drop';
import { SnackBarService } from 'src/app/services/snack-bar.service';
import { ListingStepperConstant } from 'src/app/constants/listing-stepper.constant';
import { SpinnerService } from 'src/app/services/spinner.service';

@Component({
  selector: 'app-step-two-fifth-page',
  templateUrl: './step-two-fifth-page.component.html',
  styleUrls: ['./step-two-fifth-page.component.scss'],
})
export class StepTwoFifthPageComponent implements OnInit {
  @Input({ required: true }) listingId: string;
  @ViewChildren(CdkDropList) dropsQuery: QueryList<CdkDropList>;
  @ViewChild(CdkDropList) placeholder: CdkDropList;

  backBtnRoute: string;
  nxtBtnRoute: string;
  imageForm: FormGroup;
  images: ListingImageData[] = [];
  drops: CdkDropList[];
  stepperData = ListingStepperConstant.stepTwo;

  constructor(
    private stepTwoService: ListingStepTwoService,
    private router: Router,
    public dialogRef: MatDialogRef<ConfirmDialogComponent>,
    private dialog: MatDialog,
    private snackbar: SnackBarService,
    private spinner: SpinnerService
  ) {}

  async ngOnInit(): Promise<void> {
    this.spinner.show();
    try {
      this.backBtnRoute = `/become-a-host/${+this.listingId}/step-2/title`;
      this.nxtBtnRoute = `/become-a-host/${+this.listingId}`;
      await this.imageFormInit();
      await this.getLisitngImages(Number(this.listingId));
      this.spinner.hide();
    } catch (error) {
      this.spinner.hide();
    }
  }

  ngAfterViewInit(): void {
    this.dropsQuery.changes.subscribe(() => {
      this.drops = this.dropsQuery.toArray();
    });
    Promise.resolve().then(() => {
      this.drops = this.dropsQuery.toArray();
    });

    const phElement = this.placeholder?.element.nativeElement;
    if (phElement) {
      phElement.style.display = 'none';
      phElement.parentElement?.removeChild(phElement);
    }
  }

  private async imageFormInit(): Promise<void> {
    this.imageForm = new FormGroup({
      images: new FormArray([
        new FormGroup({
          description: new FormControl(null),
          image: new FormControl(null),
          imagePreview: new FormControl(null),
          imagePathId: new FormControl(null),
        }),
      ]),
    });
  }

  async getLisitngImages(id: number): Promise<void> {
    const response = await this.stepTwoService.getListingImages(id);
    if (
      response &&
      response.success &&
      response.data &&
      response.data.data &&
      response.data.data.length > 0
    ) {
      const data = response.data.data;
      this.images = [];
      this.imageForm.reset();
      const sortedData = data.sort(
        (a: ListingImageData, b: ListingImageData) =>
          Number(a.position) - Number(b.position)
      );
      sortedData.map((image: ListingImageData, i: number) => {
        if (this.images.length > 1) {
          this.deleteCtrl(i);
        }
        this.images.push({
          imagePathId: image.imagePathId,
          imgSrc: String(image.imagePath?.imageFullPath),
          imageDescription: image.imageDescription,
          id: image.id,
        });

        if (this.images.length > 1) {
          this.addCtrl(this.images[i]);
        }
      });
      (this.imageForm.get('images') as FormArray).at(0).patchValue({
        imagePreview: this.images[0].imgSrc,
        imagePathId: this.images[0].imagePathId,
      });
    }
  }

  async deleteImage(listingId: number, imagePathId: number): Promise<void> {
    const response = await this.stepTwoService.deleteListingImage(
      listingId,
      imagePathId
    );
    if (response && response.success) {
      this.images = this.images.filter((img, i) => {
        if (img.imagePathId !== imagePathId) {
          if (this.images.length > 1) {
            this.deleteCtrl(i);
          }
        }
        return img.imagePathId !== imagePathId;
      });
      if (this.images[0]) {
        await this.stepTwoService.updateListingCoverImage(
          Number(this.listingId),
          this.images[0].imagePathId
        );
      }
    }
  }

  get imageControls(): any {
    return (this.imageForm.get('images') as FormArray).controls;
  }

  async onFileChange(event: any): Promise<void> {
    //event can be of type HTMLInputElement or Files
    if (event.target as HTMLInputElement) {
      const files = (event.target as HTMLInputElement).files;

      if (files) {
        for (let i = 0; i < files.length; i++) {
          const nameSplit = files[i].name.split('.');
          const fileType = nameSplit.at(-1);
          if (
            fileType &&
            (fileType.toLowerCase() === 'png' ||
              fileType.toLowerCase() === 'jpg' ||
              fileType.toLowerCase() === 'jpeg' ||
              fileType.toLowerCase() === 'jfif')
          ) {
            this.addCtrl(files[i]);
            const fileReader = new FileReader();
            this.imageControls[i].value.image = files[i];
            fileReader.onload = () => {
              // const imageUrl = fileReader.result as string;
              // this.images.push({ id: 0, imgSrc: imageUrl });
            };
            fileReader.readAsDataURL(files[i]);
          } else {
            this.snackbar.error(
              'Invalid File Type. File Type Should be Only PNG ,JPG And JPEG'
            );
          }
        }
      }
    } else {
      const files = event;
      if (files) {
        for (let i = 0; i < files.length; i++) {
          this.addCtrl(files[i]);
          const fileReader = new FileReader();
          this.imageControls[i].value.image = files[i];
          fileReader.onload = () => {
            // const imageUrl = fileReader.result as string;
            // this.images.push({ id: 0, imgSrc: imageUrl });
          };
          fileReader.readAsDataURL(files[i]);
        }
      }
    }

    const formData = new FormData();
    formData.append('listingId', this.listingId);
    const arrayCtrls = this.imageControls;
    arrayCtrls.map((control: any) => {
      const objData = control.value;
      Object.keys(objData).map((key) => {
        if (key === 'image') {
          formData.append('images', objData[key]);
        }
      });
    });
    this.spinner.show();
    try {
      const response = await this.stepTwoService.addListingImages(formData);
      if (response && response.data && response.data.length) {
        await this.getLisitngImages(Number(this.listingId));
        if (this.images[0]) {
          await this.stepTwoService.updateListingCoverImage(
            Number(this.listingId),
            this.images[0].imagePathId
          );
        }
      }
      this.spinner.hide();
    } catch (error) {
      this.spinner.hide();
    }
  }

  deleteCtrl(index: number): void {
    (<FormArray>this.imageForm.get('images')).removeAt(index);
  }

  addCtrl(data: any): void {
    (<FormArray>this.imageForm.get('images')).push(
      new FormGroup({
        description: new FormControl(null),
        image: new FormControl(null),
        imagePreview: new FormControl(data.imgSrc),
        imagePathId: new FormControl(data.id),
      })
    );
  }

  async onUpdateImgDescription(
    imagePathId: number,
    i: number,
    event: any
  ): Promise<void> {
    if (
      event.target.value.trim() &&
      event.target.value.trim() !== this.images[i].imageDescription
    ) {
      const description = event.target.value.trim();
      const response = await this.stepTwoService.updateListingImageDescription(
        Number(this.listingId),
        +imagePathId,
        description
      );
      if (response && response.success && response.data) {
        this.images[i].imageDescription = response.data.imageDescription;
      }
    }
  }

  async onClickNext(): Promise<void> {
    if (this.images.length < 5) {
      const dialogData = {
        title: 'You need at least 5 photos.',
        message:
          'You can skip this step, but you won’t be able to publish the location.',
        cancelBtnText: 'Back to photos',
        confirmBtnText: 'Skip this step',
      };

      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        width: '550px',
        data: dialogData,
        disableClose: false,
        panelClass: [
          'animate__animated',
          'animate__fadeInDown',
          'animate__faster',
        ],
      });

      dialogRef.afterClosed().subscribe(async (dialogResult) => {
        if (dialogResult === true) {
          const positions: ImagePosition[] = [];
          this.images.map((img, i) => {
            positions.push({
              id: Number(img.id),
              position: i + 1,
            });
          });
          const payload = {
            listingId: Number(this.listingId),
            data: positions,
          };
          const response =
            await this.stepTwoService.updateListingImagePositions(payload);
          if (response && response.success) {
            const stepCompleteRes =
              await this.stepTwoService.updateIsStepTwoCompleted(
                Number(this.listingId),
                true
              );
            if (stepCompleteRes && stepCompleteRes.success) {
              this.router.navigateByUrl(this.nxtBtnRoute);
            }
          }
        }
      });
    } else {
      const positions: ImagePosition[] = [];
      this.images.map((img, i) => {
        positions.push({
          id: Number(img.id),
          position: i + 1,
        });
      });
      const payload = {
        listingId: Number(this.listingId),
        data: positions,
      };
      const response = await this.stepTwoService.updateListingImagePositions(
        payload
      );
      if (response && response.success) {
        const stepCompleteRes =
          await this.stepTwoService.updateIsStepTwoCompleted(
            Number(this.listingId),
            true
          );
        if (stepCompleteRes && stepCompleteRes.success) {
          this.router.navigateByUrl(this.nxtBtnRoute);
        }
      }
    }
  }

  entered($event: CdkDragEnter): void {
    moveItemInArray(this.images, $event.item.data, $event.container.data);
  }

  moveUp(index: number) {
    moveItemInArray(this.images, index, index - 1);
  }

  moveDown(index: number): void {
    moveItemInArray(this.images, index, index + 1);
  }
}
