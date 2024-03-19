import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PhoneOtpComponent } from './phone-otp.component';

describe('PhoneOtpComponent', () => {
  let component: PhoneOtpComponent;
  let fixture: ComponentFixture<PhoneOtpComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PhoneOtpComponent]
    });
    fixture = TestBed.createComponent(PhoneOtpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
