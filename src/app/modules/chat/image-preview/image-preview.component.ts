import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SuccessConstant } from 'src/app/constants/success.constant';
import { SignalrClientService } from 'src/app/services/signalr-client.service';
import { SnackBarService } from 'src/app/services/snack-bar.service';

@Component({
  selector: 'app-image-preview',
  templateUrl: './image-preview.component.html',
  styleUrls: ['./image-preview.component.scss'],
})
export class ImagePreviewComponent {
  title = 'Image Preview';

  constructor(
    public dialogRef: MatDialogRef<ImagePreviewComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      previewLink: string;
      downloadLink: string;
      fileFlag?: boolean;
      messageType?: string;
    },
    private _signalrClientService: SignalrClientService,
    private snackbar: SnackBarService
  ) {
    this.title = this.data.fileFlag ? 'Document preview' : 'Image Preview';
  }

  async downloadImage(): Promise<void> {
    const response = await this._signalrClientService.getBase64Image(
      this.data.downloadLink
    );
    if (response && response.data) {
      const base64Image = 'data:image/jpg;base64,' + response.data;
      const link = document.createElement('a');
      document.body.appendChild(link); // for Firefox
      link.setAttribute('href', base64Image);
      link.setAttribute('download', this.data.downloadLink);
      link.click();
      document.body.removeChild(link);
      this.snackbar.success(SuccessConstant.IMAGE_DOWNLOAD);
      if (this.data.fileFlag) {
        this.snackbar.success(SuccessConstant.DOC_DOWNLOAD);
      } else {
        this.snackbar.success(SuccessConstant.IMAGE_DOWNLOAD);
      }
    }
  }
}
