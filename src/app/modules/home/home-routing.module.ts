import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeRootComponent } from './home-root/home-root.component';
import { adminAuthGuard } from 'src/app/guards/admin-auth.guard';

const routes: Routes = [
  {
    path: '',
    component: HomeRootComponent,
    title: 'Location Genie',
  },
  {
    path: 'edit',
    component: HomeRootComponent,
    title: 'Location Genie',
    canActivate: [adminAuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomeRoutingModule {}
