import {Component, OnInit} from '@angular/core';
import {ChartDataSets, ChartOptions} from 'chart.js';
import {Color, Label} from 'ng2-charts';
import * as pluginAnnotations from 'chartjs-plugin-annotation';
import * as _ from 'lodash';
import {BaseComponent} from '../../shared/baseComponent';
import {NgRedux} from '@angular-redux/store';
import {PageAction, PageEnum, PageMetaData} from '../../model/innerData.model';
import {ActionGenerator} from '../../store/actions/action';
import {StoreDataTypeEnum} from '../../store/storeDataTypeEnum';
import {takeUntil} from 'rxjs/operators';

@Component({
  selector: 'app-charts-ng2-page',
  templateUrl: './charts-ng2-page.component.html',
  styleUrls: ['./charts-ng2-page.component.scss']
})
export class ChartsNg2PageComponent extends BaseComponent {
  public lineChartPlugins = [pluginAnnotations];
  public lineChartData: ChartDataSets[] = [
    {
      data: [65, 59, 80, 81, 56, 55, 40],
      label: 'Series A',
      lineTension: 0,
      fill: false,
      pointBorderWidth: 4,
      pointRadius: 8,
      // pointBackgroundColor: 'yellow',
      pointBorderColor: 'black',
    },
  ];

  // lineTension: 0,
  public colorsArray: string[] = [];
  public lineChartLabels: Label[] = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
  public lineChartOptions: (ChartOptions & { annotation: any }) = {
    responsive: true,
    scales: {
      // We use this empty structure as a placeholder for dynamic theming.
      xAxes: [{}],
      yAxes: [
        {
          id: 'y-axis-0',
          position: 'left',
        },
        {
          id: 'y-axis-1',
          position: 'right',
          gridLines: {
            color: 'rgba(255,0,0,0.3)',
          },
          ticks: {
            fontColor: 'red',
          }
        }
      ]
    },
    annotation: {
      annotations: [
        {
          type: 'line',
          mode: 'horizontal',
          scaleID: 'y-axis-0',
          value: '55',
          borderColor: 'orange',
          borderWidth: 8,
          label: {
            backgroundColor: 'white',
            enabled: true,
            position: 'right',
            yAdjust: -20,
            fontColor: 'blue',
            content: 'Threshold'
          }
        },
      ],
    },
  };
  public lineChartColors: Color[] = [
    {
      pointBackgroundColor: ['yellow', 'red', 'blue'],
      borderColor: 'gray',
      backgroundColor: 'rgba(255,0,0,0.3)',
    },
  ];
  public lineChartLegend = true;
  public lineChartType = 'line';

  constructor(private ngRedux: NgRedux<any>) {
    super();

    this.lineChartData[0].data = [];
    this.lineChartLabels = [];
    this.colorsArray = [];
    this.lineChartColors[0].pointBackgroundColor = [];

    Array(100).fill(null).forEach((val, i) => {
      this.lineChartLabels.push(`${i}`);
      const random = _.random(100);
      // this.colorsArray.push( random > 50 ? 'black' : 'red');
      this.colorsArray.push(random > 50 ? 'yellow' : 'red');
      (this.lineChartColors[0].pointBackgroundColor as Array<string>).push(random > 50 ? 'yellow' : 'red');
      this.lineChartData[0].data.push(random);
    });

  }

  protected listenForUpdates() {
    this.ngRedux.select<any>([StoreDataTypeEnum.DYNAMIC_DATA, 'apiData', 'Monthly Time Series'])
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((monthlyTimeSeries: any) => {
        const dataArray = [];
        Object.entries(monthlyTimeSeries).forEach(entry => {
          const tokenizeDArray = entry[0].split('-');
          const key = {m: tokenizeDArray[1], y: tokenizeDArray[0]};
          const value = _.get(entry[1], '2. high');
          dataArray.push({key, value});
        });
        console.log('3333', dataArray);
      });
  }

  protected hookOnInit() {
    const pageData: PageMetaData = {
      name: `Charts Ng2 Page`,
      page: PageEnum.CHARTS_NG2,
      actions: []
    };
    this.ngRedux.dispatch(ActionGenerator.currentPageChanged(pageData));
  }
}
