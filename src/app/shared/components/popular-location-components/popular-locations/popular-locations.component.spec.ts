import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopularLocationsComponent } from './popular-locations.component';

describe('PopularLocationsComponent', () => {
  let component: PopularLocationsComponent;
  let fixture: ComponentFixture<PopularLocationsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PopularLocationsComponent]
    });
    fixture = TestBed.createComponent(PopularLocationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
