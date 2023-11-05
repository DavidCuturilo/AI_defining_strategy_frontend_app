import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth/auth.service';
import { LoginUserRequestDto } from '../models/request/login-user.request.dto';
import { RegisterUserRequestDto } from '../models/request/register-user.request.dto';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {
  constructor(private authService: AuthService) {}

  registerForm: FormGroup;
  errorMessage: string = '';
  isLoading = false;
  @ViewChild('password') input: ElementRef;
  showPassword = false;

  ngOnInit(): void {
    this.registerForm = new FormGroup({
      name: new FormControl('', Validators.required),
      lastname: new FormControl('', Validators.required),
      username: new FormControl('', Validators.required),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(6),
      ]),
    });
  }

  async register() {
    if (this.registerForm.valid) {
      const registerUser: RegisterUserRequestDto = {
        name: this.registerForm.value.name,
        lastname: this.registerForm.value.lastname,
        username: this.registerForm.value.username,
        password: this.registerForm.value.password,
      };
      this.errorMessage = await this.authService.register(registerUser);

      if (!this.errorMessage) {
        console.log('User successfully registered!');
        this.isLoading = true;
      }
    } else {
      if (
        !this.registerForm.value.name ||
        !this.registerForm.value.lastname ||
        !this.registerForm.value.username ||
        !this.registerForm.value.password
      ) {
        this.errorMessage = 'All fields must contain values!';
      } else if (this.registerForm.value.password.length < 6) {
        this.errorMessage = 'Password must have 6 or more characters!';
      }
    }
  }

  changePasswordVisibility() {
    this.showPassword = !this.showPassword;

    setTimeout(() => {
      this.input.nativeElement.focus();
      this.input.nativeElement.setSelectionRange(
        this.input.nativeElement.value.length,
        this.input.nativeElement.value.length
      );
    }, 0);
  }
}
