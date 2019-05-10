import express from 'express';
import path from 'path';
import RootRouter from './root-router';

jest.mock('express').mock('path');

describe('RootRouter', () => {
  describe('initialize', () => {
    it('will set up the static route', () => {
      // Arrange
      const staticRoot = '/dist/client';
      path.join.mockReturnValue(staticRoot);

      const mockRouter = { use: jest.fn() };
      express.Router.mockReturnValue(mockRouter);

      const staticMiddleware = jest.fn();
      express.static.mockReturnValue(staticMiddleware);

      const rootRouter = new RootRouter();

      // Act
      const result = rootRouter.initialize().router;

      // Assert
      expect(result).toBe(mockRouter);

      expect(path.join).toHaveBeenCalledWith(expect.any(String), '../../../dist/client');
      expect(express.static).toHaveBeenCalledWith(staticRoot);
      expect(mockRouter.use).toHaveBeenCalledWith('/', staticMiddleware);
    });
  });
});
