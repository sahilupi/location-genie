import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ActivitySearchPageComponent } from './activity-search-page/activity-search-page.component';

const routes: Routes = [
  {
    path: ':space-name/:space-id/:title-name',
    component: ActivitySearchPageComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ActivitySearchRoutingModule { }
