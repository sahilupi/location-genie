import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HostListingsComponent } from './host-listings/host-listings.component';
import { hostListingsResolver } from 'src/app/resolvers/host-listings.resolver';

const routes: Routes = [
  {
    path: '',
    component: HostListingsComponent,
    resolve: {
      allListings: hostListingsResolver,
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HostListingRoutingModule {}
