import { Injectable } from '@angular/core';
import { EncryptionService } from './encryption.service';

@Injectable({
  providedIn: 'root',
})
export class LocalService {
  constructor(private encryption: EncryptionService) {}

  async setLocalData(key: string, data: any): Promise<boolean> {
    if (key && data) {
      const encryptData = await this.encryption.encrypt(data);
      localStorage.setItem(key, encryptData);
      return true;
    } else {
      return false;
    }
  }

   async getLocalData(key: string): Promise<any> {
    if (key) {
      if (localStorage.getItem(key)) {
        const encryptData = localStorage.getItem(key) || '';
        const decryptData = await this.encryption.decrypt(encryptData);
        return decryptData;
      } else {
        return;
      }
    } else {
      return;
    }
  }

  async removeLocalData(key: string): Promise<boolean> {
    if (key) {
      if (localStorage.getItem(key)) {
        localStorage.removeItem(key);
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }

  async removeAllLocalData(): Promise<boolean> {
    try {
      localStorage.clear();
      return true;
    } catch (error) {
      return false;
    }
  }
}
