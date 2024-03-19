import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { ProjectsRoutingModule } from './projects-routing.module';
import { ProjectsListComponent } from './projects-list/projects-list.component';
import { SharedModule } from '../../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EditProjectComponent } from './edit-project/edit-project.component';
import { ProjectDetailComponent } from './project-detail/project-detail.component';
import { ProjectTeamComponent } from './project-team/project-team.component';
import { ProjectLocationsComponent } from './project-locations/project-locations.component';
import { ShareProjectComponent } from './share-project/share-project.component';
import { ProjectTokenVerificationComponent } from './project-token-verification/project-token-verification.component';
import { ProjectCopyComponent } from './project-copy/project-copy.component';

@NgModule({
  declarations: [
    ProjectsListComponent,
    EditProjectComponent,
    ProjectDetailComponent,
    ProjectTeamComponent,
    ProjectLocationsComponent,
    ShareProjectComponent,
    ProjectTokenVerificationComponent,
    ProjectCopyComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ProjectsRoutingModule,
    SharedModule,
    FormsModule,
  ],
  providers: [DatePipe],
})
export class ProjectsModule {}
