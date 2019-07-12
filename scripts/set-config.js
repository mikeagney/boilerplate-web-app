const commandLineUsage = require('command-line-usage');
const commandLineArgs = require('command-line-args');
const path = require('path');
const flatten = require('flat');
const environments = require('../src/common/config/environments');

const optionList = [
  {
    name: 'env',
    alias: 'e',
    type: String,
    defaultOption: true,
    typeLabel: '{underline environment}',
    description: 'The environment preset to use.',
  },
  {
    name: 'help',
    alias: 'h',
    type: Boolean,
    description: 'Print this usage guide.',
  },
  {
    name: 'dry-run',
    alias: 'd',
    type: Boolean,
    description: 'Do not actually set environment variables.',
  },
  {
    name: 'verbose',
    alias: 'v',
    type: Boolean,
    description: 'Write the environment variables to standard output.',
  },
  { name: 'debug', type: Boolean },
];

const usageSections = [
  {
    header: 'set-config',
    content: 'Applies a preset collection of variables to the environment.',
  },
  {
    header: 'Synopsis',
    content: [
      '$ set-config [{bold -dv}] [{bold --env}] {underline environment}',
      '$ set-config {bold --help}',
    ],
  },
  { header: 'Options', hide: ['debug'], optionList },
  { header: 'Supported presets', content: environments },
];

function printHelp() {
  console.log(commandLineUsage(usageSections));
}

const options = commandLineArgs(optionList);
if (options.help || !options.env) {
  printHelp();
  return;
}

let config = null;
try {
  const configPath = path.resolve(__dirname, '../src/common/config/env', options.env);
  // eslint-disable-next-line global-require, import/no-dynamic-require
  config = require(configPath);
} catch (e) {
  if (options.debug) {
    console.error(e);
  }
}

if (!config) {
  console.error(`Error: environment ${options.env} not found.`);
  printHelp();
  return;
}

if (!options.verbose) {
  console.log(`Using configuration ${options.env}`);
}

const flattenedConfig = flatten({ BOILERPLATE_CONFIG: config });
Object.keys(flattenedConfig).forEach((configKey) => {
  if (options.verbose) {
    console.log(`${configKey}=${flattenedConfig[configKey]}`);
  }
  if (!options['dry-run']) {
    process.env[configKey] = flattenedConfig[configKey];
  }
});
