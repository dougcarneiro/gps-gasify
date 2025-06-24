import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CadastroComponent } from './cadastro/cadastro.component';
import { LoginComponent } from './login/login.component';
import { MaterialModule } from '../shared/modules/material.module';
import { RouterLink } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LogoModule } from "../shared/components/logo/logo.module";
import { FirebaseModule } from '../firestore/firestore.module';
import { PageCardModule } from '../shared/components/page-card/page-card.module';



@NgModule({
  declarations: [
    CadastroComponent,
    LoginComponent,
  ],
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    MaterialModule,
    ReactiveFormsModule,
    RouterLink,
    LogoModule,
    FirebaseModule,
    PageCardModule,
  ]
})
export class AuthModule { }
