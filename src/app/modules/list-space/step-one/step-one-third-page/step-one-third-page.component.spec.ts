import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StepOneThirdPageComponent } from './step-one-third-page.component';

describe('StepOneThirdPageComponent', () => {
  let component: StepOneThirdPageComponent;
  let fixture: ComponentFixture<StepOneThirdPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StepOneThirdPageComponent]
    });
    fixture = TestBed.createComponent(StepOneThirdPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
