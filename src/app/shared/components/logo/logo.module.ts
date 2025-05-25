import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LogoComponent } from './logo.component';
import { RouterLink } from '@angular/router';



@NgModule({
  declarations: [
    LogoComponent,
  ],
  imports: [
    CommonModule,
    RouterLink,
  ],
  exports: [
    LogoComponent,
  ]
})
export class LogoModule { }
