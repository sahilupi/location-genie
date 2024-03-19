export interface TimeSlot {
  name: string;
  value: string;
  disabled?: boolean;
}
export interface Day extends TimeSlot {
  checked?: boolean;
}

export interface ReservedDates {
  date: string;
  ranges: DateRange;
}

export interface DateRange {
  start: string;
  end: string;
}
