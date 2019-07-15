import { unflatten } from 'flat';
import fromPairs from 'lodash/fromPairs';
import { CONFIG_BASE_KEY } from './constants';

let cachedConfig;

export function clearCache() {
  cachedConfig = undefined;
}

function readConfig() {
  if (process.env[`${CONFIG_BASE_KEY}_name`]) {
    const configFromEnv = unflatten(
      fromPairs(Object.entries(process.env).filter(([key]) => key.startsWith(CONFIG_BASE_KEY))),
      { delimiter: '_' },
    );
    return configFromEnv[CONFIG_BASE_KEY];
  }

  const { BUILD_ENV: buildEnv = 'development' } = process.env;
  // eslint-disable-next-line global-require, import/no-dynamic-require
  return require(`./env/${buildEnv}`);
}

function config() {
  if (!cachedConfig) {
    cachedConfig = readConfig();
  }
  return cachedConfig;
}

export default config;
