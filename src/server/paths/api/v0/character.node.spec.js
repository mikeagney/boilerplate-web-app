import promiseRouter from 'express-promise-router';
import Character from './character';
import CharacterProxy from '../../../proxy/character-proxy';
import MockCharacterProxy from '../../../proxy/character-proxy/mock-proxy';

jest.mock('express-promise-router').mock('../../../proxy/character-proxy');

describe('Character router', () => {
  describe('constructor', () => {
    it('will default to the CharacterProxy class', () => {
      // Arrange
      // Act
      const router = new Character();

      // Assert
      expect(router.proxy).toEqual(expect.any(CharacterProxy));
    });
  });

  describe('getCharacterIds', () => {
    it('will return the ids from the local store', async () => {
      // Arrange
      const router = new Character(new MockCharacterProxy());
      const res = {
        type: jest.fn().mockReturnThis(),
        send: jest.fn(),
      };

      // Act
      await router.getCharacterIds({ baseUrl: '/foo', query: {} }, res);

      // Assert
      expect(res.type).toHaveBeenCalledWith('application/json');
      expect(res.send).toHaveBeenCalledWith({
        items: [
          { id: 'a1', name: 'Armus', href: '/foo/a1' },
          { id: 'b2', name: 'The Caretaker', href: '/foo/b2' },
        ],
        nextCursor: null,
      });
    });

    it('will default to limit of 10 with no cursor', async () => {
      // Arrange
      const router = new Character(new MockCharacterProxy());
      jest.spyOn(router.proxy, 'getCharacterIds').mockImplementation(() => ({ items: [] }));
      const res = {
        type: jest.fn().mockReturnThis(),
        send: jest.fn(),
      };

      // Act
      await router.getCharacterIds({ baseUrl: '/foo', query: {} }, res);

      // Assert
      expect(router.proxy.getCharacterIds).toHaveBeenCalledWith(10, null);
    });

    it('will pass through limit and cursor arguments', async () => {
      // Arrange
      const router = new Character(new MockCharacterProxy());
      jest.spyOn(router.proxy, 'getCharacterIds').mockImplementation(() => ({ items: [] }));
      const res = {
        type: jest.fn().mockReturnThis(),
        send: jest.fn(),
      };

      // Act
      await router.getCharacterIds({ baseUrl: '/foo', query: { limit: 5, cursor: '12345' } }, res);

      // Assert
      expect(router.proxy.getCharacterIds).toHaveBeenCalledWith(5, '12345');
    });
  });

  describe('getCharacterById', () => {
    it('will return 404 if character id does not exist', async () => {
      // Arrange
      const byId = {};
      const router = new Character(new MockCharacterProxy());
      router.proxy.store.byId = byId;
      const req = {
        params: {
          characterId: 'abc',
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        type: jest.fn().mockReturnThis(),
        end: jest.fn(),
      };

      // Act
      // Assert
      await expect(router.getCharacterById(req, res)).rejects.toThrow({
        status: 404,
        message: 'Not Found',
      });
    });

    it('will return the character if character exists', async () => {
      // Arrange
      const byId = {
        abc: { characterId: 'abc', name: 'Foo' },
      };
      const router = new Character(new MockCharacterProxy());
      router.proxy.store.byId = byId;
      const req = {
        params: {
          characterId: 'abc',
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        type: jest.fn().mockReturnThis(),
        send: jest.fn(),
      };

      // Act
      await router.getCharacterById(req, res);

      // Assert
      expect(res.status).not.toHaveBeenCalled();
      expect(res.type).toHaveBeenCalledWith('application/json');
      expect(res.send).toHaveBeenCalledWith(byId.abc);
    });
  });

  describe('createCharacter', () => {
    it('will throw if the request has no body', async () => {
      // Arrange
      const router = new Character(new MockCharacterProxy());
      const req = {
        baseUrl: '/foo',
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        location: jest.fn().mockReturnThis(),
        type: jest.fn().mockReturnThis(),
        send: jest.fn(),
      };

      // Act
      await expect(router.createCharacter(req, res)).rejects.toThrow('"body" is required');
    });

    it('will throw if the request body has no name', async () => {
      // Arrange
      const router = new Character(new MockCharacterProxy());
      const req = {
        baseUrl: '/foo',
        body: {},
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        location: jest.fn().mockReturnThis(),
        type: jest.fn().mockReturnThis(),
        send: jest.fn(),
      };

      // Act
      await expect(router.createCharacter(req, res)).rejects.toThrow('"name" is required');
    });

    it('will call the proxy to create the character and return its id', async () => {
      // Arrange
      const router = new Character(new MockCharacterProxy());
      const req = {
        baseUrl: '/foo',
        body: {
          name: 'Foobar',
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        location: jest.fn().mockReturnThis(),
        type: jest.fn().mockReturnThis(),
        send: jest.fn(),
      };
      const expectedCharacter = {
        name: 'Foobar',
        createdDate: expect.any(Date),
        characterId: expect.any(String),
      };

      // Act
      await router.createCharacter(req, res);

      // Assert
      const INITIAL_STORE_LENGTH = 2; // How many IDs are in the mock store when created
      expect(router.proxy.store.ids.length).toEqual(INITIAL_STORE_LENGTH + 1);
      const characterId = router.proxy.store.ids[INITIAL_STORE_LENGTH];
      const createdCharacter = router.proxy.store.byId[characterId];
      expect(createdCharacter).toEqual(expectedCharacter);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.location).toHaveBeenCalledWith(`/foo/${characterId}`);
      expect(res.type).toHaveBeenCalledWith('application/json');
      expect(res.send).toHaveBeenCalledWith(expectedCharacter);
    });
  });

  describe('initialize', () => {
    it('will set up the API routes', () => {
      // Arrange
      const mockRouter = { get: jest.fn(), post: jest.fn() };
      promiseRouter.mockReturnValue(mockRouter);
      const router = new Character();

      // Act
      const result = router.initialize().router;

      // Assert
      expect(result).toBe(mockRouter);

      expect(mockRouter.get).toHaveBeenCalledTimes(2);
      expect(mockRouter.get).toHaveBeenCalledWith('/:characterId', router.getCharacterById);
      expect(mockRouter.get).toHaveBeenCalledWith('/', router.getCharacterIds);
      expect(mockRouter.post).toHaveBeenCalledTimes(1);
      expect(mockRouter.post).toHaveBeenCalledWith('/', router.createCharacter);
    });
  });
});
