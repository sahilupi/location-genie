import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { NgProgressModule } from 'ngx-progressbar';
import { NgProgressHttpModule } from 'ngx-progressbar/http';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AppRoutingModule } from './app-routing.module';
import { SharedModule } from './shared/shared.module';
import { AuthModule } from './auth/auth.module';
import { AppComponent } from './app.component';
import { AuthInterceptor } from './interceptors/auth-interceptor';
import { ReferralComponent } from './components/referral/referral.component';
import { environment } from 'src/environments/environment';
import { ProfileComponent } from './components/profile/profile.component';
import { DatePipe } from '@angular/common';
import { GeneralComponent } from './components/general/general.component';
import { LocationGenieWorkComponent } from './components/location-genie-work/location-genie-work.component';
import { DriveBookingsComponent } from './components/drive-bookings/drive-bookings.component';
import { EmailVerificationComponent } from './components/email-verification/email-verification.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { TermsComponent } from './components/terms/terms.component';
import { PrivacyComponent } from './components/privacy/privacy.component';
import { BookingFlowComponent } from './components/booking-flow/booking-flow.component';
import { RefundPolicyComponent } from './components/refund-policy/refund-policy.component';
import { PingComponent } from './components/ping/ping.component';

@NgModule({
  declarations: [
    AppComponent,
    ReferralComponent,
    ProfileComponent,
    GeneralComponent,
    LocationGenieWorkComponent,
    DriveBookingsComponent,
    EmailVerificationComponent,
    NotFoundComponent,
    TermsComponent,
    PrivacyComponent,
    BookingFlowComponent,
    RefundPolicyComponent,
    PingComponent,
  ],
  imports: [
    BrowserModule,
    DatePipe,
    AppRoutingModule,
    BrowserAnimationsModule,
    SharedModule,
    AuthModule,
    HttpClientModule,
    NgProgressModule.withConfig({
      color: '#016670',
      spinner: false,
    }),
    NgProgressHttpModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
