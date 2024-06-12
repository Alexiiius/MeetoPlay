import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './services/auth.service';
import { map } from 'rxjs';
import { UserService } from './services/user.service';
import { ChatsService } from './services/chats.service';


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

export const OwnProfileGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);

  const id = route.parent?.paramMap.get('id');
  const userData = localStorage.getItem('user_data') || sessionStorage.getItem('user_data');
  const currentUserId = userData ? JSON.parse(userData).id : null;

  if (currentUserId && id == currentUserId) {
    return true;
  } else {
    router.navigate(['/']);
    return false;
  }
};

export const chatGuard: CanActivateFn = (route, state) => {
  const chatService = inject(ChatsService);
  const router = inject(Router);

  const userChatingWith = chatService.getUser();
  let usernameInUrl = route.paramMap.get('usernamefulltag');

  if (userChatingWith.full_tag){
    userChatingWith.full_tag = userChatingWith.full_tag.replace(/\s/g, '');
  }

  if (usernameInUrl) {
    usernameInUrl = decodeURIComponent(usernameInUrl)
  }

  if(userChatingWith && userChatingWith.full_tag === usernameInUrl){
    return true;
  } else {
    router.navigate(['/']);
    return false;
  }
};



