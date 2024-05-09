import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, map, Observable, tap, throwError } from 'rxjs';
import { backAPIUrl } from '../config';
import { Router } from '@angular/router';
import { LoginResponse, RegisterResponse } from '../interfaces/back-end-api-response';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private backAPIUrl = backAPIUrl;

  public isAuth = new BehaviorSubject<boolean>(false);

  constructor(private http: HttpClient, private router: Router) {
    this.autoLogin();
  }

  autoLogin() {
    const token = localStorage.getItem('access_token') || sessionStorage.getItem('access_token');
    if (token) {
      this.isAuth.next(true);
      this.router.navigate(['/main']);
    }
  }

  login(credentials: any): Observable<any> {
    return this.http.post<LoginResponse>(this.backAPIUrl + '/login', credentials).pipe(
      map(response => {
        const token = response.data.access_token.split('|')[1];
        this.isAuth.next(true);
        console.log('User logged in');
        return token;
      }),
      catchError(errorResponse => {
        // Access the error object
        const error = errorResponse.error;
        // Now you can access error.data, error.meta, etc.
        // For example, convert the error into a user-friendly format
        return throwError({ error: true, message: error.data.message });
      })
    );
  }

  // login(user: any): Observable<any> {
  //   const formatedUser = {
  //     email: user.email,
  //     password: user.password
  //   }

  //   return this.http.post(this.backAPIUrl + '/login', formatedUser).pipe(
  //     tap(() => { // Update the value of isLoggedIn
  //       console.log('User logged in')
  //       this.isAuth.next(true);
  //       this.router.navigate(['/main']);
  //     })
  //   );
  // }

  register(credentials: any): Observable<any> {
    return this.http.post<RegisterResponse>(this.backAPIUrl + '/register', credentials).pipe(
      map(response => {
        const token = response.data.access_token.split('|')[1];
        this.isAuth.next(true);
        return token;
      }),
      catchError(errorResponse => {
        // Access the error object
        const error = errorResponse.error;
        // Now you can access error.data, error.meta, etc.
        // For example, convert the error into a user-friendly format
        if (error.data && error.data.errors) {
          return throwError({ error: true, message: error.data.message, errors: error.data.errors });
        } else {
          return throwError({ error: true, message: error.message });
        }
      })
    );
  }

  // register(user: any): Observable<any> {

  //   const formatedUser = {
  //     name: user.username,
  //     email: user.email,
  //     password: user.password,
  //     password_confirmation: user.password_confirmation
  //   }

  //   console.log(formatedUser);

  //   return this.http.post(this.backAPIUrl + '/register', formatedUser).pipe(
  //     tap(() => { // Update the value of isLoggedIn
  //       console.log('User registered')
  //       this.isAuth.next(true);
  //       this.router.navigate(['/main']);
  //     })
  //   );
  // }

  storeToken(token: string, rememberMe: boolean) {
    if (rememberMe) {
      localStorage.setItem('access_token', token);
    } else {
      sessionStorage.setItem('access_token', token);
    }
  }

  logout() {
    return this.http.post(this.backAPIUrl + '/logout', '').subscribe(
      response => {
        console.log(response);
        localStorage.removeItem('access_token');
        sessionStorage.removeItem('access_token');
        this.isAuth.next(false);
        this.router.navigate(['/login']);
      },
      error => {
        console.log(error);
      }
    );
  }
}
