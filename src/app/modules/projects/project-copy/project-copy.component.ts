import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Project } from 'src/app/models/project.model';
import { ProjectService } from 'src/app/services/project.service';

@Component({
  selector: 'app-project-copy',
  templateUrl: './project-copy.component.html',
  styleUrls: ['./project-copy.component.scss'],
})
export class ProjectCopyComponent implements OnInit {
  projects: Project[] = [];
  selectedProjectIds: number[] = [];

  constructor(
    public dialogRef: MatDialogRef<ProjectCopyComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: { projects: Project[]; listingId: number; projectId: number },
    private projectService: ProjectService
  ) {}

  ngOnInit(): void {
    this.projects = this.data.projects;
  }

  onUpdateSelectedIds(id: number, flag?: boolean): void {
    if (flag) {
      this.selectedProjectIds.push(id);
    } else {
      this.selectedProjectIds = this.selectedProjectIds.filter(
        (projectId) => projectId !== id
      );
    }
  }

  async onCopyProjects(): Promise<void> {
    if (!this.selectedProjectIds || this.selectedProjectIds.length <= 0) return;
    const payload = {
      listingId: this.data.listingId,
      projectIds: this.selectedProjectIds,
    };
    const response = await this.projectService.onCopyProject(payload);
    if (response && response.success) {
      this.dialogRef.close(true);
    }
  }
}
