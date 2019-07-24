import express from 'express';
import jsonSerialize from 'serialize-javascript';
import Character from './character';
import CharacterProxy from '../../../proxy/character-proxy';
import MockCharacterProxy from '../../../proxy/character-proxy/mock-proxy';

jest.mock('express').mock('../../../proxy/character-proxy');

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
      const ids = ['abc', 'def', '12345'];
      const router = new Character(new MockCharacterProxy());
      router.proxy.store.ids = ids;
      const res = {
        type: jest.fn().mockReturnThis(),
        send: jest.fn(),
      };

      // Act
      await router.getCharacterIds({}, res);

      // Assert
      expect(res.type).toHaveBeenCalledWith('application/json');
      expect(res.send).toHaveBeenCalledWith(jsonSerialize(ids));
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
      await router.getCharacterById(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.type).toHaveBeenCalledWith('application/json');
      expect(res.end).toHaveBeenCalledWith();
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
      expect(res.send).toHaveBeenCalledWith(jsonSerialize(byId.abc));
    });
  });

  describe('initialize', () => {
    it('will set up the API routes', () => {
      // Arrange
      const mockRouter = { get: jest.fn() };
      express.Router.mockReturnValue(mockRouter);
      const router = new Character();

      // Act
      const result = router.initialize().router;

      // Assert
      expect(result).toBe(mockRouter);

      expect(mockRouter.get).toHaveBeenCalledTimes(2);
      expect(mockRouter.get).toHaveBeenCalledWith('/:characterId', router.getCharacterById);
      expect(mockRouter.get).toHaveBeenCalledWith('/', router.getCharacterIds);
    });
  });
});
