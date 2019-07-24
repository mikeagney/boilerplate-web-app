/* eslint-disable no-console */
import config, { setConfig } from './index';

describe('common/config', () => {
  beforeEach(() => {
    process.env.BOILERPLATECONFIG_name = 'mock';
    setConfig(undefined);
    jest.clearAllMocks();
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    console.error.mockRestore();
  });

  it('will return config from environment variables if specified', () => {
    // Arrange
    // Act
    const actualConfig = config();

    // Assert
    expect(actualConfig).toEqual({ name: 'mock' });
  });

  it('will use cached data if config is called twice', () => {
    // Arrange
    // Act
    const actualConfig = config();
    const actualConfig2 = config();

    // Assert
    expect(actualConfig2).toBe(actualConfig);
  });
});
