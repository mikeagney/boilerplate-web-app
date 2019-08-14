import {
  getCharacterIds,
  getCharacterById,
  createCharacter,
  patchCharacter,
  deleteCharacter,
  addCharacter,
} from './characters.actions';

jest.mock('../api/api.action-creator', () => ({
  createApiAction: jest.fn().mockImplementation((...args) => [...args]),
}));

describe('Character actions', () => {
  describe('getCharacterIds', () => {
    it('will have the expected arguments', () => {
      // Arrange
      // Act
      // Assert
      expect(getCharacterIds).toEqual(['CHARACTER.GET_CHARACTER_IDS', expect.any(Function)]);
    });

    it('will create the expected payload', () => {
      // Arrange
      const payloadCreator = getCharacterIds[1];

      // Act
      const payload = payloadCreator('12345', 5);

      // Assert
      expect(payload).toEqual({
        request: {
          method: 'get',
          url: '/characters',
          params: {
            cursor: '12345',
            limit: 5,
          },
        },
      });
    });
  });

  describe('getCharacterById', () => {
    it('will have the expected arguments', () => {
      // Arrange
      // Act
      // Assert
      expect(getCharacterById).toEqual(['CHARACTER.GET_CHARACTER_BY_ID', expect.any(Function)]);
    });

    it('will create the expected payload', () => {
      // Arrange
      const payloadCreator = getCharacterById[1];

      // Act
      const payload = payloadCreator('foo bar');

      // Assert
      expect(payload).toEqual({
        characterId: 'foo bar',
        request: {
          method: 'get',
          url: '/characters/foo%20bar',
        },
      });
    });
  });

  describe('createCharacter', () => {
    it('will have the expected arguments', () => {
      // Arrange
      // Act
      // Assert
      expect(createCharacter).toEqual([
        'CHARACTER.CREATE_CHARACTER',
        expect.any(Function),
        expect.any(Function),
      ]);
    });

    it('will create the expected payload', () => {
      // Arrange
      const payloadCreator = createCharacter[1];
      const character = { name: 'Foobar' };

      // Act
      const payload = payloadCreator(character);

      // Assert
      expect(payload).toEqual({
        character,
        request: {
          method: 'post',
          url: '/characters',
          data: character,
        },
      });
    });

    it('will create the expected meta', () => {
      // Arrange
      const metaCreator = createCharacter[2];

      // Act
      const meta = metaCreator();

      // Assert
      expect(meta).toEqual({
        onResponse: expect.any(Function),
      });
    });

    it('will dispatch an add action on response', () => {
      // Arrange
      const metaCreator = createCharacter[2];
      const meta = metaCreator();
      const dispatch = jest.fn();
      const getState = jest.fn();
      const response = {
        data: { name: 'Foobar' },
        headers: {
          location: '/characters/bazquux',
        },
      };
      const expectedAddAction = addCharacter('bazquux', response.data);

      // Act
      meta.onResponse(dispatch, getState, response);

      // Assert
      expect(dispatch).toHaveBeenCalledWith(expectedAddAction);
    });
  });

  describe('patchCharacter', () => {
    it('will have the expected arguments', () => {
      // Arrange
      // Act
      // Assert
      expect(patchCharacter).toEqual(['CHARACTER.PATCH_CHARACTER', expect.any(Function)]);
    });

    it('will create the expected payload', () => {
      // Arrange
      const payloadCreator = patchCharacter[1];
      const characterId = 'foo bar';
      const character = { name: 'Baz Quux' };

      // Act
      const payload = payloadCreator(characterId, character);

      // Assert
      expect(payload).toEqual({
        characterId,
        character,
        request: {
          method: 'patch',
          url: `/characters/${encodeURIComponent(characterId)}`,
          data: character,
        },
      });
    });
  });

  describe('deleteCharacter', () => {
    it('will have the expected arguments', () => {
      // Arrange
      // Act
      // Assert
      expect(deleteCharacter).toEqual(['CHARACTER.DELETE_CHARACTER', expect.any(Function)]);
    });

    it('will create the expected payload', () => {
      // Arrange
      const payloadCreator = deleteCharacter[1];
      const characterId = 'foo bar';

      // Act
      const payload = payloadCreator(characterId);

      // Assert
      expect(payload).toEqual({
        characterId,
        request: {
          method: 'delete',
          url: `/characters/${encodeURIComponent(characterId)}`,
        },
      });
    });
  });
});
