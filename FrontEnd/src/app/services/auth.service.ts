import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, map, Observable, of, tap, throwError } from 'rxjs';
import { backAPIUrl } from '../config';
import { Router } from '@angular/router';
import { LoginResponse, RegisterResponse } from '../interfaces/back-end-api-response';
import { UserData } from '../interfaces/user-data';
import { UserReduced } from '../interfaces/user-reduced';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private backAPIUrl = backAPIUrl;

  public isAuth = new BehaviorSubject<boolean>(false);
  public isAuth$ = this.isAuth.asObservable();

  public userData = new BehaviorSubject<UserData | null>(null);

  public currentUserSafe: UserData | null;

  constructor(private http: HttpClient, private router: Router) {

  }

  checkToken(): Observable<any> {
    return new Observable<any>(observer => {
      const subscription = this.http.get(`${this.backAPIUrl}/check-token`).subscribe(
        (response: any) => {
          console.log(response);
          observer.next(response);
          observer.complete();
          subscription.unsubscribe();
        },
      );
  });

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
        const error = errorResponse.error;
        return throwError({ error: true, message: error.data.message });
      })
    );
  }

  register(credentials: any): Observable<any> {
    return this.http.post<RegisterResponse>(this.backAPIUrl + '/register', credentials).pipe(
      map(response => {
        const token = response.data.access_token.split('|')[1];
        this.isAuth.next(true);
        return token;
      }),
      catchError(errorResponse => {
        const error = errorResponse.error;
        if (error.data && error.data.errors) {
          return throwError({ error: true, message: error.data.message, errors: error.data.errors });
        } else {
          return throwError({ error: true, message: error.message });
        }
      })
    );
  }

  storeToken(token: string, rememberMe: boolean): Promise<void> {
    localStorage.removeItem('access_token');
    sessionStorage.removeItem('access_token');
    return new Promise((resolve, reject) => {
      if (rememberMe) {
        localStorage.setItem('access_token', token);
        sessionStorage.setItem('access_token', token);
      } else {
        sessionStorage.setItem('access_token', token);
      }
      resolve();
    });
  }

  storeUserData(userData: UserData): Promise<void> {
    return new Promise((resolve, reject) => {
      let storedData: UserReduced = {
        id: userData.id,
        name: userData.name,
        tag: userData.tag,
        full_tag: `${userData.name}#${userData.tag}`,
        avatar: userData.avatar,
        status: 'Online'
      };
      sessionStorage.setItem('user_data', JSON.stringify(storedData));
      resolve();
    });
  }

  retrieveUserData(): UserData | null {
    const userData = sessionStorage.getItem('user_data');
    return userData ? JSON.parse(userData) : null;
  }

  getUserDataSafe(): void {
    this.http.get<UserData>(this.backAPIUrl + '/user').subscribe(userData => {
      this.currentUserSafe = userData;
    });
  }

  getUserData(): Observable<UserData> {
    const storedUserData = this.retrieveUserData();
    if (storedUserData) {
      this.userData.next(storedUserData);
      return of(storedUserData);
    } else {
      return this.http.get<UserData>(this.backAPIUrl + '/user').pipe(
        tap(userData => {
          this.userData.next(userData);
          this.storeUserData(userData);
          this.getUserDataSafe();
        })
      );
    }
  }

  logout(): Observable<any> {
    return this.http.post(this.backAPIUrl + '/logout', '').pipe(
      tap(() => {
        this.isAuth.next(false);
        this.router.navigate(['/login']);
        localStorage.removeItem('access_token');
        sessionStorage.removeItem('access_token');
        sessionStorage.removeItem('user_data');
      }),
      catchError(error => {
        console.log(error);
        return throwError(error);
      })
    );
  }
}
