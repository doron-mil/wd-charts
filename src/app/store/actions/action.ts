import {Action} from 'redux';
import {CategoryUpdate, PageAction, PageMetaData} from '../../model/innerData.model';
import {StaticDataState} from '../states/static.data.state';

export interface AppAction extends Action {
  payload: any;
}

export enum ActionTypesEnum {
  DUMMY_ACTION = 'DUMMY_ACTION',
  BASIC = 'BASIC',
  SAVE_STORE = 'SAVE_STORE',
  RESTORE_STORE = 'RESTORE_STORE',

  CURRENT_PAGE_CHANGED = 'CURRENT_PAGE_CHANGED',
  UPDATE_ACTIONS_FOR_PAGE = 'UPDATE_ACTIONS_FOR_PAGE',
  EMIT_ACTION = 'EMIT_ACTION',

  ADD_CATEGORY = 'ADD_CATEGORY',
  DELETE_CATEGORY = 'DELETE_CATEGORY',
  UPDATE_CATEGORY = 'UPDATE_CATEGORY',
  CATEGORY_WAS_SELECTED = 'CATEGORY_WAS_SELECTED',
}

export class ActionGenerator {
  static setBasicData = (aBasicData: any) => ({
    type: ActionTypesEnum.BASIC,
    payload: aBasicData,
  });

  static saveStore = () => ({
    type: ActionTypesEnum.SAVE_STORE,
  });

  static restoreStore = (aStoreData: StaticDataState = null) => ({
    type: ActionTypesEnum.RESTORE_STORE,
    payload: aStoreData,
  });


  static currentPageChanged = (aPageData: PageMetaData) => ({
    type: ActionTypesEnum.CURRENT_PAGE_CHANGED,
    payload: aPageData,
  });

  static updateActionsForPage = (aPageActions: PageAction[]) => ({
    type: ActionTypesEnum.UPDATE_ACTIONS_FOR_PAGE,
    payload: aPageActions,
  });

  static emitPageAction = (aPageAction: PageAction) => ({
    type: ActionTypesEnum.EMIT_ACTION,
    payload: aPageAction,
  });


  static addCategory = (aCategory: string) => ({
    type: ActionTypesEnum.ADD_CATEGORY,
    payload: aCategory,
  });

  static deleteCategory = (aCategory: string) => ({
    type: ActionTypesEnum.DELETE_CATEGORY,
    payload: aCategory,
  });

  static updateCategory = (aCurrentCategory: string, aNewCategory: string) => ({
    type: ActionTypesEnum.UPDATE_CATEGORY,
    payload: new CategoryUpdate(aCurrentCategory, aNewCategory),
  });

  static categoryWasSelected = (aCategory: string) => ({
    type: ActionTypesEnum.CATEGORY_WAS_SELECTED,
    payload: aCategory,
  });

}
