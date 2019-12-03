import {PageAction, PageMetaData, SymbolRecord} from '../../model/innerData.model';

export interface InnerDataState {
  pageData: PageMetaData;
  lastEmittedAction: PageAction;
  selectedCategory: string;
  symbols: SymbolRecord[];
}

export const INITIAL_INNER_DATA_STATE: InnerDataState = {
  pageData: null,
  lastEmittedAction: null,
  selectedCategory: '',
  symbols: [],
};
