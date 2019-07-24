/* eslint-disable no-console */
import path from 'path';
import dotenv from 'dotenv';
import { CONFIG_BASE_KEY } from './constants';
import config, { setConfig } from './index';

describe('common/config', () => {
  beforeEach(() => {
    Object.entries(process.env)
      .map(([key]) => key)
      .filter(key => key.startsWith(CONFIG_BASE_KEY))
      .forEach((key) => {
        delete process.env[key];
      });
    process.env.BOILERPLATECONFIG_name = 'mock';
    setConfig(undefined);
    jest.clearAllMocks();
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    console.error.mockRestore();
  });

  it('will log error on invalid config', () => {
    // Arrange
    // Act
    config();

    // Assert
    expect(console.error).toHaveBeenCalledTimes(1);
  });

  it('will not log error on valid config', () => {
    // Arrange
    dotenv.config({ path: path.resolve(__dirname, './test-config.env') });

    // Act
    config();

    // Assert
    expect(console.error).not.toHaveBeenCalled();
  });
});
