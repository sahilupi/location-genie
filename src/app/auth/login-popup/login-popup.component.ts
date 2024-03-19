import { Component, Inject } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { LocalConstant } from 'src/app/constants/local-constant';
import {
  emailValidator,
  passwordValidator,
} from 'src/app/constants/patterns.constant';
import { SuccessConstant } from 'src/app/constants/success.constant';
import { UserConstant } from 'src/app/constants/user.constant';
import { LoginUserData } from 'src/app/models/auth.model';
import { AuthService } from 'src/app/services/auth.service';
import { LocalService } from 'src/app/services/local.service';
import { ProjectService } from 'src/app/services/project.service';
import { SharedService } from 'src/app/services/shared.service';
import { SignalrClientService } from 'src/app/services/signalr-client.service';
import { SnackBarService } from 'src/app/services/snack-bar.service';

@Component({
  selector: 'app-login-popup',
  templateUrl: './login-popup.component.html',
  styleUrls: ['./login-popup.component.scss'],
})
export class LoginPopupComponent {
  header = 'Login';
  loginForm: FormGroup;
  errMsg: string | null;
  currentUserId: string;
  isSubmitted = false;
  isLoggingIn = true;
  isResetingPass = false;
  isPasswordType = false;
  isLoading = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { isLoggingIn: boolean },
    public dialogRef: MatDialogRef<LoginPopupComponent>,
    private authService: AuthService,
    private localService: LocalService,
    private snackbar: SnackBarService,
    private projectSerive: ProjectService,
    private sharedService: SharedService,
    private _signalrClientService: SignalrClientService
  ) {
    this.isLoggingIn = this.data.isLoggingIn;
  }

  async ngOnInit(): Promise<void> {
    await this.buildForm();
  }

  private async buildForm(): Promise<void> {
    this.loginForm = new FormGroup({
      email: new FormControl('', [
        Validators.required,
        Validators.email,
        emailValidator,
      ]),
      password: new FormControl('', [Validators.required, passwordValidator]),
    });
  }

  get c(): { [key: string]: AbstractControl } {
    return this.loginForm.controls;
  }

  async onSubmitLoginForm(): Promise<void> {
    this.isSubmitted = true;
    this.errMsg = null;
    if (!this.loginForm.valid) return;
    this.isLoading = true;
    const data = this.loginForm.value;
    const response = await this.authService.login(data);
    if (response && response.success) {
      const userData: LoginUserData = response.data;
      const userPayload = JSON.parse(atob(userData.access_token.split('.')[1]));
      if (
        (userPayload && (userPayload.current_role as string)).toLowerCase() ===
        UserConstant.userRoles.host.toLowerCase()
      ) {
        await this.localService.setLocalData(LocalConstant.IS_HOST, true);
        this.sharedService.setHostLoggedIn(true);
      }
      if (
        userPayload &&
        userPayload.role &&
        userPayload.role.includes(UserConstant.userRoles.host)
      ) {
        await this.localService.setLocalData(LocalConstant.HAS_HOST_ROLE, true);
        this.sharedService.setHasHostRole(true);
      }
      await this.localService.setLocalData(LocalConstant.USER_DATA, userData);
      this.sharedService.setUserLoggedIn(true);
      this.snackbar.success(SuccessConstant.USER_LOGGED_IN);
      this.dialogRef.close(userData);
      // await this.getCurrentUser();
      // await this._signalrClientService.getContactList(this.currentUserId);
      const projectresponse =
        await this.projectSerive.getAllSelectedProjectLocations();
      if (
        projectresponse &&
        projectresponse.success &&
        projectresponse.data &&
        projectresponse.data.listingId
      ) {
        this.projectSerive.selectedProjectListings =
          projectresponse.data.listingId;
        this.sharedService.setSelectedProjectListings(
          projectresponse.data.listingId
        );
      }
    }
    this.isLoading = false;
  }

  async googleAuthenticate(): Promise<void> {
    const result = await this.authService.googleAuth();
    if (result.credential) {
      const oAuthIdToken: string = result.credential.idToken;
      const response = await this.authService.googleServerLogin(oAuthIdToken, true);
      if (response && response.data) {
        const userData: LoginUserData = response.data;
        const userPayload = JSON.parse(
          atob(userData.access_token.split('.')[1])
        );

        if (
          (
            userPayload && (userPayload.current_role as string)
          ).toLowerCase() === UserConstant.userRoles.host.toLowerCase()
        ) {
          await this.localService.setLocalData(LocalConstant.IS_HOST, true);
          this.sharedService.setHostLoggedIn(true);
        }
        if (
          userPayload &&
          userPayload.role &&
          userPayload.role.includes(UserConstant.userRoles.host)
        ) {
          await this.localService.setLocalData(
            LocalConstant.HAS_HOST_ROLE,
            true
          );
          this.sharedService.setHasHostRole(true);
        }
        await this.localService.setLocalData(LocalConstant.USER_DATA, userData);
        this.sharedService.setUserLoggedIn(true);
        this.snackbar.success(SuccessConstant.USER_LOGGED_IN);
        // await this.getCurrentUser();
        const projectresponse =
          await this.projectSerive.getAllSelectedProjectLocations();
        if (
          projectresponse &&
          projectresponse.success &&
          projectresponse.data &&
          projectresponse.data.listingId
        ) {
          this.projectSerive.selectedProjectListings =
            projectresponse.data.listingId;
        }
        // await this._signalrClientService.getContactList(this.currentUserId);
      }
      this.closeLoginDlg(true);
    }
  }

  async facebookAuthenticate(): Promise<void> {
    const result = await this.authService.facebookAuth();
    if (result.credential) {
      const authToken: string = result.credential.accessToken;
      const response = await this.authService.facebookServerLogin(authToken, true);
      if (response && response.data) {
        const userData: LoginUserData = response.data;
        const userPayload = JSON.parse(
          atob(userData.access_token.split('.')[1])
        );

        if (
          (
            userPayload && (userPayload.current_role as string)
          ).toLowerCase() === UserConstant.userRoles.host.toLowerCase()
        ) {
          await this.localService.setLocalData(LocalConstant.IS_HOST, true);
          this.sharedService.setHostLoggedIn(true);
        }
        if (
          userPayload &&
          userPayload.role &&
          userPayload.role.includes(UserConstant.userRoles.host)
        ) {
          await this.localService.setLocalData(
            LocalConstant.HAS_HOST_ROLE,
            true
          );
          this.sharedService.setHasHostRole(true);
        }
        await this.localService.setLocalData(LocalConstant.USER_DATA, userData);
        this.sharedService.setUserLoggedIn(true);
        // await this.getCurrentUser();
        const projectresponse =
          await this.projectSerive.getAllSelectedProjectLocations();
        if (
          projectresponse &&
          projectresponse.success &&
          projectresponse.data &&
          projectresponse.data.listingId
        ) {
          this.projectSerive.selectedProjectListings =
            projectresponse.data.listingId;
        }
        this.snackbar.success(SuccessConstant.USER_LOGGED_IN);
        // await this._signalrClientService.getContactList(this.currentUserId);
      }
      this.closeLoginDlg(true);
    }
  }

  async appleAuthenticate(): Promise<void> {
    const result = await this.authService.appleAuth();
    console.log(result);
    return;
    if (result.credential) {
      const userData = result.credential;
      await this.localService.setLocalData(LocalConstant.USER_DATA, userData);
      this.sharedService.setUserLoggedIn(true);
      this.snackbar.success(SuccessConstant.USER_LOGGED_IN);
      this.closeLoginDlg(true);
    }
  }

  closeLoginDlg(booleanRes: boolean): void {
    this.dialogRef.close(booleanRes);
  }

  onToggleResetPassword(): void {
    this.isResetingPass = !this.isResetingPass;
    this.isLoggingIn = !this.isLoggingIn;
  }

  onSignUp(): void {
    this.isLoggingIn = false;
    this.isResetingPass = false;
  }

  onLogin(): void {
    this.isLoggingIn = true;
    this.isResetingPass = false;
  }

  // private async getCurrentUser(): Promise<void> {
  //   const userData = await this.localService.getLocalData(
  //     LocalConstant.USER_DATA
  //   );
  //   const userPayload = JSON.parse(atob(userData.access_token.split('.')[1]));
  //   if (userPayload) {
  //     this.currentUserId = userPayload.sub;
  //     this._signalrClientService.emitCurrentUserId.next(this.currentUserId);
  //     this._signalrClientService.currentUserId = this.currentUserId;
  //     this._signalrClientService.currentUserEmail = userPayload.email;
  //     await this._signalrClientService.openConnection();
  //     this._signalrClientService.chatMessageHandler();
  //   }
  // }
}
