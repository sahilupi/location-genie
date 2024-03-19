import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StepThreeThirdPageComponent } from './step-three-third-page.component';

describe('StepThreeThirdPageComponent', () => {
  let component: StepThreeThirdPageComponent;
  let fixture: ComponentFixture<StepThreeThirdPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StepThreeThirdPageComponent]
    });
    fixture = TestBed.createComponent(StepThreeThirdPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
