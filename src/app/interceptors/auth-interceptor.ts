import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { LocalConstant } from '../constants/local-constant';
import { CommonService } from '../services/common.service';
import * as CryptoJS from 'crypto-js';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  secretKey = environment.secretKey;

  constructor(private commonService: CommonService) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    let userData: any;
    const encryptData = localStorage.getItem(LocalConstant.USER_DATA) || '';
    const decryptData = CryptoJS.AES.decrypt(
      encryptData,
      this.secretKey
    ).toString(CryptoJS.enc.Utf8);

    if (this.commonService.isValidJson(decryptData)) {
      userData = JSON.parse(decryptData);
    }
    if (
      !userData ||
      !userData?.roles ||
      !userData?.access_token ||
      !userData?.user_name
    ) {
      return next.handle(req);
    }

    const req1 = req.clone({
      headers: req.headers.set(
        'Authorization',
        `Bearer ${userData?.access_token}`
      ),
    });

    return next.handle(req1);
  }
}
