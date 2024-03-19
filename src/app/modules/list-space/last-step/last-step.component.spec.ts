import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LastStepComponent } from './last-step.component';

describe('LastStepComponent', () => {
  let component: LastStepComponent;
  let fixture: ComponentFixture<LastStepComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LastStepComponent]
    });
    fixture = TestBed.createComponent(LastStepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
