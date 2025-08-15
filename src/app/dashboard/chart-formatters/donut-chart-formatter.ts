import { ChartDataFormatter } from './chart-formatter.interface';
import { ChartOptions } from '../../shared/components/generic-chart/generic-chart.component';
import { RobotResponsesReport } from '../types/report-result';
import { ChartDefinition } from '../types/chart-definition';
import { GroupColors } from '../enums/chart-colors.enum';
import { ChartSeriesLabel } from '../enums/chart-series-label.enum';

export class DonutChartFormatter implements ChartDataFormatter {
    formatData(
        chartOptions: Partial<ChartOptions>,
        reportData: RobotResponsesReport,
        definition: ChartDefinition,
        granularity: string
    ): Partial<ChartOptions> {
        if (!definition.multipleSeriesData?.enabled) {
            throw new Error('Donut charts require multiple series data to be enabled');
        }

        const group = reportData[definition.multipleSeriesData.groupName as keyof typeof reportData] || {};

        if (Object.keys(group).length === 0) {
            return { ...chartOptions, series: [] };
        }

        const sortedEntries = Object.entries(group).sort((a, b) => a[0].localeCompare(b[0]));
        const labels = sortedEntries.map(([key, _]) => ChartSeriesLabel[key as keyof typeof ChartSeriesLabel] || key);
        const values = sortedEntries.map(([_, value]) => value);
        const colors = sortedEntries.map(([key, _]) => GroupColors[key as keyof typeof GroupColors] || GroupColors.default);

        return {
            ...chartOptions,
            series: values as number[],
            labels: labels,
            colors: colors,
        };
    }
}
