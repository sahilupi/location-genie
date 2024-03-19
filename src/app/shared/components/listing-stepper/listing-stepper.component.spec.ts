import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListingStepperComponent } from './listing-stepper.component';

describe('ListingStepperComponent', () => {
  let component: ListingStepperComponent;
  let fixture: ComponentFixture<ListingStepperComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListingStepperComponent]
    });
    fixture = TestBed.createComponent(ListingStepperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
