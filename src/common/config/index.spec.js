import Joi from '@hapi/joi';
import config, { clearCache } from './index';
import schema from './schema';
import environments from './environments';

describe('common/config', () => {
  beforeEach(() => {
    delete process.env.BOILERPLATECONFIG_name;
    clearCache();
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
    process.env.BOILERPLATECONFIG_name = 'mock';

    // Act
    const actualConfig = config();

    // Assert
    expect(actualConfig).toEqual({ name: 'mock' });
  });

  it('will use cached data if config is called twice', () => {
    // Arrange
    process.env.BOILERPLATECONFIG_name = 'mock';

    // Act
    const actualConfig = config();
    const actualConfig2 = config();

    // Assert
    expect(actualConfig2).toBe(actualConfig);
  });
});
