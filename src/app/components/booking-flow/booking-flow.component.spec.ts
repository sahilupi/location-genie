import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookingFlowComponent } from './booking-flow.component';

describe('BookingFlowComponent', () => {
  let component: BookingFlowComponent;
  let fixture: ComponentFixture<BookingFlowComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BookingFlowComponent]
    });
    fixture = TestBed.createComponent(BookingFlowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
