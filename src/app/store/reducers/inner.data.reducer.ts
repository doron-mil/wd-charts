import {INITIAL_INNER_DATA_STATE, InnerDataState} from '../states/inner.data.state';
import {ActionTypesEnum, AppAction} from '../actions/action';

export function innerReducer(state: InnerDataState = INITIAL_INNER_DATA_STATE,
                             action: AppAction): any {

  switch (action.type) {
    case ActionTypesEnum.CURRENT_PAGE_CHANGED:
      return Object.assign({}, state, {pageData: action.payload});
    case ActionTypesEnum.UPDATE_ACTIONS_FOR_PAGE:
      state.pageData.actions = action.payload;
      return state;
    case ActionTypesEnum.CATEGORY_WAS_SELECTED:
      state.selectedCategory = action.payload;
      return state;
    case ActionTypesEnum.EMIT_ACTION:
      return Object.assign({}, state, {lastEmittedAction: action.payload});
    default:
      return Object.assign({}, state);
  }
}

