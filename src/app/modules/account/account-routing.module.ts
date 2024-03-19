import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccountSidebarComponent } from './account-sidebar/account-sidebar.component';
import { AdditionalInfoComponent } from './additional-info/additional-info.component';
import { LoginandsecurityComponent } from './login-security/login-security.component';
import { PersonalInfoComponent } from './personal-info/personal-info.component';
import { PaymentsComponent } from './payments/payments.component';
import { PayoutsComponent } from './payouts/payouts.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { AddPaymentMethodComponent } from './add-payment-method/add-payment-method.component';
import { MyReviewsComponent } from './my-reviews/my-reviews.component';

const routes: Routes = [
  {
    path: '',
    component: AccountSidebarComponent,

    children: [
      {
        path: '',
        component: PersonalInfoComponent,
      },
      {
        path: 'personal',
        component: PersonalInfoComponent,
      },
      {
        path: 'additional',
        component: AdditionalInfoComponent,
      },
      {
        path: 'security',
        component: LoginandsecurityComponent,
      },
      {
        path: 'payments',
        component: PaymentsComponent,
      },
      {
        path: 'payment',
        component: AddPaymentMethodComponent,
      },
      {
        path: 'payouts',
        component: PayoutsComponent,
      },
      {
        path: 'notifications',
        component: NotificationsComponent,
      },
      {
        path: 'my-reviews',
        component: MyReviewsComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AccountRoutingModule {}
