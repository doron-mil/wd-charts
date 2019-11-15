import {DynamicDataState, INITIAL_DYNAMIC_DATA_STATE} from '../states/dynamic.data.state';
import {ActionTypesEnum, AppAction} from '../actions/action';

export function dynamicDataReducer(state: DynamicDataState = INITIAL_DYNAMIC_DATA_STATE,
                                   action: AppAction): any {
  switch (action.type) {
    case ActionTypesEnum.DUMMY_ACTION:
      return Object.assign({}, state, {data: action.payload});
    default:
      return Object.assign({}, state);
  }
}
