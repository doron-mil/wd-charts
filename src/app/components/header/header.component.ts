import {Component} from '@angular/core';
import {NgRedux} from '@angular-redux/store';
import {Router} from '@angular/router';

import {takeUntil} from 'rxjs/operators';

import {BaseComponent} from '../../shared/baseComponent';
import {PageAction, PageMetaData} from '../../model/innerData.model';
import {StoreDataTypeEnum} from '../../store/storeDataTypeEnum';
import {ActionGenerator} from '../../store/actions/action';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent extends BaseComponent {

  pageData: PageMetaData = new PageMetaData();

  constructor(protected ngRedux: NgRedux<any>,
              protected router: Router) {
    super();
  }

  listenForUpdates() {
    this.ngRedux.select<PageMetaData>([StoreDataTypeEnum.INNER_DATA, 'pageData'])
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((pageMetaData: PageMetaData) => {
        if (pageMetaData) {
          this.pageData = pageMetaData;
        } else {
          this.pageData = new PageMetaData();
        }
      });
  }

  goCategories() {
    this.router.navigate(['categoriesList']);
  }

  goMain() {
    this.router.navigate(['mainPage']);
  }

  getPageDataActions() {
    return this.pageData.actions;
  }

  isPage(aPage: string): boolean {
    return this.pageData ? (this.pageData.page === aPage) : false;
  }

  activateAction(aPageAction: PageAction) {

    if (aPageAction.page !== this.pageData.page) {
      this.router.navigate([aPageAction.page]);
    }

    this.ngRedux.dispatch(ActionGenerator.emitPageAction(aPageAction));
  }

  saveStore() {
    this.ngRedux.dispatch(ActionGenerator.saveStore());
  }
}
