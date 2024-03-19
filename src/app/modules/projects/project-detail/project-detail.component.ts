import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Projects } from 'src/app/constants/projects.constant';
import { Project } from 'src/app/models/project.model';
import { SnackBarService } from 'src/app/services/snack-bar.service';
import { EditProjectComponent } from '../edit-project/edit-project.component';
import { SuccessConstant } from 'src/app/constants/success.constant';
import { ShareProjectComponent } from '../share-project/share-project.component';
import { ActivatedRoute } from '@angular/router';
import { ProjectService } from 'src/app/services/project.service';
import { LocalService } from 'src/app/services/local.service';
import { LocalConstant } from 'src/app/constants/local-constant';

@Component({
  selector: 'app-project-detail',
  templateUrl: './project-detail.component.html',
  styleUrls: ['./project-detail.component.scss'],
})
export class ProjectDetailComponent implements OnInit {
  @Input() projectId: string;

  project: Project;
  projectsList: Project[] = Projects.projects;
  inviteLink: string;
  shareLink: string;
  loggedInUserEmail: string;
  projectOwnerEmail: string;

  constructor(
    private dialog: MatDialog,
    private snackbar: SnackBarService,
    private activatedRoute: ActivatedRoute,
    private projectService: ProjectService,
    private localService: LocalService
  ) {}

  async ngOnInit(): Promise<void> {
    const data = await this.localService.getLocalData(LocalConstant.USER_DATA);
    this.loggedInUserEmail = data.user_name;
    await this.getProject();
    await this.getInviteLink(Number(this.projectId));
  }

  private async getProject(): Promise<void> {
    const response = this.activatedRoute.snapshot.data['project'];
    if (response && response.success && response.data) {
      this.project = response.data;
      const projectOwnerEmail = this.project.ownerEmail;
      if (projectOwnerEmail) this.projectOwnerEmail = projectOwnerEmail;
    }
  }

  private async getInviteLink(projectId: number): Promise<void> {
    const response = await this.projectService.getInviteLink(projectId);
    if (response && response.success && response.data) {
      this.inviteLink = response.data.inviteLink;
      this.shareLink = response.data.shareLink;
    }
  }

  editProject(data: Project): void {
    const dialogRef = this.dialog.open(EditProjectComponent, {
      width: '500px',
      disableClose: true,
      autoFocus: false,
      data: {
        isEdit: true,
        projectData: { ...data },
      },
    });

    dialogRef.afterClosed().subscribe((data) => {
      if (data) {
        this.project = data;
        this.snackbar.success(SuccessConstant.PROJECT_UPDATE);
      }
    });
  }

  shareProject(data: Project): void {
    const dialogRef = this.dialog.open(ShareProjectComponent, {
      width: '600px',
      disableClose: true,
      autoFocus: false,
      data: {
        projectData: {
          ...data,
        },
        shareLink: this.shareLink,
        inviteLink: this.inviteLink,
        isOwner: this.projectOwnerEmail === this.loggedInUserEmail,
      },
    });

    dialogRef.afterClosed().subscribe((res) => {
      this.project.isPublic = res;
    });
  }
}
