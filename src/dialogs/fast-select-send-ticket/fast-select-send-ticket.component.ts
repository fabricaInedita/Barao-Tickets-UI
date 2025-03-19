import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-fast-select-send-ticket',
  templateUrl: './fast-select-send-ticket.component.html',
  styleUrl: './fast-select-send-ticket.component.css',
  standalone: false
})
export class FastSelectSendTicketComponent {
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<FastSelectSendTicketComponent>
  ) {
    this.form = this.fb.group({
      numberInput: [null, [Validators.required, Validators.min(1)]],
    });
  }

  submit(): void {
    if (this.form.valid) {
      this.dialogRef.close(this.form.value.numberInput);
    }
  }

  close(): void {
    this.dialogRef.close();
  }
}
