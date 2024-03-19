import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailUpdateModelComponent } from './email-update-model.component';

describe('EmailUpdateModelComponent', () => {
  let component: EmailUpdateModelComponent;
  let fixture: ComponentFixture<EmailUpdateModelComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EmailUpdateModelComponent]
    });
    fixture = TestBed.createComponent(EmailUpdateModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
