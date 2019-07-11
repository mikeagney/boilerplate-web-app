import { MongoClient } from 'mongodb';
import config from '../../common/config';
import { server as serverLogger } from '../../common/logger';
import DbClient from './db-client';

jest
  .mock('mongodb')
  .mock('../../common/config')
  .mock('../../common/logger');

describe('Database client', () => {
  const dbConfig = {
    connectionString: 'mongodb://mockserver:27017/',
    databaseName: 'mockDb',
  };
  const logger = {
    error: jest.fn(),
    info: jest.fn(),
    verbose: jest.fn(),
  };
  const mongoClient = {
    connect: jest.fn(),
    db: jest.fn(),
    close: jest.fn(),
  };
  const mongoClientDb = {
    collection: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    config.mockReturnValue({
      server: {
        db: dbConfig,
      },
    });
    serverLogger.mockReturnValue(logger);
    MongoClient.mockImplementation(() => mongoClient);
    mongoClient.db.mockReturnValue(mongoClientDb);
  });

  describe('constructor', () => {
    it('will retrieve configuration and get a logger', () => {
      // Arrange
      // Act
      const dbClient = new DbClient();

      // Assert
      expect(config).toHaveBeenCalledTimes(1);
      expect(config).toHaveBeenCalledWith();
      expect(dbClient.dbConfig).toBe(dbConfig);

      expect(serverLogger).toHaveBeenCalledTimes(1);
      expect(serverLogger).toHaveBeenCalledWith('database');

      expect(dbClient.logger).toBe(logger);
    });
  });

  describe('getCollection', () => {
    it('will log error when connect fails', async () => {
      // Arrange
      const err = new Error('Mock connection error');
      mongoClient.connect.mockRejectedValue(err);
      const callback = jest.fn();

      // Act
      const dbClient = new DbClient();
      await expect(dbClient.getCollection('mockCollection', callback)).rejects.toThrow(
        'Mock connection error',
      );

      // Assert
      expect(callback).not.toHaveBeenCalled();
      expect(logger.error).toHaveBeenCalledTimes(2);
      expect(logger.error).toHaveBeenCalledWith(err);
      expect(logger.info).toHaveBeenCalledTimes(1);
      expect(logger.verbose).toHaveBeenCalledTimes(2);
    });

    it('will log error when callback fails', async () => {
      // Arrange
      const err = new Error('Mock callback error');
      mongoClient.connect.mockResolvedValue();
      const callback = jest.fn().mockRejectedValue(err);

      // Act
      const dbClient = new DbClient();
      await expect(dbClient.getCollection('mockCollection', callback)).rejects.toThrow(
        'Mock callback error',
      );

      // Assert
      expect(logger.error).toHaveBeenCalledTimes(2);
      expect(logger.error).toHaveBeenCalledWith(err);
      expect(logger.info).toHaveBeenCalledTimes(1);
      expect(logger.verbose).toHaveBeenCalledTimes(4);
    });

    it('will resolve with callback result', async () => {
      // Arrange
      const result = {};
      mongoClient.connect.mockResolvedValue();
      const callback = jest.fn().mockResolvedValue(result);

      // Act
      const dbClient = new DbClient();
      const actualResult = await dbClient.getCollection('mockCollection', callback);

      // Assert
      expect(actualResult).toBe(result);
      expect(logger.error).not.toHaveBeenCalled();
      expect(logger.info).toHaveBeenCalledTimes(2);
      expect(logger.verbose).toHaveBeenCalledTimes(4);
    });
  });
});
