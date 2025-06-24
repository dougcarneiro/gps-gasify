import { Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Produto } from '../../shared/model/Produto';

@Component({
  selector: 'app-produto-form',
  standalone: false,
  templateUrl: './produto-form.component.html',
  styleUrl: './produto-form.component.css'
})
export class ProdutoFormComponent implements OnInit {
  form: FormGroup;
  submitButtonText = 'Salvar';

  @Input() isEditMode!: boolean;
  @Input() isLoading!: boolean;
  @Input() formTitle!: string;
  @Input() produto!: Produto;

  unitTypes: { value: string; viewValue: string }[] = [
    { value: 'quilo', viewValue: 'kg' },
    { value: 'unidade', viewValue: 'unidade' },
    { value: 'litro', viewValue: 'litro' },
  ];

  @Output() submit = new EventEmitter();

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: any,
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<ProdutoFormComponent>,
  ) {
    this.formTitle = data.formTitle;
    this.isEditMode = data.isEditMode || false;
    this.form = this.fb.group({
      description: ['', [Validators.required, Validators.minLength(3)]],
      unitType: [{ value: '', disabled: this.isEditMode }, [Validators.required]],
      price: ['', [Validators.required]],
      stock: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.produto = this.data.produto;
    if (this.produto) {
      this.produto = this.data.produto;
      this.form.patchValue({
        description: this.produto?.descricao,
        unitType: this.produto?.tipoUnidade,
        price: this.produto?.precoPorUnidade,
        stock: this.produto?.quantidadeEstoque,
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
