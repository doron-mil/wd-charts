import {Injectable} from '@angular/core';
import {NgRedux} from '@angular-redux/store';
import {ActionGenerator} from '../store/actions/action';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private ngRedux: NgRedux<any>) {
  }

  getDataIntoStore() {
    console.log( 'mmmm')
    this.ngRedux.dispatch(ActionGenerator.getApiData());
  }
}
