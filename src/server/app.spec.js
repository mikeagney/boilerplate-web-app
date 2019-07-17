import express from 'express';
import config from '../common/config';
import { server as serverLogger } from '../common/logger';
import { preAppHandlers, postAppHandlers } from './middleware';
import RootRouter from './paths/root-router';
import App from './app';

jest
  .mock('express')
  .mock('../common/config')
  .mock('../common/logger')
  .mock('./client/db-migrate')
  .mock('./middleware')
  .mock('./paths/root-router');

describe('Express app', () => {
  describe('initialize', () => {
    it('will create and set up an Express app instance', () => {
      // Arrange
      const mockExpress = { use: jest.fn() };
      express.mockReturnValue(mockExpress);

      const mockConfig = {};
      config.mockReturnValue(mockConfig);

      const mockLogger = jest.fn();
      serverLogger.mockReturnValue(mockLogger);

      const preAppHandlersValues = [jest.fn(), jest.fn()];
      preAppHandlers.mockReturnValue(preAppHandlersValues);

      const postAppHandlersValues = [jest.fn(), jest.fn()];
      postAppHandlers.mockReturnValue(postAppHandlersValues);

      const mockRootRouter = {
        initialize: jest.fn().mockReturnThis(),
        router: {},
      };
      RootRouter.mockImplementation(() => mockRootRouter);

      // Act
      const app = new App();
      const result = app.initialize();

      // Assert
      expect(result).toBe(app);
      expect(app.app).toBe(mockExpress);
      expect(app.config).toBe(mockConfig);
      expect(app.logger).toBe(mockLogger);
    });
  });

  describe('listen', () => {
    it('will invoke listen on the initialized app', async () => {
      // Arrange
      const app = new App();
      app.app = {
        listen: jest.fn(),
      };
      app.config = {
        server: {
          port: 12345,
        },
      };
      app.dbMigrate = { up: jest.fn().mockResolvedValue() };

      // Act
      await app.listen();

      // Assert
      expect(app.dbMigrate.up).toHaveBeenCalledTimes(1);
      expect(app.app.listen).toHaveBeenCalledWith(12345, expect.anything(Function));
    });

    it('will log startup line after listen setup is complete', async () => {
      // Arrange
      const app = new App();
      app.app = {
        listen: jest.fn(),
      };
      app.config = {
        name: 'Mock env',
        server: {
          port: 12345,
        },
      };
      app.logger = { info: jest.fn() };
      app.dbMigrate = { up: jest.fn().mockResolvedValue() };
      await app.listen();
      const listenCallback = app.app.listen.mock.calls[0][1];

      // Act
      listenCallback();

      // Assert
      expect(app.logger.info).toHaveBeenCalledWith(
        expect.stringContaining('environment "Mock env"'),
      );
      expect(app.logger.info).toHaveBeenCalledWith(expect.stringContaining('port 12345'));
    });
  });
});
