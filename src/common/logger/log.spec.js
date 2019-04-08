import Joi from 'joi';
import log, { schema } from './log';
import logTransport, { schema as logTransportSchema } from './log-transport';
import logFormatters from './log-formatters';

jest.mock('./log-transport').mock('./log-formatters');

describe('common/logger/log', () => {
  beforeEach(() => {
    logTransportSchema.mockReturnValue(Joi.string().valid('File', 'Console'));
  });

  describe('schema', () => {
    it('will validate with valid level and transports', () => {
      // Arrange
      // Act
      const result = Joi.validate({ level: 'info', transports: ['Console'] }, schema());

      // Assert
      expect(result.error).toBeNull();
    });

    it('will fail to validate with missing level', () => {
      // Arrange
      // Act
      const result = Joi.validate({ transports: ['Console'] }, schema());

      // Assert
      expect(result.error).not.toBeNull();
    });

    it('will fail to validate with missing transport array', () => {
      // Arrange
      // Act
      const result = Joi.validate({ level: 'info' }, schema());

      // Assert
      expect(result.error).not.toBeNull();
    });

    it('will fail to validate with empty transport array', () => {
      // Arrange
      // Act
      const result = Joi.validate({ level: 'info', transports: [] }, schema());

      // Assert
      expect(result.error).not.toBeNull();
    });

    it('will fail to validate with invalid transport array', () => {
      // Arrange
      // Act
      const result = Joi.validate({ level: 'info', transports: ['Missing'] }, schema());

      // Assert
      expect(result.error).not.toBeNull();
    });

    it('will fail to validate with invalid format', () => {
      // Arrange
      // Act
      const result = Joi.validate({ level: 'info', transports: ['Console'], format: 23 }, schema());

      // Assert
      expect(result.error).not.toBeNull();
    });
  });

  it('will not map format if not present', () => {
    // Arrange
    // Act
    const result = log({ level: 'info', random: 'value' });

    // Assert
    expect(result).toEqual({
      level: 'info',
      random: 'value',
      transports: [],
    });
    expect(logFormatters).not.toHaveBeenCalled();
  });

  it('will map format if present', () => {
    // Arrange
    const combinedFormat = {};
    logFormatters.mockReturnValue(combinedFormat);

    // Act
    const result = log({ level: 'info', random: 'value', format: ['colorize'] });

    // Assert
    expect(result).toEqual({
      level: 'info',
      random: 'value',
      format: combinedFormat,
      transports: [],
    });
    expect(logFormatters).toHaveBeenCalledTimes(1);
    expect(logFormatters).toHaveBeenCalledWith(['colorize']);
  });

  it('will map transports', () => {
    // Arrange
    const transports = [{}, {}];
    logTransport.mockReturnValueOnce(transports[0]);
    logTransport.mockReturnValueOnce(transports[1]);

    // Act
    const result = log({ level: 'info', transports: ['File', 'Console'] });

    // Assert
    expect(result.transports).toEqual(transports);
    expect(logTransport).toHaveBeenCalledTimes(2);
    expect(logTransport).toHaveBeenCalledWith('File');
    expect(logTransport).toHaveBeenCalledWith('Console');
  });
});
