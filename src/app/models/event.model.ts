export interface EventList {
  name: string;
  value?: string;
  id?: string | number;
  checked?: boolean;
}

export interface EventActivity {
  id: number,
  activityName: string,
  isEvent: boolean,
  isProduction: boolean,
  isMeeting: boolean
}

export interface EventType {
  id: number,
  categoryName: string,
  categoryType: number,
  keyFeatureName: string,
}