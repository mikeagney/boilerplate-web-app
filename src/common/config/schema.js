import Joi from '@hapi/joi';
import { schema as logSchema } from '../logger/log';

const server = () => Joi.object({
  port: Joi.number()
    .port()
    .required(),
  https: Joi.object({
    enabled: Joi.boolean().required(),
  }).required(),
  log: logSchema().required(),
  db: Joi.object({
    connectionString: Joi.string().required(),
    databaseName: Joi.string().required(),
  }).required(),
});

const client = () => Joi.object({
  log: logSchema().required(),
});

export default () => Joi.object({
  name: Joi.string().required(),
  server: server().required(),
  client: client().required(),
});
