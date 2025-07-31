import { Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Produto } from '../../shared/model/Produto';
import { Caixa } from '../../shared/model/Caixa';

@Component({
  selector: 'app-caixa-form',
  standalone: false,
  templateUrl: './caixa-form.component.html',
  styleUrl: './caixa-form.component.css'
})
export class CaixaFormComponent implements OnInit {
  form: FormGroup;
  submitButtonText = 'Abrir Caixa';

  @Input() isEditMode!: boolean;
  @Input() isLoading!: boolean;
  @Input() formTitle!: string;
  @Input() caixa!: Caixa;

  @Output() submit = new EventEmitter();

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: any,
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<CaixaFormComponent>,
  ) {
    this.formTitle = data.formTitle;
    this.isEditMode = data.isEditMode || false;
    this.submitButtonText = this.isEditMode ? 'Fechar Caixa' : 'Abrir Caixa';
    this.form = this.fb.group({
      initialBalance: ['', [Validators.required, Validators.min(0)]],
    });
  }

  ngOnInit(): void {
    this.caixa = this.data.caixa;
    if (this.caixa) {
      this.form.patchValue({
        initialBalance: this.caixa?.initialBalance,
      });
    }
  }

  onSubmit() {
    if (this.form.invalid) {
      return;
    }
    this.submit.emit(this.form.value);
  }

  onCancel() {
    this.dialogRef.close()
  }

}
