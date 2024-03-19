import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StepThreeFirstPageComponent } from './step-three-first-page.component';

describe('StepThreeFirstPageComponent', () => {
  let component: StepThreeFirstPageComponent;
  let fixture: ComponentFixture<StepThreeFirstPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StepThreeFirstPageComponent]
    });
    fixture = TestBed.createComponent(StepThreeFirstPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
