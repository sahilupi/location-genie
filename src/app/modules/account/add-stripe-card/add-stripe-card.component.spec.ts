import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddStripeCardComponent } from './add-stripe-card.component';

describe('AddStripeCardComponent', () => {
  let component: AddStripeCardComponent;
  let fixture: ComponentFixture<AddStripeCardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddStripeCardComponent]
    });
    fixture = TestBed.createComponent(AddStripeCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
