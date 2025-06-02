import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../shared/modules/material.module';
import { HomeComponent } from './home.component';
import { SidenavModule } from '../shared/components/sidenav/sidenav.module';
import { RouterModule } from '@angular/router'; // Importar RouterModule



@NgModule({
  declarations: [
    HomeComponent,
  ],
  imports: [
    CommonModule,
    MaterialModule,
    SidenavModule,
    RouterModule // Adicionar RouterModule aos imports
  ]
})
export class HomeModule { }
