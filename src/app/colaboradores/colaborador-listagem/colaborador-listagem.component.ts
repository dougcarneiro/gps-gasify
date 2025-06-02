import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output, ChangeDetectorRef } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Colaborador } from '../../shared/model/Colaborador';
import { ColaboradorService } from '../../shared/services/colaborador/colaborador.service';
import { getCurrentUserData } from '../../utils/localStorage';

@Component({
  selector: 'app-colaborador-listagem',
  standalone: false,
  templateUrl: './colaborador-listagem.component.html',
})
export class ColaboradorListagemComponent implements OnInit {
  @Input() tasks: Colaborador[] = [];
  @Output() delete = new EventEmitter<Colaborador>();

  @Input() noTasksLabel = '';

  isLoading = false;
  colaboradores: Colaborador[] = [];

  constructor(
    private colaboradorService: ColaboradorService,
    private cdr: ChangeDetectorRef // Injetado ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.carregarColaboradores();
  }

  carregarColaboradores(): void {
    this.isLoading = true;

    const currentUserData = getCurrentUserData();
    if (currentUserData && currentUserData.operationId) {
      this.colaboradorService.carregarColaboradores(currentUserData.operationId).subscribe({
        next: dados => {
          this.colaboradores = dados.map(dado => ({
            ...dado,
            funcao: dado.funcao as 'proprietário' | 'administrador' | 'gerente' | 'frentista' | undefined
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

  editarColaborador(id: string | undefined): void {
    // Lógica para navegar para a página de edição do colaborador
    if (id) {
      console.log('Editar colaborador com ID:', id);
      // this.router.navigate(['/colaboradores/editar', id]); // Exemplo com Angular Router
    } else {
      console.error('ID do colaborador não definido.');
    }
  }

  excluirColaborador(id: string | undefined): void {
    // Lógica para excluir o colaborador
    if (id) {
      console.log('Excluir colaborador com ID:', id);
      // this.colaboradorService.excluir(id).subscribe(() => {
      //   this.carregarColaboradores(); // Recarrega a lista após a exclusão
      // });
      // Para demonstração, remove da lista local:
      this.colaboradores = this.colaboradores.filter(c => c.id !== id);
    } else {
      console.error('ID do colaborador não definido.');
    }
  }

  onDelete(colaborador: Colaborador): void {
    const index = this.colaboradores.findIndex(t => t.id === colaborador.id);
    if (index !== -1) {
      this.colaboradores.splice(index, 1);
    }
    this.delete.emit(colaborador);
  }
}
