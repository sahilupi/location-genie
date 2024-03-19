import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Slide3Component } from './slide3.component';

describe('Slide3Component', () => {
  let component: Slide3Component;
  let fixture: ComponentFixture<Slide3Component>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [Slide3Component]
    });
    fixture = TestBed.createComponent(Slide3Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
