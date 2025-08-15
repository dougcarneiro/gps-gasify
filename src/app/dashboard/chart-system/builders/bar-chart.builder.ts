import { ChartBuilder } from './chart-builder.interface';
import { ChartOptions } from '../../../shared/components/generic-chart/generic-chart.component';
import {
    getChartType,
    barPlotOptionsStyling,
    defaultGridStyling,
    defaultStrokeStyling,
    barFillStyling
} from '../../chart-styling';
import { formatMoney } from '../../../utils/money.util';

/**
 * Builder para gráficos de barras
 * Responsável por criar as configurações base para gráficos do tipo bar
 */
export class BarChartBuilder implements ChartBuilder {

    getChartType(): string {
        return 'bar';
    }

    buildChartOptions(yAxisTitle: string, isMoneyChart: boolean = false): Partial<ChartOptions> {
        const moneyChartYAxisLabels = {
            formatter: (value: number) => formatMoney(value),
        };

        return {
            series: [],
            chart: getChartType('bar'),
            plotOptions: barPlotOptionsStyling,
            xaxis: {
                type: 'datetime',
                labels: {
                    format: 'dd/MM',
                    showDuplicates: false,
                },
            },
            yaxis: {
                title: { text: yAxisTitle },
                labels: isMoneyChart ? moneyChartYAxisLabels : {}
            },
            stroke: defaultStrokeStyling,
            grid: defaultGridStyling,
            fill: barFillStyling,
        };
    }
}
