import { TestBed } from '@angular/core/testing';

import { EditTitleService } from './edit-title.service';

describe('EditTitleService', () => {
  let service: EditTitleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EditTitleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
