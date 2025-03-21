import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from '../../login.service';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage: string | null = null;

  loginService = inject(LoginService);

  constructor(
    private fb: FormBuilder,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const { username, password } = this.loginForm.value;
  
      this.loginService.login({ username, password }).subscribe({
        next: (response: any) => {
          // Handle successful login
          console.log('Login successful:', response);
  
          // Save the token and user information to localStorage
          localStorage.setItem('token', response.token); // Save the bearer token
          localStorage.setItem('id', response.id); // Save user-id
          localStorage.setItem('username', response.username); // Save username
  
          // Redirect to the home page
          this.router.navigate(['/home']);
        },
        error: (error) => {
          // Handle login error
          if (error.status === 401) {
            this.errorMessage = 'Invalid username or password.';
          } else if (error.status === 404) {
            this.errorMessage = 'User does not exist.';
          } else {
            this.errorMessage = 'An unexpected error occurred. Please try again.';
          }
          console.error('Login error:', error);
        }
      });
    }
  }
}