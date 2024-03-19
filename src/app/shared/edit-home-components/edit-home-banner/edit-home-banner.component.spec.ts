import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditHomeBannerComponent } from './edit-home-banner.component';

describe('EditHomeBannerComponent', () => {
  let component: EditHomeBannerComponent;
  let fixture: ComponentFixture<EditHomeBannerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditHomeBannerComponent]
    });
    fixture = TestBed.createComponent(EditHomeBannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
