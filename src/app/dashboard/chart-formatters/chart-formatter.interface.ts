import { ChartOptions } from '../../shared/components/generic-chart/generic-chart.component';
import { RobotResponsesReport } from '../types/report-result';
import { ChartDefinition } from '../types/chart-definition';

export interface ChartDataFormatter {
  formatData(
    chartOptions: Partial<ChartOptions>,
    reportData: RobotResponsesReport,
    definition: ChartDefinition,
    granularity: string
  ): Partial<ChartOptions>;
}
