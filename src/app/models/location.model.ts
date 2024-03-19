import { Feature } from './listing.model';
import {
  ActivityAttendies,
  CalendarData,
  ListingPrice,
  OpeningHour,
  Rule,
} from './step-three.model';

export interface LocationList {
  listingAddress: ListingAddress;
  geolocation: GeoLocation;
  image: string;
  images: string[];
  price: number;
  slug: string;
  isActive?: boolean;
  locationTitle: string;
  type: string;
  id: number | string;
  listingId?: number;
  checked?: boolean;
  position?: number;
  lastModifiedDate?: string;
  createdDate?: string;
  listingLocationInfo?: LocationInfo;
  listingLocationInfos?: LocationInfo;
  listingImagePathIds?: ListingImagePathId[];
  listingActivityAttendees?: ActivityAttendies;
  listingPrice?: ListingPrice;
  listingCalendar?: CalendarData;
  listingLocationCategoryIds?: ListingLocationCategoryId[];
  listingLocationSubCategoryIds?: ListingSubCategoryId[];
  listingLocationRules?: LocationRules;
  listingLocationOpeningHours?: OpeningHour;
  listingLocationKeyFeaturesDetails?: Feature[];
  listingLocationInteriorFeature?: Feature[];
  imagePath?: ListingCoverImage;
  listing?: Listing;
  isStepOneCompleted?: boolean;
  isStepTwoCompleted?: boolean;
  isStepThreeCompleted?: boolean;
  listingStatus?: number;
  userData?: UserData;
}

export interface UserData {
  userId: string;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  userRole: string;
  phoneNumber: string;
  profile: {
    id: number;
    userId: string;
    profilePic: string;
  };
}

export interface HostListing {
  listing: Listing;
  coverImagePaths: ListingCoverImage[];
  activateDeactivateHistory?: any[];
}

export interface ListingCoverImage {
  id: number;
  imageFullPath: string;
}
export interface Listing {
  listingAddress: ListingAddress;
  geolocation: GeoLocation;
  image: string;
  images: string[];
  price: number;
  slug: string;
  locationTitle: string;
  type: string;
  id?: number | string;
  listingId?: number;
  checked?: boolean;
  position?: number;
  lastModifiedDate?: string;
  createdDate?: string;
  listingLocationInfo?: LocationInfo;
  status?: number;
  isStepOneCompleted?: boolean;
  isStepTwoCompleted?: boolean;
  isStepThreeCompleted?: boolean;
  isActive?: boolean;
  deActivateReasonByAdmin?: string;
  isActivateRequestByHost?: boolean;
  isDeactivateRequestByHost?: boolean;
  deActivateReasonByHost?: string;
  overallRatings?: number;
  totalCountReviews?: number;
}
export interface ListingAddress {
  city: string;
  country: string;
  state?: string;
  aptAndSuite?: string;
}
export interface GeoLocation {
  lat: number;
  lng: number;
}
export interface LocationModel {
  title: string;
  linkText: string;
  link: string;
  type: string;
  description: string;
  imageUrl: string;
  header: string;
  subHeader: string;
  imagePath?: ListingCoverImage;
  position: number;
  tileId: number;
  id?: any;
}
export interface PopularLocation {
  listingId: number;
  position: number;
}
export interface ProjectLocation {
  email: string;
  fullName: string;
  company: string;
  phoneNumber: string;
  projectName: string;
  crewAttendees: string;
  projectDate: string;
  projectLocation: string;
  minBudgetPerDay: number;
  maxBudgetPerDay: number;
  projectSpace: string;
}
export interface LocationInfo {
  accessAvailabilityParking: string;
  accessAvailabilityParkingSerialized: string[];
  amenities: string;
  amenitiesSerialized: string[];
  carParkingSpace: string;
  createdBy: string;
  createdDate: string;
  height: string;
  id: number;
  isDeleted: boolean;
  lastModifiedBy: string;
  lastModifiedDate: string;
  latitude: string;
  length: string;
  locationDescription: string;
  locationTitle: string;
  longitude: string;
  lotSize: string;
  mainFloorNumber: string;
  make: string;
  model: string;
  noOfBathRooms: number;
  noOfBedRooms: number;
  numberOfAttendees: number;
  parkingNearby: boolean;
  propertySize: number;
  truckMotarHomeParking: string;
  truckMotarHomeParkingSerialized: string[];
  width: string;
  year: number;
}
export interface ListingImagePathId {
  coverImagePathId: number;
  id: number;
  imageDescription: string;
  imagePath: ListingCoverImage;
  imagePathId: 882;
  listingId: number;
  position: number;
}
export interface AttendiesDropdown {
  id: number;
  text: string;
  value: string;
  charges: number;
  available: boolean;
}

export interface ListingLocationCategoryId {
  categoryType: number;
  listingId: number;
  listingLocationCategory: ListingLocationCategory;
  listingLocationCategoryId: number;
}

export interface ListingLocationCategory {
  id: number;
  categoryName: string;
  imagePathId: number;
  imagePath: string;
  categoryType: number;
}

export interface ListingSubCategoryId {
  categoryType: number;
  id: number;
  listingId: number;
  listingLocationSubCategory: ListingSubCategory;
}

export interface ListingSubCategory {
  categoryType: number;
  id: number;
  listingLocationCategoryId: number;
  subCategoryName: string;
}

export interface LocationRules {
  additionalRules: string | string[];
  rules: string | Rule;
}

export interface ListingReview {
  listingId: number;
  commentText: string;
  rating: number;
  id: number;
  userImg: string;
  firstName: string;
  email: string;
  lastName: string;
  createdDate: string;
  showMore: boolean;
}

export interface UserListingReview {
  listingId: number;
  reviewId: number;
  userReview: string;
  userRating: number;
  listingTitle: string;
  listingAddress: string;
  createdDate: string;
  showMore: boolean;
}
