import { ChartDataFormatter } from './chart-formatter.interface';
import { BarChartFormatter } from './bar-chart-formatter';
import { DonutChartFormatter } from './donut-chart-formatter';
import { AreaChartFormatter } from './area-chart-formatter';

export class ChartFormatterFactory {
  private static formatters: Map<string, ChartDataFormatter> = new Map([
    ['bar', new BarChartFormatter()],
    ['donut', new DonutChartFormatter()],
    ['area', new AreaChartFormatter()],
    ['line', new AreaChartFormatter()], // Line charts can use the same formatter as area
  ]);

  static getFormatter(chartType: string): ChartDataFormatter {
    const formatter = this.formatters.get(chartType);
    if (!formatter) {
      throw new Error(`No formatter found for chart type: ${chartType}`);
    }
    return formatter;
  }

  static registerFormatter(chartType: string, formatter: ChartDataFormatter): void {
    this.formatters.set(chartType, formatter);
  }
}
