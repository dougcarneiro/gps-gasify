import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ChartTitle } from '../enums/chartTitle.enum';
import { ChartDefinition } from '../types/chart-definition';
import { CustomChartService } from '../chart-system/services/custom-chart-service';
import { DashboardParams } from '../../shared/types/DashboardParams';
import { DashboardVendasService } from '../services/dashboard-vendas.service';
import { ChartColumnSize } from '../enums/chartColumnSize.enum';

@Component({
  selector: 'app-dashboard-receitas',
  standalone: false,
  templateUrl: './dashboard-receitas.component.html',
  styleUrls: ['./dashboard-receitas.component.css']
})
export class DashboardReceitasComponent {
  public initialChartsDefinitions: ChartDefinition[];
  activeDisplaySize = ChartColumnSize.Large;

  constructor(
    private dashboardVendasService: DashboardVendasService,
    private router: Router
  ) {
    this.initialChartsDefinitions = [
      {
        chartTitle: ChartTitle.Revenue,
        chartOptions: CustomChartService.createCustomChart('area', 'Receita', true),
        seriesDataLabel: 'Receita',
        serviceMethod: (params: DashboardParams) => this.dashboardVendasService.getAllSalesRevenue(params),
        toggleSlide: undefined,
        moneyChart: true,
      },
      {
        chartTitle: ChartTitle.RevenueByCategory,
        chartOptions: CustomChartService.createCustomChart('area', 'Receita', true),
        seriesDataLabel: 'Receita',
        serviceMethod: (params: DashboardParams) => this.dashboardVendasService.getRevenueByProductCategory(params),
        toggleSlide: undefined,
        moneyChart: true,
        multipleSeriesData: { enabled: true, groupName: 'receivedGroup' },
      },
    ];
  }

  voltar() {
    this.router.navigate(['/dashboard']);
  }
}
