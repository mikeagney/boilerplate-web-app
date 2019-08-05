import {
  getIds, getNames, getSelectedId, getItemById,
} from './characters.selectors';

describe('Character store selectors', () => {
  describe('getIds', () => {
    it('will select the list of character ids', () => {
      // Arrange
      const state = {
        characters: {
          ids: ['1a1', '3a3', '2a2'],
        },
      };

      // Act
      const result = getIds()(state);

      // Assert
      expect(result).toEqual(['1a1', '3a3', '2a2']);
    });
  });

  describe('getNames', () => {
    it('will get an object with all of the character names', () => {
      // Arrange
      const state = {
        characters: {
          byId: {
            '1a1': { name: 'a1a' },
            '2a2': { name: 'a2a' },
          },
        },
      };

      // Act
      const result = getNames()(state);

      // Assert
      expect(result).toEqual({
        '1a1': 'a1a',
        '2a2': 'a2a',
      });
    });
  });

  describe('getSelectedId', () => {
    it('will get the selected character id', () => {
      // Arrange
      const state = {
        characters: {
          selectedId: '12345',
        },
      };

      // Act
      const result = getSelectedId()(state);

      // Assert
      expect(result).toEqual('12345');
    });
  });

  describe('getItemById', () => {
    it('will create a selector that gets a selected character', () => {
      // Arrange
      const state = {
        characters: {
          byId: {
            '1a1': { name: 'a1a' },
            '2a2': { name: 'a2a' },
          },
        },
      };
      const getCharacterById = getItemById((_state, props) => props.characterId);

      // Act
      const result = getCharacterById(state, { characterId: '2a2' });

      // Assert
      expect(result).toEqual({ name: 'a2a' });
    });
  });
});
