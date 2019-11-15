import {Component} from '@angular/core';
import {NgRedux} from '@angular-redux/store';
import {ActionGenerator} from './store/actions/action';
import {StoreDataTypeEnum} from './store/storeDataTypeEnum';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'welldone';
  data: any;


  constructor(private ngRedux: NgRedux<any>) {
    this.ngRedux.select([StoreDataTypeEnum.STATIC_DATA, 'data']).subscribe((ddd) => {
      console.log( ddd)
      this.data = ddd;
    });
  }

  doNothing() {
    this.ngRedux.dispatch(ActionGenerator.setBasicData(4));
  }
}
