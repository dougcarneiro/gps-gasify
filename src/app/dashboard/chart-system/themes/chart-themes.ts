/**
 * Temas de cores para gráficos
 *
 * Este arquivo documenta os temas de cores disponíveis no sistema de gráficos.
 * As cores são definidas no enum GroupColors e podem ser personalizadas conforme necessário.
 *
 * Principais características dos temas:
 *
 * 1. Cores para Grupos de Dados:
 *    - Definidas no enum GroupColors (chart-colors.enum.ts)
 *    - Aplicadas automaticamente aos formatters
 *    - Consistentes em todos os tipos de gráficos
 *
 * 2. Gradientes e Preenchimentos:
 *    - barFillStyling: Gradiente horizontal para gráficos de barra
 *    - areaFillStyling: Gradiente vertical para gráficos de área
 *    - Configurados no chart-styling.ts
 *
 * 3. Estilos de Linha e Contorno:
 *    - defaultStrokeStyling: Configurações padrão para linhas
 *    - Largura, curvatura e suavização personalizáveis
 *
 * 4. Grade e Layout:
 *    - defaultGridStyling: Cores alternadas para melhor legibilidade
 *    - Configurações responsivas para diferentes tamanhos de tela
 *
 * Para personalizar temas:
 * 1. Modifique as cores no enum GroupColors
 * 2. Ajuste os gradientes no chart-styling.ts
 * 3. Use os builders para aplicar temas consistentemente
 */

export const CHART_THEMES = {
  DEFAULT: 'default',
  CORPORATE: 'corporate',
  VIBRANT: 'vibrant',
  MINIMAL: 'minimal'
} as const;

export type ChartTheme = typeof CHART_THEMES[keyof typeof CHART_THEMES];

/**
 * Metadados dos temas disponíveis
 */
export const THEME_METADATA = {
  [CHART_THEMES.DEFAULT]: {
    name: 'Padrão',
    description: 'Tema padrão com cores balanceadas e profissionais',
    primaryColors: ['#008FFB', '#00E396', '#FEB019', '#FF4560', '#775DD0']
  },
  [CHART_THEMES.CORPORATE]: {
    name: 'Corporativo',
    description: 'Cores sóbrias e profissionais para apresentações empresariais',
    primaryColors: ['#2E3440', '#3B4252', '#434C5E', '#4C566A', '#5E81AC']
  },
  [CHART_THEMES.VIBRANT]: {
    name: 'Vibrante',
    description: 'Cores vivas e chamativas para dashboards interativos',
    primaryColors: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7']
  },
  [CHART_THEMES.MINIMAL]: {
    name: 'Minimalista',
    description: 'Cores suaves e clean para interfaces modernas',
    primaryColors: ['#6C7B7F', '#9B9B9B', '#C4C4C4', '#E8E8E8', '#F5F5F5']
  }
};
