import {DynamicDataState, INITIAL_DYNAMIC_DATA_STATE} from '../states/dynamic.data.state';
import {ActionTypesEnum, AppAction} from '../actions/action';

export function dynamicDataReducer(state: DynamicDataState = INITIAL_DYNAMIC_DATA_STATE,
                                   action: AppAction): any {
  switch (action.type) {
    case ActionTypesEnum.RESTORE_STORE:
      const restoredData = action.payload ? action.payload.dynamicData : null;
      let newState = state;
      if (restoredData) {
        newState = restoredData;
      }
      return newState;
    case ActionTypesEnum.SET_API_DATA_TO_STORE:
      state.apiData = action.payload;
      return state;
    case ActionTypesEnum.SET_SELECTED_SYMBOL:
      state.selectedSymbol = action.payload;
      return state;
    default:
      return Object.assign({}, state);
  }
}
