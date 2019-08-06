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

  const testDate = new Date('1990-02-31');
  const cursorForTestDate = 'ACi7LZQA';

  describe('getQueryFromCursor', () => {
    it('will return an empty query with no cursor', () => {
      // Arrange
      // Act
      const query = CharacterProxy.getQueryFromCursor(null);

      // Assert
      expect(query).toEqual({});
    });

    it('will return expected query with cursor supplied', () => {
      // Arrange
      // Act
      const query = CharacterProxy.getQueryFromCursor(cursorForTestDate);

      // Assert
      expect(query).toEqual({
        createdDate: {
          $gte: testDate,
        },
      });
    });
  });

  describe('getCursorFromElement', () => {
    it('will return null cursor value from no element', () => {
      // Arrange
      // Act
      const cursor = CharacterProxy.getCursorFromElement(null);

      // Assert
      expect(cursor).toBeNull();
    });

    it('will return null cursor value from invalid element', () => {
      // Arrange
      const element = {};

      // Act
      const cursor = CharacterProxy.getCursorFromElement(element);

      // Assert
      expect(cursor).toBeNull();
    });

    it('will return expected cursor value from valid element', () => {
      // Arrange
      const element = { createdDate: testDate };

      // Act
      const cursor = CharacterProxy.getCursorFromElement(element);

      // Assert
      expect(cursor).toEqual(cursorForTestDate);
    });
  });

  describe('getCharacterIds', () => {
    const collection = {
      find: jest.fn().mockReturnThis(),
      hint: jest.fn().mockReturnThis(),
      sort: jest.fn().mockReturnThis(),
      project: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      toArray: jest.fn(),
    };

    beforeEach(() => {
      jest.spyOn(CharacterProxy, 'getQueryFromCursor');
      jest.spyOn(CharacterProxy, 'getCursorFromElement');
    });

    afterEach(() => {
      CharacterProxy.getQueryFromCursor.mockRestore();
      CharacterProxy.getCursorFromElement.mockRestore();
    });

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
      const characters = [{ characterId: '123', name: 'foo' }, { characterId: '456', name: 'bar' }];
      const query = { createdDate: { $gte: new Date() } };
      CharacterProxy.getQueryFromCursor.mockImplementation(() => query);
      const nextCursor = 'abcde';
      CharacterProxy.getCursorFromElement.mockImplementation(() => nextCursor);
      collection.toArray.mockResolvedValue(characters);
      const db = { collection: jest.fn().mockReturnValue(collection) };

      const proxy = new CharacterProxy();
      proxy.getCharacterIds(10, 'edcba');

      const callback = mockDbClient.getDatabase.mock.calls[0][0];

      // Act
      const result = await callback(db);

      // Assert
      expect(result).toEqual({
        items: [{ id: '123', name: 'foo' }, { id: '456', name: 'bar' }],
        nextCursor,
      });
      expect(CharacterProxy.getQueryFromCursor).toHaveBeenCalledWith('edcba');
      expect(CharacterProxy.getCursorFromElement).toHaveBeenCalledWith(false);
      expect(db.collection).toHaveBeenCalledWith('characters');
      expect(collection.find).toHaveBeenCalledWith(query);
      expect(collection.hint).toHaveBeenCalledWith('dateIdName');
      expect(collection.sort).toHaveBeenCalledWith({ createdDate: 1 });
      expect(collection.project).toHaveBeenCalledWith({
        characterId: true,
        name: true,
        createdDate: true,
        _id: false,
      });
      expect(collection.limit).toHaveBeenCalledWith(11);
      expect(collection.toArray).toHaveBeenCalledWith();
    });

    it('will retrieve one extra character and use the last to create the next cursor', async () => {
      // Arrange
      const lastCharacter = { characterId: '456', name: 'bar' };
      const characters = [{ characterId: '123', name: 'foo' }, lastCharacter];
      const query = { createdDate: { $gte: new Date() } };
      CharacterProxy.getQueryFromCursor.mockImplementation(() => query);
      const nextCursor = 'abcde';
      CharacterProxy.getCursorFromElement.mockImplementation(() => nextCursor);
      collection.toArray.mockResolvedValue(characters);
      const db = { collection: jest.fn().mockReturnValue(collection) };

      const proxy = new CharacterProxy();
      proxy.getCharacterIds(1);

      const callback = mockDbClient.getDatabase.mock.calls[0][0];

      // Act
      const result = await callback(db);

      // Assert
      expect(result).toEqual({
        items: [{ id: '123', name: 'foo' }],
        nextCursor,
      });
      expect(CharacterProxy.getCursorFromElement).toHaveBeenCalledWith(lastCharacter);
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
      expect(collection.findOne).toHaveBeenCalledWith({ characterId: 'fooId' });
    });
  });

  describe('createCharacter', () => {
    it('will invoke getDatabase when called', () => {
      // Arrange
      const proxy = new CharacterProxy();

      // Act
      proxy.createCharacter({ name: 'Foobar' });

      // Assert
      expect(mockDbClient.getDatabase).toHaveBeenCalledTimes(1);
      expect(mockDbClient.getDatabase).toHaveBeenCalledWith(expect.any(Function));
    });

    it('will add an entry to the database', async () => {
      // Arrange
      const collection = {
        insertOne: jest.fn().mockResolvedValue(),
      };

      const db = { collection: jest.fn().mockReturnValue(collection) };
      const proxy = new CharacterProxy();
      proxy.createCharacter({ name: 'Foobar' });

      const callback = mockDbClient.getDatabase.mock.calls[0][0];

      // Act
      const result = await callback(db);

      // Assert
      expect(db.collection).toHaveBeenCalledWith('characters');
      expect(collection.insertOne).toHaveBeenCalledWith({
        name: 'Foobar',
        characterId: expect.any(String),
        createdDate: expect.any(Date),
      });
      const { characterId } = collection.insertOne.mock.calls[0][0];
      expect(result).toEqual(characterId);
    });
  });
});
