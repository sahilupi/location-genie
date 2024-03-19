export class Bookings {
  public static bookingStatus = {
    all: 0,
    // accepted: 1,
    cancelled: 2,
    upcoming: 1,
    requested: 3,
    completed: 4,
    rejected: 5,
    expired: 6
  };

  public static bookingStatusObj: { [key: number]: string } = {
    0: 'All',
    1: 'Booked',
    2: 'Cancelled',
    3: 'Requested',
    4: 'Completed',
    5: 'Rejected',
    6: 'Expired'
  };
}
