import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add',
  standalone: false,
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.css']
})
export class AddComponent {
  signupForm: FormGroup;

  constructor(private fb: FormBuilder, private router: Router) {
    this.signupForm = this.fb.group({
      email: ['', [Validators.required, Validators.email], this.emailExistsValidator.bind(this)],
      username: ['', [Validators.required], this.usernameExistsValidator.bind(this)],
      password: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$')
      ]]
    });
  }

  emailExistsValidator(control: AbstractControl) {
    return new Promise(resolve => {
      // Simulate an async validation check
      setTimeout(() => {
        if (control.value === 'existing@example.com') {
          resolve({ emailExists: true });
        } else {
          resolve(null);
        }
      }, 1000);
    });
  }

  usernameExistsValidator(control: AbstractControl) {
    return new Promise(resolve => {
      // Simulate an async validation check
      setTimeout(() => {
        if (control.value === 'existinguser') {
          resolve({ usernameExists: true });
        } else {
          resolve(null);
        }
      }, 1000);
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

  onSubmit() {
    if (this.signupForm.valid) {
      // Save the information
      console.log('Form Submitted', this.signupForm.value);
      // Redirect to another page
      this.router.navigate(['/home']);
    }
  }
}