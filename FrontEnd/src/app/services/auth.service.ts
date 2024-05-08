import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { backAPIUrl } from '../config';
import { Router } from '@angular/router';

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

  login(user: any): Observable<any> {
    const formatedUser = {
      email: user.email,
      password: user.password
    }

    return this.http.post(this.backAPIUrl + '/login', formatedUser).pipe(
      tap(() => { // Update the value of isLoggedIn
        console.log('User logged in')
        this.isAuth.next(true);
        this.router.navigate(['/main']);
      })
    );
  }

  register(user: any): Observable<any> {

    const formatedUser = {
      name: user.username,
      email: user.email,
      password: user.password,
      password_confirmation: user.password_confirmation
    }

    console.log(formatedUser);

    return this.http.post(this.backAPIUrl + '/register', formatedUser).pipe(
      tap(() => { // Update the value of isLoggedIn
        console.log('User registered')
        this.isAuth.next(true);
        this.router.navigate(['/main']);
      })
    );
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
