import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { MaterialModule } from '../shared/modules/material.module';
import { GenericTableModule } from '../shared/components/generic-table/generic-table.module';
import { ProdutoFormComponent } from './produto-form/produto-form.component';
import { ProdutoListagemComponent } from './produto-listagem/produto-listagem.component';
import { ProdutoComponent } from './produto.component';

const routes: Routes = [
  {
    path: 'novo',
    component: ProdutoFormComponent
  },
  {
    path: 'editar/:id',
    component: ProdutoFormComponent
  }
];

@NgModule({
  declarations: [
    ProdutoFormComponent,
    ProdutoListagemComponent,
    ProdutoComponent,
  ],
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    GenericTableModule,
  ]
})
export class ProdutoModule { }
