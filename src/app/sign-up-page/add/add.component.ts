import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
} from '@angular/forms';
import { Router } from '@angular/router';
import { SignUpService } from '../../sign-up.service';

@Component({
  selector: 'app-add',
  standalone: false,
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.css'],
})
export class AddComponent {
  signupForm: FormGroup;
  signupService = inject(SignUpService);

  constructor(private fb: FormBuilder, private router: Router) {
    this.signupForm = this.fb.group({
      email: [
        '',
        [Validators.required, Validators.email],
        [this.emailExistsValidator.bind(this)],
      ],
      username: [
        '',
        [Validators.required],
        [this.usernameExistsValidator.bind(this)],
      ],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.pattern(
            '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$'
          ),
        ],
      ],
    });
  }





  emailExistsValidator(control: AbstractControl) {
    return new Promise((resolve) => {
      const email = control.value.toLowerCase();
      this.signupService.checkEmailExists(email).subscribe({
        next: (exists: boolean) => {
          if (exists) {
            resolve({ emailExists: true }); // Validation fails
            console.log("email exists");
          } else {
            resolve(null); // Validation passes
            console.log("email does not exist");
          }
        },
        error: (error) => {
          if (error.status === 404) {
            // Treat 404 as "email does not exist"
            resolve(null); // Validation passes
            console.log("email does not exist (404)");
          } else {
            console.error("Unexpected error:", error);
            resolve({ emailExists: true }); // Fail validation for unexpected errors
          }
        },
      });
    });
  }

  usernameExistsValidator(control: AbstractControl) {
    return new Promise((resolve) => {
      const username = control.value;
      this.signupService.checkUsernameExists(username).subscribe({
        next: (exists: boolean) => {
          if (exists) {
            resolve({ usernameExists: true }); // Validation fails
            console.log("username exists");
          } else {
            resolve(null); // Validation passes
            console.log("username does not exist");
          }
        },
        error: (error) => {
          if (error.status === 404) {
            // Treat 404 as "email does not exist"
            resolve(null); // Validation passes
            console.log("username does not exist (404)");
          } else {
            console.error("Unexpected error:", error);
            resolve({ usernameExists: true }); // Fail validation for unexpected errors
          }
        },
      });
    });
  }

  isEmailInvalid() {
    const control = this.signupForm.get('email');
    return control?.invalid && control.touched;
  }

  isEmailRequired() {
    const control = this.signupForm.get('email');
    return control?.errors?.['required'];
  }

  isEmailFormatInvalid() {
    const control = this.signupForm.get('email');
    return control?.errors?.['email'];
  }

  isEmailExists() {
    const control = this.signupForm.get('email');
    return control?.errors?.['emailExists'];
  }

  isUsernameInvalid() {
    const control = this.signupForm.get('username');
    return control?.invalid && control.touched;
  }

  isUsernameRequired() {
    const control = this.signupForm.get('username');
    return control?.errors?.['required'];
  }

  isUsernameExists() {
    const control = this.signupForm.get('username');
    return control?.errors?.['usernameExists'];
  }

  isPasswordInvalid() {
    const control = this.signupForm.get('password');
    return control?.invalid && control.touched;
  }

  isPasswordRequired() {
    const control = this.signupForm.get('password');
    return control?.errors?.['required'];
  }

  isPasswordMinLength() {
    const control = this.signupForm.get('password');
    return control?.errors?.['minlength'];
  }

  isPasswordPatternInvalid() {
    const control = this.signupForm.get('password');
    return control?.errors?.['pattern'];
  }

  async onSubmit() {
    if (this.signupForm.valid) {
        this.createNewUser();
    }
  }

  createNewUser() {
    this.signupService.createUser(this.signupForm.value);
    this.router.navigate(['/login']);
  }
}
