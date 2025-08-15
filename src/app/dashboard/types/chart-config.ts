import { ChartOptions } from "../../shared/components/generic-chart/generic-chart.component";
import { ChartDefinition, ToggleSlideConfig } from "./chart-definition";

export interface DashboardChartConfig {
  title: string;
  chartOptions: Partial<ChartOptions>;
  toggleSlide?: ToggleSlideConfig[];
  totalDisplay?: string;
  isLoaded?: boolean;
  definition: ChartDefinition;
  failedLoad?: boolean;
  wonItems?: boolean;
  includeCopilotEmails?: boolean;
  noDataFound?: boolean;
}
