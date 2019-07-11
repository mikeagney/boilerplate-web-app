import { MongoClient } from 'mongodb';
import config from '../../common/config';
import { server as serverLogger } from '../../common/logger';

class DbClient {
  constructor() {
    this.dbConfig = config().server.db;
    this.logger = serverLogger('database');
  }

  /**
   * Connect to the database and return a collection on the default database.
   * @param {string} collectionName
   *   The name of the collection on the database.
   * @param {(collection:import('mongodb').Collection,db,dbClient)=>Promise<any>} callback
   *   The method to call once the collection has been obtained.
   */
  async getCollection(collectionName, callback) {
    this.logger.info(`getCollection('${collectionName}'): Called`);
    const dbClient = new MongoClient(this.dbConfig.connectionString);
    try {
      this.logger.verbose(
        `getCollection('${collectionName}'): Attempting to connect with connection string '${
          this.dbConfig.connectionString
        }'`,
      );
      await dbClient.connect();

      this.logger.verbose(
        `getCollection('${collectionName}'): Obtaining collection from '${
          this.dbConfig.databaseName
        }'`,
      );
      const db = dbClient.db(this.dbConfig.databaseName);
      const collection = db.collection(collectionName);

      this.logger.verbose(`getCollection('${collectionName}'): Performing database operation`);
      const result = await callback(collection, db, dbClient);

      this.logger.info(`getCollection('${collectionName}'): Complete`);
      return result;
    } catch (err) {
      this.logger.error(`getCollection('${collectionName}'): Failed with error`);
      this.logger.error(err);
      throw err;
    } finally {
      this.logger.verbose(`getCollection('${collectionName}'): Closing connection`);
      dbClient.close();
    }
  }
}

export default DbClient;
