import { NgModule } from '@angular/core';
import { CommonModule, TitleCasePipe } from '@angular/common';
import { GenericTableComponent } from './generic-table.component';
import { MaterialModule } from '../../modules/material.module';
import { PipesModule } from '../../pipes/pipes.module';

@NgModule({
  declarations: [GenericTableComponent],
  imports: [
    CommonModule,
    MaterialModule,
    TitleCasePipe,
    PipesModule,
  ],
  exports: [GenericTableComponent]
})
export class GenericTableModule { }
