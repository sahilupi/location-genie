import { Component, Input, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Observable, map, startWith } from 'rxjs';
import { COUNTRY_CODE } from 'src/app/constants/country-code.constant';
import { ListingStepperConstant } from 'src/app/constants/listing-stepper.constant';
import { LocalConstant } from 'src/app/constants/local-constant';
import { SuccessConstant } from 'src/app/constants/success.constant';
import { CountryCode } from 'src/app/models/common.model';
import { PersonalInfo } from 'src/app/models/personal-Info.model';
import { PhoneOtpComponent } from 'src/app/modules/account/phone-otp/phone-otp.component';
import { CommonService } from 'src/app/services/common.service';
import { ListingStepThreeService } from 'src/app/services/listing-step-three.service';
import { LocalService } from 'src/app/services/local.service';
import { PersonalInfoService } from 'src/app/services/personal-info.service';
import { SnackBarService } from 'src/app/services/snack-bar.service';
import { SpinnerService } from 'src/app/services/spinner.service';

@Component({
  selector: 'app-step-three-fifth-page',
  templateUrl: './step-three-fifth-page.component.html',
  styleUrls: ['./step-three-fifth-page.component.scss'],
})
export class StepThreeFifthPageComponent implements OnInit {
  @Input({ required: true }) listingId: string;

  backBtnRoute: string;
  nxtBtnRoute: string;
  phoneInfoForm: FormGroup;
  dialCodeControl!: FormControl;
  filteredCountryCodes!: Observable<CountryCode[]>;
  countryCode: CountryCode[] = COUNTRY_CODE;
  selectedDialCode: string = '+991';
  selectedCountry = 'AE';
  isSubmitted = false;
  personalInfoData: PersonalInfo;
  isPasswordRequired = false;
  email: string;
  validationMsg = `Changing of phone number should be confirmed with your
  password.`;
  stepperData = ListingStepperConstant.stepThree;
  isInstantBooking = false;
  isPhoneVerified = false;
  isExternalLogin = false;
  isOTPsent = false;
  timerInterval: any;
  timerIntervalForOtp: any;
  display: string | number = '01:00';
  displaySendOtpTime: string | number;

  constructor(
    private personalInfoService: PersonalInfoService,
    public commonService: CommonService,
    private localService: LocalService,
    private router: Router,
    private snackbar: SnackBarService,
    private stepThreeService: ListingStepThreeService,
    private dialog: MatDialog,
    private spinner: SpinnerService
  ) {}

  async ngOnInit(): Promise<void> {
    this.spinner.show();
    try {
      this.backBtnRoute = `/become-a-host/${+this
        .listingId}/step-3/activities-detail`;
      this.nxtBtnRoute = `/become-a-host/${+this.listingId}`;
      const userData = await this.localService.getLocalData(
        LocalConstant.USER_DATA
      );
      this.email = userData.user_name ? userData.user_name : userData.email;
      await this.getUserData(this.email);
      await this.onGetBookingRequestType();
      await this.phoneInfoFormInit();
      this.spinner.hide();
    } catch (err) {
      this.spinner.hide();
    }
  }

  async getUserData(email: string): Promise<void> {
    const data = await this.personalInfoService.personalInfoGetApi(email);
    this.personalInfoData = data.data;

    this.isExternalLogin = data.data.isExternalLogin;
    this.isPhoneVerified = data.data.isPhoneVerified;
  }

