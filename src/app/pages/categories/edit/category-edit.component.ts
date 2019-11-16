import {Component} from '@angular/core';
import {NgRedux} from '@angular-redux/store';
import {Router} from '@angular/router';
import {BaseComponent} from '../../../shared/baseComponent';
import {PageAction, PageActionEnum, PageEnum, PageMetaData} from '../../../model/innerData.model';
import {StoreDataTypeEnum} from '../../../store/storeDataTypeEnum';
import {takeUntil} from 'rxjs/operators';
import {ActionGenerator} from '../../../store/actions/action';

const availableActions = {
  cancelAction: {
    title: 'Cancel',
    icon: 'cancel',
    page: PageEnum.CATEGORIES_LIST,
    action: PageActionEnum.VIEW
  },
};

const subtitleObjMap: { [key: string]: string } = {};
subtitleObjMap[PageActionEnum.CREATE] = 'Create';
subtitleObjMap[PageActionEnum.VIEW] = 'View';
subtitleObjMap[PageActionEnum.EDIT] = 'Edit';

@Component({
  selector: 'app-category-edit',
  templateUrl: './category-edit.component.html',
  styleUrls: ['./category-edit.component.scss']
})
export class CategoryEditComponent extends BaseComponent {

  currentAction: PageAction;

  categoryValue: string;
  originalCategoryValue: string;

  availableCategories: string[] = [];
  categoryExists: boolean;

  constructor(private ngRedux: NgRedux<any>,
              private router: Router) {
    super();
  }

  listenForUpdates() {
    this.ngRedux.select<PageAction>([StoreDataTypeEnum.INNER_DATA, 'lastEmittedAction'])
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((pageAction: PageAction) => {
        this.currentAction = pageAction;

        if (pageAction && pageAction.action === PageActionEnum.CREATE) {
          this.categoryValue = '';
          this.ngRedux.dispatch(ActionGenerator.categoryWasSelected(''));
        }

        const subTitle = subtitleObjMap[pageAction ? pageAction.action : PageActionEnum.VIEW];
        const pageData: PageMetaData = {
          name: `Category - ${subTitle}`,
          page: pageAction ? pageAction.page : PageEnum.CATEGORY_VIEW,
          actions: [availableActions.cancelAction]
        };
        this.ngRedux.dispatch(ActionGenerator.currentPageChanged(pageData));
      });

    this.ngRedux.select<string>([StoreDataTypeEnum.INNER_DATA, 'selectedCategory'])
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((selectedCategory: string) => {
        if (!this.currentAction || (this.currentAction.action !== PageActionEnum.CREATE)) {
          this.categoryValue = this.originalCategoryValue = selectedCategory;
        }
      });

    this.ngRedux.select<string[]>([StoreDataTypeEnum.STATIC_DATA, 'categories'])
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((categories: string[]) => {
        this.availableCategories = categories;
      });

  }

  backToList() {
    this.router.navigate([PageEnum.CATEGORIES_LIST]);
  }

  submit() {
    if (this.currentAction && this.currentAction.action && (this.currentAction.action === PageActionEnum.EDIT)) {
      this.ngRedux.dispatch(ActionGenerator.updateCategory(this.originalCategoryValue, this.categoryValue));
    } else {
      this.ngRedux.dispatch(ActionGenerator.addCategory(this.categoryValue));
    }
    this.backToList();
  }

  categoryAlreadyExist(aNewCategoryName: string) {
    this.categoryExists = this.availableCategories.includes(aNewCategoryName);
    return this.categoryExists;
  }

  isEditMode(): boolean {
    return this.currentAction && this.currentAction.action &&
      ((this.currentAction.action === PageActionEnum.CREATE) || (this.currentAction.action === PageActionEnum.EDIT));
  }
}
