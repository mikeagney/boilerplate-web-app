import promiseRouter from 'express-promise-router';
import ApiRouterV0 from './v0/api-router';
import ApiVersionRouter from './api-version-router';
import HttpError from '../../http-error';

jest.mock('express-promise-router').mock('./v0/api-router');

describe('ApiVersionRouter', () => {
  const routerv0 = {};

  beforeEach(() => {
    jest.clearAllMocks();
    ApiRouterV0.mockImplementation(() => ({
      initialize: jest.fn().mockReturnThis(),
      router: routerv0,
    }));
  });

  describe('error', () => {
    const mockResponse = {
      status: jest.fn().mockReturnThis(),
      type: jest.fn().mockReturnThis(),
      set: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };

    it('will passthrough if headers are already sent', () => {
      // Arrange
      const router = new ApiVersionRouter();
      const next = jest.fn();

      // Act
      router.error(new HttpError('mock'), null, { headersSent: true }, next);

      // Assert
      expect(next).toHaveBeenCalledTimes(1);
    });

    it('will use default status and headers', () => {
      // Arrange
      const router = new ApiVersionRouter();
      const next = jest.fn();

      // Act
      router.error(new Error('mock'), null, mockResponse, next);

      // Assert
      expect(next).not.toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.type).toHaveBeenCalledWith('application/json');
      expect(mockResponse.set).not.toHaveBeenCalled();
      expect(mockResponse.send).toHaveBeenCalledWith({ status: 500, message: 'mock' });
    });

    it('will use status and headers from the exception', () => {
      // Arrange
      const router = new ApiVersionRouter();
      const next = jest.fn();

      // Act
      router.error(
        new HttpError("I'm a teapot", {
          status: 418,
          headers: {
            'accept-additions': 'Cream',
          },
        }),
        null,
        mockResponse,
        next,
      );

      // Assert
      expect(next).not.toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(418);
      expect(mockResponse.type).toHaveBeenCalledWith('application/json');
      expect(mockResponse.set).toHaveBeenCalledTimes(1);
      expect(mockResponse.set).toHaveBeenCalledWith('accept-additions', 'Cream');
      expect(mockResponse.send).toHaveBeenCalledWith({ status: 418, message: "I'm a teapot" });
    });
  });

  describe('initialize', () => {
    it('will set up the API version routes', () => {
      // Arrange
      const mockRouter = { use: jest.fn() };
      promiseRouter.mockReturnValue(mockRouter);

      const router = new ApiVersionRouter();

      // Act
      const result = router.initialize().router;

      // Assert
      expect(result).toBe(mockRouter);

      expect(mockRouter.use).toHaveBeenCalledTimes(2);
      expect(mockRouter.use).toHaveBeenCalledWith('/v0', routerv0);
      expect(mockRouter.use).toHaveBeenCalledWith(router.error);
    });
  });
});
