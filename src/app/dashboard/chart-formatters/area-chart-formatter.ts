import { ChartDataFormatter } from './chart-formatter.interface';
import { ChartOptions } from '../../shared/components/generic-chart/generic-chart.component';
import { RobotResponsesReport } from '../types/report-result';
import { ChartDefinition } from '../types/chart-definition';
import { GroupColors } from '../enums/chart-colors.enum';
import { ChartSeriesLabel } from '../enums/chart-series-label.enum';
import { parseDate } from '../../utils/date.util';

export class AreaChartFormatter implements ChartDataFormatter {
  formatData(
    chartOptions: Partial<ChartOptions>,
    reportData: RobotResponsesReport,
    definition: ChartDefinition,
    granularity: string
  ): Partial<ChartOptions> {
    let seriesData;

    // Apply month formatting if needed
    const updatedChartOptions = { ...chartOptions };
    if (granularity === 'month' && updatedChartOptions.xaxis) {
      updatedChartOptions.xaxis = {
        ...updatedChartOptions.xaxis,
        labels: {
          ...updatedChartOptions.xaxis.labels,
          format: 'MMM'
        }
      };
    }

    if (definition.multipleSeriesData?.enabled) {
      const group = reportData[definition.multipleSeriesData.groupName as keyof typeof reportData] || {};

      if (Object.keys(group).length === 0) {
        return { ...updatedChartOptions, series: [] };
      }

      const sortedEntries = Object.entries(group).sort((a, b) => a[0].localeCompare(b[0]));

      // Time-series data for area chart
      seriesData = sortedEntries.map(([groupName, groupData]) => ({
        name: ChartSeriesLabel[groupName as keyof typeof ChartSeriesLabel] || groupName,
        data: (groupData as any[]).map(item => ({
          x: parseDate(item.date).getTime(),
          y: item.count,
        })),
        color: GroupColors[groupName as keyof typeof GroupColors] || GroupColors.default
      }));
    } else {
      // Single series from results
      const results = reportData.results || [];
      seriesData = [{
        name: definition.seriesDataLabel,
        data: results.map(item => ({
          x: parseDate(item.date).getTime(),
          y: item.count
        }))
      }];
    }

    return {
      ...updatedChartOptions,
      series: seriesData
    };
  }
}
