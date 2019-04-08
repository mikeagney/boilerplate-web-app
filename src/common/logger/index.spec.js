import winston from 'winston';
import config from '../config';
import log from './log';
import { client, server, getLogger } from '.';

jest.mock('winston', () => ({
  loggers: {
    has: jest.fn(() => true),
    add: jest.fn(),
    get: jest.fn(),
  },
  format: {
    label: jest.fn(),
    combine: jest.fn(),
  },
}))
  .mock('../config')
  .mock('./log');

describe('common/logger', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getLogger', () => {
    it('will return base logger if logger ID not specified', () => {
      // Arrange
      // Act
      getLogger('server');

      // Assert
      expect(winston.loggers.has).toHaveBeenCalledTimes(1);
      expect(winston.loggers.has).toHaveBeenCalledWith('server');
      expect(winston.loggers.add).not.toHaveBeenCalled();
      expect(winston.loggers.get).toHaveBeenCalledTimes(1);
      expect(winston.loggers.get).toHaveBeenCalledWith('server');
    });

    it('will return specified logger if logger ID specified', () => {
      // Arrange
      // Act
      getLogger('server', 'request');

      // Assert
      expect(winston.loggers.has).toHaveBeenCalledTimes(1);
      expect(winston.loggers.has).toHaveBeenCalledWith('server.request');
      expect(winston.loggers.add).not.toHaveBeenCalled();
      expect(winston.loggers.get).toHaveBeenCalledTimes(1);
      expect(winston.loggers.get).toHaveBeenCalledWith('server.request');
    });

    it('will combine formats if root level log config has a format', () => {
      // Arrange
      const rootFormat = jest.fn();
      const mockConfig = {
        server: { log: 'serverLoggerConfig' },
      };
      const mockLabelFormat = jest.fn();
      const mockCombinedFormat = jest.fn();

      config.mockReturnValue(mockConfig);
      winston.loggers.has.mockReturnValue(false);
      log.mockReturnValue({ format: rootFormat });
      winston.format.label.mockReturnValue(mockLabelFormat);
      winston.format.combine.mockReturnValue(mockCombinedFormat);

      // Act
      getLogger('server');

      // Assert
      expect(winston.format.combine).toHaveBeenCalledTimes(1);
      expect(winston.format.combine).toHaveBeenCalledWith(mockLabelFormat, rootFormat);
      expect(winston.loggers.add).toHaveBeenCalledWith(
        'server',
        expect.objectContaining({
          format: mockCombinedFormat,
        }),
      );
    });

    it.each(['client', 'server'])('will create logger %s if it does not exist', (target) => {
      // Arrange
      const loggerObject = { target };
      const mockConfig = {
        server: { log: 'serverLoggerConfig' },
        client: { log: 'clientLoggerConfig' },
      };
      log.mockImplementation(() => ({ loggerId: `${target}LoggerValue` }));
      const combinedFormat = jest.fn();
      winston.format.label.mockReturnValue(combinedFormat);
      winston.loggers.has.mockReturnValue(false);
      winston.loggers.get.mockReturnValue(loggerObject);
      config.mockReturnValue(mockConfig);

      // Act
      const result = getLogger(target);

      // Assert
      expect(result).toBe(loggerObject);
      expect(config).toHaveBeenCalledTimes(1);
      expect(config).toHaveBeenCalledWith();
      expect(log).toHaveBeenCalledTimes(1);
      expect(log).toHaveBeenCalledWith(`${target}LoggerConfig`);
      expect(winston.format.label).toHaveBeenCalledTimes(1);
      expect(winston.format.label).toHaveBeenCalledWith({ label: target });
      expect(winston.loggers.add).toHaveBeenCalledTimes(1);
      expect(winston.loggers.add).toHaveBeenCalledWith(target, {
        loggerId: `${target}LoggerValue`,
        format: combinedFormat,
      });
    });

    it('will throw if unexpected target type chosen', () => {
      // Arrange
      // Act
      expect(() => getLogger('other'))
        // Assert
        .toThrow('Invalid logger target: other');
    });
  });

  describe('server', () => {
    it('will get a server logger', () => {
      // Arrange
      // Act
      server('request');

      // Assert
      expect(winston.loggers.has).toHaveBeenCalledTimes(1);
      expect(winston.loggers.has).toHaveBeenCalledWith('server.request');
    });
  });

  describe('client', () => {
    it('will get a client logger', () => {
      // Arrange
      // Act
      client('request');

      // Assert
      expect(winston.loggers.has).toHaveBeenCalledTimes(1);
      expect(winston.loggers.has).toHaveBeenCalledWith('client.request');
    });
  });
});
