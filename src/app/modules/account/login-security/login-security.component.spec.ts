import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginandsecurityComponent } from './login-security.component';

describe('LoginandsecurityComponent', () => {
  let component: LoginandsecurityComponent;
  let fixture: ComponentFixture<LoginandsecurityComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LoginandsecurityComponent],
    });
    fixture = TestBed.createComponent(LoginandsecurityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
