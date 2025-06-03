import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { Functions } from '../../shared/types/Functions';
import { Colaborador } from '../../shared/model/Colaborador';
import { ColaboradorService } from '../../shared/services/colaborador/colaborador.service';
import { getCurrentUserData } from '../../utils/localStorage';
import { MensagemSnackService } from '../../shared/services/message/snack.service';

@Component({
  selector: 'app-colaborador-form',
  standalone: false,
  templateUrl: './colaborador-form.component.html',
  styleUrl: './colaborador-form.component.css'
})
export class ColaboradorFormComponent implements OnInit {
  form: FormGroup;
  colaborador: Colaborador | null = null;
  isEditMode = false;

  isLoading = false;
  submitButtonText = 'Salvar';

  formTitle: string = 'Novo Colaborador';

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
    private colaboradorService: ColaboradorService,
    private mensagemService: MensagemSnackService,
    private route: ActivatedRoute
  ) {
    this.form = this.fb.group({
      nome: ['', [Validators.required, Validators.minLength(3)]],
      funcao: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      senha: ['', [Validators.minLength(6)]] // Senha não é obrigatória na edição
    });
  }


  ngOnInit(): void {
    this.formTitle = this.data?.formTitle ?? 'Novo Colaborador';

    if (this.data != null && this.data.colaborador !=null) {
      this.isEditMode = true;
      this.colaborador = this.data.colaborador;
      this.form.patchValue({
        nome: this.colaborador?.nome,
        funcao: this.colaborador?.funcao,
        email: this.colaborador?.email,    
      });

      this.form.get('senha')?.clearValidators();
      this.form.get('senha')?.updateValueAndValidity();
    } else {
      this.isEditMode = false;
      this.form.get('senha')?.setValidators([Validators.required, Validators.minLength(6)]);
      this.form.get('senha')?.updateValueAndValidity();
    }
  }

  async onSubmit(): Promise<void> {
  if (this.form.valid && !this.isLoading) {
    const { nome, email, funcao, senha } = this.form.value;
    this.toggleLoading();
    try {
      if (this.isEditMode && this.colaborador?.email) {
        console.log(this.colaborador.email)
        await this.colaboradorService.atualizarColaborador(
          this.colaborador.email,
          { nome, email, funcao }
        );
        this.mensagemService.sucesso('Colaborador atualizado com sucesso!');
      } else {
        await this.colaboradorService.cadastrarColaborador(
          nome,
          email,
          funcao,
          senha
        );
        this.mensagemService.sucesso('Colaborador salvo com sucesso!');
      }
      this.submit.emit({ nome, email, funcao });
      this.dialogRef.close({ success: true, data: { nome, email, funcao } });
    } catch (err: any) {
      // ...tratamento de erro...
      this.toggleLoading();
    }
  }
}

  toggleLoading() {
    this.isLoading = !this.isLoading;
    this.submitButtonText = this.isLoading ? '' : 'Salvar';
  }

  onDelete(): void {
    if (this.colaborador && this.colaborador.id) {
      // this.colaboradorService.removerColaborador(this.colaborador.id).subscribe({
      //   next: () => {
      //     this.snackBar.open('Colaborador removido com sucesso!', 'Fechar', { duration: 3000 });
      //     this.router.navigate(['/colaboradores']); // TODO: Criar rota para listar colaboradores
      //   },
      //   error: (err) => {
      //     console.error(err);
      //     this.snackBar.open('Erro ao remover colaborador.', 'Fechar', { duration: 3000 });
      //   }
      // });
    }
  }

  onCancel() {
    this.dialogRef.close()
  }

}
