import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ROUTE_CONFIG } from '../../config/route-config';
import { UserService } from '../../services/user-service';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  host: {
    'class': 'flex flex-col w-full'
  }
})
export class LoginComponent {
  public formulario: FormGroup;
  public forgotForm: FormGroup;
  public ROUTE_CONFIG: typeof ROUTE_CONFIG;
  public isLoading: boolean = false;
  public isForgotMode: boolean = false;
  public forgotPasswordSuccessMessage: boolean = false;

  constructor(
    private fb: FormBuilder,
    private UserService: UserService
  ) {
    this.formulario = this.fb.group({
      username: [''],
      password: ['']
    });

    this.forgotForm = this.fb.group({
      email: ['']
    });

    this.ROUTE_CONFIG = ROUTE_CONFIG;
  }

  public handleLogin() {
    this.isLoading = true;

    this.UserService.loginPost(this.formulario.value).subscribe(
      _ => this.isLoading = false,
      _ => this.isLoading = false
    );
  }

  public handleBack() {
    this.isForgotMode = false;
    this.forgotPasswordSuccessMessage = false;
    this.forgotForm.reset()
  }

  public handleForgotPassword() {
    this.isLoading = true;

    this.UserService.forgotPassword({email:this.forgotForm.value.email}).subscribe(
      _ => {
        this.isLoading = false;
        this.forgotPasswordSuccessMessage = true;
      },
      _ => this.isLoading = false
    );
  }
}
