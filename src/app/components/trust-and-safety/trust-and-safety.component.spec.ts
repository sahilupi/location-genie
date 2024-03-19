import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrustAndSafetyComponent } from './trust-and-safety.component';

describe('TrustAndSafetyComponent', () => {
  let component: TrustAndSafetyComponent;
  let fixture: ComponentFixture<TrustAndSafetyComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TrustAndSafetyComponent]
    });
    fixture = TestBed.createComponent(TrustAndSafetyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
