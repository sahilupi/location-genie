import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ListingDetailsComponent } from './listing-details/listing-details.component';
import { listingDetailsResolver } from 'src/app/resolvers/listing-details.resolver';
import { RequestBookingComponent } from './request-booking/request-booking.component';

const routes: Routes = [
  {
    path: 'preview/:list',
    component: ListingDetailsComponent,
    resolve: {
      listingData: listingDetailsResolver,
    },
  },
  {
    path: ':list',
    component: ListingDetailsComponent,
    resolve: {
      listingData: listingDetailsResolver,
    },
  },
  {
    path: 'request-booking/:list',
    component: RequestBookingComponent,
    resolve: {
      listingData: listingDetailsResolver,
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ListingRoutingModule {}
