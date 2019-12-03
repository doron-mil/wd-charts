import {Injectable} from '@angular/core';
import {NgRedux} from '@angular-redux/store';
import {ActionGenerator} from '../store/actions/action';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private ngRedux: NgRedux<any>) {
  }

  getDataIntoStore(aSymbol: string) {
    this.ngRedux.dispatch(ActionGenerator.getApiData(aSymbol));
  }
}
