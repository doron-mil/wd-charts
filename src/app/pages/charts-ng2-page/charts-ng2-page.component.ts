import {Component, ViewChild} from '@angular/core';
import {NgRedux} from '@angular-redux/store';
import {debounceTime, filter, last, takeUntil} from 'rxjs/operators';

import * as _ from 'lodash';
import * as moment from 'moment';

import {BaseComponent} from '../../shared/baseComponent';
import {PageEnum, PageMetaData, SymbolRecord} from '../../model/innerData.model';
import {ActionGenerator} from '../../store/actions/action';
import {StoreDataTypeEnum} from '../../store/storeDataTypeEnum';
import {DataService} from '../../services/data.service';
import {Observable, Subject} from 'rxjs';
import {MatSelectChange} from '@angular/material/select';
import {ChartsProperties} from './charts-properties';
import {FormControl} from '@angular/forms';
import {MatAutocomplete, MatAutocompleteSelectedEvent} from '@angular/material/autocomplete';

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

  @ViewChild(MatAutocomplete, {static: true}) symbolAutoControl: MatAutocomplete;

  symbolControl = new FormControl();
  filteredSymbolsOptions: Observable<SymbolRecord[]>;
  lastSelectedSymbol: string;
  selectedSymbol: SymbolRecord;

  dataArray: IDataElement[];
  threshold: number;
  thresholdObservable = new Subject<number>();

  displayThreshold = true;
  minValue: number;
  maxValue: number;

  endDate: Date = moment().endOf('month').toDate();
  minDate: Date;
  maxDate: Date;

  itemsCount4Display = 20;
  itemsCount4DisplayOptions = [20, 40, 60, 80, 100];


  chartsProperties = new ChartsProperties();


  constructor(private ngRedux: NgRedux<any>, private dataService: DataService) {
    super();
  }

  protected listenForUpdates() {
    this.symbolControl.valueChanges
      .pipe(
        takeUntil(this.onDestroy$)
      )
      .subscribe((value => {
        setTimeout(() => {
          if (value !== this.lastSelectedSymbol) {
            this.ngRedux.dispatch(ActionGenerator.getApiSymbolsData(value));
          }
        });
      }));

    this.ngRedux.select<any>([StoreDataTypeEnum.DYNAMIC_DATA, 'apiData', 'Monthly Time Series'])
      .pipe(
        takeUntil(this.onDestroy$),
        filter(monthlyTimeSeries => !!monthlyTimeSeries)
      )
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

    this.ngRedux.select<SymbolRecord>([StoreDataTypeEnum.DYNAMIC_DATA, 'selectedSymbol'])
      .pipe(
        takeUntil(this.onDestroy$),
        filter(symbolRecord => !!symbolRecord)
      ).subscribe((symbolRecord: SymbolRecord) => {
      this.selectedSymbol = symbolRecord;
      this.symbolControl.setValue({symbol: symbolRecord.symbol});
    });

    this.filteredSymbolsOptions = this.ngRedux.select<SymbolRecord[]>([StoreDataTypeEnum.INNER_DATA, 'symbols'])
      .pipe(takeUntil(this.onDestroy$));

    this.thresholdObservable.pipe(
      takeUntil(this.onDestroy$),
      debounceTime(1000)
    ).subscribe((thresholdValue) => {
      this.postBuildChartAccordingToData();
      this.refreshThresholdLine();
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

    this.chartsProperties.lineChartData[0].data = [];
    this.chartsProperties.lineChartLabels = [];

    this.minValue = Number.MAX_VALUE;
    this.maxValue = 0;

    const endMoment = moment(this.endDate);
    let counter = 0;

    this.dataArray.every((dataElement) => {
      const elementMoment = moment(dataElement.key, MONTH_YEAR_FORMAT);
      if (elementMoment.isAfter(endMoment)) {
        return true;
      }
      this.chartsProperties.lineChartLabels.unshift(dataElement.key);
      const value = dataElement.value;
      this.chartsProperties.lineChartData[0].data.unshift(value);
      this.minValue = Math.min(this.minValue, value);
      this.maxValue = Math.max(this.maxValue, value);
      counter++;
      return counter < this.itemsCount4Display;
    });

    this.threshold = (this.minValue + this.maxValue) / 2;

    this.postBuildChartAccordingToData();
    this.displayThresholdChanged();
  }

  private postBuildChartAccordingToData() {
    this.chartsProperties.lineChartOptions.annotation.annotations[0].value = this.threshold;
    const formattedThreshold = Math.round(this.threshold * 10) / 10;
    this.chartsProperties.lineChartOptions.annotation.annotations[0].label.content = `Threshold (${formattedThreshold})`;

    this.chartsProperties.lineChartColors[0].pointBackgroundColor = [];
    this.chartsProperties.lineChartData[0].data.forEach(value => {
      (this.chartsProperties.lineChartColors[0].pointBackgroundColor as Array<string>).push(value > this.threshold ? 'yellow' : 'red');
    });
  }

  displayThresholdChanged(aIsDisplayed: boolean = this.displayThreshold) {
    if (aIsDisplayed) {
      this.chartsProperties.lineChartOptions.annotation.annotations.push(this.chartsProperties.thresholdAnnotation);
    } else {
      this.chartsProperties.lineChartOptions.annotation.annotations = [];
    }

    this.refreshThresholdLine();

  }

  thresholdChanged(aNewThresholdValue: number) {
    this.thresholdObservable.next(aNewThresholdValue);
  }

  private refreshThresholdLine() {
    this.chartsProperties.lineChartOptions = {...this.chartsProperties.lineChartOptions};
  }

  pickMonth(aMontDate: Date) {
    const compMoment = moment(aMontDate).endOf('month');
    this.endDate = compMoment.toDate();

    setTimeout(() => this.buildChartData());
  }

  onItemsCount4DisplayChange($event: MatSelectChange) {
    setTimeout(() => this.buildChartData());
  }

  symbolSelected(aAutocompleteEvent: MatAutocompleteSelectedEvent) {
    this.selectedSymbol = aAutocompleteEvent.option.value as SymbolRecord;
    this.lastSelectedSymbol = this.selectedSymbol.symbol;

    this.ngRedux.dispatch(ActionGenerator.setSelectedSymbol(this.selectedSymbol));

    this.getApiData();
  }

  displayFn(aSymbolRecord?: SymbolRecord): string | undefined {
    return aSymbolRecord ? aSymbolRecord.symbol : undefined;
  }

  symbolSelected2($event: boolean) {
    this.lastSelectedSymbol = '';
  }

  getApiData() {
    if (this.lastSelectedSymbol) {
      this.dataService.getDataIntoStore(this.lastSelectedSymbol);
    }
  }
}
