import { MongoClient } from 'mongodb';
import config from '../../common/config';
import { server as serverLogger } from '../../common/logger';

class DbClient {
  constructor() {
    this.dbConfig = config().server.db;
    this.logger = serverLogger('database');
  }

  /**
   * Connect to the database, perform an operation, and then close.
   * @param {(db:import('mongodb').Db,dbClient:MongoClient)=>Promise<any>} callback
   *   The method to call once the connection has been obtained.
   * @returns {Promise}
   *   A promise that resolves to whatever the callback resolves to.
   */
  async getDatabase(callback) {
    this.logger.info('Called');
    const dbClient = new MongoClient(this.dbConfig.connectionString, { useNewUrlParser: true });
    try {
      this.logger.verbose(
        `Attempting to connect with connection string '${this.dbConfig.connectionString}'`,
      );
      await dbClient.connect();

      const db = dbClient.db(this.dbConfig.databaseName);

      this.logger.verbose('Performing database operation');
      const result = await callback(db, dbClient);

      this.logger.info('Complete');
      return result;
    } catch (error) {
      this.logger.error('Failed with error', error);
      throw error;
    } finally {
      this.logger.verbose('Closing connection');
      dbClient.close();
    }
  }
}

export default DbClient;
