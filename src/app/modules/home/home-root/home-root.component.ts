import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { HomeConstant } from 'src/app/constants/home.constant';
import { LocationCategory } from 'src/app/constants/location-types.constant';
import { Locations } from 'src/app/constants/locations';
import { Spaces } from 'src/app/constants/spaces.constant';
import { SuccessConstant } from 'src/app/constants/success.constant';
import { Types } from 'src/app/constants/types.constant';
import { EventList } from 'src/app/models/event.model';
import {
  BannerModel,
  SpaceCategoryModel,
} from 'src/app/models/home-edit.model';
import { LocationModel, LocationList } from 'src/app/models/location.model';
import { TitleModel } from 'src/app/models/title.model';
import { HomeService } from 'src/app/services/home.service';
import { ListingService } from 'src/app/services/listing.service';
import { SharedService } from 'src/app/services/shared.service';
import { SnackBarService } from 'src/app/services/snack-bar.service';
import { EditTitleComponent } from 'src/app/shared/edit-home-components/edit-title/edit-title.component';

@Component({
  selector: 'app-home-root',
  templateUrl: './home-root.component.html',
  styleUrls: ['./home-root.component.scss'],
})
export class HomeRootComponent implements OnInit, OnDestroy {
  bannerData: BannerModel = { ...HomeConstant };
  isEditingData = false;
  locations: LocationList[] = [...Locations.locatoinsList].slice(-10);
  professionalLocations: LocationModel[] = [
    ...LocationCategory.professionalLocations,
  ];
  professionalLocationsHeader = LocationCategory.header;
  professionalLocationsSubHeader = LocationCategory.subHeader;
  eventLocations: LocationModel[] = [...LocationCategory.dummyLocations].slice(
    0,
    6
  );
  eventLocationsheader = Locations.eventLocationHeader;
  eventLocationsSubHeader = Locations.eventLocationSubHeader;
  destinations: LocationModel[] = [...LocationCategory.dummyLocations].slice(
    0,
    4
  );
  destinationsHeader: string = Locations.popularDestinationHeader;
  sourceSpaces: SpaceCategoryModel[] = [...Spaces.dummySpaces].slice(0, 5);
  workSpaces: SpaceCategoryModel[] = [...Spaces.dummySpaces].slice(0, 5);
  partySpaces: SpaceCategoryModel[] = [...Spaces.dummySpaces].slice(0, 5);
  sourceSpaceType = Types.SPACE_TYPE;
  workSpaceType = Types.WORK_SPACE_TYPE;
  partySpaceType = Types.PARTY_SPACE_TYPE;
  sourceSpaceTitle = Spaces.sourceSpaceTitle;
  discoverEventTitle = Spaces.discoverEventTitle;
  partyVenueTitle = Spaces.partyVenueTitle;
  popularLocationTitle = Spaces.popularLocationTitle;
  popularLocationSubTitle = Spaces.popularLocationSubTitle;
  dummySpace = { ...Spaces.dummySpace };
  dummyLocation = { ...LocationCategory.dummyLocation };
  allActivities: EventList[] = [];
  popularActivities: EventList[] = [...Locations.popularActivities];
  isLoading = false;

  constructor(
    private sharedService: SharedService,
    private router: Router,
    public dialogRef: MatDialogRef<EditTitleComponent>,
    private dialog: MatDialog,
    private snackbar: SnackBarService,
    private listingService: ListingService,
    private homeService: HomeService
  ) {
    this.sharedService.setStickyHeader(true);
    this.isEditingData = this.router.url.includes('edit') ? true : false;
  }

  async ngOnInit(): Promise<void> {
    this.isLoading = true;
    try {
      this.bannerData.imageUrl = '';
      await this.getAllHomeData();
      await this.getFindLocationData();
      this.isLoading = false;
    } catch (error) {
      this.isLoading = false;
    }
  }

