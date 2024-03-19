import { Currency } from './common.model';

export interface Rule {
  id?: string;
  name: string;
  checked?: boolean | null;
}
export interface OpeningHour {
  listingId: number;
  isOpenSunday: boolean;
  isOpenMonday: boolean;
  isOpenTuesday: boolean;
  isOpenWednesday: boolean;
  isOpenThursday: boolean;
  isOpenFriday: boolean;
  isOpenSaturday: boolean;
  sundayOpenTime: string;
  mondayOpenTime: string;
  tuesdayOpenTime: string;
  wednesdayOpenTime: string;
  thursdayOpenTime: string;
  fridayOpenTime: string;
  saturdayOpenTime: string;
}
export interface ActivityAttendies {
  listingId: number;
  isProduction: boolean;
  isEvent: boolean;
  isMeeting: boolean;
  numberOfAttendees: number;
}
export interface ListingPrice {
  listingId: number;
  isSixToFifteenPeople: boolean;
  isSixteenToThirtyPeople: boolean;
  isThirtyOneToFortyFivePeople: boolean;
  isFortySixToSixtyPeople: boolean;
  isSixtyAndAbovePeople: boolean;
  oneToFivePeople: string;
  sixToFifteenPeople: string;
  sixteenToThirtyPeople: string;
  thirtyOneToFortyFivePeople: string;
  fortySixToSixtyPeople: string;
  sixtyAndAbovePeople: string;
  priceCurrency: string;
  minimumHours: number;
  isAutomaticPricing: boolean;
  currency?: Currency;
}
export interface CalendarData {
  listingId: number;
  blockedDates: string[] | any;
  availableDates: string[] | any;
  isBlockAllWeekends?: boolean;
  isBlockAllBuisnessDays?: boolean;
}
