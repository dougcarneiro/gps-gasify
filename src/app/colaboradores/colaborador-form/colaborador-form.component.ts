import { Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Functions } from '../../shared/types/Functions';
import { UserProfileListing } from '../../shared/types/UserProfileListing';

@Component({
  selector: 'app-colaborador-form',
  standalone: false,
  templateUrl: './colaborador-form.component.html',
  styleUrl: './colaborador-form.component.css'
})
export class ColaboradorFormComponent implements OnInit {
  form: FormGroup;
  submitButtonText = 'Salvar';

  @Input() isEditMode!: boolean;
  @Input() isLoading!: boolean;
  @Input() formTitle!: string;
  @Input() colaborador!: UserProfileListing;

  funcoes: Functions[] = [
    {value: 'administrador', viewValue: 'Administrador'},
    {value: 'gerente', viewValue: 'Gerente'},
    {value: 'frentista', viewValue: 'Frentista'},
  ];

  @Output() submit = new EventEmitter();

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: any,
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<ColaboradorFormComponent>,
  ) {
    this.formTitle = data.formTitle;
    this.isEditMode = data.isEditMode || false;
    this.form = this.fb.group({
      nome: ['', [Validators.required, Validators.minLength(3)]],
      funcao: ['', Validators.required],
      email: [{ value: '', disabled: this.isEditMode }, [Validators.required, Validators.email]],
      senha: ['', [Validators.minLength(6)]]
    });
  }


  ngOnInit(): void {
    this.colaborador = this.data.colaborador;
    if (this.colaborador) {
      this.colaborador = this.data.colaborador;
      this.form.patchValue({
        nome: this.colaborador?.name,
        funcao: this.colaborador?.function,
        email: this.colaborador?.email,
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
