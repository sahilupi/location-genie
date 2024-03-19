import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StepThreeActivitiesComponent } from './step-three-activities.component';

describe('StepThreeActivitiesComponent', () => {
  let component: StepThreeActivitiesComponent;
  let fixture: ComponentFixture<StepThreeActivitiesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StepThreeActivitiesComponent]
    });
    fixture = TestBed.createComponent(StepThreeActivitiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
