import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  AbstractControl,
} from '@angular/forms';
import { Router } from '@angular/router';
import { passwordValidator } from 'src/app/constants/patterns.constant';
import { AuthService } from 'src/app/services/auth.service';
import { SnackBarService } from 'src/app/services/snack-bar.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss'],
})
export class ChangePasswordComponent implements OnInit {
  changePasswordForm: FormGroup;
  isPasswordType: boolean = false;
  isNewPasswordType: boolean = false;
  isSubmitted = false;
  oldPassword: string;
  newPassword: string;
  userId: string;
  token: string;

  constructor(
    private authService: AuthService,
    private snackbar: SnackBarService,
    private router: Router
  ) {}

  async ngOnInit(): Promise<void> {
    await this.changePasswordFormInit();
    const queryParams = new URLSearchParams(window.location.search);
    const userId = queryParams.get('userId');
    const token = queryParams.get('token');

    if (userId && token) {
      this.token = token;
      this.userId = userId;
    }
  }

  private async changePasswordFormInit(): Promise<void> {
    this.changePasswordForm = new FormGroup({
      newPassword: new FormControl(null, [
        Validators.required,
        passwordValidator,
      ]),
      confirmNewPassword: new FormControl(null, [
        Validators.required,
        passwordValidator,
      ]),
    });
  }

  get c(): { [key: string]: AbstractControl } {
    return this.changePasswordForm.controls;
  }

  matchPasswordValidation(): boolean {
    return (
      this.c['newPassword'].value !== this.c['confirmNewPassword'].value &&
      this.c['newPassword'].touched &&
      this.c['newPassword'].value?.trim() !== '' &&
      this.c['confirmNewPassword'].value.trim() !== '' &&
      this.c['confirmNewPassword'].touched
    );
  }

  async onSubmit(): Promise<void> {
    if (!this.changePasswordForm.valid || this.matchPasswordValidation())
      return;

    const password = this.changePasswordForm.value.newPassword;
    const response = await this.authService.changeNewPassword(
      this.userId,
      this.token,
      password
    );
    if (response && response.data && response.data.length > 0) {
      this.snackbar.success(response.data[0]);
      this.router.navigate(['/']);
    }
  }
}
