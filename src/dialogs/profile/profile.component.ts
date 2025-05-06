import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { UserService } from '../../services/user-service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UtilsService } from '../../services/utils-service';
import { CookiesService } from '../../services/cookies-service';

@Component({
  selector: 'app-update-password',
  standalone: false,
  templateUrl: './profile.component.html'
})
export class ProfileComponent {
  public form: FormGroup;
  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private dialogRef: MatDialogRef<ProfileComponent>,
    private UtilsService: UtilsService,
    private cookieService: CookiesService
  ) {
    this.form = this.fb.group({
      name: [this.cookieService.get("name"), Validators.required],
    });
  }

  submit(): void {
    if (this.form.valid) {
      this.userService.update({
        ...this.form.value,
        userId: this.cookieService.get("id")
      })
        .subscribe(
          e => {
            this.cookieService.set("name",this.form.value.name)
            this.UtilsService.snack("Informações alteradas com sucesso!", "success")
            this.dialogRef.close(this.form.value);
          }
        )
    }
  }

  close(): void {
    this.dialogRef.close();
  }
}
