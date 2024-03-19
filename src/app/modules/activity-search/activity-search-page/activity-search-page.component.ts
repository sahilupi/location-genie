import { Component, OnDestroy, OnInit } from '@angular/core';
import { BannerModel } from 'src/app/models/home-edit.model';
import { HomeConstant } from 'src/app/constants/home.constant';
import { SharedService } from 'src/app/services/shared.service';
import { ProjectService } from 'src/app/services/project.service';
import { Subscription } from 'rxjs';
import {
  ListingImagePathId,
  LocationList,
} from 'src/app/models/location.model';
import { Locations } from 'src/app/constants/locations';
import { ActivatedRoute, Router } from '@angular/router';
import { EventList } from 'src/app/models/event.model';
import { ListingService } from 'src/app/services/listing.service';
import { ListingPrice } from 'src/app/models/step-three.model';
import { HomeService } from 'src/app/services/home.service';

@Component({
  selector: 'app-activity-search-page',
  templateUrl: './activity-search-page.component.html',
  styleUrls: ['./activity-search-page.component.scss'],
})
export class ActivitySearchPageComponent implements OnInit, OnDestroy {
  bannerData: BannerModel = { ...HomeConstant };
  selectedProjectListingSub$: Subscription;
  selectedProjectListings: number[] = [];
  locations: LocationList[] = [];
  isEditingData = false;
  currentRoute: string = '';
  spaceId: string = '';
  allActivities: EventList[] = [];
  popularActivities: EventList[] = [...Locations.popularActivities];
  isLoadingData = false;
  spaceName: string = '';

  constructor(
    private sharedService: SharedService,
    private projectService: ProjectService,
    private listingService: ListingService,
    private activatedRoute: ActivatedRoute,
    private homeService: HomeService
  ) {
    this.sharedService.setStickyHeader(true);

    if (this.projectService.selectedProjectListings.length > 0) {
      this.selectedProjectListings =
        this.projectService.selectedProjectListings;
    } else {
      this.selectedProjectListingSub$ = this.sharedService
        .getSelectedProjectListings()
        .subscribe((res) => {
          this.selectedProjectListings = res;
        });
    }
  }

  async ngOnInit(): Promise<void> {
    this.isLoadingData = true;
    try {
      this.activatedRoute.params.subscribe((param) => {
        const activity = param['space-name'];
        this.spaceId = param['space-id'];
        this.spaceName = param['title-name'];
        this.currentRoute = activity.split('-').join(' ');
      });
      await this.getHomepageBanners();
      await this.getFindLocationData();
      await this.getActivitySearchSpaces(+atob(String(this.spaceId)));
      this.isLoadingData = false;
    } catch (error) {
      this.isLoadingData = false;
    } finally {
      this.isLoadingData = false;
    }
  }

  private async getHomepageBanners(): Promise<void> {
    try {
      const bannersResponse = await this.homeService.getHomepageBannerData();
      const data = [];
      data.push(bannersResponse.data.response);
      await this.getHomeBannerData(data);
    } catch (error) {}
  }

  private async getHomeBannerData(data: BannerModel[]): Promise<void> {
    if (data && data.length > 0) {
      this.bannerData.text = data[data.length - 1].text;
      this.bannerData.bannerId = data[data.length - 1].id;
      this.bannerData.linkText = data[data.length - 1].linkText;
      this.bannerData.link = data[data.length - 1].link;
      this.bannerData.imageUrl = String(
        data[data.length - 1].imagePath &&
          data[data.length - 1].imagePath?.imageFullPath
          ? data[data.length - 1].imagePath?.imageFullPath
          : HomeConstant.imageUrl
      );
    }
  }

