import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

import { SharedModule } from '../shared/shared.module';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { ResetComponent } from './reset/reset.component';
import { Router, RouterModule, Routes } from '@angular/router';
import { LoginPopupComponent } from './login-popup/login-popup.component';
import { ChangePasswordComponent } from './change-password/change-password.component';

const routes: Routes = [
  {
    path: '',
    component: LoginComponent,
  },
];

@NgModule({
  declarations: [LoginComponent, SignupComponent, ResetComponent, LoginPopupComponent, ChangePasswordComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SharedModule,
    RouterModule.forChild(routes),
  ],
  providers: [
    {
      provide: MatDialogRef,
      multi: true,
      useValue: {},
    },
  ],
})
export class AuthModule {}
