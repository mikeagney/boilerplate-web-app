import { unflatten } from 'flat';
import fromPairs from 'lodash/fromPairs';
import { CONFIG_BASE_KEY } from './constants';

function config() {
  if (process.env[`${CONFIG_BASE_KEY}.name`]) {
    const configFromEnv = unflatten(
      fromPairs(Object.entries(process.env).filter(([key]) => key.startsWith(CONFIG_BASE_KEY))),
    );
    return configFromEnv.BOILERPLATE_CONFIG;
  }

  const { BUILD_ENV: buildEnv = 'development' } = process.env;
  // eslint-disable-next-line global-require, import/no-dynamic-require
  return require(`./env/${buildEnv}`);
}

export default config;
