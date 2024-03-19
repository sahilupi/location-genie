import { Component, HostListener, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { ActivatedRoute, Router } from '@angular/router';
import { GeoLocationData } from 'src/app/constants/geolocations';
import { ListingDetails } from 'src/app/constants/listing-details.constant';
import { Locations } from 'src/app/constants/locations';
import { StepThreeData } from 'src/app/constants/step-three.constant';
import { Pagination } from 'src/app/models/common.model';
import { EventList } from 'src/app/models/event.model';
import { City } from 'src/app/models/find-location.model';
import {
  ListingCoverImage,
  LocationInfo,
  LocationList,
} from 'src/app/models/location.model';
import { ListingPrice } from 'src/app/models/step-three.model';
import { FilterPipe } from 'src/app/pipes/filter.pipe';
import { ListingService } from 'src/app/services/listing.service';
import { ProjectService } from 'src/app/services/project.service';
import { SpinnerService } from 'src/app/services/spinner.service';

@Component({
  selector: 'app-search-locations',
  templateUrl: './search-locations.component.html',
  styleUrls: ['./search-locations.component.scss'],
  providers: [FilterPipe],
})
export class SearchLocationsComponent implements OnInit {
  center = { ...GeoLocationData.center };
  markers = [...GeoLocationData.markersForSearch];
  locations: LocationList[] = [];
  tempLocations: LocationList[] = [];
  selectedProjectListings: number[] = [];
  showGoogleMaps: boolean = false;
  location: string = 'Dubai';
  tempLocation: string = 'Dubai';
  zoom: number = 8;
  isLoadingMap = false;
  isLoading = false;
  id: string = '';
  type: string = '';
  tempType: string = '';
  noOfAttendees: string = ''; //1-5 people
  event: string = '';
  tempEvent: string = '';
  minimumHours: string = '';
  locationAllows: string[] = [];
  cities: City[] = [];
  tempCities: City[] = [];
  minimumHoursSliderValue = '12';
  fromPrice = '0';
  toPrice = '1000';
  locationTitle = '';
  isInitializing = true;
  allActivities: EventList[] = [...Locations.popularActivities];
  tempActivities: EventList[] = [];
  attendies = [...ListingDetails.attendiesDropdown];
  locationsRules = [...StepThreeData.rules];
  showFilterOptions = false;
  pagination: Pagination = {
    pageNumber: 1,
    pageSize: 24,
  };
  totalCount = 0;
  titleSearch: FormGroup;
  showCitiesList = false;
  showEventList = false;
  menuBtnClick = false;

  @HostListener('window:click', ['$event'])
  windowClick() {
    if (!this.menuBtnClick) {
      this.showFilterOptions = false;
    } else {
      this.menuBtnClick = false;
    }
  }

  constructor(
    private projectService: ProjectService,
    private activatedRoute: ActivatedRoute,
    private listingService: ListingService,
    private spinner: SpinnerService,
    private router: Router,
    private filter: FilterPipe
  ) {}

  async ngOnInit(): Promise<void> {
    if (this.activatedRoute.snapshot.queryParams['location']) {
      const location: string =
        this.activatedRoute.snapshot.queryParams['location'];
      this.location = location.split('-').join(' ');
      this.tempLocation = location.split('-').join(' ');
    }

    this.id = this.activatedRoute.snapshot.queryParams['id'];
    this.type = this.activatedRoute.snapshot.queryParams['type'];
    this.tempType = this.activatedRoute.snapshot.queryParams['type'];
    if (this.activatedRoute.snapshot.queryParams['event']) {
      const event = this.activatedRoute.snapshot.queryParams['event'];
      this.event = event.split('-').join(' ');
      this.tempEvent = event.split('-').join(' ');
    }

    if (
      this.type === 'Production' ||
      this.type === 'Meeting' ||
      this.type === 'Event'
    ) {
      this.event = '';
    } else {
      this.type = '';
    }

    if (this.activatedRoute.snapshot.queryParams['fromPrice']) {
      this.fromPrice = this.activatedRoute.snapshot.queryParams['fromPrice'];
    }
    if (this.activatedRoute.snapshot.queryParams['toPrice']) {
      this.toPrice = this.activatedRoute.snapshot.queryParams['toPrice'];
    }
    if (this.activatedRoute.snapshot.queryParams['pageNumber']) {
      this.pagination.pageNumber =
        this.activatedRoute.snapshot.queryParams['pageNumber'];
    }

    if (this.activatedRoute.snapshot.queryParams['pageSize']) {
      this.pagination.pageSize =
        this.activatedRoute.snapshot.queryParams['pageSize'];
    }

    if (this.activatedRoute.snapshot.queryParams['noOfAttendees']) {
      this.noOfAttendees =
        this.activatedRoute.snapshot.queryParams['noOfAttendees'];
    }

    this.minimumHours =
      this.activatedRoute.snapshot.queryParams['minimumHours'];
    if (this.minimumHours) {
      this.minimumHoursSliderValue = this.minimumHours;
    }

    if (this.activatedRoute.snapshot.queryParams['locationAllows']) {
      this.locationAllows =
        this.activatedRoute.snapshot.queryParams['locationAllows'];
      if (typeof this.locationAllows === 'string') {
        // @ts-ignore
        this.locationAllows = this.locationAllows.split(':');
      }
      this.locationsRules.forEach((rule) => {
        if (this.locationAllows.includes(rule.name)) {
          rule.checked = true;
        }
      });
    }

    this.spinner.show();
    this.isLoading = true;
    try {
      await this.titleSearchFormInit();
      if (this.activatedRoute.snapshot.queryParams['locationTitle']) {
        this.locationTitle =
          this.activatedRoute.snapshot.queryParams['locationTitle'];
        this.titleSearch.patchValue({
          locationTitle: this.locationTitle,
        });
      }
      await this.searchLocations(
        this.location,
        this.event,
        this.type,
        this.noOfAttendees,
        this.minimumHours,
        this.locationAllows,
        this.fromPrice,
        this.toPrice,
        this.locationTitle
      );
      await this.getCities();
      await this.getAllActivities();
      this.isInitializing = false;
      this.isLoading = false;
      this.spinner.hide();
    } catch (error) {
      this.spinner.hide();
      this.isInitializing = false;
      this.isLoading = false;
    }

    setTimeout(() => {
      if (window.innerWidth > 991) {
        this.showGoogleMaps = true;
      }
    }, 100);
  }

  private async titleSearchFormInit(): Promise<void> {
    this.titleSearch = new FormGroup({
      locationTitle: new FormControl(null),
    });
  }

  private async getAllActivities() {
    const response = await this.listingService.getAllActivities();
    if (response && response.success && response.data.response) {
      const activityData = response.data.response;
      activityData.forEach((activity: { activityName: string; id: number }) => {
        this.allActivities.push({
          name: activity.activityName,
          value: activity.activityName,
          id: activity.id,
        });
      });
      this.allActivities = this.allActivities.filter((obj, index) => {
        return (
          index === this.allActivities.findIndex((o) => obj.name === o.name)
        );
      });

      this.tempActivities = [...this.allActivities];
    }
  }

  protected async searchLocations(
    location: string,
    event: string,
    type: string,
    noOfAttendees: string,
    minimumHours: string,
    locationAllows: string[] = [],
    fromPrice: string,
    toPrice: string,
    locationTitle: string
  ): Promise<void> {
    if (location || event) {
      if (locationAllows && typeof locationAllows === 'string') {
        //@ts-ignore
        locationAllows = locationAllows.split(':');
      }
      const payload = {
        type: type ? type : '',
        city: location,
        selectedActivity: event ? event : '',
        paginationFilter: {
          pageNumber: this.pagination.pageNumber,
          pageSize: this.pagination.pageSize,
          orderBy: '',
          direction: '',
        },
        noOfAttendees,
        minimumHours,
        locationAllows,
        priceFromTo: fromPrice + '-' + toPrice,
        locationTitle: locationTitle,
      };
      this.isLoadingMap = true;
      try {
        const response = await this.listingService.searchLocations(payload);
        this.locations = [];
        if (
          response &&
          response.success &&
          response.data &&
          response.data.response
        ) {
          if (response.data.totalCount) {
            this.totalCount = response.data.totalCount;
          }
          response.data.response.forEach(
            (element: {
              listing: LocationList;
              listingPrice: ListingPrice;
              coverImagePaths: ListingCoverImage[];
              listingLocationInfo: LocationInfo;
            }) => {
              const location = element;
              const listing = location.listing;
              listing.listing = location.listing;
              listing.listingId = Number(location.listing.id);
              listing.listing.image = element.coverImagePaths[0].imageFullPath;
              listing.listingPrice = element.listingPrice;
              this.locations.push(listing);
              this.markers = [];
              this.locations.map((location) => {
                this.markers.push({
                  position: {
                    lat: Number(location.listingLocationInfo?.latitude),
                    lng: Number(location.listingLocationInfo?.longitude),
                  },
                  visible: true,
                  opacity: 1,
                  label: {
                    color: ' ',
                    text: ' ',
                  },
                  title: location.locationTitle,
                  options: {
                    draggable: false,
                  },
                });
              });
              this.tempLocations = [...this.locations];
            }
          );
          this.center = {
            lat:
              this.markers.reduce((p, c) => p + c.position.lat, 0) /
              this.markers.length,
            lng:
              this.markers.reduce((p, c) => p + c.position.lng, 0) /
              this.markers.length,
          };

          this.selectedProjectListings = [
            ...this.projectService.selectedProjectListings,
          ];
        }
      } catch (error) {
        this.isLoadingMap = false;
      } finally {
        this.isLoadingMap = false;
      }
    }

    if (!this.isInitializing) {
      this.router.navigate([], {
        relativeTo: this.activatedRoute,
        queryParams: {
          location: location,
          event: event,
          type: type,
          noOfAttendees: noOfAttendees,
          minimumHours: minimumHours,
          locationAllows: locationAllows.join(':'),
          pageNumber: this.pagination.pageNumber,
          pageSize: this.pagination.pageSize,
          fromPrice: this.fromPrice,
          toPrice: this.toPrice,
          locationTitle: this.locationTitle,
        },
        queryParamsHandling: 'merge',
      });
    }
  }

  protected async onSearchByTitle(): Promise<void> {
    const locationTitle = this.titleSearch.value.locationTitle;
    this.locationTitle = locationTitle;
    await this.searchLocations(
      this.location,
      this.event,
      this.type,
      this.noOfAttendees,
      this.minimumHoursSliderValue.toString(),
      this.locationAllows,
      this.fromPrice,
      this.toPrice,
      locationTitle
    );
  }

  protected async clearTitleName(): Promise<void> {
    if (!this.titleSearch.value.locationTitle) {
      return;
    }

    this.titleSearch.patchValue({
      locationTitle: null,
    });
    this.locationTitle = '';
    await this.searchLocations(
      this.location,
      this.event,
      this.type,
      this.noOfAttendees,
      this.minimumHoursSliderValue.toString(),
      this.locationAllows,
      this.fromPrice,
      this.toPrice,
      this.locationTitle
    );
  }

  protected async onSelectCity(city: City): Promise<void> {
    if (this.location.toLowerCase() === city.name.toLowerCase()) return;
    this.location = city.name;
    this.tempLocation = city.name;
    await this.searchLocations(
      this.location,
      this.event,
      this.type,
      this.noOfAttendees,
      this.minimumHoursSliderValue.toString(),
      this.locationAllows,
      this.fromPrice,
      this.toPrice,
      this.locationTitle
    );
  }

  protected async onSelectActivity(event: EventList): Promise<void> {
    if (
      this.event.toLowerCase() === event.name.toLowerCase() ||
      this.type.toLowerCase() === event.name.toLowerCase()
    )
      return;
    this.event = event.name;
    this.type = event.name;
    this.tempType = event.name;
    this.tempEvent = event.name;
    if (
      this.type === 'Production' ||
      this.type === 'Meeting' ||
      this.type === 'Event'
    ) {
      this.event = '';
      this.tempEvent = '';
    } else {
      this.type = '';
      this.tempType = '';
    }
    await this.searchLocations(
      this.location,
      this.event,
      this.type,
      this.noOfAttendees,
      this.minimumHoursSliderValue.toString(),
      this.locationAllows,
      this.fromPrice,
      this.toPrice,
      this.locationTitle
    );
  }

  protected async checkIfToSearch(): Promise<void> {
    if (
      (!this.titleSearch.value.locationTitle ||
        this.titleSearch.value.locationTitle.trim() === '') &&
      this.locationTitle !== this.titleSearch.value.locationTitle
    ) {
      const locationTitle = this.titleSearch.value.locationTitle;
      this.locationTitle = locationTitle;
      await this.searchLocations(
        this.location,
        this.event,
        this.type,
        this.noOfAttendees,
        this.minimumHoursSliderValue.toString(),
        this.locationAllows,
        this.fromPrice,
        this.toPrice,
        this.locationTitle
      );
    }
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

      this.tempCities = [...this.cities];
    }
    // const data = s
  }

  preventCloseOnClick(): void {
    this.menuBtnClick = true;
  }

  onFilterCity(event: any): void {
    this.cities = this.tempCities;
    const key = event.keyCode;
    if (key === 8 || key === 46) {
      this.cities = this.filter.transform(this.cities, event.target.value);
    } else {
      this.cities = this.filter.transform(this.cities, event.target.value);
    }
  }

  onFilterEvent(event: any): void {
    this.allActivities = this.tempActivities;
    const key = event.keyCode;
    if (key === 8 || key === 46) {
      this.allActivities = this.filter.transform(
        this.allActivities,
        event.target.value
      );
    } else {
      this.allActivities = this.filter.transform(
        this.allActivities,
        event.target.value
      );
    }
  }

  protected async clearAllFilters(): Promise<void> {
    if (
      this.type === 'Production' ||
      this.type === 'Meeting' ||
      this.type === 'Event'
    ) {
      this.event = '';
    } else {
      this.type = '';
    }

    this.router.navigateByUrl(
      `/search?location=${this.location.split(' ').join('-')}&event=${
        this.event
      }&type=${this.type}`
    );

    setTimeout(() => location.reload());
  }

  async onCheckRules(
    ruleName: string,
    ruleChecked: boolean | null | undefined
  ): Promise<void> {
    if (ruleChecked) {
      this.locationAllows.push(ruleName);
    } else {
      this.locationAllows = this.locationAllows.filter(
        (name) => name !== ruleName
      );
    }

    await this.searchLocations(
      this.location,
      this.event,
      this.type,
      this.noOfAttendees,
      this.minimumHoursSliderValue.toString(),
      this.locationAllows,
      this.fromPrice,
      this.toPrice,
      this.locationTitle
    );
  }

  async toggleMaps(): Promise<void> {
    this.showGoogleMaps = !this.showGoogleMaps;
    this.locations = [];
    setTimeout(() => {
      this.locations = [...this.tempLocations];
    });
  }

  toggleFilterOptions(): void {
    this.showFilterOptions = !this.showFilterOptions;
  }

  async onPageChange(event: PageEvent): Promise<void> {
    this.pagination.pageNumber = event.pageIndex + 1;
    this.pagination.pageSize = event.pageSize;
    await this.searchLocations(
      this.location,
      this.event,
      this.type,
      this.noOfAttendees,
      this.minimumHoursSliderValue.toString(),
      this.locationAllows,
      this.fromPrice,
      this.toPrice,
      this.locationTitle
    );
  }
}