  private async getAllHomeData(): Promise<void> {
    const response = await this.homeService.getAllHomeData();
    if (response && response.data) {
      if (response.data.homepageRenterBannerAndCategory) {
        // for home banner //
        const homeBanner = response.data.homepageRenterBannerAndCategory.filter(
          (item: BannerModel) => item.type === Types.HOME_TYPE
        );
        await this.getHomeBannerData(homeBanner);

        // for source spaces //
        const sourceSpaces =
          response.data.homepageRenterBannerAndCategory.filter(
            (item: SpaceCategoryModel) => item.type === Types.SPACE_TYPE
          );
        await this.getSourceSpaceData(sourceSpaces);

        // for work spaces //
        const workSpaces = response.data.homepageRenterBannerAndCategory.filter(
          (item: SpaceCategoryModel) => item.type === Types.WORK_SPACE_TYPE
        );
        await this.getWorkSpaceData(workSpaces);

        // for party spaces //
        const partySpaces =
          response.data.homepageRenterBannerAndCategory.filter(
            (item: SpaceCategoryModel) => item.type === Types.PARTY_SPACE_TYPE
          );
        await this.getPartySpaceData(partySpaces);

        // for source space title //
        const sourceSpaceTitle =
          response.data.homepageRenterBannerAndCategory.filter(
            (item: TitleModel) => item.type === Types.SOURCE_SPACE_TITLE
          );
        await this.getSourceSpaceTitle(sourceSpaceTitle);

        // for work space title //
        const workSpaceTitle =
          response.data.homepageRenterBannerAndCategory.filter(
            (item: TitleModel) => item.type === Types.DISCOVER_EVENT_TITLE
          );
        await this.getDiscoveEventTitle(workSpaceTitle);

        // for party venue title //
        const partyVenueTitle =
          response.data.homepageRenterBannerAndCategory.filter(
            (item: TitleModel) => item.type === Types.PARTY_VENUE_TITLE
          );
        await this.getPartyVenueTitle(partyVenueTitle);

        // for popular location title //
        const popularLocationTitle =
          response.data.homepageRenterBannerAndCategory.filter(
            (item: TitleModel) => item.type === Types.POPULAR_LOCATION_TITLE
          );
        await this.getPopularLocationTitle(popularLocationTitle);

        // for popular location subtitle //
        const popularLocationSubTitle =
          response.data.homepageRenterBannerAndCategory.filter(
            (item: TitleModel) => item.type === Types.POPULAR_LOCATION_SUB_TITLE
          );
        await this.getPopularLocationSubTitle(popularLocationSubTitle);
      }

      // get all tiles
      if (response.data.homepageRenterTiles) {
        const data = response.data.homepageRenterTiles;
        await this.getAllTilesData(data);
      }

      // get Popular locations
      if (response.data.homepageRenterMostPopularLocations) {
        const data = response.data.homepageRenterMostPopularLocations;
        await this.getAllPopularLocations(data);
      }
    } else {
      this.bannerData.imageUrl = HomeConstant.imageUrl;
    }
  }

  private async getSourceSpaceTitle(data: TitleModel[]): Promise<void> {
    if (data && data.length > 0) {
      const modifiedData = data[data.length - 1];
      this.sourceSpaceTitle.categoryId = modifiedData.id;
      this.sourceSpaceTitle.type = modifiedData.type;
      this.sourceSpaceTitle.typeName = modifiedData.typeName;
    }
  }

  private async getDiscoveEventTitle(data: TitleModel[]): Promise<void> {
    if (data && data.length > 0) {
      const modifiedData = data[data.length - 1];
      this.discoverEventTitle.categoryId = modifiedData.id;
      this.discoverEventTitle.type = modifiedData.type;
      this.discoverEventTitle.typeName = modifiedData.typeName;
    }
  }

  private async getPartyVenueTitle(data: TitleModel[]): Promise<void> {
    if (data && data.length > 0) {
      const modifiedData = data[data.length - 1];
      this.partyVenueTitle.categoryId = modifiedData.id;
      this.partyVenueTitle.type = modifiedData.type;
      this.partyVenueTitle.typeName = modifiedData.typeName;
    }
  }

  private async getPopularLocationTitle(data: TitleModel[]): Promise<void> {
    if (data && data.length > 0) {
      const modifiedData = data[data.length - 1];
      this.popularLocationTitle.categoryId = modifiedData.id;
      this.popularLocationTitle.type = modifiedData.type;
      this.popularLocationTitle.typeName = modifiedData.typeName;
    }
  }

