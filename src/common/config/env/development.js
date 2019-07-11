import merge from 'merge';
import all from './all';

export default merge.recursive(all, {
  name: 'development',
  server: {
    log: {
      level: 'silly',
      transports: [
        {
          type: 'Console',
          options: {
            format: ['timestamp', 'colorize', 'simple'],
          },
        },
      ],
    },
    db: {
      connectionString: 'mongodb://localhost:27017',
    },
  },
  client: {
    log: {
      level: 'silly',
      transports: [
        {
          type: 'Console',
          options: {
            format: ['timestamp', 'colorize', 'simple'],
          },
        },
      ],
    },
  },
});
