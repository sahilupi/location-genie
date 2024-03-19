export interface FindLocationData {
  eventRoute?: string;
  eventValue?: string;
  locationRoute?: string;
  locationValue?: string;
  text: string;
  linkText: string;
  link: string;
  imageUrl: string;
  type: string;
  typeName: string;
}

export interface City {
  id: number;
  name: string;
}
