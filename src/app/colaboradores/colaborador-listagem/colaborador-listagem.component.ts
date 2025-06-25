import { Component, EventEmitter, Input, Output } from '@angular/core';
import { UserProfileListing } from '../../shared/types/UserProfileListing';
import { ColumnConfig } from '../../shared/components/generic-table/generic-table.component';

@Component({
  selector: 'app-colaborador-listagem',
  templateUrl: './colaborador-listagem.component.html',
  standalone: false,
})
export class ColaboradorListagemComponent {
  @Input() colaboradores: UserProfileListing[] = [];
  @Input() semColaboradoresLabel = 'Nenhum colaborador encontrado.';
  @Input() isLoading = false;
  @Input() isUserAdmin = false;

  @Output() delete = new EventEmitter<string>();
  @Output() edit = new EventEmitter<UserProfileListing>();
  @Output() statusChange = new EventEmitter<UserProfileListing>();

  columnConfig: ColumnConfig[] = [
    { key: 'name', header: 'Nome', sortable: true, pipe: 'titlecase' },
    { key: 'email', header: 'Email', sortable: true, pipe: 'lowercase' },
    { key: 'function', header: 'Função', sortable: true, pipe: 'titlecase' },
  ];

  constructor() { }

  editarColaborador(colaborador: UserProfileListing): void {
    this.edit.emit(colaborador);
  }

  removerColaborador(colaborador: UserProfileListing): void {
    this.delete.emit(colaborador.idUserProfileOperation);
  }

  onStatusChange(colaborador: UserProfileListing): void {
    this.statusChange.emit(colaborador);
  }
}
