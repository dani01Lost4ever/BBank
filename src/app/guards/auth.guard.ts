import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authSrv = inject(AuthService);

  const isAuthenticated = authSrv.isLoggedIn();

  if (isAuthenticated) {
    return true;
  } else {
    router.navigateByUrl('/auth/login');
    return false;
  }
};
