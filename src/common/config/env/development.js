import merge from 'merge';
import all from './all';

export default merge.recursive(
  all,
  {
    name: 'development',
    server: {
      log: {
        level: 'silly',
        transports: [{
          type: 'Console',
          options: {
            format: ['timestamp', 'colorize', 'simple'],
          },
        }],
      },
    },
    client: {
      log: {
        level: 'silly',
        transports: [{
          type: 'Console',
          options: {
            format: ['timestamp', 'colorize', 'simple'],
          },
        }],
      },
    },
  },
);
