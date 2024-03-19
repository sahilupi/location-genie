import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { ErrorConstant } from '../constants/error.constant';
import { SnackBarService } from '../services/snack-bar.service';

export const adminAuthGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const snackbar = inject(SnackBarService);
  return new Promise(async (resolve, reject) => {
    if (await authService.isSuperAdminLoggedIn()) {
      resolve(true);
    } else {
      snackbar.error(ErrorConstant.USER_UNAUTHORIZED);
      router.navigate(['/']);
      reject(false);
    }
  });
};
