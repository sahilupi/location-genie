import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditProfileImageComponent } from './edit-profile-image.component';

describe('EditProfileImageComponent', () => {
  let component: EditProfileImageComponent;
  let fixture: ComponentFixture<EditProfileImageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditProfileImageComponent]
    });
    fixture = TestBed.createComponent(EditProfileImageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
