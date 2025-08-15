import { ChartOptions } from '../../../shared/components/generic-chart/generic-chart.component';

/**
 * Interface base para builders de gráficos
 * Define o contrato para criação de diferentes tipos de gráficos
 */
export interface ChartBuilder {
  /**
   * Cria as opções base do gráfico sem dados
   * @param yAxisTitle Título do eixo Y
   * @param isMoneyChart Se o gráfico exibe valores monetários
   */
  buildChartOptions(yAxisTitle: string, isMoneyChart?: boolean): Partial<ChartOptions>;

  /**
   * Retorna o tipo do gráfico que este builder constrói
   */
  getChartType(): string;
}
