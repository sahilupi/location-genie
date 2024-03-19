import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { BaseResonse } from '../models/common.model';
import { TitleModel } from '../models/title.model';

@Injectable({
  providedIn: 'root',
})
export class EditTitleService {
  constructor(private httpService: HttpService) {}

  async getTitle(type: string): Promise<BaseResonse> {
    return this.httpService.get(
      `/api/HomePage/get-homepage-renter-category-by-type?type=${type}`
    );
  }

  async addTitle(data: TitleModel): Promise<BaseResonse> {
    return this.httpService.post(
      '/api/HomePage/add-homepage-renter-category-typeName',
      data
    );
  }

  async updateTitle(data: TitleModel): Promise<BaseResonse> {
    return this.httpService.put(
      '/api/HomePage/update-homepage-renter-category-typeName',
      data
    );
  }
}
