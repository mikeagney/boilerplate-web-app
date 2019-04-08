function config(env = process.env) {
  const { BUILD_ENV: buildEnv = 'development' } = env;
  // eslint-disable-next-line global-require, import/no-dynamic-require
  return require(`./env/${buildEnv}`).default;
}

export default config;
