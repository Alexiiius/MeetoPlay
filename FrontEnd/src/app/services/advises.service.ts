import { Injectable } from '@angular/core';
import { backAPIUrl } from '../config';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Advise } from '../interfaces/advise';

@Injectable({
  providedIn: 'root'
})
export class AdvisesService {

  backAPIUrl = backAPIUrl;

  constructor(
    private http: HttpClient
  ) {

   }

  getAdvises(): Observable<Advise[]> {
    return this.http.get<Advise[]>(`${this.backAPIUrl}/advises`);
    // return this.http.get(`${this.backAPIUrl}/advises`);
  }
}
