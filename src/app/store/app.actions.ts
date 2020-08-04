import {createAction, props} from '@ngrx/store';

export const roll = createAction('roll', props<{ expression: string, name?: string }>());
export const saveFavorite = createAction('saveFavorite', props<{ name: string, expression: string }>());
export const setCurrentExpression = createAction('set expression', props<{ expression: string }>());
