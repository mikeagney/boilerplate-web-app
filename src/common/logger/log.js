import Joi from '@hapi/joi';
import logTransport, { schema as logTransportSchema } from './log-transport';
import { schema as logFormatterSchema } from './log-formatter';
import logFormatters from './log-formatters';
import logLevelSchema from './log-level-schema';

/**
 * Gets the configuration for a logger.
 * @returns {Joi.Schema}
 */
export const schema = () => Joi.object({
  level: logLevelSchema().required(),
  format: Joi.array().items(logFormatterSchema()),
  transports: Joi.array()
    .items(logTransportSchema())
    .min(1)
    .required(),
}).unknown(true);

/**
 * Returns the constructor arguments for a Winston logger based on the provided configuration.
 *
 * @param {*} log
 *   The logger configuration.
 * @returns {*}
 *   An object that can be passed to the constructor for a Winston logger.
 */
export default function (log) {
  const { format = null, transports = [], ...finalOptions } = log;

  if (format) {
    finalOptions.format = logFormatters(format);
  }

  finalOptions.transports = transports.map(transport => logTransport(transport));

  return finalOptions;
}
