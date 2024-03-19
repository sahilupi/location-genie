import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Project } from 'src/app/models/project.model';
import { EditProjectComponent } from 'src/app/modules/projects/edit-project/edit-project.component';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { SnackBarService } from 'src/app/services/snack-bar.service';
import { SuccessConstant } from 'src/app/constants/success.constant';
import { ShareProjectComponent } from 'src/app/modules/projects/share-project/share-project.component';
import { ProjectService } from 'src/app/services/project.service';

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.scss'],
})
export class ProjectComponent implements OnInit {
  @Input({ required: true }) project: Project;
  @Input({ required: true }) loggedInUserEmail: string;

  @Output() deleteProjectEmitter = new EventEmitter<number>();

  inviteLink: string;
  shareLink: string;
  dummyImage = 'assets/images/dummy/default_image.png';

  constructor(
    private dialog: MatDialog,
    private snackbar: SnackBarService,
    private projectService: ProjectService
  ) {}

  async ngOnInit(): Promise<void> {}

  editProject(data: Project): void {
    const dialogRef = this.dialog.open(EditProjectComponent, {
      width: '500px',
      disableClose: true,
      autoFocus: false,
      data: {
        isEdit: true,
        projectData: data,
      },
    });

    dialogRef.afterClosed().subscribe((data) => {
      if (data) {
        this.project.title = data.title;
        this.project.startDate = data.startDate;
        this.project.endDate = data.endDate;
        this.project.description = data.description;
        this.snackbar.success(SuccessConstant.PROJECT_UPDATE);
      }
    });
  }

  deleteProject(id: number): void {
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
        this.deleteProjectEmitter.emit(id);
        this.snackbar.success(SuccessConstant.PROJECT_DELETED);
      }
    });
  }

  async shareProject(data: Project): Promise<void> {
    await this.getInviteLink(data.id);
    this.dialog.open(ShareProjectComponent, {
      width: '620px',
      disableClose: true,
      autoFocus: false,
      data: {
        projectData: { ...data },
        inviteLink: this.inviteLink,
        shareLink: this.shareLink,
        isOwner: this.loggedInUserEmail === data.ownerEmail,
      },
    });
  }

  private async getInviteLink(projectId: number): Promise<void> {
    const response = await this.projectService.getInviteLink(projectId);
    if (response && response.success && response.data) {
      this.inviteLink = response.data.inviteLink;
      this.shareLink = response.data.shareLink;
    }
  }
}
