import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StepOneFirstPageComponent } from './step-one-first-page/step-one-first-page.component';
import { StepOneSecondPageComponent } from './step-one-second-page/step-one-second-page.component';
import { StepOneThirdPageComponent } from './step-one-third-page/step-one-third-page.component';
import { ListNewComponent } from './list-new/list-new.component';

const routes: Routes = [
  {
    path: '',
    component: ListNewComponent,
  },
  {
    path: 'address',
    component: ListNewComponent,
  },
  {
    path: 'verify-address',
    component: StepOneFirstPageComponent,
  },
  {
    path: 'location-type',
    component: StepOneSecondPageComponent,
  },
  {
    path: 'location-details',
    component: StepOneThirdPageComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StepOneRoutingModule {}
