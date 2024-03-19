import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { BaseResonse } from '../models/common.model';
import {
  FeatureData,
  ImagePosition,
  ListingCategory,
  ListingTitleDescription,
  SelectedKeyFeaturesDetails,
} from '../models/listing.model';

@Injectable({
  providedIn: 'root',
})
export class ListingStepTwoService {
  constructor(private httpService: HttpService) {}

  async getSubcategoriesByCategory(id: number): Promise<BaseResonse> {
    return this.httpService.get(
      `/api/Listing/step-two-get-subcategories-by-category?listingId=${id}`
    );
  }

  async getCheckedSubcategoriesByCategory(id: number): Promise<BaseResonse> {
    return this.httpService.get(
      `/api/Listing/step-two-get-listing-location-sub-category?listingId=${id}`
    );
  }

  async updateSubcategories(data: ListingCategory): Promise<BaseResonse> {
    return this.httpService.post(
      `/api/Listing/step-two-update-selected-listing-location-subcategory`,
      data
    );
  }

  async updateTitleAndDescription(
    data: ListingTitleDescription
  ): Promise<BaseResonse> {
    return this.httpService.post(
      `/api/Listing/step-two-update-location-title-description`,
      data
    );
  }

  async getKeyFeatures(id: number): Promise<BaseResonse> {
    return this.httpService.get(
      `/api/Listing/step-two-get-key-features?listingId=${id}`
    );
  }

  async getSelectedKeyFeatures(id: number): Promise<BaseResonse> {
    return this.httpService.get(
      `/api/Listing/step-two-get-selected-key-features?listingId=${id}`
    );
  }

  async updateSelectedKeyFeatures(data: ListingCategory): Promise<BaseResonse> {
    return this.httpService.post(
      `/api/Listing/step-two-update-selected-key-features`,
      data
    );
  }

  async updateSelectedKeyFeaturesDetails(
    data: SelectedKeyFeaturesDetails
  ): Promise<BaseResonse> {
    return this.httpService.post(
      `/api/Listing/step-two-update-selected-key-features-details`,
      data
    );
  }

  async updateFeatures(data: FeatureData): Promise<BaseResonse> {
    return this.httpService.post(`/api/Listing/step-two-update-features`, data);
  }

  async getFeatures(listingId: number): Promise<BaseResonse> {
    return this.httpService.get(
      `/api/Listing/step-two-get-features?listingId=${listingId}`
    );
  }

  async getAllKeyFeaturesDetails(listingId: number): Promise<BaseResonse> {
    return this.httpService.get(
      `/api/Listing/step-two-get-all-key-features-details?listingId=${listingId}`
    );
  }

  async getSelectedKeyFeaturesDetails(listingId: number): Promise<BaseResonse> {
    return this.httpService.get(
      `/api/Listing/step-two-get-selected-key-features-details?listingId=${listingId}`
    );
  }

  async addListingImages(images: FormData): Promise<BaseResonse> {
    return this.httpService.post(
      `/api/Listing/step-two-add-listing-images`,
      images
    );
  }

  async getListingImages(listingId: number): Promise<BaseResonse> {
    return this.httpService.get(
      `/api/Listing/step-two-get-listing-images?listingId=${listingId}`
    );
  }

  async deleteListingImage(
    listingId: number,
    imagePathId: number
  ): Promise<BaseResonse> {
    return this.httpService.delete(
      `/api/Listing/step-two-delete-listing-images?listingId=${listingId}&imagePathId=${imagePathId}`
    );
  }

  async updateListingCoverImage(
    listingId: number,
    imagePathId: number
  ): Promise<BaseResonse> {
    return this.httpService.put(
      `/api/Listing/step-two-update-listing-cover-image?listingId=${listingId}&imagePathId=${imagePathId}`,
      ''
    );
  }

  async updateListingImageDescription(
    listingId: number,
    imagePathId: number,
    description: string
  ): Promise<BaseResonse> {
    const data = {
      listingId: listingId,
      imagePathId: imagePathId,
      description: description,
    };
    return this.httpService.put(
      `/api/Listing/step-two-update-listing-image-description`,
      data
    );
  }

  async updateListingImagePositions(payload: {
    listingId: number;
    data: ImagePosition[];
  }): Promise<BaseResonse> {
    return this.httpService.put(
      `/api/Listing/step-two-update-listing-image-position`,
      payload
    );
  }

  async updateIsStepTwoCompleted(
    listingId: number,
    isStepTwoCompleted: boolean
  ): Promise<BaseResonse> {
    return this.httpService.put(
      `/api/Listing/step-two-update-listing-step-two-completed`,
      { listingId, isStepTwoCompleted }
    );
  }

  async getInteriors(listingId: number): Promise<BaseResonse> {
    return this.httpService.get(
      `/api/Listing/step-two-get-all-interior-by-id?listingId=${listingId}`
    );
  }

  async updateInteriors(data: {
    listingId: number;
    interiorFeatureIds: number[];
  }): Promise<BaseResonse> {
    return this.httpService.post(
      `/api/Listing/add-update-selected-interior-feature`,
      data
    );
  }
}
