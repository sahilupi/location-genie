import { Component, Inject, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Observable, map, startWith } from 'rxjs';
import { COUNTRY_CODE } from 'src/app/constants/country-code.constant';
import { SuccessConstant } from 'src/app/constants/success.constant';
import { CountryCode } from 'src/app/models/common.model';
import { CommonService } from 'src/app/services/common.service';
import { PersonalInfoService } from 'src/app/services/personal-info.service';
import { SnackBarService } from 'src/app/services/snack-bar.service';

@Component({
  selector: 'app-phone-update-model',
  templateUrl: './phone-update-model.component.html',
  styleUrls: ['./phone-update-model.component.scss'],
})
export class PhoneUpdateModelComponent implements OnInit {
  phoneInfoForm: FormGroup;
  dialCodeControl!: FormControl;
  filteredCountryCodes!: Observable<CountryCode[]>;
  countryCode: CountryCode[] = COUNTRY_CODE;
  selectedDialCode: string = '+971';
  selectedCountry = 'AE';
  isSubmitted = false;
  isOTPsent = false;
  public timerInterval: any;
  public timerIntervalForOtp: any;
  display: string | number = '01:00';
  displaySendOtpTime: string | number;
  isDialCodeError = false;

  constructor(
    private personalInfoService: PersonalInfoService,
    private snackbar: SnackBarService,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      email: string;
      phoneNumber: string;
      isExternalLogin: boolean;
    },
    public commonService: CommonService,
    public dialogRef: MatDialogRef<PhoneUpdateModelComponent>
  ) { }

  async ngOnInit(): Promise<void> {
    await this.phoneInfoFormInit();
  }

  private async phoneInfoFormInit(): Promise<void> {
    this.dialCodeControl = new FormControl(
      { dialCode: '+971' },
      Validators.required
    );
    this.phoneInfoForm = new FormGroup({
      phoneNumber: new FormControl(
        this.data.phoneNumber ? this.data.phoneNumber : null,
        [Validators.required, Validators.minLength(9)]
      ),
      password: new FormControl(null, [Validators.required]),
      otp: new FormControl(null),
    });

    if (this.data.isExternalLogin) {
      this.phoneInfoForm.get('password')?.setValidators(null);
      this.phoneInfoForm.get('password')?.setErrors(null);

      this.phoneInfoForm.get('password')?.updateValueAndValidity();
    }
    this.setUserData();

    this.filteredCountryCodes = this.dialCodeControl.valueChanges.pipe(
      startWith<string | CountryCode>(''),
      map((value) => (typeof value === 'string' ? value : value.dialCode)),
      map((country) =>
        country ? this.filterCountry(country) : this.countryCode.slice()
      )
    );
  }

  get c(): { [key: string]: AbstractControl } {
    return this.phoneInfoForm.controls;
  }

  setUserData(): void {
    if (this.data && this.data?.phoneNumber) {
      const phoneNumber: string[] = this.data.phoneNumber.split('-');
      this.selectedDialCode = phoneNumber[0];
      const countryFound = this.countryCode.find(
        (x) => x.dialCode === this.selectedDialCode
      );

      this.dialCodeControl.patchValue(countryFound);
      this.isDialCodeError = false;
      this.selectedCountry = countryFound ? countryFound.code : 'AE';
      this.phoneInfoForm.patchValue({
        phoneNumber: phoneNumber[1],
      });

      // this.personalInfoForm.patchValue({ dialCodeControl: this.selectedDialCode });
    }
  }

  filterCountry(data: string): CountryCode[] {
    const codeData = this.countryCode.filter(
      (option) =>
        option.dialCode.toLowerCase().indexOf(data.toLowerCase()) === 0
    );
    const dialCodeData = this.countryCode.filter(
      (option) => option.code.toLowerCase().indexOf(data.toLowerCase()) === 0
    );
    const result = [...codeData, ...dialCodeData];
    return result;
  }

  displayFn(data?: CountryCode): string {
    return data ? data.dialCode : '+971';
  }

  onChangeCountry(data: CountryCode): void {
    this.selectedCountry = data.code;
    this.selectedDialCode = data.dialCode;
    this.isDialCodeError = false;
  }

  changeCountry(event: any): void {
    this.selectedDialCode = event.target.value;

    this.countryCode.map((element) => {
      if (element.dialCode === this.selectedDialCode) {
        this.selectedCountry = element.code;
      }
      if (event.target.value == '' || event.target.value == '+') {
        this.selectedCountry = 'AE';
      }
    });
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
    this.isSubmitted = true;
    if (!this.dialCodeControl.value.dialCode) {
      this.isDialCodeError = true;
    }
    if (!this.phoneInfoForm.valid) return;
    if (!this.dialCodeControl.valid || !this.dialCodeControl.value.dialCode)
      return;
    if (!this.isOTPsent && this.data.isExternalLogin) {
      const otpRes = await this.personalInfoService.sendOTPByEmail(
        this.data.email
      );
      if (otpRes && otpRes.success) {
        this.phoneInfoForm.get('otp')?.addValidators(Validators.required);
        this.phoneInfoForm.get('otp')?.updateValueAndValidity();
        this.isOTPsent = true;
        this.timer(1);
        this.snackbar.success(SuccessConstant.OTP_SENT);
      }
      return;
    }
    const data = {
      email: this.data.email,
      phoneNumber:
        this.dialCodeControl.value.dialCode +
        '-' +
        this.phoneInfoForm.value.phoneNumber,
      password: this.phoneInfoForm.value.password,
      otpCode: this.phoneInfoForm.value.otp,
    };
    const resposnce = await this.personalInfoService.updatePhoneNumber(data);
    if (resposnce.errors && resposnce.errors.length > 0) {
      this.snackbar.error(resposnce.errors[0]);
    }
    if (resposnce.data && resposnce.data.length > 0) {
      this.snackbar.success(resposnce.data[0]);
      this.dialogRef.close({ phoneNumber: data.phoneNumber });
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
}
