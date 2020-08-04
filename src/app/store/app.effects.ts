import {Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {roll, saveFavorite} from './app.actions';
import {map, withLatestFrom} from 'rxjs/operators';
import {ExpressionEvaluatorService} from '../services/expression-evaluator/expression-evaluator.service';
import {addRollLogEntry} from './entities/roll-log-entry/roll-log-entry.actions';
import {createSelector, MemoizedSelector, Store} from '@ngrx/store';
import {rollLogEntryEntityAdapter} from './entities/roll-log-entry/roll-log-entry.reducer';
import {State} from './app.reducers';
import {rollConfigurationEntityAdapter} from './entities/roll-configuration/roll-configuration.reducer';
import {addRollConfiguration} from './entities/roll-configuration/roll-configuration.actions';


const rollConfigurationIdsSelector: MemoizedSelector<State, string[] | number[]> =
  createSelector(state => state.rollConfigurations, rollConfigurationEntityAdapter.getSelectors().selectIds);

const rollLogEntryIdsSelector: MemoizedSelector<State, string[] | number[]> =
  createSelector(state => state.rollLogs, rollLogEntryEntityAdapter.getSelectors().selectIds);

@Injectable()
export class AppEffects {
  roll$ = createEffect(() => this.actions$.pipe(
    ofType(roll),
    withLatestFrom(this.store.select(rollLogEntryIdsSelector)),
    map(([action, ids]) => {
      const result = this.expressionEvaluatorService.roll(action.expression);
      const numericIds = ids as number[];
      return addRollLogEntry({rollLogEntry: {dices: action.expression, name: action.name, result, id: Math.max(0, ...numericIds) + 1}});
    })
  ));
  saveFavorite$ = createEffect(() => this.actions$.pipe(
    ofType(saveFavorite),
    withLatestFrom(this.store.select(rollConfigurationIdsSelector)),
    map(([action, ids]) => {
      const numericIds = ids as number[];
      return addRollConfiguration({
        rollConfiguration: {
          expression: action.expression,
          name: action.name,
          id: Math.max(0, ...numericIds) + 1
        }
      });
    })
  ));


  constructor(private actions$: Actions, private store: Store<State>, private expressionEvaluatorService: ExpressionEvaluatorService) {
  }

}
