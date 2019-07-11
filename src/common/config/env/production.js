import merge from 'merge';
import all from './all';

export default merge.recursive(all, {
  name: 'production',
  server: {
    port: 443,
    https: {
      enabled: true,
      // Figure out key management
    },
    log: {
      level: 'warn',
      transports: [
        {
          type: 'File',
          options: {
            filename: '{LOG_ROOT}/{LOG_NAME}',
          },
        },
      ],
    },
    db: {
      connectionString: 'mongodb://host.does.not.exist.yet:27017',
    },
  },
  client: {
    log: {
      level: 'warn',
      transports: [
        {
          type: 'Http',
          options: {
            path: '/api/log',
            ssl: true,
          },
        },
      ],
    },
  },
});
