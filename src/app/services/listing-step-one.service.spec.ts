import { TestBed } from '@angular/core/testing';

import { ListingStepOneService } from './listing-step-one.service';

describe('ListingStepOneService', () => {
  let service: ListingStepOneService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ListingStepOneService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
