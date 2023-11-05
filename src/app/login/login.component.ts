import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth/auth.service';
import { LoginUserRequestDto } from '../models/request/login-user.request.dto';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  constructor(private authService: AuthService) {}

  loginForm: FormGroup;
  errorMessage: string = '';
  isLoading = false;
  @ViewChild('password') input: ElementRef;
  showPassword = false;

  ngOnInit(): void {
    this.loginForm = new FormGroup({
      username: new FormControl('', Validators.required),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(6),
      ]),
    });
  }

  async login() {
    if (this.loginForm.valid) {
      const loginUser: LoginUserRequestDto = {
        username: this.loginForm.value.username,
        password: this.loginForm.value.password,
      };
      this.errorMessage = await this.authService.login(loginUser);

      if (!this.errorMessage) {
        console.log('User successfully loggedIn!');
        this.isLoading = true;
      }
    } else {
      if (!this.loginForm.value.username || !this.loginForm.value.password) {
        this.errorMessage = 'Username and password can not be empty!';
      } else if (this.loginForm.value.password.length < 6) {
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
