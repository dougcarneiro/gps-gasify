import { ChartOptions } from '../../../shared/components/generic-chart/generic-chart.component';

/**
 * Tipos e interfaces para o sistema de gráficos
 */

/**
 * Tipos suportados de gráficos
 */
export type SupportedChartType = 'bar' | 'area' | 'donut' | 'line';

/**
 * Configuração base para criação de gráficos
 */
export interface ChartCreationConfig {
  type: SupportedChartType;
  title: string;
  isMoneyChart?: boolean;
  yAxisTitle?: string;
}

/**
 * Opções avançadas para customização de gráficos
 */
export interface AdvancedChartOptions {
  showLegend?: boolean;
  showToolbar?: boolean;
  enableZoom?: boolean;
  height?: number;
  responsive?: boolean;
  customColors?: string[];
}

/**
 * Interface para configuração completa de um gráfico
 */
export interface CompleteChartConfig extends ChartCreationConfig {
  advanced?: AdvancedChartOptions;
  customOptions?: Partial<ChartOptions>;
}

/**
 * Configurações para diferentes contextos de uso
 */
export interface ChartContext {
  dashboard: 'totals' | 'items' | 'responses' | 'errors' | 'won-value';
  displaySize: 'small' | 'medium' | 'large';
  timeRange: 'day' | 'week' | 'month' | 'year';
}

/**
 * Metadados dos tipos de gráficos
 */
export const CHART_TYPE_METADATA = {
  bar: {
    name: 'Gráfico de Barras',
    description: 'Ideal para comparar valores entre categorias',
    bestFor: ['Comparações categóricas', 'Rankings', 'Distribuições simples'],
    supports: {
      timeSeries: true,
      multiSeries: true,
      monetary: true
    }
  },
  area: {
    name: 'Gráfico de Área',
    description: 'Perfeito para mostrar tendências ao longo do tempo',
    bestFor: ['Tendências temporais', 'Evolução de valores', 'Comparação de volumes'],
    supports: {
      timeSeries: true,
      multiSeries: true,
      monetary: true
    }
  },
  donut: {
    name: 'Gráfico de Rosca',
    description: 'Excelente para mostrar proporções e distribuições',
    bestFor: ['Proporções', 'Distribuições percentuais', 'Composições'],
    supports: {
      timeSeries: false,
      multiSeries: false,
      monetary: true
    }
  },
  line: {
    name: 'Gráfico de Linha',
    description: 'Ótimo para visualizar mudanças contínuas e tendências',
    bestFor: ['Tendências contínuas', 'Comparações temporais', 'Análise de séries'],
    supports: {
      timeSeries: true,
      multiSeries: true,
      monetary: true
    }
  }
} as const;
