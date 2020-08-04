import { Action, createReducer, on } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { RollLogEntry } from './roll-log-entry.model';
import * as RollLogEntryActions from './roll-log-entry.actions';

export const rollLogEntriesFeatureKey = 'rollLogEntries';

export interface RollLogEntryState extends EntityState<RollLogEntry> {
  // additional entities state properties
}

export const rollLogEntryEntityAdapter: EntityAdapter<RollLogEntry> = createEntityAdapter<RollLogEntry>();

export const initialState: RollLogEntryState = rollLogEntryEntityAdapter.getInitialState({
  // additional entity state properties
});


export const rollLogEntryReducer = createReducer(
  initialState,
  on(RollLogEntryActions.addRollLogEntry,
    (state, action) => rollLogEntryEntityAdapter.addOne(action.rollLogEntry, state)
  ),
  on(RollLogEntryActions.upsertRollLogEntry,
    (state, action) => rollLogEntryEntityAdapter.upsertOne(action.rollLogEntry, state)
  ),
  on(RollLogEntryActions.addRollLogEntrys,
    (state, action) => rollLogEntryEntityAdapter.addMany(action.rollLogEntrys, state)
  ),
  on(RollLogEntryActions.upsertRollLogEntrys,
    (state, action) => rollLogEntryEntityAdapter.upsertMany(action.rollLogEntrys, state)
  ),
  on(RollLogEntryActions.updateRollLogEntry,
    (state, action) => rollLogEntryEntityAdapter.updateOne(action.rollLogEntry, state)
  ),
  on(RollLogEntryActions.updateRollLogEntrys,
    (state, action) => rollLogEntryEntityAdapter.updateMany(action.rollLogEntrys, state)
  ),
  on(RollLogEntryActions.deleteRollLogEntry,
    (state, action) => rollLogEntryEntityAdapter.removeOne(action.id, state)
  ),
  on(RollLogEntryActions.deleteRollLogEntrys,
    (state, action) => rollLogEntryEntityAdapter.removeMany(action.ids, state)
  ),
  on(RollLogEntryActions.loadRollLogEntrys,
    (state, action) => rollLogEntryEntityAdapter.setAll(action.rollLogEntrys, state)
  ),
  on(RollLogEntryActions.clearRollLogEntrys,
    state => rollLogEntryEntityAdapter.removeAll(state)
  ),
);


export const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal,
} = rollLogEntryEntityAdapter.getSelectors();
