import Joi from '@hapi/joi';

class ControllerBase {
  /**
   * Validates an incoming request against a Joi schema.
   * The Joi schema should generally accept unknown elements at the
   * root level and only do strict validation on the `query`, `params`,
   * or `body` members of the request.
   *
   * @param {import('express').Request} req
   * The incoming request.
   * @param {any} schema
   * The Joi schema.
   * @returns {Promise<any>}
   * The result of validating the schema. If the request does not match
   * the schema, throw a 400 error.
   */
  static async validateRequest(req, schema) {
    try {
      return await Joi.validate(req, schema);
    } catch (error) {
      error.status = 400;
      throw error;
    }
  }
}

export default ControllerBase;
