import { ChartBuilderFactory } from '../builders/chart-builder.factory';
import { ChartOptions } from '../../../shared/components/generic-chart/generic-chart.component';

/**
 * Configurações predefinidas para gráficos comuns
 * Facilita a criação de gráficos com configurações padrão
 */
export class CustomChartService {
  /**
   * Cria um gráfico personalizado baseado no tipo e se é monetário
   * @param chartType Tipo do gráfico (bar, area, donut, line)
   * @param yAxisTitle Título do eixo Y
   * @param isMoneyChart Se o gráfico exibe valores monetários
   */
  static createCustomChart(chartType: string, yAxisTitle: string, isMoneyChart: boolean = false): Partial<ChartOptions> {
    const builder = ChartBuilderFactory.getBuilder(chartType);
    return builder.buildChartOptions(yAxisTitle, isMoneyChart);
  }
}
