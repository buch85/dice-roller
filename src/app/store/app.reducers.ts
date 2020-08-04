import {ActionReducer, ActionReducerMap, createReducer, MetaReducer, on} from '@ngrx/store';
import {environment} from '../../environments/environment';
import {setCurrentExpression} from './app.actions';
import {rollConfigurationReducer, RollConfigurationState} from './entities/roll-configuration/roll-configuration.reducer';
import {rollLogEntryReducer, RollLogEntryState} from './entities/roll-log-entry/roll-log-entry.reducer';
import {localStorageSync} from 'ngrx-store-localstorage';


export interface State {
  currentExpression: string;
  rollLogs: RollLogEntryState;
  rollConfigurations: RollConfigurationState;
}


export const reducers: ActionReducerMap<State> = {
  currentExpression: createReducer('',
    on(setCurrentExpression, (state, action) => action.expression)
  ),
  rollLogs: rollLogEntryReducer,
  rollConfigurations: rollConfigurationReducer
};

export function localStorageSyncReducer(reducer: ActionReducer<any>): ActionReducer<any> {
  return localStorageSync({keys: ['rollConfigurations'], rehydrate: true})(reducer);
}

export const metaReducers: MetaReducer<State>[] = [localStorageSyncReducer, ...(!environment.production ? [] : [])];
