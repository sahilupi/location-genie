import { TestBed } from '@angular/core/testing';

import { ListingStepThreeService } from './listing-step-three.service';

describe('ListingStepThreeService', () => {
  let service: ListingStepThreeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ListingStepThreeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
