import express from 'express';
import path from 'path';
import RenderReact from './render-react';
import ApiVersionRouter from './api/api-version-router';

class RootRouter {
  initialize() {
    this.router = express.Router();
    this.router.use('/api', new ApiVersionRouter().initialize().router);
    this.router.use('/', RenderReact.route);
    this.router.use('/', express.static(path.join(__dirname, '../../../dist/client/scripts')));
    return this;
  }
}

export default RootRouter;
