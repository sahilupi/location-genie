import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LocationGenieWorkComponent } from './location-genie-work.component';

describe('LocationGenieWorkComponent', () => {
  let component: LocationGenieWorkComponent;
  let fixture: ComponentFixture<LocationGenieWorkComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LocationGenieWorkComponent]
    });
    fixture = TestBed.createComponent(LocationGenieWorkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
