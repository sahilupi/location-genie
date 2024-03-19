import { Component, OnInit, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ErrorConstant } from 'src/app/constants/error.constant';
import { SuccessConstant } from 'src/app/constants/success.constant';
import { PersonalInfoService } from 'src/app/services/personal-info.service';
import { SnackBarService } from 'src/app/services/snack-bar.service';

@Component({
  selector: 'app-phone-otp',
  templateUrl: './phone-otp.component.html',
  styleUrls: ['./phone-otp.component.scss'],
})
export class PhoneOtpComponent implements OnInit {
  otpForm: FormGroup;
  public timerInterval: any;
  public timerIntervalForOtp: any;
  display: string | number = '02:00';
  displaySendOtpTime: string | number;

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: { email: string; phoneNumber: string },
    private personalInfoService: PersonalInfoService,
    private snackbar: SnackBarService,
    public dialogRef: MatDialogRef<PhoneOtpComponent>
  ) {}

  async ngOnInit(): Promise<void> {
    this.timer(2);
    await this.otpFormInit();
  }

  private async otpFormInit(): Promise<void> {
    this.otpForm = new FormGroup({
      otp: new FormControl(null, [Validators.required]),
    });
  }

  async onSubmit(): Promise<void> {
    if (!this.otpForm.valid) return;
    const data = {
      email: this.data.email,
      phoneNumber: this.data.phoneNumber,
      token: this.otpForm.value.otp,
    };
    const resposnce = await this.personalInfoService.verifyOtp(data);
    if (resposnce.errors && resposnce.errors.length > 0) {
      this.snackbar.error(ErrorConstant.INVALID_OTP);
    }
    if (resposnce.data && resposnce.data.length > 0) {
      this.snackbar.success(resposnce.data[0]);
      this.dialogRef.close(resposnce.data);
    }
  }

  timer(minute: number): void {
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

  async resendOTP(): Promise<void> {
    // clearInterval(this.timerInterval);
    const data = {
      email: this.data.email,
      phoneNumber: this.data.phoneNumber,
    };
    const response = await this.personalInfoService.verifyPhoneNumber(data);
    if (response && response.data && response.success) {
      if (response.data[0] == SuccessConstant.PHONE_VERIFIED) {
        this.snackbar.success(SuccessConstant.PHONE_VERIFIED);
      } else {
        this.timer(2);
      }
    }
  }
}
