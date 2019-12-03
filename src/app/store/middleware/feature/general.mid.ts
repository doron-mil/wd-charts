import {Injectable} from '@angular/core';

import * as _ from 'lodash';

import {ActionFeaturesEnum, ActionGenerator, ActionTypesEnum,} from '../../actions/action';
import {API_ERROR, API_SUCCESS, apiRequest} from '../../actions/api.actions';
import {StoreDataTypeEnum} from '../../storeDataTypeEnum';
import {SymbolRecord} from '../../../model/innerData.model';
import {MatSnackBar} from '@angular/material/snack-bar';

const apiKey = 'FBOX5AT53LMZJ788';
const GET_API_BASE_URL = `https://www.alphavantage.co/query?apikey=${apiKey}&function=`;
const GET_API_SYMBOLS_DATA_URL = (keywords) => `${GET_API_BASE_URL}SYMBOL_SEARCH&keywords=${keywords}`;
const GET_API_DATA_URL = (symbol) => `${GET_API_BASE_URL}TIME_SERIES_MONTHLY&symbol=${symbol}`;

@Injectable()
export class ReduxGeneralMiddlewareService {
  constructor(private snackBar: MatSnackBar) {
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
        next(
          apiRequest(null, 'GET', GET_API_DATA_URL(action.payload), ActionFeaturesEnum.API_DATA, null)
        );
        break;
      case `${ActionFeaturesEnum.API_DATA} ${API_SUCCESS}`:
        if (_.get(action.payload, 'Monthly Time Series')) {
          next(
            ActionGenerator.setApiDataToStore(action.payload)
          );
        } else if (action.payload.Note) {
          this.tooMuchTransactionsMessage(action.payload);
        } else {
          console.error(`General Error in ${ActionFeaturesEnum.API_DATA} ${API_SUCCESS} : `, action.payload);
        }
        break;
      case ActionTypesEnum.GET_API_SYMBOLS_DATA :
        next(
          apiRequest(null, 'GET', GET_API_SYMBOLS_DATA_URL(action.payload)
            , ActionFeaturesEnum.API_SYMBOL_DATA, null)
        );
        break;
      case `${ActionFeaturesEnum.API_SYMBOL_DATA} ${API_SUCCESS}`:
        // bestMatches: Array(9)
        // [{  1. symbol: "G"
        //   2. name: "Genpact Limited"
        //   3. type: "Equity"
        //   4. region: "United States"
        //   5. marketOpen: "09:30"
        //   6. marketClose: "16:00"
        //   7. timezone: "UTC-05"
        //   8. currency: "USD"
        //   9. matchScore: "1.0000" } ... ]
        if (action.payload.bestMatches && Array.isArray(action.payload.bestMatches)) {
          const symbolsArray = action.payload.bestMatches.map(value => SymbolRecord.getInstanceFromApi(value));
          next(
            ActionGenerator.setApiSymbolsDataToStore(symbolsArray)
          );
        } else if (action.payload.Note) {
          this.tooMuchTransactionsMessage(action.payload);
        } else {
          console.error(`General Error in ${ActionFeaturesEnum.API_SYMBOL_DATA} ${API_SUCCESS} : `, action.payload);
        }
        break;
    }

    if (action.type.includes(API_ERROR)) {
      this.snackBar.open('Failed to retrieve data from the internet', null, {
        duration: 7000,
        panelClass: 'snackBarClass',
      });
      console.error('Error in  processing API middleware : ', action);
    }
  };

  private tooMuchTransactionsMessage(aApiRes) {
    console.error('API vendor returned failed response : ', aApiRes);
    this.snackBar.open('Probably too many api calls - Exceeded the policy', null, {
      duration: 7000,
      panelClass: 'snackBarClass',
    });

  }
}
