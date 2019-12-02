import {Injectable} from '@angular/core';
import {ActionFeaturesEnum, ActionGenerator, ActionTypesEnum,} from '../../actions/action';
import {API_ERROR, API_SUCCESS, apiRequest} from '../../actions/api.actions';
import {StoreDataTypeEnum} from '../../storeDataTypeEnum';

const apiKey = 'FBOX5AT53LMZJ788';
const GET_API_DATA_URL = `https://www.alphavantage.co/query?function=TIME_SERIES_MONTHLY&symbol=MSFT&apikey=${apiKey}`;

@Injectable()
export class ReduxGeneralMiddlewareService {
  constructor() {
  }

  generalMiddleware = ({getState, dispatch}) => (next) => (action) => {
    next(action);

    switch (action.type) {
      case ActionTypesEnum.SAVE_STORE:
        const currentState = getState();
        const staticData = currentState[StoreDataTypeEnum.STATIC_DATA];
        const dynamicData = currentState[StoreDataTypeEnum.DYNAMIC_DATA];
        const combinedStringifiedData = JSON.stringify({staticData, dynamicData});
        localStorage.setItem('store', combinedStringifiedData);
        break;
      case ActionTypesEnum.RESTORE_STORE:
        const restoredStoreRawData = localStorage.getItem('store');
        if (restoredStoreRawData) {
          const restoredStaticStoreData = JSON.parse(restoredStoreRawData);
          next(
            ActionGenerator.restoreStore(restoredStaticStoreData)
          );
        }
        break;
      case ActionTypesEnum.GET_API_DATA :
        console.log('00000');
        next(
          apiRequest(null, 'GET', GET_API_DATA_URL, ActionFeaturesEnum.API_DATA, null)
        );
        break;
      case `${ActionFeaturesEnum.API_DATA} ${API_SUCCESS}`:
        console.log('1111', action.payload);
        next(
          ActionGenerator.setApiDataToStore(action.payload)
        );
        break;
    }

    if (action.type.includes(API_ERROR)) {
      console.error('Error in  processing API middleware : ', action);
    }
  };
}
