import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ProfileService } from '../../../services/profile.service';
import { AlertService } from '../../../services/alert.service';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule
  ],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css'
})
export class SettingsComponent implements OnInit {

  constructor(
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private profileService: ProfileService,
    private alertService: AlertService
  ) { }

  isLoggingOut = false;

  showWrongPassword: boolean = false;
  showDuplicatedEmail: boolean = false;

  isLoadingNewEmail: boolean = false;

  newEmailForm: FormGroup;

  ngOnInit(): void {
    this.newEmailForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  saveNewEmail() {
    this.isLoadingNewEmail = true;
    this.showWrongPassword = false;
    this.showDuplicatedEmail = false;

    if (this.newEmailForm.invalid) {
      return;
    }

    const email = this.newEmailForm.value.email;
    const password = this.newEmailForm.value.password;

    this.profileService.updateEmail(email, password).subscribe(
      (response) => {
        this.isLoadingNewEmail = false;
        this.alertService.showAlert('success', 'Email actualizado con éxito! 📨');
        const token = response.data.token.split('|')[1];

        //Comprueba si el token está guardado en local o session Storage y lo sustituye
        if (localStorage.getItem('access_token')) {
          localStorage.setItem('access_token', token);
        }

        if (sessionStorage.getItem('access_token')) {
          sessionStorage.setItem('access_token', token);
        }
      },
      error => {
        console.log(error);
        this.isLoadingNewEmail = false;
        this.alertService.showAlert('error', 'Algo ha fallado al actualizar tu Email 🚫');
        if (error.status === 403) {
          this.showWrongPassword = true;
        } else if (error.status === 422) {
          this.showDuplicatedEmail = true;
        }
      }
    );
  }

  logout() {
    this.isLoggingOut = true;
    this.authService.logout().subscribe(
      () => this.isLoggingOut = false,
      error => {
        console.log(error);
        this.isLoggingOut = false;
      }
    );
  }
}
