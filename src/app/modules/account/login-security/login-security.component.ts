import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  AbstractControl,
} from '@angular/forms';
import { LocalConstant } from 'src/app/constants/local-constant';
import { passwordValidator } from 'src/app/constants/patterns.constant';
import { AuthService } from 'src/app/services/auth.service';
import { LocalService } from 'src/app/services/local.service';
import { SnackBarService } from 'src/app/services/snack-bar.service';

@Component({
  selector: 'app-loginandsecurity',
  templateUrl: './login-security.component.html',
  styleUrls: ['./login-security.component.scss'],
})
export class LoginandsecurityComponent implements OnInit {
  changePasswordForm: FormGroup;
  isPasswordType: boolean = false;
  isSubmitted = false;
  oldPassword: string;
  newPassword: string;
  email: string;

  constructor(
    private authService: AuthService,
    private localService: LocalService,
    private snackbar: SnackBarService
  ) {}

  async ngOnInit(): Promise<void> {
    await this.changePasswordFormInit();
    const userData = await this.localService.getLocalData(
      LocalConstant.USER_DATA
    );
    this.email = userData.user_name;
  }

  private async changePasswordFormInit(): Promise<void> {
    this.changePasswordForm = new FormGroup({
      oldPassword: new FormControl(null, [Validators.required]),
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

  samePasswordValidation(): boolean {
    return (
      this.c['newPassword'].value === this.c['oldPassword'].value &&
      this.c['newPassword'].touched &&
      this.c['newPassword'].value?.trim() !== '' &&
      this.c['oldPassword'].value?.trim() !== '' &&
      this.c['newPassword'].touched
    );
  }

  matchPasswordValidation(): boolean {
    return (
      this.c['newPassword'].value !== this.c['confirmNewPassword'].value &&
      this.c['newPassword'].touched &&
      this.c['newPassword'].value?.trim() !== '' &&
      this.c['confirmNewPassword'].value?.trim() !== '' &&
      this.c['confirmNewPassword'].touched
    );
  }

  async onSubmit(): Promise<void> {
    if (
      !this.changePasswordForm.valid ||
      this.samePasswordValidation() ||
      this.matchPasswordValidation()
    )
      return;
    const data = this.changePasswordForm.value;
    data.email = this.email;
    const response = await this.authService.changePassword(data);
    if (response && response.data && response.data.length > 0) {
      this.snackbar.success(response.data[0]);
      this.changePasswordForm.reset();
    }
  }
}
