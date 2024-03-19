import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FindLocationComponent } from './find-location.component';

describe('SearchComponent', () => {
  let component: FindLocationComponent;
  let fixture: ComponentFixture<FindLocationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FindLocationComponent]
    });
    fixture = TestBed.createComponent(FindLocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
