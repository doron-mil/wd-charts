import * as _ from 'lodash';

export enum PageEnum {
  NO_PAGE = '',
  MAIN_PAGE = 'mainPage',
  CHARTS_NG2 = 'chartNg2Page',
  CATEGORIES_LIST = 'categoriesList',
  CATEGORY_CREATE = 'categoryCreate',
  CATEGORY_EDIT = 'categoryEdit',
  CATEGORY_VIEW = 'categoryView',
}

export enum PageActionEnum {
  CREATE = 'CREATE',
  DELETE = 'DELETE',
  VIEW = 'VIEW',
  EDIT = 'EDIT',
}

export class PageAction {
  title: string;
  icon: string;
  page: PageEnum;
  action: PageActionEnum;
}

export class PageMetaData {
  name: string;
  page: PageEnum;
  actions: PageAction[];


  constructor(name: string = '', page: PageEnum = PageEnum.NO_PAGE, actions: PageAction[] = []) {
    this.name = name;
    this.page = page;
    this.actions = actions;
  }
}

export class CategoryUpdate {
  currentCategory: string;
  newCategory: string;

  constructor(currentCategory: string, newCategory: string) {
    this.currentCategory = currentCategory;
    this.newCategory = newCategory;
  }
}

export class SymbolRecord {
  symbol: string;
  name: string;

  static getInstanceFromApi(aApiRecord: any) {
    const newSymbolRecord = new SymbolRecord();
    newSymbolRecord.symbol = _.get(aApiRecord, '1. symbol');
    newSymbolRecord.name = _.get(aApiRecord, '2. name');
    return newSymbolRecord;
  }
}
