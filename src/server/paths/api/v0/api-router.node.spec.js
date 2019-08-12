import express from 'express';
import promiseRouter from 'express-promise-router';
import Character from './character';
import ApiRouter from './api-router';

jest
  .mock('express')
  .mock('express-promise-router')
  .mock('./character');

describe('ApiRouter v0', () => {
  const characterRouter = {};
  const jsonMiddleware = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    Character.mockImplementation(() => ({
      initialize: jest.fn().mockReturnThis(),
      router: characterRouter,
    }));
    express.json.mockReturnValue(jsonMiddleware);
  });

  describe('initialize', () => {
    it('will set up the API routes', () => {
      // Arrange
      const mockRouter = { use: jest.fn() };
      promiseRouter.mockReturnValue(mockRouter);

      const router = new ApiRouter();

      // Act
      const result = router.initialize().router;

      // Assert
      expect(result).toBe(mockRouter);

      expect(mockRouter.use).toHaveBeenCalledTimes(2);
      expect(mockRouter.use).toHaveBeenCalledWith(jsonMiddleware);
      expect(mockRouter.use).toHaveBeenCalledWith('/characters', characterRouter);
    });
  });
});
