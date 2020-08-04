import { createAction, props } from '@ngrx/store';
import { Update } from '@ngrx/entity';

import { RollLogEntry } from './roll-log-entry.model';

export const loadRollLogEntrys = createAction(
  '[RollLogEntry/API] Load RollLogEntrys', 
  props<{ rollLogEntrys: RollLogEntry[] }>()
);

export const addRollLogEntry = createAction(
  '[RollLogEntry/API] Add RollLogEntry',
  props<{ rollLogEntry: RollLogEntry }>()
);

export const upsertRollLogEntry = createAction(
  '[RollLogEntry/API] Upsert RollLogEntry',
  props<{ rollLogEntry: RollLogEntry }>()
);

export const addRollLogEntrys = createAction(
  '[RollLogEntry/API] Add RollLogEntrys',
  props<{ rollLogEntrys: RollLogEntry[] }>()
);

export const upsertRollLogEntrys = createAction(
  '[RollLogEntry/API] Upsert RollLogEntrys',
  props<{ rollLogEntrys: RollLogEntry[] }>()
);

export const updateRollLogEntry = createAction(
  '[RollLogEntry/API] Update RollLogEntry',
  props<{ rollLogEntry: Update<RollLogEntry> }>()
);

export const updateRollLogEntrys = createAction(
  '[RollLogEntry/API] Update RollLogEntrys',
  props<{ rollLogEntrys: Update<RollLogEntry>[] }>()
);

export const deleteRollLogEntry = createAction(
  '[RollLogEntry/API] Delete RollLogEntry',
  props<{ id: string }>()
);

export const deleteRollLogEntrys = createAction(
  '[RollLogEntry/API] Delete RollLogEntrys',
  props<{ ids: string[] }>()
);

export const clearRollLogEntrys = createAction(
  '[RollLogEntry/API] Clear RollLogEntrys'
);
