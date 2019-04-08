import express from 'express';
import path from 'path';
import config from '../common/config';
import { server as serverLogger } from '../common/logger';
import { preAppHandlers, postAppHandlers } from './middleware';

const logger = serverLogger();

const app = express();
const { name, server } = config();
const { port } = server;

app.use(...preAppHandlers());

app.use('/', express.static(path.join(__dirname, '../../dist/client')));

app.use(...postAppHandlers());

app.listen(port, () => logger.info(`Example app environment "${name}" listening on port ${port} from dir ${__dirname}!`));
