import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StepOneSecondPageComponent } from './step-one-second-page.component';

describe('StepOneSecondPageComponent', () => {
  let component: StepOneSecondPageComponent;
  let fixture: ComponentFixture<StepOneSecondPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StepOneSecondPageComponent],
    });
    fixture = TestBed.createComponent(StepOneSecondPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
