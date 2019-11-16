import {Component} from '@angular/core';
import {NgRedux} from '@angular-redux/store';
import {StoreDataTypeEnum} from '../../../store/storeDataTypeEnum';
import {ActionGenerator} from '../../../store/actions/action';
import {PageAction, PageActionEnum, PageEnum, PageMetaData} from '../../../model/innerData.model';
import {BaseComponent} from '../../../shared/baseComponent';
import {takeUntil} from 'rxjs/operators';

const availableActions = {
  createAction: {
    title: 'Create',
    icon: 'add',
    page: PageEnum.CATEGORY_CREATE,
    action: PageActionEnum.CREATE
  },

  deleteAction: {
    title: 'Delete',
    icon: 'delete',
    page: PageEnum.CATEGORIES_LIST,
    action: PageActionEnum.DELETE
  },

  viewAction: {
    title: 'Edit',
    icon: 'edit',
    page: PageEnum.CATEGORY_EDIT,
    action: PageActionEnum.EDIT
  },

  editAction: {
    title: 'View',
    icon: 'details',
    page: PageEnum.CATEGORY_VIEW,
    action: PageActionEnum.VIEW
  },
};

@Component({
  selector: 'app-categories-list',
  templateUrl: './categories-list.component.html',
  styleUrls: ['./categories-list.component.scss']
})
export class CategoriesListComponent extends BaseComponent {

  categories: string[];
  selectedCategory: string;

  constructor(private ngRedux: NgRedux<any>) {
    super();
  }

  hookOnInit() {
    // Setting the initial data for the header
    const pageData: PageMetaData = {
      name: 'Categories - List',
      page: PageEnum.CATEGORIES_LIST,
      actions: [availableActions.createAction]
    };
    this.ngRedux.dispatch(ActionGenerator.currentPageChanged(pageData));
  }

  listenForUpdates() {
    this.ngRedux.select<string[]>([StoreDataTypeEnum.STATIC_DATA, 'categories']).subscribe((categoriesArray) => {
      this.categories = categoriesArray;
    });

    this.ngRedux.select<PageAction>([StoreDataTypeEnum.INNER_DATA, 'lastEmittedAction'])
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((pageAction: PageAction) => {
        if (pageAction && pageAction.page === PageEnum.CATEGORIES_LIST && pageAction.action === PageActionEnum.DELETE && this.selectedCategory) {
          this.ngRedux.dispatch(ActionGenerator.deleteCategory(this.selectedCategory));
        }
      });
  }

  categoryWasSelected(aSelectedCategory: string) {
    if (!this.selectedCategory && aSelectedCategory) {
      const allEvents = Object.values(availableActions);
      this.ngRedux.dispatch(ActionGenerator.updateActionsForPage(allEvents));
    }
    this.selectedCategory = aSelectedCategory;
    this.ngRedux.dispatch(ActionGenerator.categoryWasSelected(this.selectedCategory));
  }
}
