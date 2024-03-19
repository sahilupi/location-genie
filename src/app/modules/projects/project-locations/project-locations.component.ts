import { NumberSymbol } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { LocalConstant } from 'src/app/constants/local-constant';
import { Projects } from 'src/app/constants/projects.constant';
import { SuccessConstant } from 'src/app/constants/success.constant';
import { ProjectLocation } from 'src/app/models/project.model';
import { LocalService } from 'src/app/services/local.service';
import { ProjectService } from 'src/app/services/project.service';
import { SnackBarService } from 'src/app/services/snack-bar.service';
import { ConfirmDialogComponent } from 'src/app/shared/components/confirm-dialog/confirm-dialog.component';
import { ProjectCopyComponent } from '../project-copy/project-copy.component';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-project-locations',
  templateUrl: './project-locations.component.html',
  styleUrls: ['./project-locations.component.scss'],
})
export class ProjectLocationsComponent implements OnInit {
  isStatusOpen: boolean[] = [];
  projectLocation: ProjectLocation[];
  dummyImage = 'assets/images/dummy/default_image.png';
  loggedInUserEmail: string;
  comments: string[] = [];
  projectId: string;
  projectLocationStatus: any = Projects.projectLocationStatus;
  projectLocationStatusColors: any = Projects.projectLocationStatusColors;
  statusData = {
    name: 'Needs Review',
    color: this.projectLocationStatusColors[1],
  };

  constructor(
    private activatedRoute: ActivatedRoute,
    private projectService: ProjectService,
    private dialog: MatDialog,
    private snackbar: SnackBarService,
    private projectSerive: ProjectService,
    private sharedService: SharedService,
    private localService: LocalService,
    private router: Router,

  ) { }

  async ngOnInit(): Promise<void> {
    this.projectId = this.activatedRoute.parent?.snapshot.params['projectId'];
    const data = await this.localService.getLocalData(LocalConstant.USER_DATA);
    this.loggedInUserEmail = data.user_name;
    await this.getProjectTeam();
  }

  private async getProjectTeam(): Promise<void> {
    const response = this.activatedRoute.snapshot.data['projectLocations'];
    if (response && response.success && response.data) {
      if (typeof (response.data) === "string" && response.data === "Not authrized user!") {
        this.router.navigate(['/']);
        this.snackbar.error(response.data);
      } else {
        this.projectLocation = response.data;
        this.updateLikeDislike();
      }
    }
  }

  private async getLatestProjectTeam(): Promise<void> {
    const locationsData = await this.projectService.getProjectLocations(
      Number(this.projectId)
    );
    if (locationsData && locationsData.success) {
      this.projectLocation = locationsData.data;
      this.updateLikeDislike();
    }
  }

  private updateLikeDislike(): void {
    this.projectLocation.map((user) => {
      this.statusData.color = this.projectLocationStatusColors[user.status];
      user.likeTeamMembers?.map((likeTeam) => {
        if (likeTeam.email === this.loggedInUserEmail) {
          user.isProjectLiked = true;
          return;
        }
      });
    });

    this.projectLocation.map((user) => {
      user.dislikeTeamMembers?.map((dislikeTeam) => {
        if (dislikeTeam.email === this.loggedInUserEmail) {
          user.isProjectDisliked = true;
          return;
        }
      });
    });
  }

  async onChangeStatus(
    name: number,
    color: string,
    index: number,
    id: number,
    projectListingStatus: number
  ): Promise<void> {
    const payload = {
      id,
      projectListingStatus,
    };

    const response = await this.projectService.onUpdateProjectLocationStatus(
      payload
    );
    if (response && response.success) {
      this.projectLocation[index].status = name;
      this.statusData.color = color;
    }
  }

  deleteProjectLocation(id: NumberSymbol): void {
    const dialogData = {
      title: 'Remove Location from Project?',
      message: `Are you sure you want to remove this location from this Project?`,
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
        const response = await this.projectService.deleteProjectLocation(id);
        if (response && response.success) {
          this.projectLocation = this.projectLocation.filter(
            (location) => location.projectListingId !== id
          );
          const response =
            await this.projectSerive.getAllSelectedProjectLocations();
          if (
            response &&
            response.success &&
            response.data &&
            response.data.listingId
          ) {
            this.projectSerive.selectedProjectListings =
              response.data.listingId;
            this.sharedService.setSelectedProjectListings(
              response.data.listingId
            );
          }
          this.snackbar.success(SuccessConstant.LOCATION_DELETED_FROM_PROJECT);
        }
      }
    });
  }

  async onLikeDislikeProjectLocation(
    projectListingId: number,
    isLike: boolean,
    location: ProjectLocation
  ): Promise<void> {
    if (isLike && location.isProjectLiked) {
      return;
    }
    if (!isLike && location.isProjectDisliked) {
      return;
    }
    const payload = {
      projectListingId,
      isLike,
    };

    const response = await this.projectService.onLikeDislikeProjectLocation(
      payload
    );
    if (response && response.success) {
      await this.getLatestProjectTeam();
    }
  }

  async onAddComment(index: number, projectListingId: number): Promise<void> {
    if (!this.comments[index]) return;
    const payload = {
      projectListingId,
      comment: this.comments[index],
    };
    const response = await this.projectService.onAddComment(payload);
    if (response && response.success) {
      await this.getLatestProjectTeam();
      this.comments[index] = '';
    }
  }

  async copyProject(listingId: number): Promise<void> {
    const response = await this.projectService.getProjects();
    if (response && response.success && response.data) {
      const projects = response.data;
      const dialogRef = this.dialog.open(ProjectCopyComponent, {
        width: '600px',
        disableClose: true,
        autoFocus: false,
        data: {
          projects: [...projects],
          listingId: listingId,
          projectId: this.projectId,
        },
      });

      dialogRef.afterClosed().subscribe((res) => {
        if (res) {
          this.snackbar.success(SuccessConstant.LOCATION_COPIED);
        }
      });
    }
  }

  scrollTopElement(id: number) {
    const ele = document.getElementById(String(id));
    if (ele) {
      ele.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }
}
