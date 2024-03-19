import { TestBed } from '@angular/core/testing';

import { ListingStepTwoService } from './listing-step-two.service';

describe('ListingStepTwoService', () => {
  let service: ListingStepTwoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ListingStepTwoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
