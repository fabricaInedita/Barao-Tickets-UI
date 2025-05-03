import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ROUTE_CONFIG } from '../../config/route-config';
import { UserService } from '../../services/user-service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  standalone: false,
  host: {
    'class': 'flex flex-col w-full'
  }
})
export class SignupComponent {
  public formularioAluno: FormGroup;
  public ROUTE_CONFIG: typeof ROUTE_CONFIG;
  public cadastroFinalizado: boolean = false;
  public isLoading: boolean = false;
  public tipoCadastro: string

  constructor(
    private fb: FormBuilder,
    private userService: UserService
  ) {
    this.formularioAluno = this.fb.group({
      studentCode: ['', Validators.required],
      name: ['', Validators.required],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required]
    });

    this.tipoCadastro = "aluno"
    this.ROUTE_CONFIG = ROUTE_CONFIG;
  }

  public handleSignupAluno() {
    this.isLoading = true;
    this.userService.signupAluno(this.formularioAluno.value).subscribe(() => {
      this.cadastroFinalizado = true;
      this.isLoading = false;
    }, () => {
      this.isLoading = false;
    });
  }
}