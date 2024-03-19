import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StepTwoOnePageComponent } from './step-two-one-page.component';

describe('StepTwoOnePageComponent', () => {
  let component: StepTwoOnePageComponent;
  let fixture: ComponentFixture<StepTwoOnePageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StepTwoOnePageComponent]
    });
    fixture = TestBed.createComponent(StepTwoOnePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
