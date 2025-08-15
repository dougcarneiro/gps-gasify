import { ChartTitle } from '../enums/chartTitle.enum';
import { DashboardChartConfig } from './chart-config';
import { ChartOptions } from '../../shared/components/generic-chart/generic-chart.component';
import { DashboardParams } from '../../shared/types/DashboardParams';

export type ToggleSlideFunction = (chartConfig: DashboardChartConfig, id: any, event: boolean) => void;

export interface ToggleSlideConfig {
  id: any;
  label: string;
  initialValue?: boolean;
}

export interface ChartDefinition {
  chartOptions: Partial<ChartOptions>
  chartTitle: ChartTitle;
  serviceMethod: (params: DashboardParams) => any; // Should be a method from RobotService
  seriesDataLabel: string;
  multipleSeriesData?: { enabled: boolean; groupName?: string; };
  toggleSlide?: ToggleSlideConfig[];
  hideTotalSpan?: boolean;
  moneyChart?: boolean;
}
