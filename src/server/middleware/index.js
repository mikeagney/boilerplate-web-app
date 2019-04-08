import { logger, errorLogger } from './logger-middlewares';

/**
 * Gets the Express middlewares that should be applied before any
 * application-specific handlers.
 * @returns {import('express').Handler[]}
 */
export function preAppHandlers() {
  return [
    logger(),
  ];
}

/**
 * Gets the Express middlewares that should be applied after any
 * application-specific handlers.
 * @returns {import('express').Handler[]}
 */
export function postAppHandlers() {
  return [
    errorLogger(),
  ];
}
