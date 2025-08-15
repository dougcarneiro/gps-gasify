import { ChartDataFormatter } from './chart-formatter.interface';
import { ChartOptions } from '../../shared/components/generic-chart/generic-chart.component';
import { RobotResponsesReport } from '../types/report-result';
import { ChartDefinition } from '../types/chart-definition';
import { parseDate } from '../../utils/date.util';

/**
 * Exemplo de formatador personalizado para gráficos de linha
 * Este formatador pode ter lógica específica diferente do AreaChartFormatter
 */
export class LineChartFormatter implements ChartDataFormatter {
    formatData(
        chartOptions: Partial<ChartOptions>,
        reportData: RobotResponsesReport,
        definition: ChartDefinition,
        granularity: string
    ): Partial<ChartOptions> {
        // Lógica específica para gráficos de linha
        const updatedChartOptions = { ...chartOptions };

        // Configurações específicas para linha
        updatedChartOptions.stroke = {
            ...updatedChartOptions.stroke,
            curve: 'smooth',
            width: 3
        };

        // Use a mesma lógica base do area chart mas com configurações específicas
        const results = reportData.results || [];
        const seriesData = [{
            name: definition.seriesDataLabel,
            data: results.map(item => ({
                x: parseDate(item.date).getTime(),
                y: item.count
            }))
        }];

        return {
            ...updatedChartOptions,
            series: seriesData
        };
    }
}
