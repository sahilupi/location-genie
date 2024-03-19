import { TestBed } from '@angular/core/testing';

import { AllListingsService } from './all-listings.service';

describe('AllListingsService', () => {
  let service: AllListingsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AllListingsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
