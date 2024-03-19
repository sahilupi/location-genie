import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class GoogleApiService {
  apiKey = environment.googleApiKey;

  constructor(private httpService: HttpService) {}

  async getAddress(country: string): Promise<any> {
    return this.httpService.get(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${country}&key=${this.apiKey}`
    );
  }
}
