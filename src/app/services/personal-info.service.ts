import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { HttpHeaders } from '@angular/common/http';
import { BaseResonse } from '../models/common.model';
import { environment } from 'src/environments/environment';
import { PersonalInfo, StripeCard } from '../models/personal-Info.model';

@Injectable({
  providedIn: 'root',
})
export class PersonalInfoService {
  constructor(private httpService: HttpService) {}

  headers = new HttpHeaders({
    clientId: environment.clientId,
    clientSecret: environment.clientSecret,
    'Access-Control-Allow-Origin': '*', // Replace '*' with the appropriate origin
  });
  options = { headers: this.headers };

  async personalInfoGetApi(email: string): Promise<BaseResonse> {
    return this.httpService.get(
      `/api/Profile/get-personal-info?email=${email}`
    );
  }

  async personalInfoUpdate(data: PersonalInfo): Promise<BaseResonse> {
    return this.httpService.put(`/api/Profile/update-personal-info`, data);
  }

  async updateEmail(data: PersonalInfo): Promise<BaseResonse> {
    return this.httpService.put(`/api/Profile/update-email-address`, data);
  }

  async confirmEmail(data: {
    email: string;
    domain: string;
    userName: string;
  }): Promise<BaseResonse> {
    return this.httpService.post(
      `/api/Profile/email-confirmation-service`,
      data
    );
  }

  async verifyEmail(userId: string, token: string): Promise<BaseResonse> {
    const token1 = encodeURIComponent(token);
    return this.httpService.get(
      `/api/Profile/confirm-email?userId=${userId}&token=${token1}`,
      this.options
    );
  }

  async updatePhoneNumber(data: PersonalInfo): Promise<BaseResonse> {
    return this.httpService.post(`/api/Profile/add-update-phone-number`, data);
  }

  async verifyPhoneNumber(data: PersonalInfo): Promise<BaseResonse> {
    return this.httpService.post(
      `/api/Profile/send-phone-verification-code`,
      data
    );
  }

  async verifyOtp(data: PersonalInfo): Promise<BaseResonse> {
    const phoneNumber = String(data.phoneNumber).replace('+', '%2B');
    return this.httpService.get(
      `/api/Profile/confirm-phone-verification-code?email=${data.email}&phoneNumber=${phoneNumber}&token=${data.token}`
    );
  }

  async updateAdditionInfo(data: PersonalInfo): Promise<BaseResonse> {
    return this.httpService.post(
      `/api/Profile/add-update-additional-information`,
      data
    );
  }

  async getAdditionInfo(email: string): Promise<BaseResonse> {
    return this.httpService.get(
      `/api/Profile/get-additional-information?email=${email}`
    );
  }

  async updateNotifications(data: PersonalInfo): Promise<BaseResonse> {
    return this.httpService.post(`/api/Profile/add-update-notification`, data);
  }

  async getNotifications(email: string): Promise<BaseResonse> {
    return this.httpService.get(`/api/Profile/get-notification?email=${email}`);
  }

  // async updatePaymentMethod(cardToken: string): Promise<BaseResonse> {
  //   return this.httpService.post(`/api/Profile/add-update-payment-method`, {
  //     cardToken,
  //   });
  // }

  async updatePaymentMethod(token: string): Promise<BaseResonse> {
    return this.httpService.post(
      `/api/Payment/create-customer-and-add-multiple-cards`,
      {
        token,
      }
    );
  }

  async createCustomer(data: StripeCard): Promise<BaseResonse> {
    return this.httpService.post(`/api/Payment/create-customer`, data);
  }

  async getPaymentMethod(): Promise<BaseResonse> {
    return this.httpService.get(`/api/Profile/get-payment-method`);
  }

  async getPaymentCards(): Promise<BaseResonse> {
    return this.httpService.get(`/api/Payment/get-cards-by-user-id`);
  }

  async deletePaymentCard(token: string): Promise<BaseResonse> {
    return this.httpService.post(`/api/Payment/remove-card`, {
      token,
    });
  }
  // profile image
  async updateProfileImage(formData: FormData): Promise<BaseResonse> {
    return this.httpService.put(`/api/Profile/update-profile-image`, formData);
  }

  async deleteProfileImage(email: string): Promise<BaseResonse> {
    const data = {
      email: email,
    };
    return this.httpService.delete(
      `/api/Profile/delete-profile-image?email=${email}`
    );
  }

  async sendOTPByEmail(email: string): Promise<BaseResonse> {
    return this.httpService.put(
      `/api/Profile/send-otp-by-email?email=${email}`,
      {}
    );
  }

  async sendOTPToUpdateEmail(
    oldEmailAddress: string,
    newEmailAddress: string,
    password: string
  ): Promise<BaseResonse> {
    const payload = {
      oldEmailAddress: oldEmailAddress,
      newEmailAddress: newEmailAddress,
      password: password,
    };
    return this.httpService.post(
      `/api/Profile/send-otp-for-update-email`,
      payload
    );
  }

  async updateEmailByOtp(
    oldEmailAddress: string,
    newEmailAddress: string,
    otpCode: string
  ): Promise<BaseResonse> {
    const payload = {
      oldEmailAddress: oldEmailAddress,
      newEmailAddress: newEmailAddress,
      otpCode: otpCode,
    };
    return this.httpService.post(`/api/Profile/update-email-by-otp`, payload);
  }

  async getAllReviewsByUser(): Promise<BaseResonse> {
    return this.httpService.get(`/api/Profile/get-all-user-commented-reviews`);
  }
}
