import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AttendiesDropdownComponent } from './attendies-dropdown.component';

describe('AttendiesDropdownComponent', () => {
  let component: AttendiesDropdownComponent;
  let fixture: ComponentFixture<AttendiesDropdownComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AttendiesDropdownComponent]
    });
    fixture = TestBed.createComponent(AttendiesDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
