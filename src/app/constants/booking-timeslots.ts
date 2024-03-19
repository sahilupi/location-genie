import { Day, TimeSlot } from '../models/time-slot.model';

export class TimeSlots {
  public static startTimes: TimeSlot[] = [
    {
      name: '6:00am',
      value: '06:00',
    },
    {
      name: '7:00am',
      value: '07:00',
    },
    {
      name: '8:00am',
      value: '08:00',
    },
    {
      name: '9:00am',
      value: '09:00',
    },
    {
      name: '10:00am',
      value: '10:00',
    },
    {
      name: '11:00am',
      value: '11:00',
    },
    {
      name: '12:00pm',
      value: '12:00',
    },
    {
      name: '1:00pm',
      value: '13:00',
    },
    {
      name: '2:00pm',
      value: '14:00',
    },
    {
      name: '3:00pm',
      value: '15:00',
    },
    {
      name: '4:00pm',
      value: '16:00',
    },
    {
      name: '5:00pm',
      value: '17:00',
    },
    {
      name: '6:00pm',
      value: '18:00',
    },
    {
      name: '7:00pm',
      value: '19:00',
    },
    {
      name: '8:00pm',
      value: '20:00',
    },
    {
      name: '9:00pm',
      value: '21:00',
    },
    {
      name: '10:00pm',
      value: '22:00',
    },
    {
      name: '11:00pm',
      value: '23:00',
    },
  ];
  public static days: Day[] = [
    {
      name: 'Sunday',
      value: 'Sunday',
      checked: true,
    },
    {
      name: 'Monday',
      value: 'Monday',
      checked: true,
    },
    {
      name: 'Tuesday',
      value: 'Tuesday',
      checked: true,
    },
    {
      name: 'Wednesday',
      value: 'Wednesday',
      checked: true,
    },
    {
      name: 'Thursday',
      value: 'Thursday',
      checked: true,
    },
    {
      name: 'Friday',
      value: 'Friday',
      checked: true,
    },
    {
      name: 'Saturday',
      value: 'Saturday',
      checked: true,
    },
  ];

  public static endOfDayTimeSlot: TimeSlot = {
    name: '11:59pm',
    value: '24:00',
  };

  public static nextDayTimeSlots: TimeSlot[] = [
    {
      name: '1:00am',
      value: 'next-day-01:00',
    },
    {
      name: '2:00am',
      value: 'next-day-02:00',
    },
    {
      name: '3:00am',
      value: 'next-day-03:00',
    },
    {
      name: '4:00am',
      value: 'next-day-04:00',
    },
    {
      name: '5:00am',
      value: 'next-day-05:00',
    },
    {
      name: '6:00am',
      value: 'next-day-06:00',
    },
  ];
}
