import { ImagePath } from './location-types.model';

export interface StepsModel {
  position?: number;
  tileId?: number;
  id?: number;
  listingId?: number;
  categoryId?: number;
  text?: string;
  title?: string;
  header?: string;
  subHeader?: string;
  description: string;
  linkText?: string;
  link?: string;
  imageUrl?: string;
  imagePath?: ImagePath;
  type?: string;
  typeName?: string;
}
