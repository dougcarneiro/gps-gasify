import { Component, Input, ViewChild } from "@angular/core";
import {
  ApexAxisChartSeries,
  ApexChart,
  ChartComponent,
  ApexDataLabels,
  ApexPlotOptions,
  ApexYAxis,
  ApexAnnotations,
  ApexFill,
  ApexStroke,
  ApexGrid,
  ApexXAxis,
  ApexNonAxisChartSeries,
  ApexTitleSubtitle,
  ApexLegend,
  ApexTooltip,
  ApexMarkers,
  ApexResponsive,
} from "ng-apexcharts";

export type ChartOptions = {
  series: ApexAxisChartSeries | ApexNonAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  yaxis: ApexYAxis;
  xaxis: ApexXAxis;
  annotations: ApexAnnotations;
  fill: ApexFill;
  stroke: ApexStroke;
  grid: ApexGrid;
  labels?: string[];
  title?: ApexTitleSubtitle;
  legend?: ApexLegend;
  tooltip?: ApexTooltip;
  colors?: string[];
  markers?: ApexMarkers;
  responsive?: ApexResponsive[];
};

@Component({
  selector: "app-generic-chart",
  templateUrl: "./generic-chart.component.html",
  standalone: false,
})
export class GenericChartComponent {
  @Input() chartOptions!: Partial<ChartOptions>;
  @ViewChild("chart") chart!: ChartComponent;

  constructor() {}
}
