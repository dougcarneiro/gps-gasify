import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../shared/modules/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GenericChartModule } from '../shared/components/generic-chart/generic-chart.module';
import { DashboardCoreComponent } from './core/dashboard-core.component';
import { DashboardVendasComponent } from './vendas/dashboard-vendas.component';
import { PageCardModule } from '../shared/components/page-card/page-card.module';
import { DashboardReceitasComponent } from './receitas/dashboard-receitas.component';
import { DashboardPanelsComponent } from './dashboard-panels/dashboard-panels.component';


@NgModule({
  declarations: [
    DashboardCoreComponent,
    DashboardVendasComponent,
    DashboardReceitasComponent,
    DashboardPanelsComponent,
  ],
  imports: [
    CommonModule,
    GenericChartModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    PageCardModule,
  ],
  exports: [
    DashboardCoreComponent,
    DashboardVendasComponent,
    DashboardReceitasComponent,
    DashboardPanelsComponent,
  ]
})
export class DashboardModule { }
