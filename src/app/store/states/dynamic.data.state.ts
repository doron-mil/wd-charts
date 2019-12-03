import {SymbolRecord} from '../../model/innerData.model';

export interface DynamicDataState {
  data: number;
  apiData: any;
  selectedSymbol: SymbolRecord;
}

export const INITIAL_DYNAMIC_DATA_STATE: DynamicDataState = {
  data: 0,
  apiData: {},
  selectedSymbol: undefined,
};
