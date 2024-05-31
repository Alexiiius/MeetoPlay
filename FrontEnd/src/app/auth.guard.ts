import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './services/auth.service';
import { map } from 'rxjs';

// export const authGuard: CanActivateFn = (route, state) => {
//   const authService = inject(AuthService);
//   const router = inject(Router);

//   if (authService.isAuth.value == false) {
//     router.navigate(['/login']);
//     return false;
//   }

//   return authService.isAuth.value;
// };

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.isAuth$.pipe(
    map(loaded => {
      console.log('Tusmuertos', loaded)
      if (loaded) {
        return true;
      } else {
        router.navigate(['/login'], { queryParams: { redirectUrl: state.url } });
        return false;
      }
    })
  );
};


export const loggedGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuth.value == true) {
    router.navigate(['/main']);
    return false;
  }

  return true;
};
