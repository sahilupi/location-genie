import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopularLocationComponent } from './popular-location.component';

describe('PopularLocationComponent', () => {
  let component: PopularLocationComponent;
  let fixture: ComponentFixture<PopularLocationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PopularLocationComponent]
    });
    fixture = TestBed.createComponent(PopularLocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
