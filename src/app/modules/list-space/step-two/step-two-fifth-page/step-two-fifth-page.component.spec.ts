import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StepTwoFifthPageComponent } from './step-two-fifth-page.component';

describe('StepTwoFifthPageComponent', () => {
  let component: StepTwoFifthPageComponent;
  let fixture: ComponentFixture<StepTwoFifthPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StepTwoFifthPageComponent]
    });
    fixture = TestBed.createComponent(StepTwoFifthPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
