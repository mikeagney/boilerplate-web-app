import {
  getCharacterIds,
  getCharacterNames,
  getSelectedCharacterId,
  createGetCharacterById,
} from './characters.selectors';

describe('Character store selectors', () => {
  describe('getCharacterIds', () => {
    it('will select the list of character ids', () => {
      // Arrange
      const state = {
        characters: {
          ids: ['1a1', '3a3', '2a2'],
        },
      };

      // Act
      const result = getCharacterIds(state);

      // Assert
      expect(result).toEqual(['1a1', '3a3', '2a2']);
    });
  });

  describe('getCharacterNames', () => {
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
      const result = getCharacterNames(state);

      // Assert
      expect(result).toEqual({
        '1a1': 'a1a',
        '2a2': 'a2a',
      });
    });
  });

  describe('getSelectedCharacterId', () => {
    it('will get the selected character id', () => {
      // Arrange
      const state = {
        characters: {
          selectedId: '12345',
        },
      };

      // Act
      const result = getSelectedCharacterId(state);

      // Assert
      expect(result).toEqual('12345');
    });
  });

  describe('createGetCharacterById', () => {
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
      const getCharacterById = createGetCharacterById();

      // Act
      const result = getCharacterById(state, { characterId: '2a2' });

      // Assert
      expect(result).toEqual({ name: 'a2a' });
    });
  });
});
