import { inject, Input } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { ListingService } from '../services/listing.service';

export const listingDetailsResolver: ResolveFn<Promise<any>> = async (
  route,
  state
) => {
  const listingService = inject(ListingService);
  const listingId = route.paramMap.get('list');
  try {
    const decryptedId = atob(String(listingId));
    return await listingService.getListingDetails(Number(decryptedId));
  } catch (err) {
    return err;
  }
};
