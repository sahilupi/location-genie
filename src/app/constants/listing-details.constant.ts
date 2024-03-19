import { ListingStatus } from '../models/listing.model';
import { AttendiesDropdown } from '../models/location.model';

export class ListingDetails {
  public static attendiesDropdown: AttendiesDropdown[] = [
    {
      id: 1,
      text: '1-5 people',
      value: '1-5 people',
      charges: 50,
      available: false,
    },
    {
      id: 2,
      text: '6-15 people',
      value: '6-15 people',
      charges: 50,
      available: false,
    },
    {
      id: 3,
      text: '16-30 people',
      value: '16-30 people',
      charges: 50,
      available: false,
    },
    {
      id: 4,
      text: '31-45 people',
      value: '31-45 people',
      charges: 100,
      available: false,
    },
    {
      id: 5,
      text: '46-60 people',
      value: '46-60 people',
      charges: 100,
      available: false,
    },
    {
      id: 6,
      text: '60+ people',
      value: '60+ people',
      charges: 100,
      available: false,
    },
  ];

  public static listingStatus: ListingStatus[] = [
    {
      name: 'Draft',
      id: 1,
      checked: false,
    },
    {
      name: 'In review',
      id: 2,
      checked: false,
    },
    {
      name: 'Published',
      id: 3,
      checked: false,
    },
    {
      name: 'Rejected',
      id: 4,
      checked: false,
    },
  ];
}
