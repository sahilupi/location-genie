import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Slide1Component } from './slide1.component';

describe('Slide1Component', () => {
  let component: Slide1Component;
  let fixture: ComponentFixture<Slide1Component>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [Slide1Component]
    });
    fixture = TestBed.createComponent(Slide1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
