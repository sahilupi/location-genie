import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StepThreeSecondPageComponent } from './step-three-second-page.component';

describe('StepThreeSecondPageComponent', () => {
  let component: StepThreeSecondPageComponent;
  let fixture: ComponentFixture<StepThreeSecondPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StepThreeSecondPageComponent]
    });
    fixture = TestBed.createComponent(StepThreeSecondPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
