import express from 'express';
import path from 'path';

class RootRouter {
  initialize() {
    this.router = express.Router();
    this.router.use('/', express.static(path.join(__dirname, '../../../dist/client')));
    return this;
  }
}

export default RootRouter;
