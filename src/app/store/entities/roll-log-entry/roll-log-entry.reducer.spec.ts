import { rollLogEntryReducer, initialState } from './roll-log-entry.reducer';

describe('RollLogEntry Reducer', () => {
  describe('unknown action', () => {
    it('should return the previous state', () => {
      const action = {} as any;

      const result = rollLogEntryReducer(initialState, action);

      expect(result).toBe(initialState);
    });
  });
});
