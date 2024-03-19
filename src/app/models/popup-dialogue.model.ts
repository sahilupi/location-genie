import { StepsModel } from './become-host.model';
import { EventList } from './event.model';
import { SpaceCategoryModel } from './home-edit.model';

export interface ConfirmDialogue {
  title: string;
  message: string;
  cancelBtnText: string;
  confirmBtnText: string;
  isDeleting: boolean;
  showCancelBtn?: boolean;
  isLongText?: boolean;
  isReasonRequired: boolean;
  id: number;
  status?: boolean;
  isRejectingBooking?: boolean;
  isDeactivateListing: boolean;
  isActivateListing: boolean;
}

export interface HostBannerDialogue {
  id: number;
  title: string;
  description: string;
  linkText: string;
  link: string;
  imageUrl: string;
}

export interface PhotoshootsDialogue {
  type: string;
  isEditingData: boolean;
  showPositionInput: boolean;
  header: string;
  position: number;
  positions: number[];
  originalArraydata: StepsModel[];
  photoshoots: StepsModel[];
  max: number;
  title: string;
}

export interface EventsDialogue {
  isEditingData: boolean;
  position: number;
  positions: number[];
  header: string;
  subHeader: string;
  type: string;
  max: number;
  locations: SpaceCategoryModel[];
  allActivities: EventList[];
}

export interface SpaceDialogue extends EventsDialogue {
  id: number;
  text: number;
  typeName: string;
  imageUrl: string;
  activities: string;
  allActivities: EventList[];
}

export interface TitleDialogue {
  type: number;
  typeName: string;
  categoryId: string;
  max: number;
}
