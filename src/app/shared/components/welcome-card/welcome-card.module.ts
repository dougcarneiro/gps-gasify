import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WelcomeCardComponent } from './welcome-card.component';
import { PageCardModule } from '../page-card/page-card.module';

@NgModule({
  declarations: [WelcomeCardComponent],
  imports: [
    CommonModule,
    PageCardModule
  ],
  exports: [WelcomeCardComponent]
})
export class WelcomeCardModule { }
