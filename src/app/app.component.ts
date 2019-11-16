import {Component} from '@angular/core';
import {NgRedux} from '@angular-redux/store';

import {BaseComponent} from './shared/baseComponent';
import {ActionGenerator} from './store/actions/action';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent extends BaseComponent {


  constructor(protected ngRedux: NgRedux<any>) {
    super();
  }

  hookOnInit() {
    this.ngRedux.dispatch(ActionGenerator.restoreStore());
  }

}
