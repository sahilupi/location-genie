import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BookingsListComponent } from './bookings-list/bookings-list.component';
import { BookingDetailComponent } from './booking-detail/booking-detail.component';
import { bookingDetailResolver } from 'src/app/resolvers/booking-detail.resolver';
import { bookingListResolver } from 'src/app/resolvers/booking-list.resolver';

const routes: Routes = [
  {
    path: '',
    component: BookingsListComponent,
    resolve: {
      bookingList: bookingListResolver,
    },
  },
  {
    path: ':bookingId',
    component: BookingDetailComponent,
    resolve: {
      bookingDetails: bookingDetailResolver,
    },
  },
  {
    path: ':bookingId/success',
    component: BookingDetailComponent,
    resolve: {
      bookingDetails: bookingDetailResolver,
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BookingsRoutingModule {}
