import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StepTwoThirdPageComponent } from './step-two-third-page.component';

describe('StepTwoThirdPageComponent', () => {
  let component: StepTwoThirdPageComponent;
  let fixture: ComponentFixture<StepTwoThirdPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StepTwoThirdPageComponent]
    });
    fixture = TestBed.createComponent(StepTwoThirdPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
