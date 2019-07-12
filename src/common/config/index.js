function config() {
  const { BUILD_ENV: buildEnv = 'development' } = process.env;
  // eslint-disable-next-line global-require, import/no-dynamic-require
  return require(`./env/${buildEnv}`);
}

export default config;
