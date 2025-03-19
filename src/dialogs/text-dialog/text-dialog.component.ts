import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

interface DialogData {
  title: string;
  message: string;
  messageButton: string;
}

@Component({
  selector: 'app-dialog',
  templateUrl: './text-dialog.component.html',
  standalone: false
})
export class TextDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<TextDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) { }

  closeDialog(): void {
    this.dialogRef.close();
  }
}