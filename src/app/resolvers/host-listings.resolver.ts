import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { ListingService } from '../services/listing.service';
import { LocalService } from '../services/local.service';
import { LocalConstant } from '../constants/local-constant';

export const hostListingsResolver: ResolveFn<Promise<any>> = async (
  route,
  state
) => {
  const listingService = inject(ListingService);
  const localService = inject(LocalService);
  const userData = await localService.getLocalData(LocalConstant.USER_DATA);
  const email = userData.user_name;
  const pageNumber = route.queryParams['pageNumber'];
  const pageSize = route.queryParams['pageSize'];
  const status = route.queryParams['status'];
  const pagination = {
    pageNumber: pageNumber,
    pageSize: pageSize,
  };
  try {
    return await listingService.getAllListings(email, pagination, status);
  } catch (err) {
    return err;
  }
};
