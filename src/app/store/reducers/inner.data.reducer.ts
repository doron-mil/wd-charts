import {INITIAL_INNER_DATA_STATE, InnerDataState} from '../states/inner.data.state';
import {ActionTypesEnum, AppAction} from '../actions/action';

export function innerReducer(state: InnerDataState = INITIAL_INNER_DATA_STATE,
                             action: AppAction): any {

  switch (action.type) {
    case ActionTypesEnum.DUMMY_ACTION:
      return Object.assign({}, state, {data: action.payload});
    default:
      return Object.assign({}, state);
  }
}

