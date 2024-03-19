import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditHostBannerComponent } from './edit-host-banner.component';

describe('EditHostBannerComponent', () => {
  let component: EditHostBannerComponent;
  let fixture: ComponentFixture<EditHostBannerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditHostBannerComponent]
    });
    fixture = TestBed.createComponent(EditHostBannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
