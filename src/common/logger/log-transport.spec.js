import Joi from 'joi';
import winston from 'winston';
import logFormatters from './log-formatters';
import logTransport, { schema } from './log-transport';

jest.mock('./log-formatters')
  .mock('winston', () => ({
    transports: {
      File: jest.fn(),
      Console: jest.fn(),
    },
  }));

describe('common/logger/log-transport', () => {
  describe('schema', () => {
    it('will validate with no options specified', () => {
      // Arrange
      // Act
      const result = Joi.validate({ type: 'Console' }, schema());

      // Assert
      expect(result.error).toBeNull();
    });

    it('will fail to validate with no type specified', () => {
      // Arrange
      // Act
      const result = Joi.validate({}, schema());

      // Assert
      expect(result.error).not.toBeNull();
    });

    it('will fail to validate with invalid type specified', () => {
      // Arrange
      // Act
      const result = Joi.validate({ type: 23 }, schema());

      // Assert
      expect(result.error).not.toBeNull();
    });

    it('will fail to validate with invalid level', () => {
      // Arrange
      // Act
      const result = Joi.validate({ type: 'Console', options: { level: 'nonsense' } }, schema());

      // Assert
      expect(result.error).not.toBeNull();
    });

    it('will fail to validate with invalid format', () => {
      // Arrange
      // Act
      const result = Joi.validate({ type: 'Console', options: { format: 23 } }, schema());

      // Assert
      expect(result.error).not.toBeNull();
    });

    it('will fail to validate with invalid filename', () => {
      // Arrange
      // Act
      const result = Joi.validate({ type: 'Console', options: { filename: 23 } }, schema());

      // Assert
      expect(result.error).not.toBeNull();
    });
  });

  it.each([
    ['File', winston.transports.File],
    ['Console', winston.transports.Console],
  ])('will construct the appropriate winston transport for %s', (type, Transport) => {
    // Arrange
    const options = { random: 'value' };

    // Act
    const result = logTransport({ type, options });

    // Assert
    expect(result).toEqual(expect.any(Transport));
    expect(logFormatters).not.toHaveBeenCalled();
    expect(Transport).toHaveBeenCalledWith(options);
  });

  it('will throw if an unsupported trasnport type is passed', () => {
    // Act
    expect(() => logTransport({ type: 'garbage' }))
      // Assert
      .toThrow('Transport not supported: garbage');
  });

  it('will process format option', () => {
    // Arrange
    const options = { level: 'info', format: ['colorize', 'json'] };
    const combinedFormat = {};
    logFormatters.mockReturnValue(combinedFormat);

    // Act
    logTransport({ type: 'Console', options });

    // Assert
    expect(logFormatters).toHaveBeenCalledWith(['colorize', 'json']);
    expect(winston.transports.Console).toHaveBeenCalledWith({
      level: 'info',
      format: combinedFormat,
    });
  });
});
