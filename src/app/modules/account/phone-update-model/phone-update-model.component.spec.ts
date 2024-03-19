import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PhoneUpdateModelComponent } from './phone-update-model.component';

describe('PhoneUpdateModelComponent', () => {
  let component: PhoneUpdateModelComponent;
  let fixture: ComponentFixture<PhoneUpdateModelComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PhoneUpdateModelComponent]
    });
    fixture = TestBed.createComponent(PhoneUpdateModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
