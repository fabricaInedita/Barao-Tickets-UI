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
  public ROUTE_CONFIG: typeof ROUTE_CONFIG
  public isLoading: boolean = false
  public forgotPasswordMessage = false

  constructor(
    private fb: FormBuilder,
    private UserService: UserService
  ) {
    this.formulario = this.fb.group({
      username: [''],
      password: ['']
    });
    this.ROUTE_CONFIG = ROUTE_CONFIG;
  }

  public handleLogin() {
    this.isLoading = true

    this.UserService.loginPost(this.formulario.value).subscribe(
      e => {
        this.isLoading = false
      },
      err => {
        this.isLoading = false
      }
    )
  }
}
