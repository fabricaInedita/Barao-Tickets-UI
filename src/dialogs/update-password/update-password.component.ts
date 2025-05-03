import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { UserService } from '../../services/user-service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UtilsService } from '../../services/utils-service';

@Component({
  selector: 'app-update-password',
  standalone: false,
  templateUrl: './update-password.component.html'
})
export class UpdatePasswordComponent {
  public form: FormGroup;
  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private dialogRef: MatDialogRef<UpdatePasswordComponent>,
    private UtilsService: UtilsService
  ) {
    this.form = this.fb.group({
      currentPassword: ["", Validators.required],
      password: ["", Validators.required],
    });
  }

  submit(): void {
    if (this.form.valid) {
      this.userService.changePassword(this.form.value)
        .subscribe(
          e => {
            this.UtilsService.snack("Senha alterada com sucesso!", "success")
            this.dialogRef.close(this.form.value);
          }
        )
    }
  }

  close(): void {
    this.dialogRef.close();
  }
}
