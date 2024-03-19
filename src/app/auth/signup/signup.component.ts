import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { LocalConstant } from 'src/app/constants/local-constant';
import { SuccessConstant } from 'src/app/constants/success.constant';
import { LoginUserData } from 'src/app/models/auth.model';
import { AuthService } from 'src/app/services/auth.service';
import { LocalService } from 'src/app/services/local.service';
import { SnackBarService } from 'src/app/services/snack-bar.service';
import { LoginComponent } from '../login/login.component';
import { SharedService } from 'src/app/services/shared.service';
import {
  emailValidator,
  passwordValidator,
} from 'src/app/constants/patterns.constant';
import { Router } from '@angular/router';
import { UserConstant } from 'src/app/constants/user.constant';
import { ProjectService } from 'src/app/services/project.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss', '../login/login.component.scss'],
})
export class SignupComponent implements OnInit {
  @Output() login = new EventEmitter<null>();
  signupForm: FormGroup;
  isSubmitted = false;
  errMsg: string | null;
  isPasswordType: boolean = false;
  isLoading = false;

  constructor(
    private authService: AuthService,
    private localService: LocalService,
    private snackbar: SnackBarService,
    public dialogRef: MatDialogRef<LoginComponent>,
    private sharedService: SharedService,
    private projectSerive: ProjectService,
    private router: Router
  ) { }

  async ngOnInit(): Promise<void> {
    await this.buildForm();
  }

  async buildForm(): Promise<void> {
    this.signupForm = new FormGroup({
      email: new FormControl('', [
        Validators.required,
        Validators.email,
        emailValidator,
      ]),
      password: new FormControl('', [Validators.required, passwordValidator]),
    });
  }

  get c(): { [key: string]: AbstractControl } {
    return this.signupForm.controls;
  }

  async onSubmit(): Promise<void> {
    this.isSubmitted = true;
    if (!this.signupForm.valid) return;
    this.isLoading = true;
    const data = this.signupForm.value;
    const response = await this.authService.signup(data);
    if (response && response.success) {
      // const userData: LoginUserData = response.data;
      // await this.localService.setLocalData(LocalConstant.USER_DATA, userData);
      // this.sharedService.setUserLoggedIn(true);
      // if (this.router.url.includes('redirectUrl')) {
      //   const url = this.router.url.split('redirectUrl=');
      //   const decodedUrl = decodeURIComponent(url[1]);
      //   this.router.navigateByUrl(decodedUrl);
      // }
      // this.closeLoginDlg(userData);
      // // else {
      // //   this.router.navigateByUrl('/');
      // // }
      // this.snackbar.success(SuccessConstant.USER_SIGNUP_UP);
      this.closeLoginDlg(false);
      this.snackbar.success(response.data[0]);
    }
    this.isLoading = false;
  }

  async googleAuthenticate(): Promise<void> {
    const result = await this.authService.googleAuth();
    if (result.credential) {
      const oAuthIdToken: string = result.credential.idToken;
      const response = await this.authService.googleServerLogin(oAuthIdToken, false);
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
        if (this.router.url.includes('redirectUrl')) {
          const url = this.router.url.split('redirectUrl=');
          const decodedUrl = decodeURIComponent(url[1]);
          this.router.navigateByUrl(decodedUrl);
        } else {
          this.router.navigateByUrl('/');
        }

        this.snackbar.success(SuccessConstant.USER_LOGGED_IN);
      }
      this.closeLoginDlg(true);
    }
  }

  async facebookAuthenticate(): Promise<void> {
    const result = await this.authService.facebookAuth();
    if (result.credential) {
      const authToken: string = result.credential.accessToken;
      const response = await this.authService.facebookServerLogin(authToken, false);
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
        if (this.router.url.includes('redirectUrl')) {
          const url = this.router.url.split('redirectUrl=');
          const decodedUrl = decodeURIComponent(url[1]);
          this.router.navigateByUrl(decodedUrl);
        } else {
          this.router.navigateByUrl('/');
        }

        this.snackbar.success(SuccessConstant.USER_LOGGED_IN);
      }
      this.closeLoginDlg(true);
    }
  }

  closeLoginDlg(userData?: LoginUserData | boolean): void {
    this.dialogRef.close(userData);
  }

  onLogin(): void {
    this.login.emit(null);
  }
}
