import Joi from '@hapi/joi';
import winston from 'winston';

const logFormatterType = () => Joi.string();

/**
 * Gets the schema for a log formatter.
 * @returns {Joi.Schema}
 *    The schema for a log formatter argument.
 */
export const schema = () => Joi.alternatives().try(
  logFormatterType(),
  Joi.array()
    .ordered(logFormatterType().required())
    .items(Joi.any()),
);

/**
 * Gets a constructor function for a given formatter type.
 *
 * Any of the built-in logform formatters may be used. If you wish to define custom formatters
 * without explicitly extending Winston, you can add the appropriate switch statement or lookup
 * table here.
 * @param {string} type
 *   The type of formatter.
 * @returns {?Function}
 *   A function that can be used to create a Winston formatter, or falsy if there is no formatter
 *   defined for the specified type.
 */
function getLogFormatterConstructor(type) {
  // If we define our own log formatter types, return them here
  return winston.format[type];
}

/**
 * Creates a log formatter with the specified type and option parameters.
 *
 * @param {string} type
 *   The type of formatter.
 * @param {...any} options
 *   The parameters to pass when constructing the log formatter.
 * @returns {*}
 *   A log formatter constructed with the specified options.
 */
function createLogFormatter(type, ...options) {
  const logFormatterConstructor = getLogFormatterConstructor(type);
  if (!logFormatterConstructor) {
    return null;
  }

  return logFormatterConstructor(...options);
}

/**
 * Creates a log formatter from the specified configuration.
 *
 * @param {string|Array}
 *   The log formatter configuration.
 * @returns {*}
 *   The constructed Winston formatter, or null if a formatter could not be created
 *   from the configuration given.
 */
export default function (logFormatter) {
  if (typeof logFormatter === 'string') {
    return createLogFormatter(logFormatter);
  }
  const [type, ...options] = logFormatter;
  return createLogFormatter(type, ...options);
}
