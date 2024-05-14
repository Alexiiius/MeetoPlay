import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable, ChangeDetectorRef } from "@angular/core";
import { AuthService } from "../services/auth.service";
import { catchError, Observable, throwError } from "rxjs";
import { Router } from "@angular/router";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService, private router: Router, private cd: ChangeDetectorRef) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          this.authService.isAuth.next(false);
          this.router.navigate(['/login']).then(() => {
            localStorage.removeItem('access_token');
            sessionStorage.removeItem('access_token');
            sessionStorage.removeItem('user_data');
            this.cd.detectChanges();
          });
        }
        return throwError(error);
      })
    );
  }
}
