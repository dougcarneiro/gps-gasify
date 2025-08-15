import { ChartBuilder } from './chart-builder.interface';
import { ChartOptions } from '../../../shared/components/generic-chart/generic-chart.component';
import {
    getChartType,
    areaPlotOptionsStyling,
    defaultGridStyling,
    defaultStrokeStyling,
    areaFillStyling
} from '../../chart-styling';
import { formatMoney } from '../../../utils/money.util';

/**
 * Builder para gráficos de área
 * Responsável por criar as configurações base para gráficos do tipo area
 */
export class AreaChartBuilder implements ChartBuilder {

    getChartType(): string {
        return 'area';
    }

    buildChartOptions(yAxisTitle: string, isMoneyChart: boolean = false): Partial<ChartOptions> {
        const moneyChartYAxisLabels = {
            formatter: (value: number) => formatMoney(value),
        };

        return {
            series: [],
            chart: getChartType('area'),
            plotOptions: areaPlotOptionsStyling,
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
            stroke: defaultStrokeStyling,
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
