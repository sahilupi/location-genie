import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { LocalConstant } from 'src/app/constants/local-constant';
import { SuccessConstant } from 'src/app/constants/success.constant';
import { ProjectTeam } from 'src/app/models/project.model';
import { LocalService } from 'src/app/services/local.service';
import { ProjectService } from 'src/app/services/project.service';
import { SharedService } from 'src/app/services/shared.service';
import { SnackBarService } from 'src/app/services/snack-bar.service';
import { ConfirmDialogComponent } from 'src/app/shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-project-team',
  templateUrl: './project-team.component.html',
  styleUrls: ['./project-team.component.scss'],
})
export class ProjectTeamComponent implements OnInit, OnDestroy {
  projectTeams: ProjectTeam[];
  defaultUserImageUrl: string = 'assets/images/dummy/dummy-user.jpg';
  loggedInUserEmail: string;
  projectOwnerEmail: string;
  projectChangedSub$: Subscription;
  projectId = 0;

  constructor(
    private activatedRoute: ActivatedRoute,
    private localService: LocalService,
    private dialog: MatDialog,
    private snackbar: SnackBarService,
    private projectService: ProjectService,
    private sharedService: SharedService,
    private router: Router
  ) { }

  async ngOnInit(): Promise<void> {
    this.activatedRoute.parent?.params.subscribe(params => {
      this.projectId = +params['projectId']
    })
    const data = await this.localService.getLocalData(LocalConstant.USER_DATA);
    this.loggedInUserEmail = data.user_name;
    this.projectChangedSub$ = this.sharedService
      .getIsProjectTeamChanged()
      .subscribe(async () => {

        await this.getProjectTeamAfterInvite();
      });
    await this.getProjectTeam();
  }

  private async getProjectTeam(): Promise<void> {
    const response = this.activatedRoute.snapshot.data['projectTeam'];
    if (response && response.success && response.data) {
      if (typeof (response.data) === "string" && response.data === "Not authrized user!") {
        this.router.navigate(['/']);
        this.snackbar.error(response.data);
      } else {
        this.projectTeams = response.data;
        const projectOwner = this.projectTeams.find(
          (user) => user.email === this.loggedInUserEmail && user.isOwner
        );
        if (projectOwner) this.projectOwnerEmail = projectOwner.email;
      }
    }
  }

  private async getProjectTeamAfterInvite(): Promise<void> {
    const response = await this.projectService.getProjectTeam(this.projectId);
    if (response && response.success && response.data) {
      if (typeof (response.data) === "string" && response.data === "Not authrized user!") {
        this.router.navigate(['/']);
        this.snackbar.error(response.data);
      } else {
        this.projectTeams = response.data;
        const projectOwner = this.projectTeams.find(
          (user) => user.email === this.loggedInUserEmail && user.isOwner
        );
        if (projectOwner) this.projectOwnerEmail = projectOwner.email;
      }
    }
  }

  deleteTeamMember(id: number, memebrEmail: string): void {
    const dialogData = {
      title: 'Delete Team Member?',
      message: `Do you really want to delete team member ${memebrEmail}?`,
      cancelBtnText: 'Cancel',
      confirmBtnText: 'Delete',
      isDeleting: true,
    };

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '450px',
      data: dialogData,
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(async (dialogResult) => {
      if (dialogResult === true) {
        const response = await this.projectService.deleteTeamMember(id);
        if (response && response.success) {
          this.projectTeams = this.projectTeams.filter(
            (member) => member.id !== id
          );
          this.snackbar.success(SuccessConstant.MEMBER_DELETED);
        }
      }
    });
  }

  ngOnDestroy(): void {
    this.projectChangedSub$?.unsubscribe();
  }
}
