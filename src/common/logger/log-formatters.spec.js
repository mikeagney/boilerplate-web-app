import winston from 'winston';
import logFormatter from './log-formatter';
import logFormatters from './log-formatters';

jest
  .mock('winston', () => ({
    format: {
      combine: jest.fn(),
    },
  }))
  .mock('./log-formatter');

describe('common/logger/log-formatters', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('will call winston.format.combine with created formatters', () => {
    // Arrange
    const formatters = [{ formatter: 'one' }, { formatter: 'two' }];
    const combinedFormatter = { formatter: 'combined' };
    logFormatter.mockReturnValueOnce(formatters[0]);
    logFormatter.mockReturnValueOnce(formatters[1]);
    winston.format.combine.mockReturnValue(combinedFormatter);

    // Act
    const result = logFormatters(['colorize', 'json']);

    // Assert
    expect(result).toBe(combinedFormatter);
    expect(winston.format.combine).toHaveBeenCalledWith(...formatters);
    expect(logFormatter).toHaveBeenCalledTimes(2);
    expect(logFormatter).toHaveBeenCalledWith('colorize');
    expect(logFormatter).toHaveBeenCalledWith('json');
  });
});
