import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { BaseResonse } from '../models/common.model';
import {
  ListingCategory,
  ListingMapPin,
  ListingsDetails,
} from '../models/listing.model';
import { ListingAddress } from '../models/location.model';

@Injectable({
  providedIn: 'root',
})
export class ListingStepOneService {
  constructor(private httpService: HttpService) {}

  async getListingAddress(id: number): Promise<BaseResonse> {
    return this.httpService.get(
      `/api/Listing/step-one-get-listing?listingId=${id}`
    );
  }

  async updateListingAddress(data: ListingAddress): Promise<BaseResonse> {
    return this.httpService.post(
      `/api/Listing/step-one-add-update-listing-address`,
      data
    );
  }

  async getAllLocationTypes(): Promise<BaseResonse> {
    return this.httpService.get(
      `/api/Listing/step-one-get-all-location-categories`
    );
  }

  async getCheckedLocationCategory(listingId: number): Promise<BaseResonse> {
    return this.httpService.get(
      `/api/Listing/step-one-get-listing-location-category?listingId=${listingId}`
    );
  }

  async updateListingLocationCategory(
    data: ListingCategory
  ): Promise<BaseResonse> {
    return this.httpService.post(
      `/api/Listing/step-one-update-listing-location-category`,
      data
    );
  }

  async updateListingLocationDetails(
    data: ListingsDetails
  ): Promise<BaseResonse> {
    return this.httpService.post(
      `/api/Listing/step-one-update-listing-location-detail`,
      data
    );
  }

  async getListingLocationInfo(listingId: number): Promise<BaseResonse> {
    return this.httpService.get(
      `/api/Listing/step-one-get-listing-location-info?listingId=${listingId}`
    );
  }

  async getListingLocationLatAndLngByListingId(
    listingId: number
  ): Promise<BaseResonse> {
    return this.httpService.get(
      `/api/Listing/step-one-get-listing-location-lat-lng?listingId=${listingId}`
    );
  }

  async updateListingLocationPinInfo(
    data: ListingMapPin
  ): Promise<BaseResonse> {
    return this.httpService.post(
      `/api/Listing/step-one-update-listing-location-info`,
      data
    );
  }

  async getCountriesList(): Promise<BaseResonse> {
    return this.httpService.get(`/api/Listing/get-all-countries-isactive`);
  }
}
