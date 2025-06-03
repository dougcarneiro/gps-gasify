import { Component, OnInit } from '@angular/core';
import { getCurrentUserData, removeUserData } from '../utils/localStorage';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MensagemSnackService } from '../shared/services/message/snack.service';
import { Router } from '@angular/router';
import { ColaboradorFormComponent } from './colaborador-form/colaborador-form.component';
import { Colaborador } from '../shared/model/Colaborador';

@Component({
  selector: 'app-colaboradores',
  standalone: false,
  templateUrl: './colaboradores.component.html',
})
export class ColaboradoresComponent implements OnInit {

  colaboradores: Array<Colaborador> = [];
  noColaboradorLabel = 'Nenhum colaborador cadastrado.'

  userId!: string;
  dialogRef!: MatDialogRef<ColaboradorFormComponent>;


  constructor(
    private dialog: MatDialog,
    private snackService: MensagemSnackService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.userId = getCurrentUserData().user.id;
    this.getColaboradores();

  }

  getColaboradores(filtro: string = '', arrayCheckbox: string[] = []): void {
    // if (filtro !== '' || arrayCheckbox.length > 0) {
    //   this.noColaboradorLabel = 'Nenhum afazer encontrado.';
    // }
    // this.colaboradorService.listar(this.userId, filtro, arrayCheckbox).subscribe(
    //   (tasks) => {
    //     this.tasks = tasks;
    // })
    this.colaboradores = [
      { id: '1', nome: 'João Silva', email: 'joao.silva@example.com', funcao: 'gerente' },
      { id: '2', nome: 'Maria Oliveira', email: 'maria.oliveira@example.com', funcao: 'frentista' },
      { id: '3', nome: 'Carlos Pereira', email: 'carlos.pereira@example.com', funcao: 'gerente' }
    ];
  }

  openDialog(colaborador?: Colaborador): void {
    const dialogRef = this.dialog.open(ColaboradorFormComponent, {
      width: '30rem',
      data: {
        formTitle: colaborador ? 'Editar Colaborador' : 'Novo Colaborador',
        colaborador: colaborador || null
    },
  });

    dialogRef.componentInstance.submit.subscribe((formData: any) => {
      // const data: Colaborador = {
      //   titulo: formData.title,
      //   descricao: formData.text,
      //   prioridade: formData.priority,
      //   status: 'pendente',
      //   donoId: this.userId,
      //   dueDate: formData.dueDate,
      //   dataCriacao: new Date(),
      //   dataAlteracao: new Date(),
      //   removido: false,
      // }

      // this.colaboradorService.inserir(data).subscribe({
        // next: (task) => {
        //   this.snackService.sucesso('Afazer criado!');
        //   this.getColaboradores();
        //   dialogRef.close();
        // },
        // error: (error) => {
        //   this.snackService.erro('Erro ao tentar criar afazer.');
        // }
      });
    // });

    dialogRef.afterClosed().subscribe(result => {
    });
  }

  onCancel() {
    this.dialogRef.close();
  }

  onDelete(colaborador: Colaborador): void {
    // this.colaboradorService.remover(task).subscribe({
    //   next: () => {
    //   this.snackService.sucesso('Afazer removido!');
    //   },
    //   error: (error) => {
    //   this.snackService.erro('Erro ao tentar remover afazer.');
    //   }
    // });
  }

  logout(): void {
    removeUserData();
    this.router.navigate(['/sign-in']);
  }
}
