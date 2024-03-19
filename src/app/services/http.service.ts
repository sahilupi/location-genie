import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment';
import { SnackBarService } from './snack-bar.service';
import { CommonService } from './common.service';
import { ErrorConstant } from '../constants/error.constant';
import { SpinnerService } from './spinner.service';
import { LocalConstant } from '../constants/local-constant';
import { LocalService } from './local.service';
import { SharedService } from './shared.service';
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root',
})
export class HttpService {
  private apiUrl = environment.apiUrl;
  constructor(
    private http: HttpClient,
    private snackbar: SnackBarService,
    private commonService: CommonService,
    private spinner: SpinnerService,
    private localService: LocalService,
    private router: Router,
    private sharedService: SharedService
  ) {}

  public async get(uri: string, options?: any): Promise<any> {
    return lastValueFrom(this.http.get(this.apiUrl + uri, options)).catch(
      (error: HttpErrorResponse) => {
        this.catchException(error);
      }
    );
  }

  public async post(url: string, data: any, options = {}): Promise<any> {
    return lastValueFrom(
      this.http.post(this.apiUrl + url, data, options)
    ).catch((error: HttpErrorResponse) => {
      this.catchException(error);
    });
  }

  public async put(url: string, data: any, options = {}): Promise<any> {
    return lastValueFrom(this.http.put(this.apiUrl + url, data, options)).catch(
      (error: HttpErrorResponse) => {
        this.catchException(error);
      }
    );
  }

  public async patch(url: string, data: any, options = {}): Promise<any> {
    return lastValueFrom(
      this.http.patch(this.apiUrl + url, data, options)
    ).catch((error: HttpErrorResponse) => {
      this.catchException(error);
    });
  }

  public async delete(url: string, options = {}): Promise<any> {
    return lastValueFrom(this.http.delete(this.apiUrl + url, options)).catch(
      async (error: HttpErrorResponse) => {
        await this.catchException(error);
      }
    );
  }

  async catchException(error: HttpErrorResponse): Promise<void> {
    console.log('error => ', error);
    this.spinner.hide();
    if (
      (error?.status && error?.status === 401) ||
      (error?.error.errors &&
        error?.error.errors[0] ===
          'Your account has been deactivated, Please contact to admin')
    ) {
      await this.localService.removeLocalData(LocalConstant.USER_DATA);
      await this.localService.removeLocalData(LocalConstant.USER_IMAGE);
      await this.localService.removeLocalData(LocalConstant.IS_HOST);
      await this.localService.removeLocalData(LocalConstant.HAS_HOST_ROLE);
      this.sharedService.setUserLoggedIn(false);
      this.sharedService.setHasHostRole(false);
      this.sharedService.setHostLoggedIn(false);
      this.sharedService.setUserLoggedIn(false);
      this.snackbar.error(
        'Your account has been deactivated, Please contact to admin'
      );
      this.router.navigateByUrl('/');
      return;
    }
    if (
      error?.error?.errors &&
      (error?.error?.errors?.[0] ===
        'User entered invalid email or password.' ||
        error?.error?.errors?.[0] === 'Password not Valid!!')
    ) {
      this.snackbar.error(ErrorConstant.INVALID_CREDENTIALS);
      return;
    }
    if (
      error?.error?.errors &&
      error?.error?.errors?.[0] === 'Card Details already exists!!'
    ) {
      this.snackbar.error('Card Details already exists');
      return;
    }
    if (
      error?.error?.errors &&
      error?.error?.errors?.[0] ===
        'This project name already exists, please try with different project name!'
    ) {
      this.snackbar.error(
        'This project name already exists, please try with different project name!'
      );
      return;
    }
    if (
      error?.error?.errors &&
      error?.error?.errors?.[0] === 'This user is already invited to the team!'
    ) {
      this.snackbar.error('This user is already invited to the team!');
      return;
    }
    if (
      error?.error?.errors &&
      error?.error?.errors?.[0] === 'We have a problem.Duplicate team member!'
    ) {
      this.snackbar.error('We have a problem.Duplicate team member!');
      return;
    }
    if (error?.error) {
      if (error?.status === 400) {
        if (this.commonService.isEmptyObject(error?.error?.message)) {
          this.snackbar.error(ErrorConstant.SOMETHING_WENT_WRONG);
        } else if (
          error?.error?.errors &&
          error?.error?.errors?.Error &&
          error?.error?.errors?.Error.length > 0
        ) {
          this.snackbar.error(error?.error?.errors?.Error[0]);
        } else if (
          error?.error?.errors &&
          error?.error?.errors &&
          error?.error?.errors?.length > 0
        ) {
          this.snackbar.error(error?.error?.errors?.[0]);
        } else if (typeof error?.error?.title === 'string') {
          this.snackbar.error(error?.error?.title);
        } else {
          this.snackbar.error(ErrorConstant.SOMETHING_WENT_WRONG);
        }
      } else {
        this.snackbar.error(ErrorConstant.SOME_ISSUE);
      }
    } else {
      this.snackbar.error(ErrorConstant.SOME_ISSUE);
    }
  }
}
