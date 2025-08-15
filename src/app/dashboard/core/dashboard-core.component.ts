import { Component, AfterViewInit, Input } from '@angular/core';
import { RobotResponsesReport } from '../types/report-result';
import { ChartDefinition } from '../types/chart-definition';
import { DashboardChartConfig } from '../types/chart-config';
import { tap, finalize } from 'rxjs/operators';
import { FormControl, FormGroup } from '@angular/forms';
import { formatMoney } from '../../utils/money.util';
import { ChartFormatterFactory } from '../chart-formatters';
import { DashboardParams } from '../../shared/types/DashboardParams';
import { ChartColumnSize } from '../enums/chartColumnSize.enum';

@Component({
  selector: 'app-dashboard-core',
  standalone: false,
  templateUrl: './dashboard-core.component.html',
  styleUrls: ['./dashboard-core.component.css']
})
export class DashboardCoreComponent implements AfterViewInit {
  @Input() initialChartsDefinitions: ChartDefinition[] = [];
  @Input() DEFAULT_DATE_RANGE_DAYS: number = 2;
  @Input() MAX_DATE_RANGE_DAYS: number = 365;
  @Input() activeDisplaySize: number = ChartColumnSize.Medium;

  chartConfigs: DashboardChartConfig[] = [];

  dateRange = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
  });

  maxDate = new Date();
  minDate: Date | null = null;

  activePreset: number | null = null; // Removido valor padrão pois agora usamos mês atual

  isShortDateRange: boolean = false;
  isVeryShortDateRange: boolean = false;

  fromDate: Date = new Date();
  toDate: Date = new Date();

  get granularity(): string {
    const periodLength = (this.toDate.getTime() - this.fromDate.getTime()) / (1000 * 60 * 60 * 24) + 1; // +1 to include the end date
    if (periodLength >= 30) {
      return 'month';
    }
    return 'day';
  }

  get isLoading(): boolean {
    const loadedCount = this.chartConfigs.filter(chart => chart.isLoaded).length;
    return loadedCount !== this.chartConfigs.length;
  }

  constructor() { }

  ngAfterViewInit(): void {
    this.initDashboardCharts();
    this.applyCurrentMonthDateRange();
  }

  initDashboardCharts(): void {
    for (const definition of this.initialChartsDefinitions) {
      this.chartConfigs.push({
        title: definition.chartTitle,
        chartOptions: definition.chartOptions,
        totalDisplay: `Total: --`,
        isLoaded: false,
        toggleSlide: definition.toggleSlide,
        definition: definition,
      });
    }
  }

  clearDateRange(): void {
    this.dateRange.reset();
    this.activePreset = null;
  }

  setMinDate(): void {
    if (this.dateRange.get('start')?.value) {
      const newDate: Date = new Date(this.dateRange.get('start')!.value!);
      newDate.setDate(newDate.getDate() - this.MAX_DATE_RANGE_DAYS);
      this.minDate = newDate;
    }
  }

  setMaxDate(): void {
    const today: Date = new Date();
    if (!this.dateRange.get('start')?.value) {
      this.maxDate = today;
    } else {
      const newDate: Date = new Date(this.dateRange.get('start')!.value!);
      newDate.setDate(newDate.getDate() + this.MAX_DATE_RANGE_DAYS);
      this.maxDate = newDate > today ? today : newDate;
    }
  }

  rerenderCharts(): void {
    this.chartConfigs = []
    this.initDashboardCharts();
  }

  applyDisplaySize(size: number): void {
    this.activeDisplaySize = size;

    this.chartConfigs = this.chartConfigs.map(config => {
      return {
        ...config,
        chartOptions: { ...config.chartOptions }
      };
    });
  }

  refetchChartData(config: DashboardChartConfig): void {
    this.fetchChartsData([config], this.fromDate, this.toDate);
  }

  toggleChange(chartConfig: DashboardChartConfig): void {
    chartConfig.chartOptions.series = [];
    this.fetchChartsData([chartConfig], this.fromDate, this.toDate);
  }

  fetchChartsData(
    chartsConfigs: DashboardChartConfig[],
    from: Date,
    to: Date
  ): void {
    for (const chartConfig of chartsConfigs) {
      let definition: ChartDefinition = chartConfig.definition;

      chartConfig.isLoaded = false;
      chartConfig.failedLoad = true

      const params: DashboardParams = {
        from,
        to,
        granularity: this.granularity!,
      };

      chartConfig.definition.serviceMethod(params)
        .pipe(
          tap({
            next: (reportData: RobotResponsesReport) => {
              this.refreshChartData(chartConfig, reportData);
              chartConfig.failedLoad = false;
            },
            error: err => {
              console.error(`Erro ao carregar relatório para o gráfico "${definition.chartTitle}":`, err);
              chartConfig.failedLoad = true;
            },
          }),
          finalize(() => {
            chartConfig.isLoaded = true;
          })
        ).subscribe();
    }
  }

  refreshChartData(chartConfig: DashboardChartConfig, reportData: RobotResponsesReport): void {
    const definition = chartConfig.definition;

    chartConfig.noDataFound = reportData.total === 0;
    if (chartConfig.noDataFound) {
      return;
    }

    const chartType = chartConfig.chartOptions.chart?.type;
    if (!chartType) {
      console.error('Chart type is not defined');
      return;
    }

    try {
      const formatter = ChartFormatterFactory.getFormatter(chartType);
      chartConfig.chartOptions = formatter.formatData(
        chartConfig.chartOptions,
        reportData,
        definition,
        this.granularity
      );
    } catch (error) {
      console.error(`Error formatting chart data for type "${chartType}":`, error);
      chartConfig.chartOptions = { ...chartConfig.chartOptions, series: [] };
    }

    chartConfig.totalDisplay = `Total: ${definition.moneyChart ? formatMoney(reportData.total!) : `${reportData.total} itens`}`;
  }

  applyDateFilterPreset(days: number, firstLoad?: boolean): void {
    const toDate = new Date();
    const fromDate = new Date();
    fromDate.setDate(toDate.getDate() - (days - 1)); // - (days - 1) to include today in the count of 'days'

    if (firstLoad) {
      this.dateRange.get('start')?.setValue(fromDate);
      this.dateRange.get('end')?.setValue(toDate);
    } else {
      this.dateRange.get('start')?.setValue(new Date(fromDate));
      this.dateRange.get('end')?.setValue(new Date(toDate));
    }
    this.activePreset = days;

    this.loadChartsData(fromDate, toDate);
  }

  applyCurrentMonthDateRange(): void {
    const today = new Date();
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    this.dateRange.get('start')?.setValue(firstDayOfMonth);
    this.dateRange.get('end')?.setValue(today);

    // Definir activePreset como "mês atual" (usaremos um valor especial)
    this.activePreset = -1; // Valor especial para indicar "mês atual"

    this.loadChartsData(firstDayOfMonth, today);
  }

  onDateRangeChange(clearEndDate?: boolean): void {
    this.setMaxDate();
    this.setMinDate();
    if (clearEndDate) { this.dateRange.get('end')?.setValue(null); }
    if (this.dateRange.get('start')?.value && this.dateRange.get('end')?.value) {
      this.activePreset = null;
      this.loadChartsData(this.dateRange.get('start')!.value!, this.dateRange.get('end')!.value!);
    }
  }

  private clearCharts(): void {
    this.chartConfigs.map(chart => {
      chart.chartOptions.series = [];
      chart.totalDisplay = `Total: --`;
      chart.isLoaded = false;
    })
  }

  private loadChartsData(fromDate: Date, toDate: Date): void {
    this.fromDate = fromDate;
    this.toDate = toDate;

    const oneDay = 24 * 60 * 60 * 1000;
    const startDateNormalized = new Date(fromDate.getFullYear(), fromDate.getMonth(), fromDate.getDate());
    const endDateNormalized = new Date(toDate.getFullYear(), toDate.getMonth(), toDate.getDate());

    const diffTime = Math.abs(endDateNormalized.getTime() - startDateNormalized.getTime());
    const diffDays = Math.round(diffTime / oneDay);
    const periodLength = diffDays + 1;
    this.isShortDateRange = periodLength <= 7 && periodLength > 2;
    this.isVeryShortDateRange = periodLength <= 2;;

    this.clearCharts();
    this.fetchChartsData(this.chartConfigs, fromDate, toDate);
  }
}
