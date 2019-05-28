import express from 'express';
import Character from './character';
import ApiRouter from './api-router';

jest
  .mock('express')
  .mock('./character');

describe('ApiRouter v0', () => {
  const characterRouter = {};

  beforeEach(() => {
    jest.clearAllMocks();
    Character.mockImplementation(() => ({
      initialize: jest.fn().mockReturnThis(),
      router: characterRouter,
    }));
  });

  describe('initialize', () => {
    it('will set up the API routes', () => {
      // Arrange
      const mockRouter = { use: jest.fn() };
      express.Router.mockReturnValue(mockRouter);

      const router = new ApiRouter();

      // Act
      const result = router.initialize().router;

      // Assert
      expect(result).toBe(mockRouter);

      expect(mockRouter.use).toHaveBeenCalledTimes(1);
      expect(mockRouter.use).toHaveBeenCalledWith('/character', characterRouter);
    });
  });
});
