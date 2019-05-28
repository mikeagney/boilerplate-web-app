import express from 'express';
import ApiRouterV0 from './v0/api-router';
import ApiVersionRouter from './api-version-router';

jest
  .mock('express')
  .mock('./v0/api-router');

describe('ApiVersionRouter', () => {
  const routerv0 = {};

  beforeEach(() => {
    jest.clearAllMocks();
    ApiRouterV0.mockImplementation(() => ({
      initialize: jest.fn().mockReturnThis(),
      router: routerv0,
    }));
  });

  describe('initialize', () => {
    it('will set up the API version routes', () => {
      // Arrange
      const mockRouter = { use: jest.fn() };
      express.Router.mockReturnValue(mockRouter);

      const router = new ApiVersionRouter();

      // Act
      const result = router.initialize().router;

      // Assert
      expect(result).toBe(mockRouter);

      expect(mockRouter.use).toHaveBeenCalledTimes(1);
      expect(mockRouter.use).toHaveBeenCalledWith('/v0', routerv0);
    });
  });
});
