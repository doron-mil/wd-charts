import {INITIAL_STATIC_DATA_STATE, StaticDataState} from '../states/static.data.state';
import {ActionTypesEnum, AppAction} from '../actions/action';

export function staticDataReducer(state: StaticDataState = INITIAL_STATIC_DATA_STATE,
                                  action: AppAction): any {

  switch (action.type) {
    case ActionTypesEnum.BASIC:
      console.log( '1111' , action)
      return Object.assign({}, state, {data: action.payload});
    default:
      return Object.assign({}, state);
  }
}

