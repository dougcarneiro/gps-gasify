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
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      // this.colaboradorService.getColaboradorById(id).subscribe(colaborador => {
      //   if (colaborador) {
      //     this.colaborador = colaborador;
      //     this.form.patchValue(colaborador);
      //     if (!this.isEditMode) { // Se não estiver em modo de edição (novo), a senha é obrigatória
      //       this.form.get('senha')?.setValidators([Validators.required, Validators.minLength(6)]);
      //     } else {
      //       this.form.get('senha')?.clearValidators(); // Limpa validadores da senha em modo de edição
      //       this.form.get('senha')?.updateValueAndValidity();
      //     }
      //   }
      // });
    }
  }

  async onSubmit(): Promise<void> {
    if (this.form.valid && !this.isLoading) {
      const { nome, email, funcao, senha } = this.form.value;

      this.toggleLoading();
      try {
        await this.colaboradorService.cadastrarColaborador(
          nome,
          email,
          funcao,
          senha
        );
        this.mensagemService.sucesso('Colaborador salvo com sucesso!');
        this.submit.emit({ nome, email, funcao, senha });
        this.dialogRef.close({ success: true, data: { nome, email, funcao, senha } });
      } catch (err: any) {
        console.error(err);
        let errorMessage = 'Erro ao salvar colaborador.';
        if (err && err.message) {
          errorMessage = err.message;
        }
        this.mensagemService.erro(errorMessage);
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
