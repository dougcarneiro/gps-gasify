import { Component, EventEmitter, Inject, Input, Output } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog',
  standalone: false,

  templateUrl: './dialog.component.html',
  styleUrl: './dialog.component.css'
})
export class DialogComponent {

  @Input() dialogTitle!: string;
  @Input() dialogText!: string;
  @Output() dialogActionConfirm = new EventEmitter();


  constructor(
    @Inject(MAT_DIALOG_DATA) private data: any,
        private dialogRef: MatDialogRef<DialogComponent>
  ) {
    this.dialogTitle = data.dialogTitle;
    this.dialogText = data.dialogText;
  }

  onCancel() {
    this.dialogRef.close()
  }

  onConfirm() {
    this.dialogActionConfirm.emit()
  }
}
