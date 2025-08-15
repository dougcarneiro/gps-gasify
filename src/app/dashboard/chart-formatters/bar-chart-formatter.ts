import { ChartDataFormatter } from './chart-formatter.interface';
import { ChartOptions } from '../../shared/components/generic-chart/generic-chart.component';
import { RobotResponsesReport } from '../types/report-result';
import { ChartDefinition } from '../types/chart-definition';
import { ChartSeriesLabel } from '../enums/chart-series-label.enum';

export class BarChartFormatter implements ChartDataFormatter {
  formatData(
    chartOptions: Partial<ChartOptions>,
    reportData: RobotResponsesReport,
    definition: ChartDefinition,
    granularity: string
  ): Partial<ChartOptions> {
    if (!definition.multipleSeriesData?.enabled) {
      throw new Error('Bar charts require multiple series data to be enabled');
    }

    const group = reportData[definition.multipleSeriesData.groupName as keyof typeof reportData] || {};

    if (Object.keys(group).length === 0) {
      return { ...chartOptions, series: [] };
    }

    const sortedEntries = Object.entries(group).sort((a, b) => a[0].localeCompare(b[0]));
    const labels = sortedEntries.map(([key, _]) => ChartSeriesLabel[key as keyof typeof ChartSeriesLabel] || key);
    const values = sortedEntries.map(([_, value]) => value);

    return {
      ...chartOptions,
      series: [{
        name: definition.seriesDataLabel,
        data: values as number[]
      }],
      xaxis: {
        ...chartOptions.xaxis,
        categories: labels
      }
    };
  }
}
