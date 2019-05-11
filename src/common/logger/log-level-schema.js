import Joi from '@hapi/joi';

/**
 * Gets the schema for a valid logger level.
 * @returns {Joi.Schema}
 */
export default () => Joi.string().valid('error', 'warn', 'info', 'verbose', 'debug', 'silly');
