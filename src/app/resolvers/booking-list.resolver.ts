import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { BookingService } from '../services/booking.service';
import { Bookings } from '../constants/bookings.constant';
import { Pagination } from '../models/common.model';

export const bookingListResolver: ResolveFn<Promise<any>> = async (
  route,
  state
) => {
  const bookingService = inject(BookingService);
  const bookingStatus = Bookings.bookingStatus;
  const queryParam = route.queryParams;
  const pageNumber = queryParam['pageNumber'];
  const pageSize = queryParam['pageSize'];
  const pagination: Pagination = {
    pageNumber: 1,
    pageSize: 10,
  };
  if (pageNumber && pageSize) {
    pagination.pageNumber = parseInt(pageNumber);
    pagination.pageSize = parseInt(pageSize);
  }
  try {
    if (route.queryParams['tab']) {
      let status =
        //@ts-ignore
        bookingStatus[route.queryParams['tab']];

      if (!status && status !== 0) {
        status = 1;
      }
      return await bookingService.getRequestedBookingByStatus(
        status,
        pagination
      );
    } else {
      let status =
        //@ts-ignore
        bookingStatus[route.queryParams['tab']];
      if (!status && status !== 0) {
        status = 1;
      }
      return await bookingService.getRequestedBookingByStatus(
        status,
        pagination
      );
    }
  } catch (err) {
    return err;
  }
};
