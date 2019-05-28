import express from 'express';
import jsonSerialize from 'serialize-javascript';
import Character from './character';

jest.mock('express');

describe('Character router', () => {
  describe('getCharacterIds', () => {
    it('will return the ids from the local store', () => {
      // Arrange
      const ids = ['abc', 'def', '12345'];
      const router = new Character();
      router.store.ids = ids;
      const res = {
        type: jest.fn().mockReturnThis(),
        send: jest.fn(),
      };

      // Act
      router.getCharacterIds({}, res);

      // Assert
      expect(res.type).toHaveBeenCalledWith('application/json');
      expect(res.send).toHaveBeenCalledWith(jsonSerialize(ids));
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

      expect(mockRouter.get).toHaveBeenCalledTimes(1);
      expect(mockRouter.get).toHaveBeenCalledWith('/ids', router.getCharacterIds);
    });
  });
});
