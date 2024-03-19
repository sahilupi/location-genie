import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConciergeComponent } from './concierge.component';

describe('ConciergeComponent', () => {
  let component: ConciergeComponent;
  let fixture: ComponentFixture<ConciergeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ConciergeComponent]
    });
    fixture = TestBed.createComponent(ConciergeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
