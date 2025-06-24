import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../shared/modules/material.module';
import { HomeComponent } from './home.component';
import { SidenavModule } from '../shared/components/sidenav/sidenav.module';
import { RouterModule } from '@angular/router'; // Importar RouterModule
import { NavbarModule } from '../shared/components/navbar/navbar.module';
import { PageCardModule } from '../shared/components/page-card/page-card.module';



@NgModule({
  declarations: [
    HomeComponent,
  ],
  imports: [
    CommonModule,
    MaterialModule,
    SidenavModule,
    NavbarModule,
    RouterModule,
    PageCardModule,
  ]
})
export class HomeModule { }
