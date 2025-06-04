import { Component, EventEmitter, Input, OnInit, Output, ChangeDetectorRef } from '@angular/core';
import { Colaborador } from '../../shared/model/Colaborador';
import { ColaboradorService } from '../../shared/services/colaborador/colaborador.service';
import { ColaboradorFormComponent } from '../colaborador-form/colaborador-form.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MensagemSnackService } from '../../shared/services/message/snack.service';
import { DialogComponent } from '../../shared/components/dialog/dialog.component';
import { toggleState } from '../../utils/loading.util';
import { UserProfile } from '../../shared/model/UserProfile';
import { UserProfileListing } from '../../shared/types/UserProfileListing';

@Component({
  selector: 'app-colaborador-listagem',
  standalone: false,
  templateUrl: './colaborador-listagem.component.html',
})
export class ColaboradorListagemComponent {
  @Input() colaboradores: UserProfileListing[] = [];
  @Input() semColaboradoresLabel = '';
  @Input() isLoading = false;

  @Output() delete = new EventEmitter<string>();
  @Output() editar = new EventEmitter<Colaborador>();
  @Output() reload = new EventEmitter<void>();

  dialogRef!: MatDialogRef<ColaboradorFormComponent>;

  constructor(
    private dialog: MatDialog,
    private colaboradorService: ColaboradorService,
    private snackService: MensagemSnackService,

  ) {}

  async editarColaborador(colaborador: UserProfileListing): Promise<void> {
     const dialogRef = this.dialog.open(ColaboradorFormComponent, {
      width: '30rem',
      data: { formTitle: 'Atualizar Colaborador', colaborador: colaborador, isEditMode: true },
    });

    dialogRef.componentInstance.submit.subscribe((formData: any) => {
      const data: UserProfileListing = {
        idUserProfileOperation: colaborador.idUserProfileOperation,
        name: formData.nome,
        function: formData.funcao,
        email: formData.email ? formData.email : colaborador.email,
        operationId: colaborador.operationId!,
      }

    toggleState(dialogRef);

    this.colaboradorService.atualizarColaborador(data)
      .then((updatedColaborador) => {
        this.snackService.sucesso('Colaborador atualizado com sucesso!');
        this.reload.emit();
        dialogRef.close();
      })
      .catch((error) => {
        console.error('Erro ao atualizar colaborador:', error);
        this.snackService.erro('Erro ao atualizar colaborador: ' + error.message);
        toggleState(dialogRef);
      });
    });
  }


  removerColaborador(id: string): void {
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '30rem',
      data: {
        dialogTitle: 'Remover Colaborador',
        dialogText: 'Deseja realmente remover este colaborador?'
      },
    });

    dialogRef.componentInstance.dialogActionConfirm.subscribe(
      () => {
        this.delete.emit(id);
        dialogRef.close();
      }
    );
  }

}
