import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ColumnConfig } from '../../shared/components/generic-table/generic-table.component';
import { Produto } from '../../shared/model/Produto';

@Component({
  selector: 'app-produto-listagem',
  templateUrl: './produto-listagem.component.html',
  standalone: false,
})
export class ProdutoListagemComponent {
  @Input() produtos: Produto[] = [];
  @Input() noDataMessage = 'Nenhum produto encontrado.';
  @Input() isLoading = false;
  @Input() isUserAdmin = false;

  @Output() delete = new EventEmitter<Produto>();
  @Output() edit = new EventEmitter<Produto>();
  @Output() statusChange = new EventEmitter<Produto>();

  columnConfig: ColumnConfig[] = [
    { key: 'descricao', header: 'Nome', sortable: true, pipe: '' },
    { key: 'tipoUnidade', header: 'Tipo de Unidade', sortable: true, pipe: 'lowercase' },
    { key: 'precoPorUnidade', header: 'Preço', sortable: true },
    { key: 'quantidadeEstoque', header: 'Quantidade em Estoque', sortable: true },
    { key: 'status', header: 'Status', sortable: true, isBoolean: true },
  ];

  constructor() {
  }

  alterarProduto(produto: Produto): void {
    this.edit.emit(produto);
  }

  removerProduto(produto: Produto): void {
    this.delete.emit(produto);
  }

  onStatusChange(produto: Produto): void {
    this.statusChange.emit(produto);
  }
}
