import { getCharacterIds, getCharacterById } from './characters.actions';

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
});
