import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { Slide1Component } from './slide1/slide1.component';
import { Slide2Component } from './slide2/slide2.component';
import { Slide3Component } from './slide3/slide3.component';
import { Slide6Component } from './slide6/slide6.component';
import { Slide5Component } from './slide5/slide5.component';
import { Slide4Component } from './slide4/slide4.component';
import { Slide7Component } from './slide7/slide7.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'slides',
    pathMatch: 'full',
  },
  {
    path: 'slides',
    children: [
      {
        path: 'slide-1',
        component: Slide1Component,
      },
      {
        path: 'slide-2',
        component: Slide2Component,
      },
      {
        path: 'slide-3',
        component: Slide3Component,
      },
      {
        path: 'slide-4',
        component: Slide4Component,
      },
      {
        path: 'slide-5',
        component: Slide5Component,
      },
      {
        path: 'slide-6',
        component: Slide6Component,
      },
      {
        path: 'slide-7',
        component: Slide7Component,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HostingGuideRoutingModule {}
