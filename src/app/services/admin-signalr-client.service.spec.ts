import { TestBed } from '@angular/core/testing';

import { AdminSignalrClientService } from './admin-signalr-client.service';

describe('AdminSignalrClientService', () => {
  let service: AdminSignalrClientService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AdminSignalrClientService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
