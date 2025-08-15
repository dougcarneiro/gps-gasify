import { ApexChart, ApexFill, ApexGrid, ApexPlotOptions, ApexStroke, ChartType } from "ng-apexcharts"
import { formatMoney } from "../utils/money.util"


export function getChartType(type: ChartType): ApexChart {
  return {
    height: 300,
    type: type,
    animations: { enabled: false },
    toolbar: {
      show: true,
      tools: {
        download: true,
        selection: true,
        zoom: true,
        zoomin: true,
        zoomout: true,
        reset: true,
      },
    },
    zoom: {
      enabled: false
    },
  }
}

export const barPlotOptionsStyling: ApexPlotOptions = {
  bar: {
    columnWidth: "40%",
    borderRadius: 10,
    horizontal: false,
  },
}

export const areaPlotOptionsStyling: ApexPlotOptions = {
  area: {
    fillTo: "origin",
  }
}


export const defaultGridStyling: ApexGrid = {
  row: {
    colors: ["#fff", "#f2f2f2"]
  }
}

export const barFillStyling: ApexFill = {
  type: "gradient",
  gradient: {
    shade: "light",
    type: "horizontal",
    shadeIntensity: 0.25,
    gradientToColors: undefined,
    inverseColors: true,
    opacityFrom: 0.85,
    opacityTo: 0.85,
    stops: [50, 100]
  },
}

export const defaultStrokeStyling: ApexStroke = {
  width: 3,
  curve: "smooth",
}

export const areaFillStyling: ApexFill = {
  type: "gradient",
  gradient: {
    shadeIntensity: 1,
    inverseColors: false,
    opacityFrom: 0.45,
    opacityTo: 0.05,
    stops: [20, 100, 100]
  },
}

export function getDonutPlotOptionsStyling(isMoneychart: boolean = false): ApexPlotOptions {
  const moneyFormatter = (w: any) => {
    const total = w.globals.seriesTotals.reduce((a: number, b: number) => a + b, 0);
    return formatMoney(total);
  }

  const defaultFormatter = (w: any) => {
    return w.globals.seriesTotals.reduce((a: any, b: any) => {
      return a + b
    }, 0) + '';
  }

  return {
    pie: {
      donut: {
        labels: {
          show: true,
          name: {
            show: true
          },
          value: {
            show: true,
            formatter: (val) => {
              return isMoneychart ? formatMoney(val) : val.toString();
            }
          },
          total: {
            show: true,
            showAlways: false,
            fontWeight: 600,
            fontFamily: 'Roboto, sans-serif',
            formatter: (isMoneychart ? moneyFormatter : defaultFormatter)
          }
        }
      }
    }
  }
}