  private async getFindLocationData(): Promise<void> {
    try {
      const popularActivityResponse =
        await this.listingService.getPopularActivities();
      if (
        popularActivityResponse &&
        popularActivityResponse.success &&
        popularActivityResponse.data.response
      ) {
        const activityData = popularActivityResponse.data.response;
        activityData.forEach((activity: string) => {
          const parsedActivity = JSON.parse(activity);
          this.popularActivities.push({
            name: parsedActivity.name,
            value: parsedActivity.name,
            id: parsedActivity.id,
          });
        });
      }
    } catch (error) {}
    try {
      const response = await this.listingService.getAllActivities();
      if (response && response.success && response.data.response) {
        const activityData = response.data.response;
        activityData.forEach(
          (activity: { activityName: string; id: number }) => {
            this.allActivities.push({
              name: activity.activityName,
              value: activity.activityName,
              id: activity.id,
            });
          }
        );
        this.allActivities = [...this.popularActivities, ...this.allActivities];
      }
    } catch (error) {}
  }

  private async getActivitySearchSpaces(id: number): Promise<void> {
    if (
      this.spaceName === 'activities' ||
      this.spaceName === 'types' ||
      this.spaceName === 'cities' ||
      this.spaceName === 'features'
    ) {
      try {
        const response = await this.listingService.getListByValue(
          this.spaceName.charAt(0).toUpperCase() +
            this.spaceName.substr(1).toLowerCase(),
          this.currentRoute.charAt(0).toUpperCase() +
            this.currentRoute.substr(1).toLowerCase()
        );

        if (
          response &&
          response.success &&
          response.data.response &&
          response.data.response.length > 0
        ) {
          [...response.data?.response].forEach(
            (element: {
              listing: LocationList;
              id: number;
              locationTitle: string;
              city: string;
              country: string;
              totalCountReviews: number;
              overallRatings: number;
              listingPrice: ListingPrice[];
              listingImagePathIds: ListingImagePathId[];
            }) => {
              const coverImage = element.listingImagePathIds.find(
                (img) => img.coverImagePathId > 0
              );
              const listing = {
                id: Number(element.id),
                listingId: Number(element.id),
                listing: {
                  locationTitle: element.locationTitle,
                  geolocation: {
                    lat: 29.444444,
                    lng: 71.98999,
                  },
                  images: [
                    String(coverImage?.imagePath.imageFullPath),
                    ...element.listingImagePathIds.map(
                      (image) => image.imagePath.imageFullPath
                    ),
                  ],
                  price: 100,
                  slug: '',
                  type: '',
                  image: coverImage
                    ? coverImage.imagePath.imageFullPath
                    : element.listingImagePathIds[0]?.imagePath.imageFullPath,
                  listingAddress: {
                    city: element.city,
                    country: element.country,
                  },
                  listingPrice: element.listingPrice[0],
                  totalCountReviews: element.totalCountReviews,
                  overallRatings: element.overallRatings,
                },
                image: coverImage
                  ? coverImage.imagePath.imageFullPath
                  : element.listingImagePathIds[0]?.imagePath.imageFullPath,
                listingPrice: element.listingPrice[0],
                locationTitle: element.locationTitle,
                listingAddress: {
                  city: element.city,
                  country: element.country,
                },
                images: [
                  String(coverImage?.imagePath.imageFullPath),
                  ...element.listingImagePathIds.map(
                    (image) => image.imagePath.imageFullPath
                  ),
                ],
                geolocation: {
                  lat: 29.444444,
                  lng: 71.98999,
                },
                price: 100,
                slug: '',
                type: '',
              };

              this.locations.push(listing);
            }
          );
        }
      } catch (error) {
        console.log(error);
      }
    } else if(this.spaceName === 'locations' || this.spaceName === 'events' || this.spaceName === 'destinations')  {
      try {
        const response = await this.listingService.getActivitySearchPerformance(id);
        if (
          response &&
          response.success &&
          response.data &&
          response.data.length > 0
        ) {
          [...response.data].forEach(
            (element: {
              listing: LocationList;
              id: number;
              locationTitle: string;
              city: string;
              country: string;
              totalCountReviews: number;
              overallRatings: number;
              listingPrice: ListingPrice[];
              listingImagePathIds: ListingImagePathId[];
            }) => {
              const coverImage = element.listingImagePathIds.find(
                (img) => img.coverImagePathId > 0
              );
              const listing = {
                id: Number(element.id),
                listingId: Number(element.id),
                listing: {
                  locationTitle: element.locationTitle,
                  geolocation: {
                    lat: 29.444444,
                    lng: 71.98999,
                  },
                  images: [
                    String(coverImage?.imagePath.imageFullPath),
                    ...element.listingImagePathIds.map(
                      (image) => image.imagePath.imageFullPath
                    ),
                  ],
                  price: 100,
                  slug: '',
                  type: '',
                  image: coverImage
                    ? coverImage.imagePath.imageFullPath
                    : element.listingImagePathIds[0]?.imagePath.imageFullPath,
                  listingAddress: {
                    city: element.city,
                    country: element.country,
                  },
                  listingPrice: element.listingPrice[0],
                  totalCountReviews: element.totalCountReviews,
                  overallRatings: element.overallRatings,
                },
                image: coverImage
                  ? coverImage.imagePath.imageFullPath
                  : element.listingImagePathIds[0]?.imagePath.imageFullPath,
                listingPrice: element.listingPrice[0],
                locationTitle: element.locationTitle,
                listingAddress: {
                  city: element.city,
                  country: element.country,
                },
                images: [
                  String(coverImage?.imagePath.imageFullPath),
                  ...element.listingImagePathIds.map(
                    (image) => image.imagePath.imageFullPath
                  ),
                ],
                geolocation: {
                  lat: 29.444444,
                  lng: 71.98999,
                },
                price: 100,
                slug: '',
                type: '',
              };

              this.locations.push(listing);
            }
          );
        }
      } catch (error) {
        console.log(error);
      }
    }
    else {
      try {
        const response = await this.listingService.getActivitySearchSpaces(id);
        if (
          response &&
          response.success &&
          response.data &&
          response.data.length > 0
        ) {
          [...response.data].forEach(
            (element: {
              listing: LocationList;
              id: number;
              locationTitle: string;
              city: string;
              country: string;
              totalCountReviews: number;
              overallRatings: number;
              listingPrice: ListingPrice[];
              listingImagePathIds: ListingImagePathId[];
            }) => {
              const coverImage = element.listingImagePathIds.find(
                (img) => img.coverImagePathId > 0
              );
              const listing = {
                id: Number(element.id),
                listingId: Number(element.id),
                listing: {
                  locationTitle: element.locationTitle,
                  geolocation: {
                    lat: 29.444444,
                    lng: 71.98999,
                  },
                  images: [
                    String(coverImage?.imagePath.imageFullPath),
                    ...element.listingImagePathIds.map(
                      (image) => image.imagePath.imageFullPath
                    ),
                  ],
                  price: 100,
                  slug: '',
                  type: '',
                  image: coverImage
                    ? coverImage.imagePath.imageFullPath
                    : element.listingImagePathIds[0]?.imagePath.imageFullPath,
                  listingAddress: {
                    city: element.city,
                    country: element.country,
                  },
                  listingPrice: element.listingPrice[0],
                  totalCountReviews: element.totalCountReviews,
                  overallRatings: element.overallRatings,
                },
                image: coverImage
                  ? coverImage.imagePath.imageFullPath
                  : element.listingImagePathIds[0]?.imagePath.imageFullPath,
                listingPrice: element.listingPrice[0],
                locationTitle: element.locationTitle,
                listingAddress: {
                  city: element.city,
                  country: element.country,
                },
                images: [
                  String(coverImage?.imagePath.imageFullPath),
                  ...element.listingImagePathIds.map(
                    (image) => image.imagePath.imageFullPath
                  ),
                ],
                geolocation: {
                  lat: 29.444444,
                  lng: 71.98999,
                },
                price: 100,
                slug: '',
                type: '',
              };

              this.locations.push(listing);
            }
          );
        }
      } catch (error) {
        console.log(error);
      }
    }
  }

  ngOnDestroy(): void {
    this.selectedProjectListingSub$?.unsubscribe();
    this.sharedService.setStickyHeader(false);
  }
}
