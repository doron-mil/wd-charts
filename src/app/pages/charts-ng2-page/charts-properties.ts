import {ChartDataSets, ChartOptions} from 'chart.js';

import * as pluginAnnotations from 'chartjs-plugin-annotation';
import {Color, Label} from 'ng2-charts';

export class ChartsProperties {
  lineChartType = 'line';
  lineChartLegend = false;
  colorsArray: string[] = [];
  lineChartPlugins = [pluginAnnotations];

  lineChartLabels: Label[] = [];

  lineChartColors: Color[] = [
    {
      pointBackgroundColor: ['yellow', 'red', 'blue'],
      borderColor: 'gray',
      backgroundColor: 'rgba(255,0,0,0.3)',
    },
  ];

  lineChartData: ChartDataSets[] = [
    {
      data: [],
      label: 'Series A',
      lineTension: 0,
      fill: false,
      pointBorderWidth: 4,
      pointRadius: 8,
      // pointBackgroundColor: 'yellow',
      pointBorderColor: 'black',
    },
  ];

  thresholdAnnotation = {
    type: 'line',
    mode: 'horizontal',
    scaleID: 'y-axis-0',
    value: '55',
    borderColor: 'orange',
    borderDash: [4, 2],
    borderWidth: 2,
    label: {
      backgroundColor: 'white',
      enabled: true,
      position: 'right',
      yAdjust: -20,
      fontColor: 'blue',
      content: 'Threshold'
    },
    // onMouseover: (e) => console.log(e),
  };

  lineChartOptions: (ChartOptions & { annotation: any }) = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      // We use this empty structure as a placeholder for dynamic theming.
      xAxes: [{
        ticks: {
          autoSkip: false,
          maxRotation: 90,
          minRotation: 90
        }
      }],
      yAxes: [
        {
          id: 'y-axis-0',
          position: 'left',
        },
        // {
        //   id: 'y-axis-1',
        //   position: 'right',
        //   gridLines: {
        //     color: 'rgba(255,0,0,0.3)',
        //   },
        //   ticks: {
        //     fontColor: 'red',
        //   }
        // }
      ]
    },
    annotation: {
      events: ['mouseover'],
      annotations: [
        this.thresholdAnnotation
      ],
    },
  };


}
