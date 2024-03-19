import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StepTwoOnePageComponent } from './step-two-one-page/step-two-one-page.component';
import { StepTwoSecondPageComponent } from './step-two-second-page/step-two-second-page.component';
import { StepTwoThirdPageComponent } from './step-two-third-page/step-two-third-page.component';
import { StepTwoFourthPageComponent } from './step-two-fourth-page/step-two-fourth-page.component';
import { StepTwoFifthPageComponent } from './step-two-fifth-page/step-two-fifth-page.component';

const routes: Routes = [
  {
    path: 'styles',
    component: StepTwoOnePageComponent,
  },
  {
    path: 'features',
    component: StepTwoSecondPageComponent,
  },
  {
    path: 'interior',
    component: StepTwoThirdPageComponent,
  },
  {
    path: 'title',
    component: StepTwoFourthPageComponent,
  },
  {
    path: 'photos',
    component: StepTwoFifthPageComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StepTwoRoutingModule {}
