import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Project } from 'src/app/models/project.model';
import { ProjectService } from 'src/app/services/project.service';

@Component({
  selector: 'app-edit-project',
  templateUrl: './edit-project.component.html',
  styleUrls: ['./edit-project.component.scss'],
})
export class EditProjectComponent implements OnInit {
  isSubmitted = false;
  editProjectForm: FormGroup;
  heading: string = 'Add New Project';
  today = new Date();
  isPastDate = false;

  constructor(
    public datePipe: DatePipe,
    public dialogRef: MatDialogRef<EditProjectComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: { isEdit: boolean; projectData: Project },
    private projectService: ProjectService
  ) {}

  async ngOnInit(): Promise<void> {
    if (this.data.isEdit) this.heading = 'Edit Project';

    await this.editProjectFormInit();
  }

  private async editProjectFormInit(): Promise<void> {
    this.isPastDate =
      this.data.isEdit &&
      new Date(this.data.projectData.startDate) < this.today;
    this.editProjectForm = new FormGroup({
      id: new FormControl(this.data.isEdit ? this.data.projectData.id : 0),
      title: new FormControl(
        this.data.isEdit ? this.data.projectData.title : null,
        [Validators.required, Validators.maxLength(20)]
      ),
      startDate: new FormControl(
        this.data.isEdit ? new Date(this.data.projectData.startDate) : null,
        [Validators.required]
      ),
      endDate: new FormControl(
        this.data.isEdit ? new Date(this.data.projectData.endDate) : null,
        [Validators.required]
      ),
      description: new FormControl(
        this.data.isEdit ? this.data.projectData.description : null,
        Validators.maxLength(500)
      ),
    });
  }

  async onSubmitForm(): Promise<void> {
    this.isSubmitted = true;
    if (
      !this.editProjectForm.valid &&
      !this.editProjectForm.controls['startDate'].errors?.['matDatepickerMin']
        .actual
    )
      return;

    const data = this.editProjectForm.value;
    data.startDate = this.datePipe.transform(
      this.editProjectForm.value.startDate,
      'MM-dd-yyyy'
    );
    data.endDate = this.datePipe.transform(
      this.editProjectForm.value.endDate,
      'MM-dd-yyyy'
    );
    const response = await this.projectService.addUpdateProject(data);
    if (response && response.success) {
      this.dialogRef.close(response.data);
    }
  }

  closeDlg(): void {
    this.dialogRef.close();
  }

  get c(): { [key: string]: AbstractControl } {
    return this.editProjectForm.controls;
  }
}
