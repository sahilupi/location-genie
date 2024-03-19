import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Project } from 'src/app/models/project.model';
import { EditProjectComponent } from '../edit-project/edit-project.component';
import { ActivatedRoute, Router } from '@angular/router';
import { ProjectService } from 'src/app/services/project.service';
import { LocalService } from 'src/app/services/local.service';
import { LocalConstant } from 'src/app/constants/local-constant';
import { Pagination } from 'src/app/models/common.model';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-projects-list',
  templateUrl: './projects-list.component.html',
  styleUrls: ['./projects-list.component.scss'],
})
export class ProjectsListComponent implements OnInit {
  projectsList: Project[] = [];
  projectOwnerEmail: string;
  loggedInUserEmail: string;
  pagination: Pagination = {
    pageNumber: 1,
    pageSize: 10,
  };
  totalCount: number = 10;
  isFetchingFirstTime = true;

  constructor(
    private dialog: MatDialog,
    private activatedRoute: ActivatedRoute,
    private localService: LocalService,
    private router: Router,
    private projectService: ProjectService
  ) {}

  async ngOnInit(): Promise<void> {
    const data = await this.localService.getLocalData(LocalConstant.USER_DATA);
    this.loggedInUserEmail = data.user_name;
    await this.fetchLatestProjects();
    this.isFetchingFirstTime = false;
  }

  private async fetchLatestProjects(): Promise<void> {
    this.activatedRoute.queryParams.subscribe(async (queryParam) => {
      const pageNumber = queryParam['pageNumber'];
      const pageSize = queryParam['pageSize'];

      if (pageNumber && pageSize) {
        this.pagination.pageNumber = parseInt(pageNumber);
        this.pagination.pageSize = parseInt(pageSize);
        const response = await this.projectService.getProjects(this.pagination);
        if (response && response.totalCount)
          this.totalCount = Number(response.totalCount);

        if (response && response.data && response.data.length > 0) {
          this.projectsList = response.data;
        }
      } else {
        if (this.isFetchingFirstTime) {
          await this.getProjects();
        } else if (!this.isFetchingFirstTime) {
          const response = await this.projectService.getProjects(
            this.pagination
          );
          if (response && response.totalCount)
            this.totalCount = Number(response.totalCount);

          if (response && response.data && response.data.length > 0) {
            this.projectsList = response.data;
          }
        }
        this.pagination.pageNumber = 1;
        this.pagination.pageSize = 10;
      }
    });
  }

  private async getProjects(): Promise<void> {
    const response = this.activatedRoute.snapshot.data['projects'];
    if (response && response.totalCount)
      this.totalCount = Number(response.totalCount);
    if (response && response.data && response.data.length > 0) {
      this.projectsList = response.data;
    }
  }

  addNewProject(): void {
    const dialogRef = this.dialog.open(EditProjectComponent, {
      width: '500px',
      disableClose: true,
      autoFocus: false,
      data: {
        isEdit: false,
      },
    });
    dialogRef.afterClosed().subscribe(async (res) => {
      if (res) {
        await this.fetchLatestProjects();
        // this.projectsList.push(res);
        // this.totalCount++;
      }
    });
  }

  async onDeleteProject(id: number): Promise<void> {
    const response = await this.projectService.deleteProject(id);
    if (response && response.success) {
      await this.fetchLatestProjects();
      this.projectsList = this.projectsList.filter(
        (project) => project.id !== id
      );
      // this.totalCount--;
    }
  }

  async onPageChange(event: PageEvent): Promise<void> {
    this.pagination.pageNumber = event.pageIndex + 1;
    this.pagination.pageSize = event.pageSize;
    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams: {
        pageNumber: this.pagination.pageNumber,
        pageSize: this.pagination.pageSize,
      },
      queryParamsHandling: 'merge',
    });

    const response = await this.projectService.getProjects(this.pagination);
    if (response && response.data && response.data.length > 0) {
      this.projectsList = response.data;
    }
  }
}
