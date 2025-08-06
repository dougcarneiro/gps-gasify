import { Component, OnInit } from '@angular/core';
import { CaixaService } from '../shared/services/caixa/caixa.service';
import { getCurrentUserData } from '../utils/localStorage';
import { Caixa } from '../shared/model/Caixa';
import { Venda } from '../shared/model/Venda';
import { VendaService } from '../shared/services/venda/venda.service';
import { MatDialog } from '@angular/material/dialog';
import { VendaFormComponent } from './venda-form/venda-form.component';
import { VendaDetalhesComponent } from './venda-detalhes/venda-detalhes.component';
import { Router } from '@angular/router';
import { ColumnConfig } from '../shared/components/generic-table/generic-table.component';

@Component({
  selector: 'app-vendas',
  standalone: false,
  templateUrl: './vendas.component.html',
  styleUrls: ['./vendas.component.css']
})
export class VendasComponent implements OnInit {

  caixaAberto: Caixa | null = null;
  isLoading = true;
  vendas: Venda[] = [];
  columnConfig: ColumnConfig[] = [
    { key: 'id', header: 'ID', sortable: false, pipe: null },
    { key: 'totalVenda', header: 'Total da Venda', sortable: true, pipe: 'brlCurrency' },
    { key: 'metodoPagamento', header: 'Método de Pagamento', sortable: true, pipe: 'paymentMethod' },
    { key: 'createdAt', header: 'Data de Criação', sortable: true, pipe: 'localDate' },
  ]
  noDataLabel = 'Nenhuma venda registrada neste caixa.';

  constructor(
    private caixaService: CaixaService,
    private vendaService: VendaService,
    private dialog: MatDialog,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.verificarCaixaAberto();
  }

  verificarCaixaAberto() {
    this.isLoading = true;
    const { roleId, operationId } = getCurrentUserData();
    this.caixaService.verificarSeCaixaEstaAberto(roleId, operationId)
      .then(caixa => {
        this.caixaAberto = caixa;
        if (this.caixaAberto) {
          this.carregarVendas();
        }
        this.isLoading = false;
      })
      .catch(err => {
        console.error(err);
        this.isLoading = false;
      });
  }

  carregarVendas() {
    if (this.caixaAberto && this.caixaAberto.id) {
      this.vendaService.listarVendasPorCaixa(this.caixaAberto.id).subscribe(vendas => {
        this.vendas = vendas;
      });
    }
  }

  lancarVenda() {
    const dialogRef = this.dialog.open(VendaFormComponent, {
      width: '800px',
      data: { caixa: this.caixaAberto }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.carregarVendas();
      }
    });
  }

  verDetalhes(venda: unknown) {
    this.dialog.open(VendaDetalhesComponent, {
      width: '600px',
      data: { vendaId: (venda as Venda).id }
    });
  }

  irParaCaixa() {
    this.router.navigate(['/caixa']);
  }
}
