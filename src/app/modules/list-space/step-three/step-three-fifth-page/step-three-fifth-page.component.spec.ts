import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StepThreeFifthPageComponent } from './step-three-fifth-page.component';

describe('StepThreeFifthPageComponent', () => {
  let component: StepThreeFifthPageComponent;
  let fixture: ComponentFixture<StepThreeFifthPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StepThreeFifthPageComponent]
    });
    fixture = TestBed.createComponent(StepThreeFifthPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
