import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HostingGuideRoutingModule } from './hosting-guide-routing.module';
import { Slide1Component } from './slide1/slide1.component';
import { Slide2Component } from './slide2/slide2.component';
import { Slide3Component } from './slide3/slide3.component';
import { Slide4Component } from './slide4/slide4.component';
import { Slide5Component } from './slide5/slide5.component';
import { Slide6Component } from './slide6/slide6.component';
import { Slide7Component } from './slide7/slide7.component';


@NgModule({
  declarations: [
    Slide1Component,
    Slide2Component,
    Slide3Component,
    Slide4Component,
    Slide5Component,
    Slide6Component,
    Slide7Component
  ],
  imports: [
    CommonModule,
    HostingGuideRoutingModule
  ]
})
export class HostingGuideModule { }
