import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GalleryModelComponent } from './gallery-model.component';

describe('GalleryModelComponent', () => {
  let component: GalleryModelComponent;
  let fixture: ComponentFixture<GalleryModelComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GalleryModelComponent]
    });
    fixture = TestBed.createComponent(GalleryModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
