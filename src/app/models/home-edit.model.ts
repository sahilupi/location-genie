import { ListingCoverImage } from './location.model';

export interface BannerModel {
  bannerId?: number | null;
  id?: number | null;
  text: string;
  linkText: string;
  link: string;
  imageUrl: string;
  imagePath?: ListingCoverImage;
  type?: string;
  typeName?: string;
  title?: string;
  description?: string;
  eventValue?: string;
  eventRoute?: string;
  locationValue?: string;
  locationRoute?: string;
  position?: number;
}

export interface SpaceCategoryModel {
  id?: number | null;
  listingId?: number;
  categoryId?: number;
  position: number | null;
  text?: string;
  title?: string;
  header?: string;
  subHeader?: string;
  description?: string;
  linkText?: string;
  link?: string;
  activities?: string;
  imageUrl: string;
  imagePath?: {
    imageFullPath: string;
  };
  type?: string;
  typeName?: string;
}

export interface Tiles {
  header: string;
  subHeader: string;
  id?: number | null;
  type: string;
  tilesData: TilesData[];
}
export interface TilesData {
  tileId: number;
  title: string;
  linkText: string;
  link: string;
  imageUrl: string;
  position: number;
}

export interface footerTabs {
  id: number;
  name: string;
}

