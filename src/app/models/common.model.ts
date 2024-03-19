export interface BaseResonse {
  [x: string]: any;
  success?: boolean;
  data?: any;
  errors?: string[];
  statusCode?: number;
  totalCount?: number;
}

export interface CountryCode {
  name: string;
  dialCode: string;
  code: string;
}

export interface Country {
  name: string;
  code: string;
}

export interface Pagination {
  pageNumber: number;
  pageSize: number;
  orderBy?: string;
  direction?: string;
}

export interface Currency {
  id: number;
  currencyCode: string;
  currencyName: string;
  currencySymbol: string;
}
