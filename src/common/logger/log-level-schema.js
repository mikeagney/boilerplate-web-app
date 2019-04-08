import Joi from 'joi';

/**
 * Gets the schema for a valid logger level.
 * @returns {Joi.Schema}
 */
export default () => Joi.string().valid('error', 'warn', 'info', 'verbose', 'debug', 'silly');
