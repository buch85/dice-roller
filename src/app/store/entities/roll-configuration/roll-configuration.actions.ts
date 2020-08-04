import { createAction, props } from '@ngrx/store';
import { Update } from '@ngrx/entity';

import { RollConfiguration } from './roll-configuration.model';

export const loadRollConfigurations = createAction(
  '[RollConfiguration/API] Load RollConfigurations', 
  props<{ rollConfigurations: RollConfiguration[] }>()
);

export const addRollConfiguration = createAction(
  '[RollConfiguration/API] Add RollConfiguration',
  props<{ rollConfiguration: RollConfiguration }>()
);

export const upsertRollConfiguration = createAction(
  '[RollConfiguration/API] Upsert RollConfiguration',
  props<{ rollConfiguration: RollConfiguration }>()
);

export const addRollConfigurations = createAction(
  '[RollConfiguration/API] Add RollConfigurations',
  props<{ rollConfigurations: RollConfiguration[] }>()
);

export const upsertRollConfigurations = createAction(
  '[RollConfiguration/API] Upsert RollConfigurations',
  props<{ rollConfigurations: RollConfiguration[] }>()
);

export const updateRollConfiguration = createAction(
  '[RollConfiguration/API] Update RollConfiguration',
  props<{ rollConfiguration: Update<RollConfiguration> }>()
);

export const updateRollConfigurations = createAction(
  '[RollConfiguration/API] Update RollConfigurations',
  props<{ rollConfigurations: Update<RollConfiguration>[] }>()
);

export const deleteRollConfiguration = createAction(
  '[RollConfiguration/API] Delete RollConfiguration',
  props<{ id: string }>()
);

export const deleteRollConfigurations = createAction(
  '[RollConfiguration/API] Delete RollConfigurations',
  props<{ ids: string[] }>()
);

export const clearRollConfigurations = createAction(
  '[RollConfiguration/API] Clear RollConfigurations'
);
