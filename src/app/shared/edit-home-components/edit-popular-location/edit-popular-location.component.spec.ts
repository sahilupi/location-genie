import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditPopularLocationComponent } from './edit-popular-location.component';

describe('EditPopularLocationComponent', () => {
  let component: EditPopularLocationComponent;
  let fixture: ComponentFixture<EditPopularLocationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditPopularLocationComponent]
    });
    fixture = TestBed.createComponent(EditPopularLocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
