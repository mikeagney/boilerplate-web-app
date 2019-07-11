import DbClient from '../../client/db-client';
import CharacterProxy from '.';

jest.mock('../../client/db-client');

describe('Character proxy', () => {
  const mockDbClient = {
    getCollection: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    DbClient.mockImplementation(() => mockDbClient);
  });

  describe('constructor', () => {
    it('will instantiate the DbClient', () => {
      // Arrange
      // Act
      const proxy = new CharacterProxy();

      // Assert
      expect(proxy).toBeDefined();
      expect(DbClient).toHaveBeenCalledTimes(1);
    });
  });

  describe('getCharacterIds', () => {
    it('will invoke getCollection when called', () => {
      // Arrange
      const proxy = new CharacterProxy();

      // Act
      proxy.getCharacterIds();

      // Assert
      expect(mockDbClient.getCollection).toHaveBeenCalledTimes(1);
      expect(mockDbClient.getCollection).toHaveBeenCalledWith('characters', expect.any(Function));
    });

    it('will retrieve character IDs from the database', async () => {
      // Arrange
      const expectedResult = ['123', '456'];
      const collection = {
        find: jest.fn().mockReturnThis(),
        project: jest.fn().mockReturnThis(),
        map: jest.fn().mockReturnThis(),
        toArray: jest.fn().mockResolvedValue(expectedResult),
      };
      const proxy = new CharacterProxy();
      proxy.getCharacterIds();

      const callback = mockDbClient.getCollection.mock.calls[0][1];

      // Act
      const result = await callback(collection);

      // Assert
      expect(result).toBe(expectedResult);
      expect(collection.find).toHaveBeenCalledWith({});
      expect(collection.project).toHaveBeenCalledWith({ characterId: true });
      expect(collection.map).toHaveBeenCalledWith(expect.any(Function));
      expect(collection.toArray).toHaveBeenCalledWith();

      // Arrange
      const mapCallback = collection.map.mock.calls[0][0];
      const record = { characterId: 'foo' };

      // Act
      const mapResult = mapCallback(record);

      // Assert
      expect(mapResult).toEqual('foo');
    });
  });

  describe('getCharacterById', () => {
    it('will invoke getCollection when called', () => {
      // Arrange
      const proxy = new CharacterProxy();

      // Act
      proxy.getCharacterById('fooId');

      // Assert
      expect(mockDbClient.getCollection).toHaveBeenCalledTimes(1);
      expect(mockDbClient.getCollection).toHaveBeenCalledWith('characters', expect.any(Function));
    });

    it('will retrieve a character from the database', async () => {
      // Arrange
      const expectedResult = { characterId: 'fooId' };
      const collection = {
        findOne: jest.fn().mockResolvedValue(expectedResult),
      };
      const proxy = new CharacterProxy();
      proxy.getCharacterById('fooId');

      const callback = mockDbClient.getCollection.mock.calls[0][1];

      // Act
      const result = await callback(collection);

      // Assert
      expect(result).toBe(expectedResult);
      expect(collection.findOne).toHaveBeenCalledWith(
        { characterId: 'fooId' },
        { fields: { characterId: true, name: true } },
      );
    });
  });
});
