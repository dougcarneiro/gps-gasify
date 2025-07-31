import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../shared/modules/material.module';
import { PageCardModule } from '../shared/components/page-card/page-card.module';
import { CaixaComponent } from './caixa.component';
import { CaixaFormComponent } from './caixa-form/caixa-form.component';


@NgModule({
  declarations: [
    CaixaComponent,
    CaixaFormComponent,
  ],
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    PageCardModule,
  ]
})
export class CaixaModule { }
