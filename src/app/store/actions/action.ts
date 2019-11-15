import {Action} from 'redux';

export interface AppAction extends Action {
  payload: any;
}

export enum ActionTypesEnum {
  DUMMY_ACTION = 'DUMMY_ACTION',
  BASIC = 'BASIC',
}

export class ActionGenerator {
  static setBasicData = (aBasicData: any) => ({
    type: ActionTypesEnum.BASIC,
    payload: aBasicData,
  })
}
