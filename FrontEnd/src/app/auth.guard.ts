import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './services/auth.service';
import { map } from 'rxjs';


export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.isAuth$.pipe(
    map(loaded => {
      if (loaded) {
        return true;
      } else {
        router.navigate(['/login'], { queryParams: { redirectUrl: state.url } });
        return false;
      }
    })
  );
};

