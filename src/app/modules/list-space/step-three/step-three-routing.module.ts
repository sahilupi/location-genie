import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StepThreeFifthPageComponent } from './step-three-fifth-page/step-three-fifth-page.component';
import { StepThreeSecondPageComponent } from './step-three-second-page/step-three-second-page.component';
import { StepThreeFirstPageComponent } from './step-three-first-page/step-three-first-page.component';
import { StepThreeThirdPageComponent } from './step-three-third-page/step-three-third-page.component';
import { StepThreeFourthPageComponent } from './step-three-fourth-page/step-three-fourth-page.component';
import { StepThreeActivitiesComponent } from './step-three-activities/step-three-activities.component';

const routes: Routes = [
  {
    path: 'rules-crews',
    component: StepThreeFirstPageComponent,
  },
  {
    path: 'calendar',
    component: StepThreeSecondPageComponent,
  },
  {
    path: 'activities',
    component: StepThreeThirdPageComponent,
  },
  {
    path: 'activities-detail',
    component: StepThreeActivitiesComponent,
  },
  {
    path: 'pricing',
    component: StepThreeFourthPageComponent,
  },
  {
    path: 'phone-number',
    component: StepThreeFifthPageComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StepThreeRoutingModule {}
