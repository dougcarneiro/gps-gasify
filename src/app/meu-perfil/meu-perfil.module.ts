import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MeuPerfilComponent } from './meu-perfil.component';
import { PageCardModule } from '../shared/components/page-card/page-card.module';
import { MaterialModule } from '../shared/modules/material.module';



@NgModule({
  declarations: [
    MeuPerfilComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    PageCardModule,
  ],
})
export class MeuPerfilModule { }
