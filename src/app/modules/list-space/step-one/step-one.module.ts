import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GoogleMapsModule } from '@angular/google-maps';

import { StepOneRoutingModule } from './step-one-routing.module';
import { StepOneFirstPageComponent } from './step-one-first-page/step-one-first-page.component';
import { StepOneSecondPageComponent } from './step-one-second-page/step-one-second-page.component';
import { StepOneThirdPageComponent } from './step-one-third-page/step-one-third-page.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ListNewComponent } from './list-new/list-new.component';
import { LocationDetailsFormComponent } from './location-details-form/location-details-form.component';
import { NoZeroInputDirective } from 'src/app/directives/no-zero.directive';

@NgModule({
  declarations: [
    StepOneFirstPageComponent,
    StepOneSecondPageComponent,
    StepOneThirdPageComponent,
    ListNewComponent,
    LocationDetailsFormComponent,
    NoZeroInputDirective,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    StepOneRoutingModule,
    SharedModule,
    GoogleMapsModule,
    FormsModule,
  ],
})
export class StepOneModule {}
