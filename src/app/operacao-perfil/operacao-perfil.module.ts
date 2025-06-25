import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OperacaoPerfilComponent } from './operacao-perfil.component';
import { PageCardModule } from '../shared/components/page-card/page-card.module';
import { MaterialModule } from '../shared/modules/material.module';

@NgModule({
    declarations: [
        OperacaoPerfilComponent
    ],
    imports: [
        CommonModule,
        MaterialModule,
        PageCardModule,
    ],
})
export class OperacaoPerfilModule { }
