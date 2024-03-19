import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { PersonalInfoService } from '../../../services/personal-info.service';
import { LocalService } from 'src/app/services/local.service';
import { LocalConstant } from 'src/app/constants/local-constant';
import { PersonalInfo } from 'src/app/models/personal-Info.model';
import { SnackBarService } from 'src/app/services/snack-bar.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { EmailUpdateModelComponent } from '../email-update-model/email-update-model.component';
import { PhoneUpdateModelComponent } from '../phone-update-model/phone-update-model.component';
import { PhoneOtpComponent } from '../phone-otp/phone-otp.component';
import { CountryCode } from 'src/app/models/common.model';
import { COUNTRY_CODE } from 'src/app/constants/country-code.constant';
import { CommonService } from 'src/app/services/common.service';
import { SuccessConstant } from 'src/app/constants/success.constant';
import { LoginUserData } from 'src/app/models/auth.model';
import { SpinnerService } from 'src/app/services/spinner.service';

@Component({
  selector: 'app-personal-info',
  templateUrl: './personal-info.component.html',
  styleUrls: ['./personal-info.component.scss'],
})
export class PersonalInfoComponent implements OnInit {
  personalInfoForm: FormGroup;
  personalInfoData: PersonalInfo;
  filteredCountryCodes!: Observable<CountryCode[]>;
  countryCode: CountryCode[] = COUNTRY_CODE;
  selectedDialCode: string = '+1';
  selectedCountry = 'US';
  isSubmitted = false;
  userData: LoginUserData;
  isExternalLogin = false;
  isPhoneVerified = false;
  isEmailVerified = false;

  constructor(
    private personalInfoService: PersonalInfoService,
    private localService: LocalService,
    protected commonService: CommonService,
    private snackbar: SnackBarService,
    public dialogRef: MatDialogRef<EmailUpdateModelComponent>,
    private dialog: MatDialog,
    private spinner: SpinnerService
  ) {}

  async ngOnInit(): Promise<void> {
    this.spinner.show();
    try {
      this.userData = await this.localService.getLocalData(
        LocalConstant.USER_DATA
      );
      await this.fetchData(
        this.userData.user_name ? this.userData.user_name : this.userData.email
      );
      await this.personalInfoFormInit();
      this.spinner.hide();
    } catch (error) {
      this.spinner.hide();
    }
  }

  private async personalInfoFormInit(): Promise<void> {
    this.personalInfoForm = new FormGroup({
      firstName: new FormControl(
        this.personalInfoData ? this.personalInfoData.firstName : null,
        [Validators.required, Validators.maxLength(30)]
      ),
      lastName: new FormControl(
        this.personalInfoData ? this.personalInfoData.lastName : null,
        [Validators.required, Validators.maxLength(30)]
      ),
      email: new FormControl(
        this.personalInfoData ? this.personalInfoData.email : null
      ),
      phoneNumber: new FormControl(
        this.personalInfoData &&
        this.personalInfoData.phoneNumber &&
        this.personalInfoData.phoneNumber != 'null'
          ? this.personalInfoData.phoneNumber
          : null
      ),
    });
  }

  async fetchData(email: string): Promise<void> {
    const response = await this.personalInfoService.personalInfoGetApi(email);
    if (response && response.success && response.data) {
      this.personalInfoData = response.data;
      this.isExternalLogin = response.data.isExternalLogin;
      this.isPhoneVerified = response.data.isPhoneVerified;
      this.isEmailVerified = response.data.isEmailVerified;
    }
  }

  async onSubmitForm(): Promise<void> {
    this.isSubmitted = true;
    if (!this.personalInfoForm.valid || !this.personalInfoForm.dirty) return;
    this.personalInfoForm.markAsPristine();
    const data = {
      email: this.personalInfoForm.value.email,
      firstName: this.personalInfoForm.value.firstName,
      lastName: this.personalInfoForm.value.lastName,
      roles: 'User',
    };
    const response = await this.personalInfoService.personalInfoUpdate(data);
    if (response && response.data && response.data.length > 0) {
      this.snackbar.success(response.data[0]);
    }
  }

  async onUpdateEmail(): Promise<void> {
    const dialogRef = this.dialog.open(EmailUpdateModelComponent, {
      width: '600px',
      data: {
        email: this.personalInfoForm.value.email,
        isExternalLogin: this.isExternalLogin,
      },
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe(async (res) => {
      if (res && res.email) {
        const userData = await this.localService.getLocalData(
          LocalConstant.USER_DATA
        );
        userData.user_name = res.email;
        await this.localService.setLocalData(LocalConstant.USER_DATA, userData);
        this.personalInfoForm.patchValue({ email: res.email });
        // this.isEmailVerified = false;
      }
    });
  }

  async onConfirmEmail(): Promise<void> {
    const domain = window.location.protocol + '//' + window.location.host;
    const userName = this.personalInfoForm.value.firstName
      ? this.personalInfoForm.value.firstName +
        ' ' +
        this.personalInfoForm.value.lastName
      : this.userData.user_name;
    const payload = {
      email: this.personalInfoForm.value.email,
      domain: domain,
      userName: userName,
    };
    const response = await this.personalInfoService.confirmEmail(payload);
    if (response && response.data && response.success) {
      this.snackbar.success(response.data[0]);
    }
  }

  onUpdatePhone(): void {
    const data = {
      email: this.personalInfoForm.value.email,
      phoneNumber: this.personalInfoForm.value.phoneNumber
        ? this.personalInfoForm.value.phoneNumber
        : null,
      isExternalLogin: this.isExternalLogin,
    };
    const dialogRef = this.dialog.open(PhoneUpdateModelComponent, {
      width: '600px',
      data: data,
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((res) => {
      if (res && res.phoneNumber) {
        this.personalInfoForm.patchValue({ phoneNumber: res.phoneNumber });
        this.isPhoneVerified = false;
      }
    });
  }

  async onVerifyPhoneNumber(): Promise<void> {
    const data = {
      email: this.personalInfoForm.value.email,
      phoneNumber: this.personalInfoForm.value.phoneNumber,
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

        dialogRef.afterClosed().subscribe((res) => {
          if (res) {
            this.isPhoneVerified = true;
          }
        });
      }
    }
  }

  get f(): any {
    return this.personalInfoForm.controls;
  }
}
