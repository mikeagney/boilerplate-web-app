import { setSelected, setName } from './characters.actions';
import charactersReducer from '.';

describe('Characters store reducer', () => {
  const state = Object.freeze({
    selectedId: '12345',
    byId: {
      12345: { name: 'foo' },
      54321: { name: 'bar' },
    },
    ids: ['12345', '54321'],
  });

  describe('setSelected', () => {
    it('will update selected character id', () => {
      // Arrange
      const action = setSelected('54321');

      // Act
      const nextState = charactersReducer(state, action);

      // Assert
      expect(nextState).toEqual({
        ...state,
        selectedId: '54321',
      });
    });
  });

  describe('setName', () => {
    it('will update the name of the selected character', () => {
      // Arrange
      const action = setName('54321', 'baz');

      // Act
      const nextState = charactersReducer(state, action);

      // Assert
      expect(nextState.byId[12345]).toEqual(state.byId[12345]);
      expect(nextState.byId[54321].name).toEqual('baz');
    });
  });
});