  private async getPopularLocationSubTitle(data: TitleModel[]): Promise<void> {
    if (data && data.length > 0) {
      const modifiedData = data[data.length - 1];
      this.popularLocationSubTitle.categoryId = modifiedData.id;
      this.popularLocationSubTitle.type = modifiedData.type;
      this.popularLocationSubTitle.typeName = modifiedData.typeName;
    }
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

  private async getSourceSpaceData(data: SpaceCategoryModel[]): Promise<void> {
    this.sourceSpaces = [];
    if (data && data.length > 0) {
      {
        const positions = data.map((space: SpaceCategoryModel) => {
          if (space.imagePath) {
            space.imageUrl = space.imagePath.imageFullPath;
          }
          return Number(space.position);
        });
        const maxPosition = Math.max(...positions);
        let length = 10;
        if (maxPosition < 6) length = 6;
        if (maxPosition >= 6) length = maxPosition;
        for (let i = 0; i <= length; i++) {
          if (positions.some((el: number) => el === i)) {
            const space = data.find(
              (space: SpaceCategoryModel) => space.position === i
            );
            if (space) this.sourceSpaces[i - 1] = space;
          } else {
            this.sourceSpaces.push(this.dummySpace);
          }
        }
      }
    } else {
      for (let i = 1; i <= 6; i++) {
        this.sourceSpaces.push(this.dummySpace);
      }
    }
  }

  private async getWorkSpaceData(data: SpaceCategoryModel[]): Promise<void> {
    this.workSpaces = [];
    if (data && data.length > 0) {
      {
        const positions = data.map((space: SpaceCategoryModel) => {
          if (space.imagePath) {
            space.imageUrl = space.imagePath.imageFullPath;
          }
          return Number(space.position);
        });
        const maxPosition = Math.max(...positions);
        let length = 10;
        if (maxPosition < 6) length = 6;
        if (maxPosition >= 6) length = maxPosition;
        for (let i = 0; i <= length; i++) {
          if (positions.some((el: number) => el === i)) {
            const space = data.find(
              (space: SpaceCategoryModel) => space.position === i
            );
            if (space) this.workSpaces[i - 1] = space;
          } else {
            this.workSpaces.push(this.dummySpace);
          }
        }
      }
    } else {
      for (let i = 1; i <= 6; i++) {
        this.workSpaces.push(this.dummySpace);
      }
    }
  }

  private async getPartySpaceData(data: SpaceCategoryModel[]): Promise<void> {
    this.partySpaces = [];
    if (data && data.length > 0) {
      {
        const positions = data.map((space: SpaceCategoryModel) => {
          if (space.imagePath) {
            space.imageUrl = space.imagePath.imageFullPath;
          }
          return Number(space.position);
        });
        const maxPosition = Math.max(...positions);
        let length = 10;
        if (maxPosition < 6) length = 6;
        if (maxPosition >= 6) length = maxPosition;
        for (let i = 0; i <= length; i++) {
          if (positions.some((el: number) => el === i)) {
            const space = data.find(
              (space: SpaceCategoryModel) => space.position === i
            );
            if (space) this.partySpaces[i - 1] = space;
          } else {
            this.partySpaces.push(this.dummySpace);
          }
        }
      }
    } else {
      for (let i = 1; i <= 6; i++) {
        this.partySpaces.push(this.dummySpace);
      }
    }
  }

  private async getAllPopularLocations(data: LocationList[]): Promise<void> {
    if (data && data.length > 0) {
      data.map((listing: LocationList) => {
        listing.images = [];
        listing.image = listing.image
          ? listing.image
          : 'assets/images/dummy/default_image.png';
        const listingImages = listing.listingImagePathIds?.sort(
          (a, b) => b.coverImagePathId - a.coverImagePathId
        );
        listingImages?.map((imagePathId) => {
          listing.images.push(imagePathId.imagePath.imageFullPath);
        });
      });
      this.locations = data;
      if (this.locations.length < 10) {
        const length = 10 - this.locations.length;
        for (let i = 1; i <= length; i++) {
          this.locations.push(Locations.locatoinsList[0]);
        }
      }
    }
  }

  private async getAllTilesData(data: LocationModel[]): Promise<void> {
    if (data && data.length > 0) {
      // for professional locations
      {
        const professionalLocations = data.filter(
          (loc: LocationModel) => loc.type === Types.PROFESSIONAL_EVENT_TYPE
        );
        if (
          professionalLocations &&
          professionalLocations.length > 0 &&
          professionalLocations?.at(-1)?.header
        ) {
          this.professionalLocationsHeader =
            professionalLocations[professionalLocations.length - 1].header;
        }
        if (
          professionalLocations &&
          professionalLocations.length > 0 &&
          professionalLocations?.at(-1)?.subHeader
        ) {
          this.professionalLocationsSubHeader =
            professionalLocations[professionalLocations.length - 1].subHeader;
        }

        const positions = professionalLocations.map((loc: LocationModel) => {
          if (loc.imagePath) {
            loc.imageUrl = loc.imagePath.imageFullPath;
          }
          return Number(loc.position);
        });

        for (let i = 1; i <= 2; i++) {
          if (positions.some((el: number) => +el === i)) {
            const location = professionalLocations.find(
              (loc: LocationModel) => loc.position === i
            );
            if (location) this.professionalLocations[i - 1] = location;
          }
        }
      }
      // for event locations
      {
        const eventLocations = data.filter(
          (loc: LocationModel) => loc.type === Types.LOCALHOST_EVENT_TYPE
        );

        if (
          eventLocations &&
          eventLocations.length > 0 &&
          eventLocations?.at(-1)?.header
        ) {
          this.eventLocationsheader =
            eventLocations[eventLocations.length - 1].header;
          this.eventLocationsSubHeader =
            eventLocations[eventLocations.length - 1].subHeader;
        }

        const positions = eventLocations.map((loc: LocationModel) => {
          if (loc.imagePath) {
            loc.imageUrl = loc.imagePath.imageFullPath;
          }
          return loc.position;
        });

        this.eventLocations = [];
        for (let i = 1; i <= 6; i++) {
          if (positions.some((el: number) => el === i)) {
            const location = eventLocations.find(
              (loc: LocationModel) => loc.position === i
            );
            if (location) this.eventLocations[i - 1] = location;
          } else {
            this.eventLocations.push(this.dummyLocation);
          }
        }
      }

      // for popular destinations
      {
        const destinations = data.filter(
          (loc: LocationModel) =>
            loc.type === Types.POPULAR_DESTINATIONS_EVENT_TYPE
        );
        if (
          destinations &&
          destinations.length > 0 &&
          destinations[destinations.length - 1].header
        ) {
          this.destinationsHeader =
            destinations[destinations.length - 1].header;
        }
        const positions = destinations.map((loc: LocationModel) => {
          if (loc.imagePath) {
            loc.imageUrl = loc.imagePath.imageFullPath;
          }
          return loc.position;
        });

        this.destinations = [];
        for (let i = 1; i <= 4; i++) {
          if (positions.some((el: number) => el === i)) {
            const location = destinations.find(
              (loc: LocationModel) => loc.position === i
            );
            if (location) this.destinations[i - 1] = location;
          } else {
            this.destinations.push(this.dummyLocation);
          }
        }
      }
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
        this.allActivities = this.allActivities.filter((obj, index) => {
          return (
            index === this.allActivities.findIndex((o) => obj.name === o.name)
          );
        });
      }
    } catch (error) {}
  }

