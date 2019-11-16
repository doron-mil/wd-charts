import {Component} from '@angular/core';
import {NgRedux} from '@angular-redux/store';

import {PageEnum, PageMetaData} from '../../model/innerData.model';
import {BaseComponent} from '../../shared/baseComponent';
import {ActionGenerator} from '../../store/actions/action';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss']
})
export class MainPageComponent extends BaseComponent {

  constructor(private ngRedux: NgRedux<any>) {
    super();
  }

  protected hookOnInit() {
    super.hookOnInit();

    const pageData: PageMetaData = {
      name: `Main Page`,
      page: PageEnum.MAIN_PAGE,
      actions: []
    };
    this.ngRedux.dispatch(ActionGenerator.currentPageChanged(pageData));
  }
}
