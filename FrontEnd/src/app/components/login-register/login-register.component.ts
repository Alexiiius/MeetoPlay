import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, NavigationEnd, Router, RouterLink } from '@angular/router';
import { loginAnimation, registerAnimation } from './login-register-animation';

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
  state: String = 'login';

  constructor
    (private formBuilder: FormBuilder,
      private authService: AuthService,
      private route: ActivatedRoute,
      private router: Router) {

    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.state = this.router.url === '/register' ? 'register' : 'login';
      }
    });
  }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
      rememberMe: [false]
    });

    this.registerForm = this.formBuilder.group({
      username: ['', Validators.required],
      email: ['', Validators.required],
      password: ['', Validators.required],
      password_confirmation: ['', Validators.required]
    });
  }

  login() {
    this.authService.login(this.loginForm.value).subscribe(
      response => {
        console.log(response);
        const token = response.data.access_token.split('|')[1];
        if (this.loginForm.value.rememberMe) {
          localStorage.setItem('access_token', token);
        } else {
          sessionStorage.setItem('access_token', token);
        }
        this.router.navigate(['/main']);
      },
      error => {
        console.log(error);
      }
    );
  }

  register() {
    this.authService.register(this.registerForm.value).subscribe(
      response => {
        console.log(response);
        const token = response.data.access_token.split('|')[1];
        sessionStorage.setItem('access_token', token);
      },
      error => {
        console.log(error);
      }
    );
  }
}
