import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LocationDetailsFormComponent } from './location-details-form.component';

describe('LocationDetailsFormComponent', () => {
  let component: LocationDetailsFormComponent;
  let fixture: ComponentFixture<LocationDetailsFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LocationDetailsFormComponent]
    });
    fixture = TestBed.createComponent(LocationDetailsFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
