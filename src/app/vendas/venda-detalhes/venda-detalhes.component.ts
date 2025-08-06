import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Venda } from '../../shared/model/Venda';
import { VendaService } from '../../shared/services/venda/venda.service';

@Component({
  selector: 'app-venda-detalhes',
  standalone: false,
  templateUrl: './venda-detalhes.component.html',
  styleUrls: ['./venda-detalhes.component.css']
})
export class VendaDetalhesComponent implements OnInit {
  venda: Venda | null = null;
  isLoading = true;

  constructor(
    private vendaService: VendaService,
    @Inject(MAT_DIALOG_DATA) public data: { vendaId: string }
  ) { }

  ngOnInit(): void {
    this.carregarDetalhesVenda();
  }

  carregarDetalhesVenda() {
    this.vendaService.getVendaPorId(this.data.vendaId).subscribe(venda => {
      this.venda = venda;
      this.isLoading = false;
    });
  }
}
