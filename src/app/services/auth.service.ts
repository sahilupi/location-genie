import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import {
  GoogleAuthProvider,
  FacebookAuthProvider,
  OAuthProvider,
} from 'firebase/auth';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { HttpService } from './http.service';
import {
  ChangePassword,
  LoginSignupUser,
  LoginUserData,
  Logout,
} from '../models/auth.model';
import { LocalConstant } from '../constants/local-constant';
import { LocalService } from 'src/app/services/local.service';
import { BaseResonse } from '../models/common.model';
import { SharedService } from './shared.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { LoginPopupComponent } from '../auth/login-popup/login-popup.component';
import { UserConstant } from '../constants/user.constant';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private httpService: HttpService,
    private localService: LocalService,
    private afAuth: AngularFireAuth,
    private sharedService: SharedService,
    private dialog: MatDialog,
    private router: Router,
    public dialogRef: MatDialogRef<LoginPopupComponent>
  ) { }

  headers = new HttpHeaders({
    clientId: 'LocationGenieFrontend',
    clientSecret: 'LocationGenieFrontendSecret',
  });
  options = { headers: this.headers };

  async isUserLoggedIn(): Promise<boolean> {
    const userData: LoginUserData = await this.localService.getLocalData(
      LocalConstant.USER_DATA
    );
    if (userData) {
      const userPayload = JSON.parse(atob(userData.access_token.split('.')[1]));
      if (userPayload.exp < Date.now() / 1000) {
        await this.localService.removeLocalData(LocalConstant.USER_DATA);
        await this.localService.removeLocalData(LocalConstant.USER_IMAGE);
        await this.localService.removeLocalData(LocalConstant.IS_HOST);
        await this.localService.removeLocalData(LocalConstant.HAS_HOST_ROLE);
        this.sharedService.setUserLoggedIn(false);
        this.sharedService.setHasHostRole(false);
        this.sharedService.setHostLoggedIn(false);
        this.sharedService.setUserLoggedIn(false);
      }
      return userPayload.exp > Date.now() / 1000;
    } else {
      return false;
    }
  }

  async isSuperAdminLoggedIn(): Promise<boolean> {
    const userData: LoginUserData = await this.localService.getLocalData(
      LocalConstant.USER_DATA
    );
    if (userData) {
      const userPayload = JSON.parse(atob(userData.access_token.split('.')[1]));
      if (userPayload && userPayload.exp < Date.now() / 1000) {
        await this.localService.removeLocalData(LocalConstant.USER_DATA);
        this.sharedService.setUserLoggedIn(false);
      } else if (
        !userPayload.role.includes(UserConstant.userRoles.superAdmin)
      ) {
        return false;
      }
      return userPayload.exp > Date.now() / 1000;
    } else {
      const route = location.pathname;
      this.dialogRef = this.dialog.open(LoginPopupComponent, {
        width: '600px',
        disableClose: true,
        autoFocus: false,
        data: {
          isLoggingIn: true,
        },
      });
      this.dialogRef.afterClosed().subscribe(async (response) => {
        if (response) {
          const userData: LoginUserData = response;
          const userPayload = JSON.parse(
            atob(userData.access_token.split('.')[1])
          );
          if (
            userPayload &&
            userPayload.exp > Date.now() / 1000 &&
            userPayload.role.includes(UserConstant.userRoles.superAdmin)
          ) {
            this.router.navigateByUrl(route);
          }
        }
      });
      return false;
    }
  }

  async getHostInfo(): Promise<boolean> {
    const isHost = await this.localService.getLocalData(LocalConstant.IS_HOST);
    if (isHost) {
      return true;
    } else {
      return false;
    }
  }

  async hasHostRole(): Promise<boolean> {
    const isHost = await this.localService.getLocalData(
      LocalConstant.HAS_HOST_ROLE
    );
    if (isHost) {
      return true;
    } else {
      return false;
    }
  }

  async login(data: LoginSignupUser): Promise<BaseResonse> {
    return this.httpService.post(`/api/Account/login`, data, this.options);
  }

  async signup(data: LoginSignupUser): Promise<BaseResonse> {
    return this.httpService.post(`/api/Account/signup`, data, this.options);
  }

  async logout(data: Logout): Promise<BaseResonse> {
    return this.httpService.post(`/serverApi`, data);
  }

  // logic for social signin popup
  async socialSignIn(provider: any): Promise<any> {
    return await this.afAuth.signInWithPopup(provider);
  }

  // google login
  async googleAuth(): Promise<any> {
    return await this.socialSignIn(new GoogleAuthProvider());
  }

  // facebook login
  async facebookAuth(): Promise<any> {
    return await this.socialSignIn(new FacebookAuthProvider());
  }
  async appleAuth() {
    return await this.socialSignIn(new OAuthProvider('apple.com'));
  }

  async facebookServerLogin(AccessToken: string, IsLoginRequest: boolean): Promise<BaseResonse> {
    return this.httpService.post(
      `/api/Account/facebook-login?AccessToken=${AccessToken}&IsLoginRequest=${IsLoginRequest}`,
      ''
    );
  }

  async googleServerLogin(OAuthIdToken: string, IsLoginRequest: boolean): Promise<BaseResonse> {
    return this.httpService.post(
      `/api/Account/google-login?OAuthIdToken=${OAuthIdToken}&IsLoginRequest=${IsLoginRequest}`,
      OAuthIdToken
    );
  }

  async changePassword(data: ChangePassword): Promise<BaseResonse> {
    return this.httpService.post(`/api/Profile/change-password`, data);
  }

  async forgetPassword(email: string, url: string): Promise<BaseResonse> {
    const payload = {
      email: email,
      url: url,
    };
    return await this.httpService.post(`/api/Account/forgot-password`, payload);
  }

  async changeNewPassword(
    userId: string,
    token: string,
    password: string
  ): Promise<BaseResonse> {
    const url = `/api/Account/forgot-password-email-confirmation?userId=${userId}&token=${token.replace(
      /\+/gi,
      '%2B'
    )}&password=${password}`;
    return await this.httpService.get(url);
  }

  async switchRole(
    email: string,
    toRenter: boolean,
    toHost: boolean
  ): Promise<BaseResonse> {
    return this.httpService.put(`/api/Profile/switch-to-host-or-renter`, {
      email,
      toRenter,
      toHost,
    });
  }

  async setToHost(email: string): Promise<BaseResonse> {
    return this.httpService.put(`/api/Profile/set-user-to-host`, {
      email,
    });
  }
}
