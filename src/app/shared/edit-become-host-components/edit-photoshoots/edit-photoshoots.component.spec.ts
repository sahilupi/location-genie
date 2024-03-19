import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditPhotoshootsComponent } from './edit-photoshoots.component';

describe('EditPhotoshootsComponent', () => {
  let component: EditPhotoshootsComponent;
  let fixture: ComponentFixture<EditPhotoshootsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditPhotoshootsComponent]
    });
    fixture = TestBed.createComponent(EditPhotoshootsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
