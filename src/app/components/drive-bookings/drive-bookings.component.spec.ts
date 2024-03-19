import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DriveBookingsComponent } from './drive-bookings.component';

describe('DriveBookingsComponent', () => {
  let component: DriveBookingsComponent;
  let fixture: ComponentFixture<DriveBookingsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DriveBookingsComponent]
    });
    fixture = TestBed.createComponent(DriveBookingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