  private async phoneInfoFormInit(): Promise<void> {
    this.dialCodeControl = new FormControl(
      { dialCode: '+971' },
      Validators.required
    );
    this.phoneInfoForm = new FormGroup({
      phoneNumber: new FormControl(
        this.personalInfoData?.phoneNumber
          ? this.personalInfoData.phoneNumber
          : null,
        [Validators.required, Validators.minLength(9)]
      ),
      password: new FormControl(null),
      otp: new FormControl(null),
    });

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

  async onVerifyPhoneNumber(): Promise<void> {
    const phoneNumberControl = this.phoneInfoForm.get('phoneNumber');
    if (phoneNumberControl && phoneNumberControl.value !== null) {
      const data = {
        email: this.email,
        phoneNumber: this.selectedDialCode + '-' + phoneNumberControl.value, // country code was missing, therefore there was error in sending OTP.
      };
      const response = await this.personalInfoService.verifyPhoneNumber(data);
      if (response && response.data && response.success) {
        if (response.data[0] == SuccessConstant.PHONE_VERIFIED) {
          this.snackbar.success(SuccessConstant.PHONE_VERIFIED);
        } else {
          const dialogRef = this.dialog.open(PhoneOtpComponent, {
            width: '600px',
            data: data,
            disableClose: true,
          });
          dialogRef.afterClosed().subscribe(async (res) => {
            if (res) {
              const stepCompleteRes =
                await this.stepThreeService.updateIsStepThreeCompleted(
                  Number(this.listingId),
                  true
                );
              const instantBookingRes =
                await this.stepThreeService.onUpdateBookingRequestType(
                  Number(this.listingId),
                  this.isInstantBooking
                );
              if (
                stepCompleteRes &&
                stepCompleteRes.success &&
                instantBookingRes &&
                instantBookingRes.success
              ) {
                this.router.navigateByUrl(this.nxtBtnRoute);
              }
            }
          });
        }
      }
    }
  }

  setUserData(): void {
    if (this.personalInfoData && this.personalInfoData.phoneNumber) {
      const phoneNumber: string[] =
        this.personalInfoData.phoneNumber.split('-');
      this.selectedDialCode = phoneNumber[0];
      const countryFound = this.countryCode.find(
        (x) => x.dialCode === this.selectedDialCode
      );

      this.dialCodeControl.patchValue(countryFound);
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
    this.dialCodeControl.patchValue({
      dialCode: this.selectedDialCode,
    });
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

  async onResendOtp(): Promise<void> {
    const otpRes = await this.personalInfoService.sendOTPByEmail(this.email);
    if (otpRes && otpRes.success) {
      this.timer(1);
      this.snackbar.success(SuccessConstant.OTP_SENT);
    }
  }

  async onSubmit(): Promise<void> {
    //if user social login
    if (
      this.phoneInfoForm.valid &&
      !this.isOTPsent &&
      this.isExternalLogin &&
      (this.personalInfoData.phoneNumber?.split('-')[1] !==
        this.phoneInfoForm.value.phoneNumber ||
        this.personalInfoData.phoneNumber?.split('-')[0] !==
          this.dialCodeControl.value.dialCode)
    ) {
      const otpRes = await this.personalInfoService.sendOTPByEmail(this.email);
      if (otpRes && otpRes.success) {
        this.phoneInfoForm.get('otp')?.addValidators(Validators.required);
        this.phoneInfoForm.get('otp')?.updateValueAndValidity();
        this.isOTPsent = true;
        this.timer(1);
        this.snackbar.success(SuccessConstant.OTP_SENT);
      }
      return;
    }
    // if (!this.isPhoneVerified) {
    //   this.onVerifyPhoneNumber();
    //   return;
    // }
    // if phone is not changed
    if (
      this.personalInfoData.phoneNumber?.split('-')[1] ===
        this.phoneInfoForm.value.phoneNumber &&
      this.personalInfoData.phoneNumber?.split('-')[0] ===
        this.dialCodeControl.value.dialCode
    ) {
      if (!this.isPhoneVerified) {
        this.onVerifyPhoneNumber();
        return;
      } else {
        const stepCompleteRes =
          await this.stepThreeService.updateIsStepThreeCompleted(
            Number(this.listingId),
            true
          );
        const instantBookingRes =
          await this.stepThreeService.onUpdateBookingRequestType(
            Number(this.listingId),
            this.isInstantBooking
          );
        if (
          stepCompleteRes &&
          stepCompleteRes.success &&
          instantBookingRes &&
          instantBookingRes.success
        ) {
          this.router.navigateByUrl(this.nxtBtnRoute);
        }
      }
    }

    // if phone is changed, ask for password
    if (
      this.personalInfoData.phoneNumber?.split('-')[1] !==
        this.phoneInfoForm.value.phoneNumber ||
      this.personalInfoData.phoneNumber?.split('-')[0] !==
        this.dialCodeControl.value.dialCode
    ) {
      if (!this.isExternalLogin) {
        this.isPasswordRequired = true;
        this.phoneInfoForm.controls['password']?.setValidators(
          Validators.required
        );
        this.phoneInfoForm.controls['password']?.updateValueAndValidity();
      }

      if (
        this.phoneInfoForm.valid &&
        (this.isPasswordRequired || this.isExternalLogin)
      ) {
        const data = {
          email: this.email,
          phoneNumber:
            this.dialCodeControl.value.dialCode +
            '-' +
            this.phoneInfoForm.value.phoneNumber,
          password: this.phoneInfoForm.value.password,
          otpCode: this.phoneInfoForm.value.otp,
        };
        const response = await this.personalInfoService.updatePhoneNumber(data);
        if (response.errors && response.errors.length > 0) {
          this.snackbar.error(response.errors[0]);
        }
        if (response && response.success && response.data) {
          this.onVerifyPhoneNumber();
          return;
          // const stepCompleteRes =
          //   await this.stepThreeService.updateIsStepThreeCompleted(
          //     Number(this.listingId),
          //     true
          //   );
          // if (stepCompleteRes && stepCompleteRes.success) {
          //   this.router.navigateByUrl(this.nxtBtnRoute);
          // }
        }
      }
    }
  }

  private async onGetBookingRequestType(): Promise<void> {
    const response = await this.stepThreeService.onGetBookingRequestType(
      Number(this.listingId)
    );
    if (response && response.success) {
      this.isInstantBooking = response.data.response.isInstantBooking;
    }
  }

  onSaveAndExit(): void {
    this.router.navigateByUrl(this.nxtBtnRoute);
  }
}
