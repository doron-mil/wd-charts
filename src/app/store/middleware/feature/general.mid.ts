import {Injectable} from '@angular/core';
import {
  ActionGenerator,
  ActionTypesEnum,
} from '../../actions/action';
import {API_ERROR} from '../../actions/api.actions';
import {StoreDataTypeEnum} from '../../storeDataTypeEnum';
import {DynamicDataState} from '../../states/dynamic.data.state';


@Injectable()
export class ReduxGeneralMiddlewareService {
  constructor() {
  }

  generalMiddleware = ({getState, dispatch}) => (next) => (action) => {
    next(action);

    switch (action.type) {
      case ActionTypesEnum.DUMMY_ACTION:
        dispatch(ActionGenerator.setBasicData( true));
        break;
    }

    if (action.type.includes(API_ERROR)) {
      console.error('Error in  processing API middleware : ', action);
    }
  };
}
