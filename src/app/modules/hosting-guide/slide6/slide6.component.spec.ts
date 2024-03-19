import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Slide6Component } from './slide6.component';

describe('Slide6Component', () => {
  let component: Slide6Component;
  let fixture: ComponentFixture<Slide6Component>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [Slide6Component]
    });
    fixture = TestBed.createComponent(Slide6Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
