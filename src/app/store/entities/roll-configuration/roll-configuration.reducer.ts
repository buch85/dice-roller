import {createReducer, on} from '@ngrx/store';
import {createEntityAdapter, EntityAdapter, EntityState} from '@ngrx/entity';
import {RollConfiguration} from './roll-configuration.model';
import * as RollConfigurationActions from './roll-configuration.actions';

export const rollConfigurationsFeatureKey = 'rollConfigurations';

export interface RollConfigurationState extends EntityState<RollConfiguration> {
  // additional entities state properties
}

export const rollConfigurationEntityAdapter: EntityAdapter<RollConfiguration> = createEntityAdapter<RollConfiguration>();

export const initialState: RollConfigurationState = rollConfigurationEntityAdapter.getInitialState({
  // additional entity state properties
});


export const rollConfigurationReducer = createReducer(
  initialState,
  on(RollConfigurationActions.addRollConfiguration,
    (state, action) => rollConfigurationEntityAdapter.addOne(action.rollConfiguration, state)
  ),
  on(RollConfigurationActions.upsertRollConfiguration,
    (state, action) => rollConfigurationEntityAdapter.upsertOne(action.rollConfiguration, state)
  ),
  on(RollConfigurationActions.addRollConfigurations,
    (state, action) => rollConfigurationEntityAdapter.addMany(action.rollConfigurations, state)
  ),
  on(RollConfigurationActions.upsertRollConfigurations,
    (state, action) => rollConfigurationEntityAdapter.upsertMany(action.rollConfigurations, state)
  ),
  on(RollConfigurationActions.updateRollConfiguration,
    (state, action) => rollConfigurationEntityAdapter.updateOne(action.rollConfiguration, state)
  ),
  on(RollConfigurationActions.updateRollConfigurations,
    (state, action) => rollConfigurationEntityAdapter.updateMany(action.rollConfigurations, state)
  ),
  on(RollConfigurationActions.deleteRollConfiguration,
    (state, action) => rollConfigurationEntityAdapter.removeOne(action.id, state)
  ),
  on(RollConfigurationActions.deleteRollConfigurations,
    (state, action) => rollConfigurationEntityAdapter.removeMany(action.ids, state)
  ),
  on(RollConfigurationActions.loadRollConfigurations,
    (state, action) => rollConfigurationEntityAdapter.setAll(action.rollConfigurations, state)
  ),
  on(RollConfigurationActions.clearRollConfigurations,
    state => rollConfigurationEntityAdapter.removeAll(state)
  ),
);


export const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal,
} = rollConfigurationEntityAdapter.getSelectors();
