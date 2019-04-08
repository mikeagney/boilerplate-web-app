import expressWinston from 'express-winston';
import { server } from '../../common/logger';
import { logger, errorLogger } from './logger-middlewares';

jest.mock('express-winston').mock('../../common/logger');

describe('src/server/middleware/logger-middlewares', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('logger', () => {
    it('will construct the appropriate request middleware', () => {
      // Arrange
      const winstonInstance = jest.fn();
      const mockLogger = jest.fn();
      server.mockReturnValue(winstonInstance);
      expressWinston.logger.mockReturnValue(mockLogger);

      // Act
      const result = logger();

      // Assert
      expect(result).toBe(mockLogger);
      expect(server).toHaveBeenCalledTimes(1);
      expect(server).toHaveBeenCalledWith('request');
      expect(expressWinston.logger).toHaveBeenCalledTimes(1);
      expect(expressWinston.logger).toHaveBeenCalledWith({ winstonInstance });
    });
  });

  describe('errorLogger', () => {
    it('will construct the appropriate error middleware', () => {
      // Arrange
      const winstonInstance = jest.fn();
      const mockErrorLogger = jest.fn();
      server.mockReturnValue(winstonInstance);
      expressWinston.errorLogger.mockReturnValue(mockErrorLogger);

      // Act
      const result = errorLogger();

      // Assert
      expect(result).toBe(mockErrorLogger);
      expect(server).toHaveBeenCalledTimes(1);
      expect(server).toHaveBeenCalledWith('error');
      expect(expressWinston.errorLogger).toHaveBeenCalledTimes(1);
      expect(expressWinston.errorLogger).toHaveBeenCalledWith({ winstonInstance });
    });
  });
});
