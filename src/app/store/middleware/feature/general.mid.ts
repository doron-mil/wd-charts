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
      case ActionTypesEnum.SAVE_STORE:
        const staticData = JSON.stringify(getState()[StoreDataTypeEnum.STATIC_DATA]);
        localStorage.setItem('store', staticData);
        break;
      case ActionTypesEnum.RESTORE_STORE:
        const restoredStaticStoreRawData = localStorage.getItem('store');
        if (restoredStaticStoreRawData) {
          const restoredStaticStoreData = JSON.parse(restoredStaticStoreRawData);
          next(
            ActionGenerator.restoreStore(restoredStaticStoreData)
          );
        }
        break;
    }

    if (action.type.includes(API_ERROR)) {
      console.error('Error in  processing API middleware : ', action);
    }
  };
}
