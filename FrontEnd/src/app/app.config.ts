import { ApplicationConfig } from '@angular/core';
import { provideRouter, withViewTransitions } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { authInterceptor } from './interceptors/auth.interceptor';
import { unAuthInterceptor } from './interceptors/unauth.interceptor';
// import { apiInterceptor } from './interceptors/api.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [

    provideRouter(routes, withViewTransitions()),
    provideHttpClient(withInterceptors([authInterceptor, unAuthInterceptor])),
    provideAnimationsAsync()
  ]
};
