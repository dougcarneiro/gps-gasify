import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgApexchartsModule } from 'ng-apexcharts';
import { MaterialModule } from '../../modules/material.module';
import { GenericChartComponent } from './generic-chart.component';

@NgModule({
  declarations: [GenericChartComponent],
  imports: [CommonModule, NgApexchartsModule, MaterialModule],
  exports: [GenericChartComponent],
})
export class GenericChartModule {}
