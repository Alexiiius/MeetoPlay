import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Alert, AlertService } from '../../../services/alert.service';

@Component({
  selector: 'app-alert',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './alert.component.html',
  styleUrl: './alert.component.css'
})
export class AlertComponent {

  alert: Alert;
  showAlert = false;

  constructor(private alertService: AlertService) { }

  ngOnInit() {
    this.alertService.alert$.subscribe(alert => {
      this.alert = alert;
      this.showAlert = true;
      setTimeout(() => this.showAlert = false, 4000);
    });
  }
}
