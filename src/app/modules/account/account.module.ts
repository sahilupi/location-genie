import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxStripeModule } from 'ngx-stripe';
import { ImageCropperModule } from 'ngx-image-cropper';
import {
  provideEnvironmentNgxMask,
  IConfig,
  NgxMaskDirective,
  NgxMaskPipe,
} from 'ngx-mask';

import { AccountRoutingModule } from './account-routing.module';
import { PersonalInfoComponent } from './personal-info/personal-info.component';
import { AdditionalInfoComponent } from './additional-info/additional-info.component';
import { LoginandsecurityComponent } from './login-security/login-security.component';
import { AccountSidebarComponent } from './account-sidebar/account-sidebar.component';
import { PaymentsComponent } from './payments/payments.component';
import { PayoutsComponent } from './payouts/payouts.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { AddPaymentMethodComponent } from './add-payment-method/add-payment-method.component';
import { EmailUpdateModelComponent } from './email-update-model/email-update-model.component';
import { PhoneUpdateModelComponent } from './phone-update-model/phone-update-model.component';
import { PhoneOtpComponent } from './phone-otp/phone-otp.component';
import { environment } from 'src/environments/environment';
import { EditProfileImageComponent } from './edit-profile-image/edit-profile-image.component';
import { AddStripeCardComponent } from './add-stripe-card/add-stripe-card.component';
import { MyReviewsComponent } from './my-reviews/my-reviews.component';

const maskConfig: Partial<IConfig> = {
  validation: false,
};

@NgModule({
  declarations: [
    PersonalInfoComponent,
    AdditionalInfoComponent,
    LoginandsecurityComponent,
    AccountSidebarComponent,
    PaymentsComponent,
    PayoutsComponent,
    NotificationsComponent,
    AddPaymentMethodComponent,
    EmailUpdateModelComponent,
    PhoneUpdateModelComponent,
    PhoneOtpComponent,
    EditProfileImageComponent,
    AddStripeCardComponent,
    MyReviewsComponent,
  ],
  imports: [
    CommonModule,
    AccountRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    NgxStripeModule.forRoot(environment.stripePK),
    ImageCropperModule,
    FormsModule,
    NgxMaskDirective,
    NgxMaskPipe,
  ],
  providers: [provideEnvironmentNgxMask(maskConfig)],
})
export class AccountModule {}
