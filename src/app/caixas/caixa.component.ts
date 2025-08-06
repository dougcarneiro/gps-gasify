import { ChangeDetectorRef, Component, AfterViewInit } from '@angular/core';
import { getCurrentUserData } from '../utils/localStorage';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MensagemSnackService } from '../shared/services/message/snack.service';
import { toggleState } from '../utils/loading.util';
import { DialogComponent } from '../shared/components/dialog/dialog.component';
import { ColaboradorService } from '../shared/services/colaborador/colaborador.service';
import { Caixa } from '../shared/model/Caixa';
import { CaixaService } from '../shared/services/caixa/caixa.service';
import { CaixaFormComponent } from './caixa-form/caixa-form.component';
import { MyProfile } from '../shared/types/MyProfile';

@Component({
  selector: 'app-caixas',
  standalone: false,
  templateUrl: './caixa.component.html',
})
export class CaixaComponent implements AfterViewInit {
  isUserAdmin: boolean = false;

  caixaAtivo: Caixa | null = null;
  noDataLabel = 'Nenhum caixa ativo.';

  colaboradorPerfil: MyProfile | undefined;
  isLoadingProfile: boolean = false;

  isLoading = false;

  userId!: string;
  dialogRef!: MatDialogRef<CaixaFormComponent>;

  constructor(
    private dialog: MatDialog,
    private snackService: MensagemSnackService,
    private caixaService: CaixaService,
    private colaboradorService: ColaboradorService,
  ) { }

  ngAfterViewInit(): void {
    this.userId = getCurrentUserData().user.id;
    this.getCaixa();
    this.getPerfilColaborador();
  }

  getPerfilColaborador(): void {
    this.isLoadingProfile = true;
    this.colaboradorService.getPerfil().then((userProfile) => {
      this.colaboradorPerfil = userProfile;
      this.isLoadingProfile = false;
    }).catch(error => {
      console.error('Erro ao carregar perfil do colaborador:', error);
      this.snackService.erro('Erro ao carregar perfil do colaborador');
      this.isLoadingProfile = false;
    });
  }

  getCaixa(): void {
    this.isLoading = true;

    const currentUserData = getCurrentUserData();
    if (currentUserData && currentUserData.operationId) {
      this.caixaService.carregarCaixasAtivas(currentUserData.operationId).subscribe({
        next: dados => {
          if (dados.length > 0) {
            // Ordenar por data de criação (mais recente primeiro)
            dados.sort((a, b) => {
              const dateA = a.createdAt ? new Date(a.createdAt) : new Date(0);
              const dateB = b.createdAt ? new Date(b.createdAt) : new Date(0);
              return dateB.getTime() - dateA.getTime();
            });
            this.caixaAtivo = dados[0];
          }
          this.isLoading = false;
        },
        error: error => {
          console.error('Erro ao carregar caixas:', error);
          this.snackService.erro('Erro ao carregar caixas');
          this.isLoading = false;
        }
      });
    } else {
      this.isLoading = false;
    }
  }

  abrirCaixaDialog(): void {
    const dialogRef = this.dialog.open(CaixaFormComponent, {
      width: '30rem',
      data: { formTitle: 'Abrir caixa' },
    });

    dialogRef.componentInstance.submit.subscribe((formData: any) => {
      const data: Caixa = {
        operationId: getCurrentUserData().operationId!,
        initialBalance: formData.initialBalance,
        currentBalance: formData.initialBalance,
        closedBalance: null,
        isActive: true,
        ownerId: getCurrentUserData().roleId,
      }

      toggleState(dialogRef);
      this.caixaService.abrirCaixa(data.operationId, data.initialBalance, data.ownerId)
        .then(() => {
          this.snackService.sucesso('Caixa aberto com sucesso!');
          this.getCaixa();
          dialogRef.close();
        })
        .catch(error => {
          console.error('Erro ao abrir caixa:', error);
          this.snackService.erro('Erro ao abrir caixa');
        })
        .finally(() => {
          toggleState(dialogRef);
        });
    });
    dialogRef.afterClosed().subscribe(result => {
    });
  }

  fecharCaixaDialog(): void {
    const dialogRef = this.dialog.open(CaixaFormComponent, {
      width: '30rem',
      data: {
        formTitle: 'Fechar Caixa',
        isEditMode: true
      },
    });

    dialogRef.componentInstance.submit.subscribe((formData: any) => {
      const closedBalance = formData.initialBalance; // Using initialBalance field for closed balance

      toggleState(dialogRef);
      this.caixaService.fecharCaixa(this.caixaAtivo!.id!, closedBalance)
        .then(() => {
          this.snackService.sucesso('Caixa fechado com sucesso!');
          this.caixaAtivo = null;
          dialogRef.close();
        })
        .catch(error => {
          console.error('Erro ao fechar caixa:', error);
          this.snackService.erro('Erro ao fechar caixa');
        })
        .finally(() => {
          toggleState(dialogRef);
        });
    });
    dialogRef.afterClosed().subscribe(result => {
    });
  }

  onCancel() {
    this.dialogRef.close();
  }
}
