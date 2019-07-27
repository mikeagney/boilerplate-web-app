require('@babel/register');
require('dotenv/config');
const commandLineUsage = require('command-line-usage');
const commandLineArgs = require('command-line-args');
const DbMigrate = require('../src/server/client/db-migrate').default;

const commands = [
  {
    name: 'up',
    summary: 'Upgrades the database to a later migration.',
    optionList: [
      {
        name: 'help',
        alias: 'h',
        type: Boolean,
        description: 'Print this usage guide.',
      },
      {
        name: 'from',
        alias: 'f',
        type: String,
        typeLabel: '{underline migration}',
        description: 'Only run migrations starting from the specified migration.',
      },
      {
        name: 'to',
        alias: 't',
        type: String,
        description:
          'Run migrations up to the specified migration. '
          + 'If not specified, all forward migrations will be run.',
        typeLabel: '{underline migration}',
        defaultOption: true,
      },
    ],
    usageSections: [
      { header: 'migrate-db up', content: 'Upgrades the current database.' },
      {
        header: 'Usage',
        content: [
          '$ yarn migrate-db up [{bold --from} {underline migration}] [{bold --to} {underline migration}]',
          '$ yarn migrate-db up [{underline migration}]',
        ],
      },
      { header: 'Options' },
    ],
  },
  {
    name: 'down',
    summary: 'Downgrades the database to an earlier migration.',
    optionList: [
      {
        name: 'help',
        alias: 'h',
        type: Boolean,
        description: 'Print this usage guide.',
      },
      {
        name: 'from',
        alias: 'f',
        type: String,
        description: 'Only revert migrations starting from the specified migration.',
      },
      {
        name: 'to',
        alias: 't',
        type: String,
        description:
          'Revert migrations up to the specified migration. '
          + 'If not specified, the most recent migration will be reverted. '
          + 'Specify "0" to revert all migrations.',
        defaultOption: true,
      },
    ],
    usageSections: [
      { header: 'migrate-db down', content: 'Downgrades the current database.' },
      {
        header: 'Usage',
        content: [
          '$ yarn migrate-db down [{bold --from} {underline migration}] [{bold --to} {underline migration}] ',
          '$ yarn migrate-db down [{underline migration}]',
        ],
      },
      { header: 'Options' },
    ],
  },
];

commands.forEach((command) => {
  const optionsSection = (command.usageSections || []).find(
    section => section.header === 'Options',
  );
  if (optionsSection) {
    optionsSection.optionList = command.optionList;
  }
});

const mainOptionList = [
  {
    name: 'help',
    alias: 'h',
    type: Boolean,
    description: 'Print this usage guide.',
  },
];

const mainUsageSections = [
  {
    header: 'migrate-db',
    content: 'Migrates the current database.',
  },
  {
    header: 'Usage',
    content: ['$ yarn migrate-db {bold [command]}', '$ yarn migrate-db {bold --help}'],
  },
  { header: 'Options', optionList: mainOptionList },
  { header: 'Commands', content: commands.map(({ name, summary }) => ({ name, summary })) },
];

function printHelp(usageSections = mainUsageSections) {
  console.log(commandLineUsage(usageSections));
}

const mainCommandOptions = commandLineArgs(mainOptionList, { stopAtFirstUnknown: true });
// eslint-disable-next-line no-underscore-dangle
const commandArgv = mainCommandOptions._unknown || [];
const mainCommandName = commandArgv.shift();

if (mainCommandOptions.help || !mainCommandName) {
  printHelp();
  process.exit(0);
}

const command = commands.find(c => c.name === mainCommandName);
if (!command) {
  console.error(`Invalid command: ${mainCommandName}.`);
  printHelp();
  process.exit(1);
}

const commandOptions = commandLineArgs(command.optionList, { argv: commandArgv });
if (commandOptions.help) {
  printHelp(command.usageSections);
  process.exit(0);
}

const dbMigrate = new DbMigrate();

dbMigrate[command.name](commandOptions)
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
