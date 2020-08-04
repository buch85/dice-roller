import { rollConfigurationReducer, initialState } from './roll-configuration.reducer';

describe('RollConfiguration Reducer', () => {
  describe('unknown action', () => {
    it('should return the previous state', () => {
      const action = {} as any;

      const result = rollConfigurationReducer(initialState, action);

      expect(result).toBe(initialState);
    });
  });
});
