import { NgModule } from '@angular/core';
import { CommonModule, TitleCasePipe } from '@angular/common';
import { GenericTableComponent } from './generic-table.component';
import { MaterialModule } from '../../modules/material.module';

@NgModule({
  declarations: [GenericTableComponent],
  imports: [
    CommonModule,
    MaterialModule,
    TitleCasePipe,
  ],
  exports: [GenericTableComponent]
})
export class GenericTableModule { }
