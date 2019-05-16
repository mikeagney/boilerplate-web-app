import ActionTypes from './characters.constants';
import { setSelected } from './characters.actions';

describe('Character store actions', () => {
  describe('setSelected', () => {
    it('will create the expected action', () => {
      // Arrange
      // Act
      const action = setSelected('12345');

      // Assert
      expect(action).toEqual({
        type: ActionTypes.SET_SELECTED,
        payload: {
          characterId: '12345',
        },
      });
    });
  });
});
