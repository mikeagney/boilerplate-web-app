import Joi from 'joi';
import winston from 'winston';
import logFormatter, { schema } from './log-formatter';

jest.mock('winston', () => ({
  format: {
    colorize: jest.fn(),
  },
}));

describe('common/logger/log-formatter', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('schema', () => {
    it('will validate for a simple string', () => {
      // Arrange
      // Act
      const result = Joi.validate('colorize', schema());

      // Assert
      expect(result.error).toBeNull();
    });

    it('will fail to validate for a non-string non-array', () => {
      // Arrange
      // Act
      const result = Joi.validate(23, schema());

      // Assert
      expect(result.error).not.toBeNull();
    });

    it('will validate for a valid array', () => {
      // Arrange
      // Act
      const result = Joi.validate(['colorize', {}], schema());

      // Assert
      expect(result.error).toBeNull();
    });

    it('will fail to validate for an array that does not start with a string', () => {
      // Arrange
      // Act
      const result = Joi.validate([23], schema());

      // Assert
      expect(result.error).not.toBeNull();
    });
  });

  it('will return nothing for nonexistent formatter type', () => {
    // Arrange
    // Act
    const result = logFormatter('thisFormatDoesNotExist');

    // Assert
    expect(result).toBeNull();
  });

  it('will construct existing Winston formatter with default options', () => {
    // Arrange
    const constructed = {};
    winston.format.colorize.mockReturnValue(constructed);

    // Act
    const result = logFormatter('colorize');

    // Assert
    expect(result).toBe(constructed);
    expect(winston.format.colorize).toHaveBeenCalledTimes(1);
    expect(winston.format.colorize).toHaveBeenCalledWith();
  });

  it('will construct formatter with supplied options', () => {
    // Arrange
    const options = { option: 'one' };
    const constructed = {};
    winston.format.colorize.mockReturnValue(constructed);

    // Act
    const result = logFormatter(['colorize', options, 23]);

    // Assert
    expect(result).toBe(constructed);
    expect(winston.format.colorize).toHaveBeenCalledTimes(1);
    expect(winston.format.colorize).toHaveBeenCalledWith(options, 23);
  });
});
