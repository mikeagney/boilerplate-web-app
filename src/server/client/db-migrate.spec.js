import Umzug from 'umzug';
import { server as serverLogger } from '../../common/logger';
import DbClient from './db-client';
import DbMigrate from './db-migrate';

jest
  .mock('umzug')
  .mock('../../common/logger')
  .mock('./db-client');

describe('Database migration driver', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('constructor', () => {
    it('will use DbClient and a database logger', () => {
      // Arrange
      const logger = {};
      const dbClient = {};
      DbClient.mockImplementation(() => dbClient);
      serverLogger.mockReturnValue(logger);

      // Act
      const result = new DbMigrate();

      // Assert
      expect(DbClient).toHaveBeenCalledTimes(1);
      expect(DbClient).toHaveBeenCalledWith();
      expect(result.dbClient).toBe(dbClient);

      expect(serverLogger).toHaveBeenCalledTimes(1);
      expect(serverLogger).toHaveBeenCalledWith('database');
      expect(result.logger).toBe(logger);
    });
  });

  describe('umzug', () => {
    it('will create the Umzug migration object', () => {
      // Arrange
      const dbMigrate = new DbMigrate();
      const db = {};

      // Act
      dbMigrate.umzug(db);

      // Assert
      expect(Umzug).toHaveBeenCalledWith({
        storage: 'mongodb',
        storageOptions: {
          connection: db,
        },
        logging: expect.any(Function),
        migrations: expect.objectContaining({
          params: [db],
        }),
      });
    });

    it('will use the system logger for logging', () => {
      // Arrange
      const dbMigrate = new DbMigrate();
      dbMigrate.logger = { info: jest.fn() };
      const db = {};
      dbMigrate.umzug(db);
      const { logging } = Umzug.mock.calls[0][0];

      // Act
      logging('Test log');

      // Assert
      expect(dbMigrate.logger.info).toHaveBeenCalledWith('Test log');
    });
  });

  describe('up and down', () => {
    it.each(['up', 'down'])('will invoke the database with umzug.{0}', async (method) => {
      // Arrange
      const dbMigrate = new DbMigrate();
      const expectedResult = {};
      const mockUmzug = {
        up: jest.fn().mockResolvedValue(expectedResult),
        down: jest.fn().mockResolvedValue(expectedResult),
      };
      dbMigrate.umzug = jest.fn().mockReturnValue(mockUmzug);
      dbMigrate.dbClient = {
        getDatabase: jest.fn().mockImplementation(callback => callback()),
      };

      // Act
      const result = await dbMigrate[method]();

      // Assert
      expect(result).toBe(expectedResult);
      expect(mockUmzug[method]).toHaveBeenCalledTimes(1);
    });
  });
});
