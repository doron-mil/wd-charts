import {INITIAL_STATIC_DATA_STATE, StaticDataState} from '../states/static.data.state';
import {ActionTypesEnum, AppAction} from '../actions/action';
import {CategoryUpdate} from '../../model/innerData.model';

export function staticDataReducer(state: StaticDataState = INITIAL_STATIC_DATA_STATE,
                                  action: AppAction): any {

  switch (action.type) {
    case ActionTypesEnum.RESTORE_STORE:
      const restoredData = action.payload ? action.payload.staticData : null;
      let newState = state;
      if (restoredData) {
        newState = restoredData;
      }
      return newState;
    case ActionTypesEnum.ADD_CATEGORY:
      state.categories.push(action.payload);
      state.categories = [...state.categories];
      return state;
    case ActionTypesEnum.UPDATE_CATEGORY:
      const categoryUpdate = action.payload as CategoryUpdate;
      const catIndex = state.categories.indexOf(categoryUpdate.currentCategory);
      if (catIndex >= 0) {
        state.categories[catIndex] = categoryUpdate.newCategory;
      }
      state.categories = [...state.categories];
      return state;
    case ActionTypesEnum.DELETE_CATEGORY:
      const catIndex2Delete = state.categories.indexOf(action.payload);
      if (catIndex2Delete >= 0) {
        state.categories.splice(catIndex2Delete,1);
      }
      state.categories = [...state.categories];
      return state;
    default:
      return Object.assign({}, state);
  }
}

