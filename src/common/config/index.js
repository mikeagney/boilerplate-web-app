import Joi from '@hapi/joi';
import { unflatten } from 'flat';
import fromPairs from 'lodash/fromPairs';
import { CONFIG_BASE_KEY } from './constants';
import schema from './schema';

let cachedConfig;

export function setConfig(newConfig) {
  cachedConfig = newConfig;
}

function readConfig() {
  const configFromEnv = unflatten(
    fromPairs(Object.entries(process.env).filter(([key]) => key.startsWith(CONFIG_BASE_KEY))),
    { delimiter: '_' },
  );
  const configValue = configFromEnv[CONFIG_BASE_KEY];
  // TODO: Make this server-only section so that tree shaking can exclude
  // it from the browser bundle
  if (typeof window === 'undefined') {
    const validationResult = Joi.validate(configValue, schema());
    if (validationResult.error) {
      // eslint-disable-next-line no-console
      console.error('Config validation failed', validationResult.error);
    }
  }
  return configValue;
}

function config() {
  if (!cachedConfig) {
    cachedConfig = readConfig();
  }
  return cachedConfig;
}

export default config;
