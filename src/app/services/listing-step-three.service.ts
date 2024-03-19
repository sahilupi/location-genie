import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { BaseResonse } from '../models/common.model';
import {
  ActivityAttendies,
  CalendarData,
  ListingPrice,
  OpeningHour,
} from '../models/step-three.model';

@Injectable({
  providedIn: 'root',
})
export class ListingStepThreeService {
  constructor(private httpService: HttpService) {}

  async updateListingRules(
    listingId: number,
    rules: string,
    additionalRules: string
  ): Promise<BaseResonse> {
    const payload = {
      listingId: listingId,
      rules: rules,
      additionalRules: additionalRules,
    };
    return this.httpService.post(
      `/api/Listing/step-three-update-listing-location-rules`,
      payload
    );
  }

  async getListingRules(listingId: number): Promise<BaseResonse> {
    return this.httpService.get(
      `/api/Listing/step-three-get-listing-location-rule-by-id?listingId=${listingId}`
    );
  }

  async updateOpeningHours(data: OpeningHour): Promise<BaseResonse> {
    return this.httpService.post(
      `/api/Listing/step-three-update-location-opening-hours`,
      data
    );
  }

  async getOpeningHours(listingId: number): Promise<BaseResonse> {
    return this.httpService.get(
      `/api/Listing/step-three-get-listing-location-opening-hours-by-id?listingId=${listingId}`
    );
  }

  async updateWelcomeGuide(
    listingId: number,
    listingWelcomeGuide: string
  ): Promise<BaseResonse> {
    const payload = {
      listingId: listingId,
      listingWelcomeGuide: listingWelcomeGuide,
    };
    return this.httpService.put(
      `/api/Listing/step-three-update-listing-welcome-guide`,
      payload
    );
  }

  async getWelcomeGuide(listingId: number): Promise<BaseResonse> {
    return this.httpService.get(
      `/api/Listing/step-three-get-listing-welcome-guide-by-id?listingId=${listingId}`
    );
  }

  async updateActivityAttendies(data: ActivityAttendies): Promise<BaseResonse> {
    return this.httpService.put(
      `/api/Listing/step-three-update-listing-activities-attendees`,
      data
    );
  }

  async getActivityAttendies(listingId: number): Promise<BaseResonse> {
    return this.httpService.get(
      `/api/Listing/step-three-get-listing-activities-attendees-by-id?listingId=${listingId}`
    );
  }

  async updateBlockedAvailabledates(data: CalendarData): Promise<BaseResonse> {
    return this.httpService.post(
      `/api/Listing/step-three-update-blocked-and-available-dates`,
      data
    );
  }

  async getCalendarData(listingId: number): Promise<BaseResonse> {
    return this.httpService.get(
      `/api/Listing/step-three-get-listing-calendar-data?listingId=${listingId}`
    );
  }

  async updateListingPrice(data: ListingPrice): Promise<BaseResonse> {
    return this.httpService.post(
      `/api/Listing/step-three-update-listing-price`,
      data
    );
  }

  async getListingPrice(listingId: number): Promise<BaseResonse> {
    return this.httpService.get(
      `/api/Listing/step-three-get-listing-price?listingId=${listingId}`
    );
  }

  async blockOrUnblockWeekends(data: {
    listingId: number;
    blockAllWeekends: boolean;
  }): Promise<BaseResonse> {
    return this.httpService.post(
      `/api/Listing/step-three-block-unblock-all-weekends`,
      data
    );
  }

  async blockOrUnblockWeekDays(data: {
    listingId: number;
    blockAllBuisnessDays: boolean;
  }): Promise<BaseResonse> {
    return this.httpService.post(
      `/api/Listing/step-three-block-unblock-all-buisness-days`,
      data
    );
  }

  async updateIsStepThreeCompleted(
    listingId: number,
    isStepThreeCompleted: boolean
  ): Promise<BaseResonse> {
    return this.httpService.put(
      `/api/Listing/step-three-update-listing-step-three-completed`,
      { listingId, isStepThreeCompleted }
    );
  }

  async onCompleteHostingGuide(isHostingGuide: boolean): Promise<BaseResonse> {
    return this.httpService.put(`/api/Listing/update-hosting-guide-key`, {
      isHostingGuide: isHostingGuide,
    });
  }

  async onAcceptRejectBooking(
    listingId: number,
    statusId: number
  ): Promise<BaseResonse> {
    return this.httpService.post(`/api/Booking/update-booking-status-by-host`, {
      id: listingId,
      status: statusId,
    });
  }

  async onUpdateBookingRequestType(
    listingId: number,
    isInstantBooking: boolean
  ): Promise<BaseResonse> {
    return this.httpService.post(
      `/api/Listing/step-three-update-instant-booking`,
      {
        listingId: listingId,
        isInstantBooking: isInstantBooking,
      }
    );
  }

  async onGetBookingRequestType(listingId: number): Promise<BaseResonse> {
    return this.httpService.get(
      `/api/Listing/step-three-get-instant-booking?listingId=${listingId}`
    );
  }

  async getAllCurrencies(): Promise<BaseResonse> {
    return this.httpService.get(`/api/Listing/step-three-get-all-currencies`);
  }

  async getListingPriceSettings(): Promise<BaseResonse> {
    return this.httpService.get(`/api/Payment/get-all-settings`);
  }

  async getActivitiesByEvent(listingId: number): Promise<BaseResonse> {
    return this.httpService.get(
      `/api/Listing/get-activity-list-by-activities?listingId=${listingId}`
    );
  }

  async getSelectedActivitiesByEvent(listingId: number): Promise<BaseResonse> {
    return this.httpService.get(
      `/api/Listing/get-selected-activities?listingId=${listingId}`
    );
  }

  async onUpdateActivitiesByEvent(
    listingId: number,
    activities: string
  ): Promise<BaseResonse> {
    return this.httpService.post(`/api/Listing/update-selected-activities`, {
      listingId: listingId,
      activities: activities,
    });
  }
}
