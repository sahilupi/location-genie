import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class SnackBarService {
  constructor(private snackBar: MatSnackBar) {}

  success(message: string, action = 'close', duration = 5000): void {
    this.snackBar.open(message, action, {
      duration: duration,
      verticalPosition: 'top',
      panelClass: ['success-snackbar'],
    });
  }

  error(message: string, action = 'close', duration = 5000): void {
    this.snackBar.open(message, action, {
      duration: duration,
      verticalPosition: 'top',
      panelClass: ['error-snackbar'],
    });
  }

  warning(message: string, action = 'close', duration = 5000): void {
    this.snackBar.open(message, action, {
      duration: duration,
      verticalPosition: 'top',
      panelClass: ['warning-snackbar'],
    });
  }

  info(message: string, action = 'close', duration = 5000): void {
    this.snackBar.open(message, action, {
      duration: duration,
      verticalPosition: 'top',
      panelClass: ['info-snackbar'],
    });
  }
}
