import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InputSpinnerComponent } from './input-spinner.component';

describe('InputSpinnerComponent', () => {
  let component: InputSpinnerComponent;
  let fixture: ComponentFixture<InputSpinnerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InputSpinnerComponent]
    });
    fixture = TestBed.createComponent(InputSpinnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
