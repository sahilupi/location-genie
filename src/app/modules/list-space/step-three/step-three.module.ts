import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SharedModule } from 'src/app/shared/shared.module';
import { KendoModule } from 'src/app/shared/modules/kendo-ui/kendo-ui.module';
import { StepThreeRoutingModule } from './step-three-routing.module';
import { StepThreeFirstPageComponent } from './step-three-first-page/step-three-first-page.component';
import { StepThreeSecondPageComponent } from './step-three-second-page/step-three-second-page.component';
import { StepThreeThirdPageComponent } from './step-three-third-page/step-three-third-page.component';
import { StepThreeFourthPageComponent } from './step-three-fourth-page/step-three-fourth-page.component';
import { StepThreeFifthPageComponent } from './step-three-fifth-page/step-three-fifth-page.component';
import { StepThreeActivitiesComponent } from './step-three-activities/step-three-activities.component';
@NgModule({
  declarations: [
    StepThreeFirstPageComponent,
    StepThreeSecondPageComponent,
    StepThreeThirdPageComponent,
    StepThreeFourthPageComponent,
    StepThreeFifthPageComponent,
    StepThreeActivitiesComponent,
  ],
  imports: [
    CommonModule,
    StepThreeRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    FormsModule,
    KendoModule,
  ],
  providers: [DatePipe],
})
export class StepThreeModule { }
