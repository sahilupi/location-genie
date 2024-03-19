import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SquareSpinnerComponent } from './square-spinner.component';

describe('SquareSpinnerComponent', () => {
  let component: SquareSpinnerComponent;
  let fixture: ComponentFixture<SquareSpinnerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SquareSpinnerComponent]
    });
    fixture = TestBed.createComponent(SquareSpinnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
