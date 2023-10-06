import { inject } from '@angular/core';
import { CanActivateFn, CanDeactivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const justLoggedGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authSrv = inject(AuthService);

  const isAuthenticated = authSrv.isLoggedIn();

  if (isAuthenticated) {
    router.navigateByUrl('/dashboard');
    return false;
  } else {
    return true;
  }
};
