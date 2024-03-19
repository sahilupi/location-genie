import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { LocalConstant } from 'src/app/constants/local-constant';
import { LocalService } from 'src/app/services/local.service';
import { PersonalInfoService } from 'src/app/services/personal-info.service';
import { SnackBarService } from 'src/app/services/snack-bar.service';
import { SpinnerService } from 'src/app/services/spinner.service';

@Component({
  selector: 'app-additional-info',
  templateUrl: './additional-info.component.html',
  styleUrls: ['./additional-info.component.scss'],
})
export class AdditionalInfoComponent implements OnInit {
  additionInfoForm: FormGroup;
  email: string;

  constructor(
    private personalInfoService: PersonalInfoService,
    private localService: LocalService,
    private snackbar: SnackBarService,
    private spinner: SpinnerService
  ) {}

  async ngOnInit(): Promise<void> {
    this.spinner.show();
    try {
      await this.additionFormInit();

      const userData = await this.localService.getLocalData(
        LocalConstant.USER_DATA
      );
      this.email = userData.user_name;
      await this.getAdditionalInfo();
      this.spinner.hide();
    } catch (error) {
      this.spinner.hide();
    }
  }

  private async additionFormInit(): Promise<void> {
    this.additionInfoForm = new FormGroup({
      companyName: new FormControl(null, [Validators.required]),
      about: new FormControl(null, [Validators.required]),
    });
  }

  private async getAdditionalInfo(): Promise<void> {
    const response = await this.personalInfoService.getAdditionInfo(this.email);
    if (response && response.data) {
      this.additionInfoForm.setValue({
        companyName: response.data.companyName,
        about: response.data.about,
      });
    }
  }

  async onSubmitForm(): Promise<void> {
    if (!this.additionInfoForm.valid || !this.additionInfoForm.dirty) return;
    this.additionInfoForm.markAsPristine();
    const data = this.additionInfoForm.value;
    data.email = this.email;
    const response = await this.personalInfoService.updateAdditionInfo(data);
    if (response && response.data && response.data.message) {
      this.snackbar.success(response.data.message);
    }
  }
}
