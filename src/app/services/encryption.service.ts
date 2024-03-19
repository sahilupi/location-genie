import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';
import { environment } from 'src/environments/environment';
import { CommonService } from './common.service';

@Injectable({
  providedIn: 'root',
})
export class EncryptionService {
  secretKey = environment.secretKey;

  constructor(private commonService: CommonService) {}

  async encrypt(data: any): Promise<string> {
    let newData = data;
    if (typeof data !== 'string') {
      newData = JSON.stringify(data);
    }
    return CryptoJS.AES.encrypt(newData, this.secretKey).toString();
  }

  async decrypt(data: string): Promise<any> {
    const decryptData = CryptoJS.AES.decrypt(data, this.secretKey).toString(
      CryptoJS.enc.Utf8
    );
    if (this.commonService.isValidJson(decryptData)) {
      return JSON.parse(decryptData);
    }
    return decryptData;
  }
}
