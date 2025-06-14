import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { getCurrentUserData, removeUserData } from '../utils/localStorage';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MensagemSnackService } from '../shared/services/message/snack.service';
import { Router } from '@angular/router';
import { ColaboradorFormComponent } from './colaborador-form/colaborador-form.component';
import { Colaborador } from '../shared/model/Colaborador';
import { ColaboradorService } from '../shared/services/colaborador/colaborador.service';
import { toggleState } from '../utils/loading.util';
import { UserProfileListing } from '../shared/types/UserProfileListing';

@Component({
  selector: 'app-colaboradores',
  standalone: false,
  templateUrl: './colaboradores.component.html',
})
export class ColaboradoresComponent implements OnInit {

  colaboradores: Array<UserProfileListing> = [];
  noColaboradorLabel = 'Nenhum colaborador cadastrado.'

  isLoading = false;

  userId!: string;
  dialogRef!: MatDialogRef<ColaboradorFormComponent>;

  constructor(
    private dialog: MatDialog,
    private snackService: MensagemSnackService,
    private colaboradorService: ColaboradorService,
    private cdr: ChangeDetectorRef,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.userId = getCurrentUserData().user.id;
    this.getColaboradores();

  }

  getColaboradores(filtro: string = '', arrayCheckbox: string[] = []): void {
    this.isLoading = true;

    const currentUserData = getCurrentUserData();
    if (currentUserData && currentUserData.operationId) {
      this.colaboradorService.carregarColaboradores(currentUserData.operationId).subscribe({
        next: dados => {
          this.colaboradores = dados
            .filter((dado: UserProfileListing) => dado.function !== undefined)
            .map((dado: UserProfileListing) => ({
              ...dado,
              funcao: dado.function as 'proprietário' | 'administrador' | 'gerente' | 'frentista'
            }));
          this.isLoading = false;
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Erro ao carregar colaboradores:', err);
          this.colaboradores = [];
          this.isLoading = false;
          this.cdr.detectChanges();
        }
      });
    } else {
      console.error('Não foi possível obter operationId do usuário atual.');
      this.colaboradores = [];
      this.isLoading = false;
      this.cdr.detectChanges();
    }
  }

  novoColaboradorDialog(): void {
    const dialogRef = this.dialog.open(ColaboradorFormComponent, {
      width: '30rem',
      data: { formTitle: 'Novo Colaborador' },
    });

    dialogRef.componentInstance.submit.subscribe((formData: any) => {
      const data: Colaborador = {
        nome: formData.nome,
        funcao: formData.funcao,
        email: formData.email,
        senha: formData.senha,
      }

    toggleState(dialogRef);
    this.colaboradorService.cadastrarColaborador(
        data.nome, data.email, data.funcao, data.senha!
      ).then(() => {
        this.snackService.sucesso('Colaborador adicionado com sucesso!');
        this.getColaboradores();
        dialogRef.close();
      }).catch((error) => {
        console.error('Erro ao criar colaborador:', error);
        this.snackService.erro('Erro ao tentar criar colaborador: ' + error.message);
        toggleState(dialogRef);
      });
    });


    dialogRef.afterClosed().subscribe(result => {
    });
  }

  onCancel() {
    this.dialogRef.close();
  }

  async onDelete(id: string): Promise<void> {
    this.isLoading = true;
    await this.colaboradorService.remover(id).then(() => {
        this.snackService.sucesso('Colaborador removido com sucesso!');
        this.getColaboradores();
        this.isLoading = false;
      }).catch((error) => {
        console.error('Erro ao criar colaborador:', error);
        this.snackService.erro('Erro ao tentar criar colaborador: ' + error.message);
        this.isLoading = false;
      });
  }

  logout(): void {
    removeUserData();
    this.router.navigate(['/sign-in']);
  }
}
