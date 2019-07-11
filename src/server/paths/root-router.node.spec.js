import express from 'express';
import RenderReact from './render-react';
import ApiVersionRouter from './api/api-version-router';
import RootRouter from './root-router';

jest
  .mock('express')
  .mock('./render-react')
  .mock('./api/api-version-router');

describe('RootRouter', () => {
  const apiVersionRouter = {};

  beforeEach(() => {
    ApiVersionRouter.mockImplementation(() => ({
      initialize: jest.fn().mockReturnThis(),
      router: apiVersionRouter,
    }));
  });

  describe('initialize', () => {
    it('will set up the static route', () => {
      // Arrange
      const mockRouter = { use: jest.fn() };
      express.Router.mockReturnValue(mockRouter);

      const staticMiddleware = jest.fn();
      express.static.mockReturnValue(staticMiddleware);

      const rootRouter = new RootRouter();

      // Act
      const result = rootRouter.initialize().router;

      // Assert
      expect(result).toBe(mockRouter);

      expect(express.static).toHaveBeenCalledWith(expect.any(String));
      expect(mockRouter.use).toHaveBeenCalledTimes(3);
      expect(mockRouter.use).toHaveBeenCalledWith('/', staticMiddleware);
      expect(mockRouter.use).toHaveBeenCalledWith('/', RenderReact.route);
      expect(mockRouter.use).toHaveBeenCalledWith('/api', apiVersionRouter);
    });
  });
});
