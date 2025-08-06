import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VendasComponent } from './vendas.component';
import { MaterialModule } from '../shared/modules/material.module';
import { PageCardModule } from '../shared/components/page-card/page-card.module';
import { RouterModule } from '@angular/router';
import { GenericTableModule } from '../shared/components/generic-table/generic-table.module';
import { VendaFormComponent } from './venda-form/venda-form.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AdicionarItemVendaComponent } from './adicionar-item-venda/adicionar-item-venda.component';
import { VendaDetalhesComponent } from './venda-detalhes/venda-detalhes.component';
import { PipesModule } from '../shared/pipes/pipes.module';

@NgModule({
  declarations: [
    VendasComponent,
    VendaFormComponent,
    AdicionarItemVendaComponent,
    VendaDetalhesComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    PageCardModule,
    RouterModule,
    GenericTableModule,
    FormsModule,
    ReactiveFormsModule,
    PipesModule
  ]
})
export class VendasModule { }
