import { addCharacter, setSelected, setName } from './characters.actions';
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

  describe('addCharacter', () => {
    it('will add a new character if the id does not already exist', () => {
      // Arrange
      const action = addCharacter('12321', { name: 'baz' });

      // Act
      const nextState = charactersReducer(state, action);

      // Assert
      expect(nextState).toEqual({
        byId: { 12345: state.byId['12345'], 54321: state.byId['54321'], 12321: { name: 'baz' } },
        ids: ['12345', '54321', '12321'],
        selectedId: '12321',
      });
    });

    it('will replace an existing character if the id exists', () => {
      // Arrange
      const action = addCharacter('12345', { name: 'baz' });

      // Act
      const nextState = charactersReducer(state, action);

      // Assert
      expect(nextState).toEqual({
        byId: { 54321: state.byId['54321'], 12345: { name: 'baz' } },
        ids: ['54321', '12345'],
        selectedId: '12345',
      });
    });
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

  describe('getCharacterIds', () => {
    describe('request', () => {
      it('will set loading to true on the global state', () => {
        // Arrange
        const action = { type: 'CHARACTER.GET_CHARACTER_IDS.REQUEST' };

        // Act
        const nextState = charactersReducer(state, action);

        // Assert
        expect(nextState.loading).toBeTruthy();
      });
    });

    describe('response', () => {
      it('will set the current set of character IDs', () => {
        // Arrange
        const action = {
          type: 'CHARACTER.GET_CHARACTER_IDS.RESPONSE',
          payload: {
            response: { data: ['c1', 'd2'] },
          },
        };

        // Act
        const nextState = charactersReducer(state, action);

        // Assert
        expect(nextState.loading).not.toBeTruthy();
        // Change to just 'ids' and set selectedId when everything is in order
        expect(nextState.idsFromApi).toEqual(['c1', 'd2']);
      });
    });

    describe('error', () => {
      it('will set the error object', () => {
        // Arrange
        const action = {
          type: 'CHARACTER.GET_CHARACTER_IDS.ERROR',
          payload: { error: 'failed' },
          error: true,
        };

        // Act
        const nextState = charactersReducer(state, action);

        // Assert
        expect(nextState.loading).not.toBeTruthy();
        expect(nextState.error).toEqual('failed');
      });
    });
  });

  describe('getCharacterById', () => {
    describe('request', () => {
      it('will set loading to true on an existing character on the global state', () => {
        // Arrange
        const action = {
          type: 'CHARACTER.GET_CHARACTER_BY_ID.REQUEST',
          payload: {
            characterId: '12345',
          },
        };

        // Act
        const nextState = charactersReducer(state, action);

        // Assert
        expect(nextState.byId[12345].loading).toBeTruthy();
      });

      it('will set loading to true on a new character on the global state', () => {
        // Arrange
        const action = {
          type: 'CHARACTER.GET_CHARACTER_BY_ID.REQUEST',
          payload: {
            characterId: 'foobar',
          },
        };

        // Act
        const nextState = charactersReducer(state, action);

        // Assert
        expect(nextState.byId.foobar).toEqual({ loading: true });
      });
    });

    describe('response', () => {
      it('will set the character data for the specified id', () => {
        // Arrange
        const action = {
          type: 'CHARACTER.GET_CHARACTER_BY_ID.RESPONSE',
          payload: {
            characterId: '12345',
            response: { data: { name: 'baz' } },
          },
        };

        // Act
        const nextState = charactersReducer(state, action);

        // Assert
        expect(nextState.byId[12345]).toEqual({ name: 'baz' });
      });
    });

    describe('error', () => {
      it('will set the error object', () => {
        // Arrange
        const action = {
          type: 'CHARACTER.GET_CHARACTER_BY_ID.ERROR',
          payload: { characterId: 12345, error: 'failed' },
          error: true,
        };

        // Act
        const nextState = charactersReducer(state, action);

        // Assert
        expect(nextState.byId[12345]).toMatchObject({
          loading: false,
          error: 'failed',
        });
      });
    });
  });
});
