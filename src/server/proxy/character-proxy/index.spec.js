import DbClient from '../../client/db-client';
import CharacterProxy from '.';

jest.mock('../../client/db-client');

describe('Character proxy', () => {
  const mockDbClient = {
    getDatabase: jest.fn(),
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
    it('will invoke getDatabase when called', () => {
      // Arrange
      const proxy = new CharacterProxy();

      // Act
      proxy.getCharacterIds();

      // Assert
      expect(mockDbClient.getDatabase).toHaveBeenCalledTimes(1);
      expect(mockDbClient.getDatabase).toHaveBeenCalledWith(expect.any(Function));
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
      const db = { collection: jest.fn().mockReturnValue(collection) };
      const proxy = new CharacterProxy();
      proxy.getCharacterIds();

      const callback = mockDbClient.getDatabase.mock.calls[0][0];

      // Act
      const result = await callback(db);

      // Assert
      expect(result).toBe(expectedResult);
      expect(db.collection).toHaveBeenCalledWith('characters');
      expect(collection.find).toHaveBeenCalledWith({ characterId: { $exists: true } });
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
    it('will invoke getDatabase when called', () => {
      // Arrange
      const proxy = new CharacterProxy();

      // Act
      proxy.getCharacterById('fooId');

      // Assert
      expect(mockDbClient.getDatabase).toHaveBeenCalledTimes(1);
      expect(mockDbClient.getDatabase).toHaveBeenCalledWith(expect.any(Function));
    });

    it('will retrieve a character from the database', async () => {
      // Arrange
      const expectedResult = { characterId: 'fooId' };
      const collection = {
        findOne: jest.fn().mockResolvedValue(expectedResult),
      };
      const db = { collection: jest.fn().mockReturnValue(collection) };
      const proxy = new CharacterProxy();
      proxy.getCharacterById('fooId');

      const callback = mockDbClient.getDatabase.mock.calls[0][0];

      // Act
      const result = await callback(db);

      // Assert
      expect(result).toBe(expectedResult);
      expect(db.collection).toHaveBeenCalledWith('characters');
      expect(collection.findOne).toHaveBeenCalledWith(
        { characterId: 'fooId' },
        { fields: { characterId: true, name: true } },
      );
    });
  });
});
