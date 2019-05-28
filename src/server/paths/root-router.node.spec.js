import express from 'express';
import path from 'path';
import RenderReact from './render-react';
import ApiVersionRouter from './api/api-version-router';
import RootRouter from './root-router';

jest
  .mock('express')
  .mock('path')
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

      expect(path.join).toHaveBeenCalledWith(expect.any(String), '../../../dist/client/scripts');
      expect(express.static).toHaveBeenCalledWith(staticRoot);
      expect(mockRouter.use).toHaveBeenCalledTimes(3);
      expect(mockRouter.use).toHaveBeenCalledWith('/', staticMiddleware);
      expect(mockRouter.use).toHaveBeenCalledWith('/', RenderReact.route);
      expect(mockRouter.use).toHaveBeenCalledWith('/api', apiVersionRouter);
    });
  });
});
