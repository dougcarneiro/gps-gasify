import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { ColaboradorFormComponent } from './colaborador-form/colaborador-form.component';
import { MaterialModule } from '../shared/modules/material.module';
import { ColaboradorListagemComponent } from './colaborador-listagem/colaborador-listagem.component';
import { ColaboradoresComponent } from './colaboradores.component';
import { GenericTableModule } from '../shared/components/generic-table/generic-table.module';
import { PageCardModule } from '../shared/components/page-card/page-card.module';

const routes: Routes = [
  // {
  //   path: '',
  //   component: ColaboradorListComponent // Rota para listar colaboradores
  // },
  {
    path: 'novo',
    component: ColaboradorFormComponent
  },
  {
    path: 'editar/:id',
    component: ColaboradorFormComponent
  }
];

@NgModule({
  declarations: [
    ColaboradorFormComponent,
    ColaboradorListagemComponent,
    ColaboradoresComponent,
  ],
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    GenericTableModule,
    PageCardModule,
  ]
})
export class ColaboradoresModule { }
