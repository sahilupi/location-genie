import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { LocalConstant } from 'src/app/constants/local-constant';
import { PersonalInfo } from 'src/app/models/personal-Info.model';
import { LocalService } from 'src/app/services/local.service';
import { PersonalInfoService } from 'src/app/services/personal-info.service';
import { SnackBarService } from 'src/app/services/snack-bar.service';
import { SpinnerService } from 'src/app/services/spinner.service';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss'],
})
export class NotificationsComponent implements OnInit {
  notificationForm: FormGroup;
  email: string;
  personalInfoData: PersonalInfo;

  constructor(
    private localService: LocalService,
    private personalInfoService: PersonalInfoService,
    private snackbar: SnackBarService,
    private spinner: SpinnerService
  ) {}

  async ngOnInit(): Promise<void> {
    this.spinner.show();
    try {
      await this.notificationFormInit();
      const userData = await this.localService.getLocalData(
        LocalConstant.USER_DATA
      );
      this.email = userData.user_name ? userData.user_name : userData.email;
      await this.fetchData(this.email);
      await this.getNotifications();
      this.spinner.hide();
    } catch (error) {
      this.spinner.hide();
    }
  }

  private async fetchData(email: string): Promise<void> {
    const data = await this.personalInfoService.personalInfoGetApi(email);
    this.personalInfoData = data.data;
  }

  private async notificationFormInit(): Promise<void> {
    this.notificationForm = new FormGroup({
      isSendChatResponsesToCellPhone: new FormControl(false),
      isDoNotWantToReceiveMarketingSMS: new FormControl(false),
      isDoNotWantToReceiveMarketingEmail: new FormControl(false),
    });
  }

  private async getNotifications(): Promise<void> {
    const response = await this.personalInfoService.getNotifications(
      this.email
    );
    if (response && response.data) {
      this.notificationForm.setValue({
        isSendChatResponsesToCellPhone:
          response.data.isSendChatResponsesToCellPhone,
        isDoNotWantToReceiveMarketingSMS:
          response.data.isDoNotWantToReceiveMarketingSMS,
        isDoNotWantToReceiveMarketingEmail:
          response.data.isDoNotWantToReceiveMarketingEmail,
      });
    }
  }

  async onSubmitForm(): Promise<void> {
    if (!this.notificationForm.valid || !this.notificationForm.dirty) return;
    this.notificationForm.markAsPristine();
    const data = this.notificationForm.value;
    data.email = this.email;
    const response = await this.personalInfoService.updateNotifications(data);
    if (response && response.data && response.data.message) {
      this.snackbar.success(response.data.message);
    }
  }
}
