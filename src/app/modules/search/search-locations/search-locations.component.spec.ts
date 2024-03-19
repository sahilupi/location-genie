import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchLocationsComponent } from './search-locations.component';

describe('SearchLocationsComponent', () => {
  let component: SearchLocationsComponent;
  let fixture: ComponentFixture<SearchLocationsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SearchLocationsComponent]
    });
    fixture = TestBed.createComponent(SearchLocationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
