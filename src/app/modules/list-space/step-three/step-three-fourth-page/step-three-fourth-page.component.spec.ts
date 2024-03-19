import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StepThreeFourthPageComponent } from './step-three-fourth-page.component';

describe('StepThreeFourthPageComponent', () => {
  let component: StepThreeFourthPageComponent;
  let fixture: ComponentFixture<StepThreeFourthPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StepThreeFourthPageComponent]
    });
    fixture = TestBed.createComponent(StepThreeFourthPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
