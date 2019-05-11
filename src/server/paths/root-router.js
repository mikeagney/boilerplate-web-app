import express from 'express';
import path from 'path';
import RenderReact from './render-react';

class RootRouter {
  initialize() {
    this.router = express.Router();
    this.router.use('/', RenderReact.route);
    this.router.use('/', express.static(path.join(__dirname, '../../../dist/client/scripts')));
    return this;
  }
}

export default RootRouter;
