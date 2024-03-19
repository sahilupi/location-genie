import { Injectable } from '@angular/core';
import { BaseResonse } from '../models/common.model';
import { HttpService } from './http.service';

@Injectable({
  providedIn: 'root',
})
export class HostService {
  constructor(private httpService: HttpService) {}

  //Banner Section
  async addHostBanner(data: FormData): Promise<BaseResonse> {
    return this.httpService.post(
      '/api/HomePage/add-homepage-host-banner',
      data
    );
  }

  async getBecomeHostByType(type: string): Promise<BaseResonse> {
    return this.httpService.get(
      `/api/HomePage/get-homepage-host-banner-category-by-type?type=${type}`
    );
  }

  async updateHostBanner(data: FormData): Promise<BaseResonse> {
    return this.httpService.put(
      '/api/HomePage/update-homepage-host-banner',
      data
    );
  }

  //Photoshoots Host Section

  async getAllHostData(): Promise<BaseResonse> {
    return this.httpService.get(`/api/HomePage/get-all-homepage-host-data`);
  }

  async addHostPhotoshoots(data: FormData): Promise<BaseResonse> {
    return this.httpService.post(
      '/api/HomePage/add-homepage-host-photoshoot',
      data
    );
  }

  async updateHostPhotoshoots(data: FormData): Promise<BaseResonse> {
    return this.httpService.put(
      '/api/HomePage/update-homepage-host-photoshoot',
      data
    );
  }

  async deleteHostPhotoshoots(id: number | null): Promise<BaseResonse> {
    return this.httpService.delete(
      `/api/HomePage/delete-homepage-host-by-id?id=${id}`
    );
  }
}
