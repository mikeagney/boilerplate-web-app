import express from 'express';
import retry from 'async-retry';
import config from '../common/config';
import { server as serverLogger } from '../common/logger';
import DbMigrate from './client/db-migrate';
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
    this.dbMigrate = new DbMigrate();
    return this;
  }

  async listen() {
    const { name, server } = this.config;
    const { port } = server;

    await retry(() => this.dbMigrate.up());

    this.app.listen(port, () =>
      this.logger.info(
        `Example app environment "${name}" listening on port ${port} from dir ${__dirname}!`,
      ));
  }
}

export default App;
