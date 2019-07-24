import Joi from '@hapi/joi';
import config, { setConfig } from './index';

jest.mock('@hapi/joi');

describe('common/config', () => {
  beforeEach(() => {
    setConfig(undefined);
    jest.clearAllMocks();
  });

  it('will not log error in the browser on invalid config', () => {
    // Arrange
    // Act
    config();

    // Assert
    expect(Joi.validate).not.toHaveBeenCalled();
  });
});
