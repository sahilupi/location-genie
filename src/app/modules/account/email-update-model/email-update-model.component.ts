import { Component, OnInit, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { emailValidator } from 'src/app/constants/patterns.constant';
import { SuccessConstant } from 'src/app/constants/success.constant';

import { PersonalInfoService } from 'src/app/services/personal-info.service';
import { SnackBarService } from 'src/app/services/snack-bar.service';

@Component({
  selector: 'app-email-update-model',
  templateUrl: './email-update-model.component.html',
  styleUrls: ['./email-update-model.component.scss'],
})
export class EmailUpdateModelComponent implements OnInit {
  emailInfoForm: FormGroup;
  isOTPsent = false;
  isUpdateEmailOTPsent = false;
  public timerInterval: any;
  public timerIntervalForOtp: any;
  display: string | number = '01:00';
  displaySendOtpTime: string | number;
  isSubmitted = false;
  email: string = '';

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: { email: string; isExternalLogin: boolean },
    private personalInfoService: PersonalInfoService,
    private snackbar: SnackBarService,
    public dialogRef: MatDialogRef<EmailUpdateModelComponent>
  ) {}

  async ngOnInit(): Promise<void> {
    this.email = this.data.email;
    await this.emailInfoFormInit();
  }

  private async emailInfoFormInit(): Promise<void> {
    this.emailInfoForm = new FormGroup({
      email: new FormControl(this.data.email ? this.data.email : null, [
        Validators.required,
        emailValidator,
      ]),
      password: new FormControl(null, [Validators.required]),
      otp: new FormControl(null),
    });

    if (this.data.isExternalLogin) {
      this.emailInfoForm.get('password')?.setValidators(null);
      this.emailInfoForm.get('password')?.setErrors(null);

      this.emailInfoForm.get('password')?.updateValueAndValidity();
    }
  }

  async onResendOtp(): Promise<void> {
    const otpRes = await this.personalInfoService.sendOTPByEmail(
      this.data.email
    );
    if (otpRes && otpRes.success) {
      this.timer(1);
      this.snackbar.success(SuccessConstant.OTP_SENT);
    }
  }

  async onSubmit(): Promise<void> {
    if (this.isUpdateEmailOTPsent) {
      await this.onSubmitOtpToUpdateEmail();
      return;
    }
    if (!this.isOTPsent && this.data.isExternalLogin) {
      const otpRes = await this.personalInfoService.sendOTPByEmail(
        this.data.email
      );
      if (otpRes && otpRes.success) {
        this.emailInfoForm.get('otp')?.addValidators(Validators.required);
        this.emailInfoForm.get('otp')?.updateValueAndValidity();
        this.isOTPsent = true;
        this.timer(1);
        this.snackbar.success(SuccessConstant.OTP_SENT);
      }
      return;
    }
    this.isSubmitted = true;
    if (!this.emailInfoForm.valid) return;
    if (this.email.trim() === this.emailInfoForm.value.email) {
      this.snackbar.error('You are entering the old email');
      return;
    }

    const resposnce = await this.personalInfoService.sendOTPToUpdateEmail(
      this.email,
      this.emailInfoForm.value.email,
      this.emailInfoForm.value.password
    );
    if (resposnce && resposnce.errors && resposnce.errors.length > 0) {
      this.snackbar.error(resposnce.errors[0]);
      this.isUpdateEmailOTPsent = false;
    }
    if (resposnce && resposnce.success) {
      this.snackbar.success(SuccessConstant.OTP_SENT);
      this.isUpdateEmailOTPsent = true;
      this.timer(1);
    }
  }

  async onSubmitOtpToUpdateEmail(): Promise<void> {
    this.isSubmitted = true;
    if (!this.emailInfoForm.valid || !this.emailInfoForm.value.otp) return;

    const resposnce = await this.personalInfoService.updateEmailByOtp(
      this.email,
      this.emailInfoForm.value.email,
      this.emailInfoForm.value.otp
    );
    if (resposnce && resposnce.errors && resposnce.errors.length > 0) {
      this.snackbar.error(resposnce.errors[0]);
      this.isUpdateEmailOTPsent = false;
    }
    if (resposnce && resposnce.success) {
      this.snackbar.success(SuccessConstant.EMAIL_UPDATE);
      this.dialogRef.close({ email: this.emailInfoForm.value.email });
      this.isUpdateEmailOTPsent = true;
    }
  }

  private timer(minute: number): void {
    // let minute = 1;
    let seconds: number = minute * 60;
    let textSec: string | number = '0';
    let statSec: number = 60;
    const prefix = minute < 10 ? '0' : '';
    this.timerInterval = setInterval(() => {
      seconds--;
      if (statSec != 0) statSec--;
      else statSec = 59;

      if (statSec < 10) {
        textSec = '0' + statSec;
      } else textSec = statSec;

      this.display = `${prefix}${Math.floor(seconds / 60)}:${textSec}`;
      if (seconds == 0) {
        this.display = 0;
        clearInterval(this.timerInterval);
      }
    }, 1000);
  }
}
