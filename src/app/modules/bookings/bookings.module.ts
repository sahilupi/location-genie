import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { BookingsListComponent } from './bookings-list/bookings-list.component';
import { BookingComponent } from './booking/booking.component';
import { BookingsRoutingModule } from './bookings-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { BookingDetailComponent } from './booking-detail/booking-detail.component';
import { AddReviewComponent } from './add-review/add-review.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    BookingsListComponent,
    BookingComponent,
    BookingDetailComponent,
    AddReviewComponent,
  ],
  imports: [
    CommonModule,
    BookingsRoutingModule,
    SharedModule,
    ReactiveFormsModule,
  ],
  providers: [DatePipe],
})
export class BookingsModule {}
