import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StepTwoFourthPageComponent } from './step-two-fourth-page.component';

describe('StepTwoFourthPageComponent', () => {
  let component: StepTwoFourthPageComponent;
  let fixture: ComponentFixture<StepTwoFourthPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StepTwoFourthPageComponent]
    });
    fixture = TestBed.createComponent(StepTwoFourthPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
