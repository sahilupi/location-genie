import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { BaseResonse, Pagination } from '../models/common.model';
import { PopularLocation, ProjectLocation } from '../models/location.model';

@Injectable({
  providedIn: 'root',
})
export class HomeService {
  constructor(private httpService: HttpService) { }

  async getHomeEditSection(type: string): Promise<BaseResonse> {
    return this.httpService.get(
      `/api/HomePage/get-homepage-renter-category-by-type?type=${type}`
    );
  }

  async addHomeBanner(data: FormData): Promise<BaseResonse> {
    return this.httpService.post(
      '/api/HomePage/add-homepage-renter-banner',
      data
    );
  }

  async updateHomeBanner(data: FormData): Promise<BaseResonse> {
    return this.httpService.put(
      '/api/HomePage/update-homepage-renter-banner',
      data
    );
  }

  async addHomeSpaces(data: FormData): Promise<BaseResonse> {
    return this.httpService.post(
      '/api/HomePage/add-homepage-renter-category',
      data
    );
  }

  async updateHomeSpaces(data: FormData): Promise<BaseResonse> {
    return this.httpService.put(
      '/api/HomePage/update-homepage-renter-category',
      data
    );
  }

  async deleteSourceSpace(id: number | null): Promise<BaseResonse> {
    return this.httpService.delete(
      `/api/HomePage/delete-homepage-renter-category?categoryId=${id}`
    );
  }

  async deleteProfessionalLocation(id: number | null): Promise<BaseResonse> {
    return this.httpService.delete(
      `/api/HomePage/delete-homepage-renter-tiles?tilesId=${id}`
    );
  }

  // edit events
  async addHomeTielsData(data: FormData): Promise<BaseResonse> {
    return this.httpService.post(
      '/api/HomePage/add-homepage-renter-tiles',
      data
    );
  }

  async upadteHomeTielsData(data: FormData): Promise<BaseResonse> {
    return this.httpService.put(
      '/api/HomePage/update-homepage-renter-tiles',
      data
    );
  }

  async updateLocationPosition(data: FormData): Promise<BaseResonse> {
    return this.httpService.post(
      '/api/HomePage/add-homepage-renter-category',
      data
    );
  }

  async getAllListings(data: Pagination, search: string): Promise<BaseResonse> {
    return this.httpService.get(
      `/api/Listing/step-one-get-all-listings?PaginationFilter.PageNumber=${data?.pageNumber}&PaginationFilter.PageSize=${data?.pageSize}&Search=${search}`
    );
  }

  async getAllPopularLocations(): Promise<BaseResonse> {
    return this.httpService.get(
      `/api/HomePage/get-all-homepage-renter-most-popular-locations`
    );
  }

  async addUpdatePopularDestinations(
    data: PopularLocation[]
  ): Promise<BaseResonse> {
    return this.httpService.post(
      `/api/HomePage/add-update-homepage-most-popular-locations`,
      { data }
    );
  }

  async getAllTilesData(): Promise<BaseResonse> {
    return this.httpService.get(`/api/HomePage/get-all-homepage-renter-tiles`);
  }

  async getAllHomeData(): Promise<BaseResonse> {
    return this.httpService.get(`/api/HomePage/get-homepage-renter-all-data`);
  }

  async getTilesDataByType(type: string): Promise<BaseResonse> {
    return this.httpService.get(
      `/api/HomePage/get-homepage-renter-tiles-by-type?type=${type}`
    );
  }

  async getAllFooterData(): Promise<BaseResonse> {
    return this.httpService.get(`/api/HomePage/get-footer-data`);
  }

  async getHomepageBannerData(): Promise<BaseResonse> {
    return this.httpService.get(`/api/HomePage/get-homepage-banner-data`);
  }

  async addCustomerNeed(data: ProjectLocation): Promise<BaseResonse> {
    return this.httpService.post(`/api/HomePage/add-customer-need`, data);
  }
}