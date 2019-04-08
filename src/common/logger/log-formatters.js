import winston from 'winston';
import logFormatter from './log-formatter';

/**
 * Creates a collection of log formatters.
 *
 * @param {*[]} logFormatters
 *   A collection of log formatter configurations.
 * @returns {*}
 *   A single Winston formatter created by combining the formatters specified by
 *   the input.
 */
export default function (logFormatters) {
  return winston.format.combine(
    ...logFormatters.map(formatter => logFormatter(formatter)),
  );
}
