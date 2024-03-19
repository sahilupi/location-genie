import { Component, OnInit, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TitleModel } from 'src/app/models/title.model';
import { EditTitleService } from 'src/app/services/edit-title.service';

@Component({
  selector: 'app-edit-title',
  templateUrl: './edit-title.component.html',
  styleUrls: ['./edit-title.component.scss'],
})
export class EditTitleComponent implements OnInit {
  editSpaceForm: FormGroup;
  header = 'Edit title';

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: TitleModel,
    public dialogRef: MatDialogRef<EditTitleComponent>,
    private titleService: EditTitleService
  ) {}

  async ngOnInit(): Promise<void> {
    await this.editFormInit();
    if (this.data.header) {
      this.header = this.data.header;
    }
  }

  private async editFormInit(): Promise<void> {
    this.editSpaceForm = new FormGroup({
      typeName: new FormControl(
        this.data && this.data.typeName ? this.data.typeName : null,
        [
          Validators.required,
          Validators.maxLength(this.data.max ? this.data.max : 30),
        ]
      ),
      type: new FormControl(this.data ? this.data.type : null, [
        Validators.required,
        Validators.maxLength(30),
      ]),
      categoryId: new FormControl(
        this.data && this.data.categoryId ? this.data.categoryId : null
      ),
    });
  }

  async onSubmitForm(): Promise<void> {
    if (!this.editSpaceForm.valid) return;
    if (this.data.categoryId) {
      const data = {
        categoryId: +this.data.categoryId,
        type: this.data.type,
        typeName: this.editSpaceForm.value.typeName,
      };
      const response = await this.titleService.updateTitle(data);
      if (response && response.data) {
        this.dialogRef.close(response.data);
      }
    } else {
      const data = {
        type: this.data.type,
        typeName: this.editSpaceForm.value.typeName,
      };
      const response = await this.titleService.addTitle(data);
      if (response && response.data) {
        this.dialogRef.close(response.data);
      }
    }
  }
}
