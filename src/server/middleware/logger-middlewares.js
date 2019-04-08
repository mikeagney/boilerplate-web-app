import expressWinston from 'express-winston';
import { server } from '../../common/logger';

/**
 * Gets an Express middleware for logging incoming requests.
 * @returns {import('express').Handler}
 */
export function logger() {
  return expressWinston.logger({ winstonInstance: server('request') });
}

/**
 * Gets an Express middleware for logging errors on handling requests.
 * @returns {import('express').ErrorHandler}
 */
export function errorLogger() {
  return expressWinston.errorLogger({ winstonInstance: server('error') });
}
