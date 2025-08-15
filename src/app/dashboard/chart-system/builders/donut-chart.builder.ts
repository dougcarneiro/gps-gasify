import { ChartBuilder } from './chart-builder.interface';
import { ChartOptions } from '../../../shared/components/generic-chart/generic-chart.component';
import {
    getChartType,
    getDonutPlotOptionsStyling,
    defaultGridStyling,
    defaultStrokeStyling,
    barFillStyling
} from '../../chart-styling';

/**
 * Builder para gráficos de rosca (donut)
 * Responsável por criar as configurações base para gráficos do tipo donut
 */
export class DonutChartBuilder implements ChartBuilder {

    getChartType(): string {
        return 'donut';
    }

    buildChartOptions(yAxisTitle: string, isMoneyChart: boolean = false): Partial<ChartOptions> {
        return {
            chart: getChartType('donut'),
            series: [],
            labels: [],
            colors: [],
            plotOptions: getDonutPlotOptionsStyling(isMoneyChart),
            yaxis: { title: { text: yAxisTitle } },
            stroke: defaultStrokeStyling,
            grid: defaultGridStyling,
            fill: barFillStyling,
            legend: {
                position: "bottom",
                horizontalAlign: "center",
            },
            responsive: [
                {
                    breakpoint: 480,
                    options: {
                        chart: {
                            // width: 200
                        },
                        legend: {
                            position: "bottom"
                        }
                    }
                }
            ]
        };
    }
}
