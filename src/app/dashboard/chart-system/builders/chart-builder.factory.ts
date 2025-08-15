import { ChartBuilder } from './chart-builder.interface';
import { BarChartBuilder } from './bar-chart.builder';
import { AreaChartBuilder } from './area-chart.builder';
import { DonutChartBuilder } from './donut-chart.builder';
import { LineChartBuilder } from './line-chart.builder';

/**
 * Factory para criação de builders de gráficos
 * Centraliza a criação de diferentes tipos de builders para gráficos
 */
export class ChartBuilderFactory {
    private static builders: Map<string, ChartBuilder> = new Map([
        ['bar', new BarChartBuilder()],
        ['area', new AreaChartBuilder()],
        ['donut', new DonutChartBuilder()],
        ['line', new LineChartBuilder()],
    ]);

    /**
     * Obtém um builder para o tipo de gráfico especificado
     * @param chartType Tipo do gráfico (bar, area, donut, line)
     * @returns Builder correspondente ao tipo de gráfico
     */
    static getBuilder(chartType: string): ChartBuilder {
        const builder = this.builders.get(chartType);
        if (!builder) {
            throw new Error(`Nenhum builder encontrado para o tipo de gráfico: ${chartType}`);
        }
        return builder;
    }

    /**
     * Registra um novo builder para um tipo de gráfico
     * @param chartType Tipo do gráfico
     * @param builder Instância do builder
     */
    static registerBuilder(chartType: string, builder: ChartBuilder): void {
        this.builders.set(chartType, builder);
    }

    /**
     * Lista todos os tipos de gráficos disponíveis
     * @returns Array com os tipos de gráficos suportados
     */
    static getAvailableChartTypes(): string[] {
        return Array.from(this.builders.keys());
    }
}
