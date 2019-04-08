import winston from 'winston';
import config from '../config';
import log from './log';

function getLoggerConfig(target) {
  switch (target) {
    case 'server':
      return log(config().server.log);
    case 'client':
      return log(config().client.log);
    default:
      throw new Error(`Invalid logger target: ${target}`);
  }
}

function prependLabel(format, label) {
  const labelFormat = winston.format.label({ label });
  return format ? winston.format.combine(labelFormat, format) : labelFormat;
}

/**
 * Test hook only.
 */
export function getLogger(target, loggerId) {
  const fullId = loggerId ? `${target}.${loggerId}` : target;
  if (!winston.loggers.has(fullId)) {
    const { format, ...loggerConfig } = getLoggerConfig(target);
    winston.loggers.add(fullId, {
      ...loggerConfig,
      format: prependLabel(format, fullId),
    });
  }
  return winston.loggers.get(fullId);
}

/**
 * Gets a server logger.
 * @param {?string} loggerId
 *   The identifier for the logger. If not specified, returns the base logger.
 * @returns {winston.Logger}
 *   The specified server logger.
 */
export const server = loggerId => getLogger('server', loggerId);

/**
 * Gets a client logger.
 * @param {?string} loggerId
 *   The identifier for the logger. If not specified, returns the base logger.
 * @returns {winston.Logger}
 *   The specified client logger.
 */
export const client = loggerId => getLogger('client', loggerId);
