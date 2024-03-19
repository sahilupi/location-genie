import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StepOneFirstPageComponent } from './step-one-first-page.component';

describe('StepOneFirstPageComponent', () => {
  let component: StepOneFirstPageComponent;
  let fixture: ComponentFixture<StepOneFirstPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StepOneFirstPageComponent]
    });
    fixture = TestBed.createComponent(StepOneFirstPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
