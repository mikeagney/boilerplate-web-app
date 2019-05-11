import Joi from '@hapi/joi';
import winston from 'winston';
import { schema as logFormatterSchema } from './log-formatter';
import logFormatters from './log-formatters';
import logLevelSchema from './log-level-schema';

/**
 * Gets the schema for Winston transport configuration.
 * @returns {Joi.Schema}
 */
export const schema = () => Joi.object({
  type: Joi.string().required(),
  options: Joi.object({
    level: logLevelSchema(),
    format: Joi.array().items(logFormatterSchema()),
    filename: Joi.string(),
  }).unknown(true),
});

function getTransportConstructor(type) {
  const transport = winston.transports[type];
  if (!transport) {
    throw new Error(`Transport not supported: ${type}`);
  }
  return transport;
}

/**
 * Constructs a Winston transport with the provided configuration.
 *
 * @param {*} logTransport
 *   The transport configuration.
 * @returns {winston.Transport}
 *   The created transport.
 */
export default function (logTransport) {
  const { type, options } = logTransport;
  const Transport = getTransportConstructor(type);
  const { format = null, ...otherOptions } = options;

  if (format) {
    otherOptions.format = logFormatters(format);
  }

  return new Transport(otherOptions);
}
