import {Component} from '@angular/core';
import {NgRedux} from '@angular-redux/store';
import {debounceTime, takeUntil} from 'rxjs/operators';

import * as _ from 'lodash';
import * as moment from 'moment';

import {Color, Label} from 'ng2-charts';
import {ChartDataSets, ChartOptions} from 'chart.js';
import * as pluginAnnotations from 'chartjs-plugin-annotation';

import {BaseComponent} from '../../shared/baseComponent';
import {PageEnum, PageMetaData} from '../../model/innerData.model';
import {ActionGenerator} from '../../store/actions/action';
import {StoreDataTypeEnum} from '../../store/storeDataTypeEnum';
import {DataService} from '../../services/data.service';
import {Subject} from 'rxjs';

interface IDataElement {
  key: string;
  value: number;
}

const MONTH_YEAR_FORMAT = 'MM/YY';

@Component({
  selector: 'app-charts-ng2-page',
  templateUrl: './charts-ng2-page.component.html',
  styleUrls: ['./charts-ng2-page.component.scss']
})
export class ChartsNg2PageComponent extends BaseComponent {

  dataArray: IDataElement[];
  threshold: number;
  thresholdObservable = new Subject<number>();

  displayThreshold = true;
  minValue: number;
  maxValue: number;

  endDate: Date = moment().endOf('month').toDate();
  minDate: Date;
  maxDate: Date;

  public lineChartPlugins = [pluginAnnotations];
  public lineChartData: ChartDataSets[] = [
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

  // lineTension: 0,
  public colorsArray: string[] = [];
  public lineChartLabels: Label[] = [];
  public thresholdAnnotation = {
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
  public lineChartOptions: (ChartOptions & { annotation: any }) = {
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
  public lineChartColors: Color[] = [
    {
      pointBackgroundColor: ['yellow', 'red', 'blue'],
      borderColor: 'gray',
      backgroundColor: 'rgba(255,0,0,0.3)',
    },
  ];
  public lineChartLegend = false;
  public lineChartType = 'line';


  constructor(private ngRedux: NgRedux<any>, private dataService: DataService) {
    super();
  }

  protected listenForUpdates() {
    this.ngRedux.select<any>([StoreDataTypeEnum.DYNAMIC_DATA, 'apiData', 'Monthly Time Series'])
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((monthlyTimeSeries: any) => {
        this.dataArray = [];
        let minMoment = moment('3000', 'YYYY');
        let maxMoment = moment(0);
        Object.entries(monthlyTimeSeries).forEach(entry => {
          const entryMoment = moment(entry[0], 'YYYY-MM-DD');
          maxMoment = moment.max(entryMoment, maxMoment);
          minMoment = moment.min(entryMoment, minMoment);
          const key = entryMoment.format(MONTH_YEAR_FORMAT);
          const value = _.toNumber(_.get(entry[1], '2. high'));
          this.dataArray.push({key, value});
        });
        minMoment.startOf('month');
        maxMoment.endOf('month');
        this.minDate = minMoment.toDate();
        this.maxDate = maxMoment.toDate();

        this.buildChartData();
      });

    this.thresholdObservable.pipe(
      takeUntil(this.onDestroy$),
      debounceTime(1000)
    ).subscribe((thresholdValue) => {
      this.postBuildChartAccordingToData();
      this.refreshTresholdLine();
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

  private buildChartData() {
    if (!this.dataArray || this.dataArray.length <= 0) {
      console.error('No Data to show');
      return;
    }

    this.lineChartData[0].data = [];
    this.lineChartLabels = [];

    const itemsCount4Display = 20;
    this.minValue = Number.MAX_VALUE;
    this.maxValue = 0;

    const endMoment = moment(this.endDate);
    let counter = 0;

    this.dataArray.every((dataElement) => {
      const elementMoment = moment(dataElement.key, MONTH_YEAR_FORMAT);
      if (elementMoment.isAfter(endMoment)) {
        return true;
      }
      this.lineChartLabels.unshift(dataElement.key);
      const value = dataElement.value;
      this.lineChartData[0].data.unshift(value);
      this.minValue = Math.min(this.minValue, value);
      this.maxValue = Math.max(this.maxValue, value);
      counter++;
      return counter < itemsCount4Display;
    });

    this.threshold = (this.minValue + this.maxValue) / 2;

    this.postBuildChartAccordingToData();
    this.displayThresholdChanged();
  }

  private postBuildChartAccordingToData() {
    this.lineChartOptions.annotation.annotations[0].value = this.threshold;
    const formattedThreshold = Math.round(this.threshold * 10) / 10;
    this.lineChartOptions.annotation.annotations[0].label.content = `Threshold (${formattedThreshold})`;

    this.lineChartColors[0].pointBackgroundColor = [];
    this.lineChartData[0].data.forEach(value => {
      (this.lineChartColors[0].pointBackgroundColor as Array<string>).push(value > this.threshold ? 'yellow' : 'red');
    });
  }

  getApiData() {
    this.dataService.getDataIntoStore();
  }

  displayThresholdChanged(aIsDisplayed: boolean = this.displayThreshold) {
    if (aIsDisplayed) {
      this.lineChartOptions.annotation.annotations.push(this.thresholdAnnotation);
    } else {
      this.lineChartOptions.annotation.annotations = [];
    }

    this.refreshTresholdLine();

  }

  thresholdChanged(aNewThresholdValue: number) {
    this.thresholdObservable.next(aNewThresholdValue);
    // console.log('1111', aNewThresholdValue);
  }

  private refreshTresholdLine() {
    this.lineChartOptions = {...this.lineChartOptions};
  }

  pickMonth(aMontDate: Date) {
    const compMoment = moment(aMontDate).endOf('month');
    this.endDate = compMoment.toDate();

    setTimeout(() => this.buildChartData());
  }

}
