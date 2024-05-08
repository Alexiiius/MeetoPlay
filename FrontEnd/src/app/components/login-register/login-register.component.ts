import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-login-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './login-register.component.html',
  styleUrl: './login-register.component.css'
})
export class LoginRegisterComponent implements OnInit {
  loginForm: FormGroup;
  registerForm: FormGroup;
  mode: String = 'login';

  constructor
  (private formBuilder: FormBuilder,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router) { }

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

    this.route.data.subscribe(data => {
      this.mode = data['mode'];
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
