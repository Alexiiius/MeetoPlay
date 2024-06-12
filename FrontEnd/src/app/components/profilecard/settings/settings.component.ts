import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule, AbstractControl } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ProfileService } from '../../../services/profile.service';
import { AlertService } from '../../../services/alert.service';
import { UserService } from '../../../services/user.service';

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

  @ViewChild('settingsModal') settingsModal!: ElementRef<HTMLDialogElement>;

  constructor(
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private profileService: ProfileService,
    private alertService: AlertService,
    private userService: UserService
  ) { }

  currentEmail: string;

  isLoggingOut = false;

  showWrongPassword: boolean = false;
  showWrongPassword2: boolean = false;
  showWrongPassword3: boolean = false;
  showDuplicatedEmail: boolean = false;

  showDeleteUserFrom: boolean = false;

  isLoadingNewEmail: boolean = false;
  isLoadingNewPass: boolean = false;
  isLoadingDeleteUser: boolean = false;

  newEmailForm: FormGroup;
  newPassForm: FormGroup;
  deleteUserForm: FormGroup;

  ngOnInit(): void {
    this.newEmailForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });

    this.newPassForm = this.formBuilder.group({
      newPassword: ['', [Validators.required, this.strongPassword]],
      confirmPassword: ['', [Validators.required, this.checkPasswords.bind(this)]],
      currentPassword: ['', Validators.required],
    });

    this.deleteUserForm = this.formBuilder.group({
      password: ['', Validators.required],
    });

    this.userService.getCurrentEmail().subscribe(
      (response: string) => {
        this.currentEmail = response;
      },
      error => {
        console.log(error);
      }
    );
  }

  openSettingsModal() {
    this.settingsModal.nativeElement.showModal();
  }

  closeSettingsModal() {
    this.settingsModal.nativeElement.close();

    // Reiniciar los formularios
    this.newEmailForm.reset();
    this.newPassForm.reset();

    // Ocultar los errores
    this.showWrongPassword = false;
    this.showWrongPassword2 = false;
    this.showDuplicatedEmail = false;
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
        this.currentEmail = email;

        this.showWrongPassword = false;
        this.showDuplicatedEmail = false;
        this.newEmailForm.reset();

        const token = response.data.token.split('|')[1];

        this.authService.resetToken(token).then(() => {
          this.profileService.resendVerificationEmail().subscribe();
      });
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

  saveNewPass() {
    this.isLoadingNewPass = true;
    this.showWrongPassword2 = false;

    if (this.newPassForm.invalid) {
      return;
    }

    const newPassword = this.newPassForm.value.newPassword;
    const currentPassword = this.newPassForm.value.currentPassword;

    this.profileService.updatePassword(newPassword, currentPassword).subscribe(
      () => {
        this.isLoadingNewPass = false;
        this.alertService.showAlert('success', 'Contraseña actualizada con éxito! 🔒');
        this.showWrongPassword2 = false;
        this.newPassForm.reset();
      },
      error => {
        console.log(error);
        this.isLoadingNewPass = false;
        this.alertService.showAlert('error', 'Algo ha fallado al actualizar tu contraseña 🚫');
        if (error.status === 403) {
          this.showWrongPassword2 = true;
        }
      }
    );
  }

  strongPassword(control: AbstractControl): { [key: string]: boolean } | null {
    const value = control.value;
    const hasUpperCase = /[A-Z]/.test(value);
    const hasLowerCase = /[a-z]/.test(value);
    const hasNumeric = /[0-9]/.test(value);
    const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(value);
    const isLengthValid = value ? value.length > 7 : false;

    if (hasUpperCase && hasLowerCase && hasNumeric && hasSpecialChar && isLengthValid) {
      return null;
    } else {
      return { 'weakPassword': true };
    }
  }

  get strongPasswordError() {
    const errors = this.newPassForm.get('newPassword')?.errors;
    if (errors) {
      return errors['weakPassword'] ? 'La contraseña debe contener al menos una letra mayúscula, una letra minúscula, un número, un carácter especial y tener al menos 8 caracteres de longitud.' : '';
    }
    return '';
  }

  checkPasswords(control: AbstractControl) {
    if (this.newPassForm) {
      let pass = this.newPassForm.get('newPassword')?.value;
      let confirmPass = control.value;

      return pass === confirmPass ? null : { notSame: true }
    }
    return null;
  }

  get passwordConfirmationError() {
    const errors = this.newPassForm.get('confirmPassword')?.errors;
    if (errors) {
      return errors['notSame'] ? 'Las contraseñas no coinciden' : '';
    }
    return '';
  }

  deleteUser() {
    this.isLoadingDeleteUser = true;
    this.showWrongPassword3 = false;

    if (this.deleteUserForm.invalid) {
      return;
    }

    const password = this.deleteUserForm.value.password;

    this.userService.deleteUser(password).subscribe(
      () => {
        this.isLoadingDeleteUser = false;
        this.alertService.showAlert('success', 'Usuario eliminado con éxito! 👋');
        this.authService.clientLogout();
      },
      error => {
        console.log(error);
        this.isLoadingDeleteUser = false;
        this.alertService.showAlert('error', 'Algo ha fallado al eliminar tu cuenta 🚫');
        if (error.status === 403) {
          this.showWrongPassword3 = true;
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
