import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { ColaboradorFormComponent } from './colaborador-form/colaborador-form.component';
import { MaterialModule } from '../shared/modules/material.module';
import { ColaboradorListagemComponent } from './colaborador-listagem/colaborador-listagem.component';
import { ColaboradoresComponent } from './colaboradores.component';
// Importe aqui o componente de listagem quando for criado
// import { ColaboradorListComponent } from './colaborador-list/colaborador-list.component';

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
  ]
})
export class ColaboradoresModule { }
