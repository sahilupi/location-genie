import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { BaseResonse, Pagination } from '../models/common.model';
import { RequestBooking } from '../models/listing.model';

@Injectable({
  providedIn: 'root',
})
export class ListingService {
  constructor(private httpService: HttpService) {}

  async getAllListings(
    email: string,
    pagination?: Pagination,
    status?: number
  ): Promise<BaseResonse> {
    return this.httpService.get(
      `/api/Listing/step-one-get-listings-by-user?email=${email}&PaginationFilter.PageNumber=${pagination?.pageNumber}&PaginationFilter.PageSize=${pagination?.pageSize}&listingStatus=${status}`
    );
  }

  async deleteListing(listingId: number): Promise<BaseResonse> {
    return this.httpService.delete(
      `/api/Listing/delete-listing?listingId=${listingId}`
    );
  }

  async getListingDetails(
    listingId: number,
    isEditing?: boolean
  ): Promise<BaseResonse> {
    if (isEditing) {
      return this.httpService.get(
        `/api/Listing/preview-listing?listingId=${listingId}&IsEdit=${true}`
      );
    }

    return this.httpService.get(
      `/api/Listing/preview-listing?listingId=${listingId}&IsEdit=${false}`
    );
  }

  async onRequestBooking(data: RequestBooking): Promise<BaseResonse> {
    return this.httpService.post(`/api/Booking/add-request-booking`, data);
  }

  async getRequestedBooking(listingId: number): Promise<BaseResonse> {
    return this.httpService.get(
      `/api/Booking/get-bookings-by-status?listingId=${listingId}`
    );
  }

  async onPublishListing(listingId: number): Promise<BaseResonse> {
    return this.httpService.put(
      `/api/Listing/listing-status-change-by-listing-id`,
      { listingId }
    );
  }

  async onRequestDeactivateListing(
    listingId: number,
    deactivateReason: string,
    isDeactivateRequestByHost: boolean,
    isActivateRequestByHost: boolean
  ): Promise<BaseResonse> {
    const payload = {
      listingId: listingId,
      deactivateReason: deactivateReason,
      isDeactivateRequestByHost: isDeactivateRequestByHost,
      isActivateRequestByHost: isActivateRequestByHost,
    };
    return this.httpService.put(
      `/api/Listing/active-deactive-request-by-host`,
      payload
    );
  }

  async getListingReviews(
    listingId: number,
    pagination: Pagination
  ): Promise<BaseResonse> {
    return this.httpService.get(
      `/api/Listing/get-reviews?listingId=${listingId}&PageNumber=${pagination.pageNumber}&PageSize=${pagination.pageSize}`
    );
  }

  async postListingReview(data: {
    listingId: number;
    commentText: string;
    rating: number;
    reviewId: number;
  }): Promise<BaseResonse> {
    return this.httpService.post(`/api/Listing/add-update-reviews`, data);
  }

  async updateToSuperHost(listingId: number): Promise<BaseResonse> {
    return this.httpService.put(
      `/api/Profile/update-to-superhost?listingId=${listingId}`,
      {}
    );
  }

  async deleteListingReview(reviewId: number): Promise<BaseResonse> {
    return this.httpService.delete(
      `/api/Listing/delete-reviews?commentId=${reviewId}`
    );
  }

  async getListingReviewsByUser(
    listingId: number,
    pagination: Pagination
  ): Promise<BaseResonse> {
    return this.httpService.get(
      `/api/Listing/get-reviews-by-userid?listingId=${listingId}&PageNumber=${pagination.pageNumber}&PageSize=${pagination.pageSize}`
    );
  }

  async getSimilarLocations(listingId: number): Promise<BaseResonse> {
    return this.httpService.get(
      `/api/Listing/get-similar-locations?listingId=${listingId}`
    );
  }

  async getFindLocationData(): Promise<BaseResonse> {
    return this.httpService.get(
      `/api/Listing/get-all-category-subcategory-data`
    );
  }

  async searchLocations(data: {
    city: string;
    selectedActivity: string;
    paginationFilter: Pagination;
    noOfAttendees: string;
    minimumHours: string;
    locationAllows: string[];
    priceFromTo: string;
    locationTitle: string;
  }): Promise<BaseResonse> {
    return this.httpService.post(`/api/Listing/homepage-search`, data);
  }

  async getAllActivities(): Promise<BaseResonse> {
    return this.httpService.get(
      `/api/Admin/get-all-activities?PaginationFilter.PageNumber=1&PaginationFilter.PageSize=2000&PaginationFilter.OrderBy=&PaginationFilter.Direction=&Search=`
    );
  }

  async getPopularActivities(): Promise<BaseResonse> {
    return this.httpService.get(`/api/Listing/get-most-popular-activities`);
  }

  async getActivitiesData(): Promise<BaseResonse> {
    return this.httpService.get(`/api/Admin/get-all-activities`);
  }

  async getFeaturesData(): Promise<BaseResonse> {
    return this.httpService.get(`/api/Admin/get-all-key-feature`);
  }

  async getTypesData(): Promise<BaseResonse> {
    return this.httpService.get(`/api/Admin/get-all-category`);
  }

  async getCityData(): Promise<BaseResonse> {
    return this.httpService.get(`/api/Listing/get-listings-by-city`);
  }

  async getAllCitiesData(): Promise<BaseResonse> {
    return this.httpService.get(`/api/Listing/get-all-cities-list`);
  }

  async getActivitySearchSpaces(id: number): Promise<BaseResonse> {
    return this.httpService.get(
      `/api/HomePage/get-search-listing-activities-based-on-space-performance?id=${id}`
    );
  }

  
  async getActivitySearchPerformance(id: number): Promise<BaseResonse> {
    return this.httpService.get(
      `/api/HomePage/get-search-listing-activities-based-on-performance?id=${id}`
    );
  }

  async getListByValue(key: string, value: string): Promise<BaseResonse> {
    return this.httpService.get(
      `/api/Listing/get-listings-by-footer-value?key=${key}&value=${value}`
    );
  }

  async getBannerCities(): Promise<BaseResonse> {
    return this.httpService.get(`/api/Listing/get-all-cities-list`);
  }
}
