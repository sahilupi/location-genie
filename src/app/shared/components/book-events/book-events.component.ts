import { NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EventActivity, EventType } from 'src/app/models/event.model';
import { ListingService } from 'src/app/services/listing.service';

@Component({
  selector: 'app-book-events',
  templateUrl: './book-events.component.html',
  styleUrls: ['./book-events.component.scss'],
  standalone: true,
  imports: [NgIf, NgFor],
})
export class BookEventsComponent implements OnInit {
  public activeRoute: string = '';
  events: EventActivity[] = [];
  meetings: EventActivity[] = [];
  productions: EventActivity[] = [];
  residentials: EventType[] = [];
  commercials: EventType[] = [];
  studios: EventType[] = [];
  transportations: EventType[] = [];
  citiesData = [];

  constructor(private listingService: ListingService, private router: Router) {
    this.activeRoute = this.router.url.split('/')[2];
  }

  async ngOnInit(): Promise<void> {
    await this.getActivitiesData();
  }

  async getActivitiesData(): Promise<void> {
    switch (this.activeRoute) {
      case 'activities': {
        const response = await this.listingService.getActivitiesData();
        if (response && response.data && response.data.response) {
          const data: EventActivity[] = [...response.data.response];
          this.events = data.filter((item) => item.isEvent);
          this.productions = data.filter((item) => item.isProduction);
          this.meetings = data.filter((item) => item.isMeeting);
        }
        break;
      }
      case 'types': {
        const response = await this.listingService.getTypesData();
        if (response && response.data && response.data) {
          const data: EventType[] = [...response.data];
          this.residentials = data.filter((item) => item.categoryType == 1);
          this.commercials = data.filter((item) => item.categoryType == 2);
          this.studios = data.filter((item) => item.categoryType == 3);
          this.transportations = data.filter((item) => item.categoryType == 4);
        }
        break;
      }
      case 'features': {
        const response = await this.listingService.getFeaturesData();
        if (response && response.data) {
          const data: EventType[] = [...response.data];
          this.residentials = data.filter((item) => item.categoryType == 1);
          this.commercials = data.filter((item) => item.categoryType == 2);
          this.studios = data.filter((item) => item.categoryType == 3);
          this.transportations = data.filter((item) => item.categoryType == 4);
        }
        break;
      }
      case 'cities': {
        const response = await this.listingService.getAllCitiesData();
        if (response && response.data && response.data.response) {
          this.citiesData = response.data.response;
        }
        break;
      }
    }
  }

  getRoute(value: string, key: string, id?: number): string {
    return (
      '/book/' +
      value?.toLowerCase()?.split(' ')?.join('-') +
      '/' +
      btoa(String(id)) +
      '/' + key
    );
  }
}
