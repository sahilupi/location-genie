import { Listing } from './location.model';

export interface Booking {
  imgUrl?: string;
  dates: string[];
  times: string[];
  startTime?: string;
  endTime?: string;
  projectName?: string;
  fees: number;
  currency?: {
    currencyCode: string;
    currencyName: string;
    currencySymbol: string;
    id: 1;
  };
  locationTitle: string;
  id: number;
  userId?: string;
  listingId?: number;
  listing?: Listing;
  renterOrCompany?: string;
  activity?: string;
  castAndCrew?: string;
  aboutProject?: string;
  days?: string;
  totalHours?: number;
  amountPerHour?: number;
  totalAmount?: number;
  processingFee?: number;
  priceCurrency?: string;
  renter?: UserModel;
  hostDetails?: UserModel;
  status?: number;
  paymentStatus?: number;
  exactCount?: number;
  cleaningFee?: number;
  lastModifiedDate?: Date;
  createdDate?: Date;
  statusName?: string;
  allowedPeople?: number;
  totalCountReviews?: number;
  isRenterCancelledBooking?: boolean;
  isExpired?: boolean;
  bookingRejectionReason?: string;
  isInstantBooking?: boolean;
  renterName: string;
  renterEmail: string;
  hostName: string;
  hostEmail: string;
}

export interface UserModel {
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  userRole: number | string;
  phoneNumber: string;
  isActive: boolean;
}

export interface DayData {
  date: Date;
  startTime: string;
  endTime: string;
}
