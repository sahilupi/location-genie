import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BecomeHostComponent } from './become-host.component';

describe('BecomeHostComponent', () => {
  let component: BecomeHostComponent;
  let fixture: ComponentFixture<BecomeHostComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BecomeHostComponent]
    });
    fixture = TestBed.createComponent(BecomeHostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