  onEditTitle(data: TitleModel): void {
    const dialogRef = this.dialog.open(EditTitleComponent, {
      width: '600px',
      data: data,
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((res) => {
      if (res) {
        if (res.type == this.sourceSpaceTitle.type) {
          this.sourceSpaceTitle.typeName = res.typeName;
          this.snackbar.success(SuccessConstant.TITLE_UPDATE);
        }
        if (res.type == this.discoverEventTitle.type) {
          this.discoverEventTitle.typeName = res.typeName;
          this.snackbar.success(SuccessConstant.TITLE_UPDATE);
        }
        if (res.type == this.partyVenueTitle.type) {
          this.partyVenueTitle.typeName = res.typeName;
          this.snackbar.success(SuccessConstant.TITLE_UPDATE);
        }
        if (res.type == this.popularLocationTitle.type) {
          this.popularLocationTitle.typeName = res.typeName;
          this.snackbar.success(SuccessConstant.TITLE_UPDATE);
        }
        if (res.type == this.popularLocationSubTitle.type) {
          this.popularLocationSubTitle.typeName = res.typeName;
          this.snackbar.success(SuccessConstant.TITLE_UPDATE);
        }
      }
    });
  }

  ngOnDestroy(): void {
    this.sharedService.setStickyHeader(false);
  }
}
