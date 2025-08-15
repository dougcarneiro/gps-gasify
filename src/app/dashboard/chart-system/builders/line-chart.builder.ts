import { ChartBuilder } from './chart-builder.interface';
import { ChartOptions } from '../../../shared/components/generic-chart/generic-chart.component';
import {
    getChartType,
    defaultGridStyling,
    defaultStrokeStyling,
    areaFillStyling
} from '../../chart-styling';
import { formatMoney } from '../../../utils/money.util';

/**
 * Builder para gráficos de linha
 * Responsável por criar as configurações base para gráficos do tipo line
 * Similar ao AreaChartBuilder mas com configurações específicas para linhas
 */
export class LineChartBuilder implements ChartBuilder {

    getChartType(): string {
        return 'line';
    }

    buildChartOptions(yAxisTitle: string, isMoneyChart: boolean = false): Partial<ChartOptions> {
        const moneyChartYAxisLabels = {
            formatter: (value: number) => formatMoney(value),
        };

        return {
            series: [],
            chart: getChartType('line'),
            plotOptions: {}, // Line charts don't need specific plot options
            xaxis: {
                tooltip: { enabled: false },
                type: 'datetime',
                labels: {
                    show: true,
                    format: 'dd/MM',
                    showDuplicates: false,
                    datetimeUTC: false,
                },
            },
            yaxis: {
                title: { text: yAxisTitle },
                labels: isMoneyChart ? moneyChartYAxisLabels : {}
            },
            stroke: {
                ...defaultStrokeStyling,
                curve: 'smooth',
                width: 3
            },
            grid: defaultGridStyling,
            fill: areaFillStyling,
            dataLabels: {
                formatter: (value: number) => isMoneyChart ? formatMoney(value) : value.toString(),
            },
            tooltip: {
                shared: true,
                intersect: false,
                y: {
                    formatter: (value: number) => isMoneyChart ? formatMoney(value) : value.toString(),
                }
            }
        };
    }
}
