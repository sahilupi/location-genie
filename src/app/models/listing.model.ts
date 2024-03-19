import { ImagePath } from './location-types.model';

export interface ListingsData {
  id: number;
  locationTitle?: string;
  city: string;
  country: string;
  lastModifiedDate?: string;
  createdDate?: string;
  coverImage?: string;
  status?: number;
  isStepOneCompleted?: boolean;
  isStepTwoCompleted?: boolean;
  isStepThreeCompleted?: boolean;
  isActive?: boolean;
  deActivateReasonByAdmin?: string;
  isActivateRequestByHost?: boolean;
  isDeactivateRequestByHost?: boolean;
  deActivateReasonByHost?: string;
  activateDeactivateHistory?: any;
}
export interface ListingSubCategory {
  id: number;
  subCategoryName: 'Classic';
  imagePathId?: number;
  imagePath: ImagePath;
  categoryType: number;
  listingLocationCategoryId: number | null;
  isDeleted: boolean;
  createdDate: string;
  createdBy: string;
  checked: boolean;
  lastModifiedDate: string | null;
  lastModifiedBy: string | null;
}
export interface ListingCheckedSubCategory {
  categoryType?: number;
  createdDate: string;
  createdBy?: string;
  checked: boolean;
  id: number;
  isDeleted: boolean;
  lastModifiedDate: string | null;
  lastModifiedBy: string | null;
  listing?: string;
  listingId: number;
  listingLocationSubCategory: string;
  listingLocationSubCategoryId: number;
}
export interface ListingCategory {
  listingId: number;
  categoryType?: number;
  selectedValues: number[];
}
export interface SelectedKeyFeaturesDetails {
  listingId: number;
  data: SelectedKeyFeatures[];
}
export interface SelectedKeyFeatures {
  keyFeaturesId: number;
  selectedValues: number[];
}
export interface ListingTitleDescription {
  listingId: number;
  description: string;
  title: string;
}
export interface ListingMapPin {
  listingId: number;
  longitude: string;
  latitude: string;
}
export interface ListingsDetails {
  noOfBedRooms: string;
  noOfBathRooms: string;
  propertySize: string;
  lotSize: string;
  mainFloorNumber: string;
  heightFeet: string;
  heightInches: string;
  widthFeet: string;
  widthInches: string;
  lengthFeet: string;
  lengthInches: string;
  carParkingSpace: string;
  year: string;
  make: string;
  model: string;
  accessAvailabilityParking: string[];
  truckMotarHomeParking: string[];
  parkingNearby: string;
  amenities: string[];
}
export interface KeyFeature {
  categoryType: number;
  listingId: number;
  keyFeaturesDetailsId?: number;
  keyFeaturesId?: number;
  id: number;
  keyFeatureName: string;
  name: string;
  listingLocationCategoryId: number;
  checked?: boolean;
  type?: string;
}

export interface FilteredKeyFeature {
  title: string;
  id: number;
  keyFeatureDetails: KeyFeature[];
}

export interface Interior {
  interiorTitleName: string;
  id: number;
  listingLocationInteriorFeature: InteriorDetail[];
}

export interface InteriorDetail {
  id: number;
  interiorId: number;
  name: string;
  isSelected: boolean;
}
export interface Feature {
  id: string;
  name: string;
  checked?: boolean;
}
export interface FeatureData {
  listingId: number;
  data: FeatureList[];
}
export interface FeatureList {
  name: string;
  features: string;
}
export interface ListingImageData {
  imagePathId: number;
  imgSrc: string;
  imagePath?: ImagePath;
  id?: number;
  imageDescription?: string;
  position?: number;
}
export interface ImagePosition {
  id: number;
  position: number;
}

export interface RequestBooking {
  listingId: number;
  projectName: string;
  renterOrCompany: string;
  activity: string;
  castAndCrew: string;
  aboutProject: string;
  days: string;
  totalHours: number;
  amountPerHour: number;
  totalAmount: number;
  processingFee: number;
  exactCount: number;
  // userPaymentInfoId: number;
  token?: string;
  selectedToken?: string;
  cardNumber?: string;
  expiryMonth?: string;
  expiryYear?: string;
  cvc?: string;
  nameOnCard?: string;
  countryAndRegion?: string;
  zipCode?: string;
  // cardSourceId: string;
}

export interface ListingStatus {
  name: string;
  id: number;
  checked: boolean;
}
