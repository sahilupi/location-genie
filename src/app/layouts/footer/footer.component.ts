import { Component, OnInit } from '@angular/core';
import {
  FooterActivity,
  FooterFeatures,
  FooterTypes,
  FooterCities,
} from 'src/app/models/footer.model';
import { footerTabs } from 'src/app/models/home-edit.model';
import { HomeService } from 'src/app/services/home.service';
import { ListingService } from 'src/app/services/listing.service';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent implements OnInit {
  activitiesData: FooterActivity[];
  featuresData: FooterFeatures[];
  typesData: FooterTypes[];
  citiesData: FooterCities[];

  constructor(
    private homeService: HomeService,
    private sharedService: SharedService
  ) { }

  async ngOnInit(): Promise<void> {
    await this.getAllFooterData();
  }

  async getAllFooterData(): Promise<void> {
    const response = await this.homeService.getAllFooterData();
    if (response && response.data) {
      this.activitiesData = response.data.activities;
      this.featuresData = response.data.features;
      this.typesData = response.data.types;
      this.citiesData = response.data.cities;
      this.sharedService.setCities(this.citiesData);
      this.sharedService.citiesData = this.citiesData;
    }
  }

  getRoute(data: footerTabs, key: string): string {
    return (
      '/book/' +
      data.name?.toLowerCase()?.split(' ')?.join('-') +
      '/' +
      btoa(String(data.id)) +
      '/' + key
    );
  }
}
