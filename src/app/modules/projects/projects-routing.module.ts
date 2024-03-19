import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProjectsListComponent } from './projects-list/projects-list.component';
import { ProjectDetailComponent } from './project-detail/project-detail.component';
import { ProjectLocationsComponent } from './project-locations/project-locations.component';
import { ProjectTeamComponent } from './project-team/project-team.component';
import { projectResolver } from 'src/app/resolvers/project.resolver';
import { projectDetailResolver } from 'src/app/resolvers/project-detail.resolver';
import { projectTeamResolver } from 'src/app/resolvers/project-team.resolver';
import { ProjectTokenVerificationComponent } from './project-token-verification/project-token-verification.component';
import { projectLocationsResolver } from 'src/app/resolvers/project-locations.resolver';

const routes: Routes = [
  {
    path: '',
    component: ProjectsListComponent,
    resolve: {
      projects: projectResolver,
    },
  },
  {
    path: ':projectId/invite/:token',
    component: ProjectTokenVerificationComponent,
  },
  {
    path: 'project-detail/:projectId',
    component: ProjectDetailComponent,
    resolve: {
      project: projectDetailResolver,
    },
    children: [
      {
        path: 'locations',
        component: ProjectLocationsComponent,
        resolve: {
          projectLocations: projectLocationsResolver,
        },
      },
      {
        path: 'team',
        component: ProjectTeamComponent,
        resolve: {
          projectTeam: projectTeamResolver,
        },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProjectsRoutingModule {}
