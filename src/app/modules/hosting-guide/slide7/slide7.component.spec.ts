import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Slide7Component } from './slide7.component';

describe('Slide7Component', () => {
  let component: Slide7Component;
  let fixture: ComponentFixture<Slide7Component>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [Slide7Component]
    });
    fixture = TestBed.createComponent(Slide7Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
