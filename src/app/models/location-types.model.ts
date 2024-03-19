import { LocationList } from './location.model';

export interface LocationType {
  categoryName: string;
  imgSrc: string;
  id: number;
  categoryType: number;
  listingLocationCategoryId?: number;
  checked: boolean;
  imagePath: ImagePath;
  listingLocationCategory: ListingLocationCategory;

  listing: LocationList;
}

export interface ListingLocationCategory {
  categoryName: string;
  categoryType: number;
  id: number;
}
export interface ImagePath {
  id: number;
  imageFullPath: string;
  isDeleted: boolean;
  createdDate: string;
  createdBy: string;
  lastModifiedDate: string | null;
  lastModifiedBy: string | null;
}
export interface LocationKind {
  name: string;
  imgSrc: string;
  id: number;
  checked: boolean;
}
