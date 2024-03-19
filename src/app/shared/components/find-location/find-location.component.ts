import { Component, HostListener, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DubaiCities } from 'src/app/constants/dubai-emirates';
import { Locations } from 'src/app/constants/locations';
import { EventList } from 'src/app/models/event.model';
import { City } from 'src/app/models/find-location.model';
import { BannerModel } from 'src/app/models/home-edit.model';
import { ListingService } from 'src/app/services/listing.service';

@Component({
  selector: 'app-find-location',
  templateUrl: './find-location.component.html',
  styleUrls: ['./find-location.component.scss'],
})
export class FindLocationComponent implements OnInit {
  @Input({ required: true }) bannerData: BannerModel;
  @Input() isActivitySearch: boolean = false;

  @Input({ required: true }) allActivities: EventList[] = [];
  @Input({ required: true }) popularActivities: EventList[] = [
    ...Locations.popularActivities,
  ];
  searchForm: FormGroup;
  cities: City[] = [];
  showEventList: boolean = false;
  showLocationList: boolean = false;
  currentRoute: string = '';
  showAllActivities = false;
  menuBtnClick = false;
  spaceName: string = '';
  @HostListener('window:click', ['$event'])
  windowClick() {
    if (!this.menuBtnClick) {
      this.onBlurEvent();
    } else {
      this.menuBtnClick = false;
    }
  }

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private listingService: ListingService
  ) {
    DubaiCities.forEach((cityName, i) => {
      this.cities.push({ id: i, name: cityName });
    });
  }

  async ngOnInit(): Promise<void> {
    this.bannerData.locationValue = 'Dubai';
    this.bannerData.locationRoute = 'Dubai';

    if (this.router.url.includes('/book')) {
      this.isActivitySearch = true;
      this.activatedRoute.params.subscribe((param) => {
        if (param['space-name']) {
          const activity = param['space-name'];
          this.currentRoute = activity.split('-').join(' ');
        }
        if (param['title-name']) {
          this.spaceName = param['title-name'];
        }
        if (this.spaceName === 'activities') {
          this.bannerData.eventValue = this.currentRoute.charAt(0).toUpperCase() +
            this.currentRoute.slice(1).toLowerCase();
        }
        if (this.spaceName === 'cities') {
          this.bannerData.locationValue = this.currentRoute.charAt(0).toUpperCase() +
            this.currentRoute.slice(1).toLowerCase();
        }

      });
    } else {
      this.isActivitySearch = false;
    }
    await this.callSearchForm();
    await this.getCities();
  }

  private async getCities() {
    const response = await this.listingService.getBannerCities();
    if (
      response &&
      response.success &&
      response.data &&
      response.data.response &&
      response.data.response.length > 0
    ) {
      const data = [...response.data.response];
      this.cities = [];
      data.forEach((city, i) => {
        this.cities.push({
          id: i + 1,
          name: city,
        });
      });
      if (this.cities && this.cities.length > 0 && this.spaceName && this.spaceName.toLowerCase() === 'cities') {
        this.bannerData.locationValue = this.currentRoute;
        this.bannerData.locationRoute = this.currentRoute.toLowerCase().split(' ').join('-');
        this.searchForm.patchValue({
          location: this.bannerData.locationValue.charAt(0).toUpperCase() +
            this.bannerData.locationValue.slice(1).toLowerCase()
        })
      }
      if (this.cities && this.cities.length > 0 && this.spaceName && this.spaceName.toLowerCase() === 'activities') {
        this.bannerData.locationValue = this.cities[0].name;
        this.bannerData.locationRoute = this.cities[0].name.toLowerCase().split(' ').join('-');
        this.searchForm.patchValue({
          location: this.bannerData.locationValue.charAt(0).toUpperCase() +
            this.bannerData.locationValue.slice(1).toLowerCase()
        })
      }
    }
    // const data = s
  }

  private async callSearchForm(): Promise<void> {
    this.searchForm = new FormGroup({
      location: new FormControl(
        this.spaceName === 'cities'
          ? this.currentRoute.charAt(0).toUpperCase() +
          this.currentRoute.slice(1).toLowerCase()
          : this.bannerData.locationValue
      ),
      event: new FormControl(
        this.spaceName === 'activities'
          ? this.currentRoute.charAt(0).toUpperCase() +
          this.currentRoute.slice(1).toLowerCase()
          : this.bannerData.eventValue
      ),
    });
  }

  preventCloseOnClick(): void {
    this.menuBtnClick = true;
  }

  onSelectLocation(city: City): void {
    this.bannerData.locationValue = city.name;
    this.bannerData.locationRoute = city.name.split(' ').join('-');
  }

  onSelectEvent(eventName: string, id: number): void {
    if (
      eventName.toLowerCase() === 'production' ||
      eventName.toLowerCase() === 'meeting' ||
      eventName.toLowerCase() === 'event'
    ) {
      this.bannerData.type = eventName;
    }
    this.bannerData.eventValue = eventName;
    this.bannerData.id = id;
    const eventValue = eventName.split(' ').join('-');
    this.bannerData.eventRoute = eventValue;
  }

  onFocusEvent(): void {
    this.showEventList = true;
    this.searchForm.patchValue({
      event: '',
    });
  }

  onBlurEvent(): void {
    this.showEventList = false;
    this.searchForm.patchValue({
      event: this.bannerData.eventValue,
    });
  }

  onFocusLocation(): void {
    this.showLocationList = true;
    this.searchForm.patchValue({
      location: '',
    });
  }

  onBlurLocation(): void {
    this.showLocationList = false;
    this.searchForm.patchValue({
      location: this.bannerData.locationValue,
    });
  }

  onSearhLocation(): void {
    if (!this.bannerData.locationRoute || !this.bannerData.eventRoute) return;
    if (
      this.bannerData.type === 'Production' ||
      this.bannerData.type === 'Meeting' ||
      this.bannerData.type === 'Event'
    ) {
      this.bannerData.eventRoute = '';
    } else {
      this.bannerData.type = '';
    }
    this.router.navigateByUrl(
      `/search?location=${this.bannerData.locationRoute}&event=${this.bannerData.eventRoute
      }&id=${this.bannerData.id ? this.bannerData.id : ''}&type=${this.bannerData.type
      }`
    );
  }
}
