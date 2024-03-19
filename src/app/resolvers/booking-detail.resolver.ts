import { ResolveFn } from '@angular/router';
import { BookingService } from '../services/booking.service';
import { inject } from '@angular/core';

export const bookingDetailResolver: ResolveFn<Promise<any>> = async (
  route,
  state
) => {
  const bookingDescryptedId = route.paramMap.get('bookingId');
  const bookingService = inject(BookingService);
  try {
    const bookingEncryptedId = +atob(String(bookingDescryptedId))
    return await bookingService.getBookingById(Number(bookingEncryptedId));
  } catch (err) {
    return err;
  }
};
