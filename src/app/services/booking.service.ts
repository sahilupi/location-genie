import { Injectable } from '@angular/core';
import { BaseResonse, Pagination } from '../models/common.model';
import { HttpService } from './http.service';

@Injectable({
  providedIn: 'root',
})
export class BookingService {
  constructor(private httpService: HttpService) {}

  async getRequestedBookingByStatus(
    status: number,
    pagination: Pagination
  ): Promise<BaseResonse> {
    const now = new Date();

    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const year = now.getFullYear();

    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');

    const formattedDateTime = `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
    return await this.httpService.get(
      `/api/Booking/get-bookings-by-status?status=${status}&PaginationFilter.PageNumber=${pagination?.pageNumber}&PaginationFilter.PageSize=${pagination?.pageSize}&dateTime=${formattedDateTime}`
    );
  }

  async getBookingById(id: number): Promise<BaseResonse> {
    return await this.httpService.get(
      `/api/Booking/get-request-booking-by-id?id=${id}`
    );
  }

  async createChargeFromCustomer(
    listingId: number,
    statusId: number,
    reason?: string
  ): Promise<BaseResonse> {
    return await this.httpService.post(
      `/api/Payment/create-charge-from-customer`,
      {
        id: listingId,
        status: statusId, //accept: 1, Reject: 2
        reason: reason,
      }
    );
  }

  async cancelBookingByRenter(
    bookingId: number,
    isRenterCancelledBooking: boolean
  ): Promise<BaseResonse> {
    return await this.httpService.put(`/api/Booking/cancel-booking-by-renter`, {
      id: bookingId,
      isRenterCancelledBooking: isRenterCancelledBooking,
    });
  }
}
