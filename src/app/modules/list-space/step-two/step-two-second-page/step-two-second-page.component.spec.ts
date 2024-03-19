import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StepTwoSecondPageComponent } from './step-two-second-page.component';

describe('StepTwoSecondPageComponent', () => {
  let component: StepTwoSecondPageComponent;
  let fixture: ComponentFixture<StepTwoSecondPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StepTwoSecondPageComponent]
    });
    fixture = TestBed.createComponent(StepTwoSecondPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
