import { logger, errorLogger } from './logger-middlewares';
import { preAppHandlers, postAppHandlers } from '.';

jest.mock('./logger-middlewares');

describe('src/server/middleware', () => {
  describe('preAppHandlers', () => {
    it('will return the expected pre-app middlewares', () => {
      // Arrange
      const mockLogger = jest.fn();
      logger.mockReturnValue(mockLogger);

      // Act
      const result = preAppHandlers();

      // Assert
      expect(result).toEqual([mockLogger]);
    });
  });

  describe('postAppHandlers', () => {
    it('will return the expected post-app middlewares', () => {
      // Arrange
      const mockErrorLogger = jest.fn();
      errorLogger.mockReturnValue(mockErrorLogger);

      // Act
      const result = postAppHandlers();

      // Assert
      expect(result).toEqual([mockErrorLogger]);
    });
  });
});
