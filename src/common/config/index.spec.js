import Joi from '@hapi/joi';
import config from './index';
import schema from './schema';
import environments from './environments';

describe('common/config', () => {
  beforeEach(() => {
    delete process.env['BOILERPLATE_CONFIG.name'];
    jest.resetModules();
  });

  it.each([...environments])('will have a valid environment for %s', (env) => {
    // Arrange
    process.env.BUILD_ENV = env;

    // Act
    const actualConfig = config();
    const validationResult = Joi.validate(actualConfig, schema());

    // Assert
    expect(validationResult).toMatchObject({ error: null });
  });

  it('will return development environment if environment not specified', () => {
    // Arrange
    delete process.env.BUILD_ENV;

    // Act
    const actualConfig = config();

    // Assert
    expect(actualConfig.name).toEqual('development');
  });

  it('will return config from environment variables if specified', () => {
    // Arrange
    process.env['BOILERPLATE_CONFIG.name'] = 'mock';

    // Act
    const actualConfig = config();

    // Assert
    expect(actualConfig).toEqual({ name: 'mock' });
  });
});
