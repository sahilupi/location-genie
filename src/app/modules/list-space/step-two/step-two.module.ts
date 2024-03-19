import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StepTwoRoutingModule } from './step-two-routing.module';
import { StepTwoFifthPageComponent } from './step-two-fifth-page/step-two-fifth-page.component';
import { StepTwoFourthPageComponent } from './step-two-fourth-page/step-two-fourth-page.component';
import { StepTwoThirdPageComponent } from './step-two-third-page/step-two-third-page.component';
import { StepTwoSecondPageComponent } from './step-two-second-page/step-two-second-page.component';
import { StepTwoOnePageComponent } from './step-two-one-page/step-two-one-page.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FileDragNDropDirective } from 'src/app/directives/file-drag-n-drop.directive';
import { DragDropModule } from '@angular/cdk/drag-drop';

@NgModule({
  declarations: [
    FileDragNDropDirective,
    StepTwoFifthPageComponent,
    StepTwoFourthPageComponent,
    StepTwoThirdPageComponent,
    StepTwoSecondPageComponent,
    StepTwoOnePageComponent,
  ],
  imports: [
    CommonModule,
    StepTwoRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    DragDropModule,
  ],
})
export class StepTwoModule {}
