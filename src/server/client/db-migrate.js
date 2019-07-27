import path from 'path';
import Umzug from 'umzug';
import { server as serverLogger } from '../../common/logger';
import DbClient from './db-client';

class DbMigrate {
  constructor() {
    this.dbClient = new DbClient();
    this.logger = serverLogger('database');
  }

  umzug(db) {
    return new Umzug({
      storage: 'mongodb',
      storageOptions: {
        connection: db,
      },
      logging: message => this.logger.info(message),
      migrations: {
        params: [db],
        pattern: /^\d{8}-\d+\.\d+\.\d+-[\w-]+\.js$/,
        path: path.resolve(__dirname, '../../../migrations'),
      },
    });
  }

  async up(...args) {
    return this.dbClient.getDatabase(db => this.umzug(db).up(...args));
  }

  async down(...args) {
    return this.dbClient.getDatabase(db => this.umzug(db).down(...args));
  }
}

export default DbMigrate;
