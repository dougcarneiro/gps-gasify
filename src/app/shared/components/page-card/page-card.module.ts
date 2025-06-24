import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageCardComponent } from './page-card.component';
import { MaterialModule } from '../../modules/material.module';

@NgModule({
    declarations: [PageCardComponent],
    imports: [
        CommonModule,
        MaterialModule
    ],
    exports: [PageCardComponent]
})
export class PageCardModule { }
