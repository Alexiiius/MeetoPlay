import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export type AlertType = 'success' | 'error' | 'warning' | 'info';

export interface Alert {
  type: AlertType;
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  private alertSubject = new Subject<Alert>();
  alert$ = this.alertSubject.asObservable();

  showAlert(type: AlertType, message: string) {
    this.alertSubject.next({ type, message });
  }
}
