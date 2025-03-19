import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { UserService } from '../../services/user-service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-update-password',
  standalone: false,
  templateUrl: './update-password.component.html'
})
export class UpdatePasswordComponent {
  public form: FormGroup;
  private _snackBar = inject(MatSnackBar)

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private dialogRef: MatDialogRef<UpdatePasswordComponent>
  ) {
    this.form = this.fb.group({
      currentPassword: "",
      password: "",
    });
  }

  submit(): void {
    if (this.form.valid) {

      this.userService.changePassword(this.form.value).subscribe(e => {
        this._snackBar.open("Senha alterada com sucesso!", "Ok")
        this.dialogRef.close(this.form.value);
      })
    }
  }

  close(): void {
    this.dialogRef.close();
  }
}
