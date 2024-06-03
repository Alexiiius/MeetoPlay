import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, NavigationEnd, Router, RouterLink } from '@angular/router';
import { loginAnimation, registerAnimation } from './login-register-animation';
import { set } from 'date-fns';

@Component({
  selector: 'app-login-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './login-register.component.html',
  styleUrl: './login-register.component.css',
  animations: [loginAnimation, registerAnimation]
})
export class LoginRegisterComponent implements OnInit {
  loginForm: FormGroup;
  registerForm: FormGroup;
  state: 'login' | 'register' = 'login';
  logingIn = false;
  loginErrorMessage = '';
  registerErrorMessage = '';
  fieldErrors: any = {};
  objectKeys = Object.keys;

  redirectUrl = '/main';

  constructor
    (private formBuilder: FormBuilder,
      private authService: AuthService,
      private router: Router,
      private route: ActivatedRoute) {

    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.state = this.router.url === '/register' ? 'register' : 'login';
      }
    });
  }

  ngOnInit() {
    this.redirectUrl = this.route.snapshot.queryParamMap.get('redirectUrl') ?? '/main';

    this.authService.isAuth$.subscribe({
      next: (loggedIn) => {
        if (loggedIn) {
          this.router.navigate([this.redirectUrl]);
        }
      },
      error: (error) => {
        console.log(error);
      }
    });

    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      rememberMe: [false]
    });

    this.registerForm = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, this.strongPassword]],
      password_confirmation: ['', [Validators.required, this.checkPasswords.bind(this)]]
    });

    // Subscribe to password field changes
    this.registerForm.get('password')?.valueChanges.subscribe(() => {
      // Trigger password_confirmation validation
      this.registerForm.get('password_confirmation')?.updateValueAndValidity();
    });
  }

  login() {
    this.logingIn = true;
    this.authService.login(this.loginForm.value).subscribe(
      token => {
        this.authService.storeToken(token, this.loginForm.value.rememberMe).then(() => {
          this.authService.getUserData().subscribe(() => {
            this.router.navigate([this.redirectUrl]);
            this.logingIn = false;
          })
        });

      },
      error => {
        if (error.error) {
          this.loginErrorMessage = error.message;
          this.logingIn = false;
        } else {
          console.log(error);
        }
      }
    );
  }

  register() {
    this.logingIn = true;
    this.authService.register(this.registerForm.value).subscribe(
      token => {
        sessionStorage.setItem('access_token', token);
        this.router.navigate(['/main']);
      },
      error => {
        if (error.error) {
          // Handle the error here
          // For example, show the error message
          this.registerErrorMessage = error.message;
          // And handle the individual field errors
          this.fieldErrors = error.errors;
          console.log(this.fieldErrors);
          console.log(this.registerErrorMessage);
          this.logingIn = false;
        } else {
          console.log(error);
        }
      }
    );
  }

  isInvalid(form: FormGroup, fieldName: string) {
    const field = form.get(fieldName);
    return field?.invalid && field?.touched;
  }

  checkPasswords(control: AbstractControl) {
    if (this.registerForm) {
      let pass = this.registerForm.get('password')?.value;
      let confirmPass = control.value;

      return pass === confirmPass ? null : { notSame: true }
    }
    return null;
  }

  get passwordConfirmationError() {
    const errors = this.registerForm.get('password_confirmation')?.errors;
    if (errors) {
      return errors['notSame'] ? 'Las contraseñas no coinciden' : '';
    }
    return '';
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
    const errors = this.registerForm.get('password')?.errors;
    if (errors) {
      return errors['weakPassword'] ? 'La contraseña debe contener al menos una letra mayúscula, una letra minúscula, un número, un carácter especial y tener al menos 8 caracteres de longitud.' : '';
    }
    return '';
  }
}
