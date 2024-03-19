import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { SnackBarService } from '../services/snack-bar.service';
import { ErrorConstant } from '../constants/error.constant';

export const authGuard: CanActivateFn = (route, state): Promise<boolean> => {
  const authService = inject(AuthService);
  const snackbar = inject(SnackBarService);
  const router = inject(Router);
  return new Promise(async (resolve, reject) => {
    if (await authService.isUserLoggedIn()) {
      resolve(true);
    } else {
      snackbar.error(ErrorConstant.USER_UNAUTHENTICATED);
      const encodedUrl = state.url;
      const decodedUrl = decodeURIComponent(encodedUrl);
      router.navigateByUrl(`/login?redirectUrl=${decodedUrl}`);
      reject(false);
    }
  });
};
