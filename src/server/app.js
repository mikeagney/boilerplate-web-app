import express from 'express';
import config from '../common/config';
import { server as serverLogger } from '../common/logger';
import { preAppHandlers, postAppHandlers } from './middleware';
import RootRouter from './paths/root-router';

class App {
  initialize() {
    this.app = express();
    this.app.use(...preAppHandlers());
    this.app.use(new RootRouter().initialize().router);
    this.app.use(...postAppHandlers());
    this.config = config();
    this.logger = serverLogger();
    return this;
  }

  listen() {
    const { name, server } = this.config;
    const { port } = server;

    this.app.listen(port, () =>
      this.logger.info(
        `Example app environment "${name}" listening on port ${port} from dir ${__dirname}!`,
      ));
  }
}

export default App;
