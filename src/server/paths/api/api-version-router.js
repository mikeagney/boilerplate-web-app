import express from 'express';
import ApiRouterV0 from './v0/api-router';

class ApiVersionRouter {
  initialize() {
    this.router = express.Router();
    this.router.use('/v0', new ApiRouterV0().initialize().router);
    return this;
  }
}

export default ApiVersionRouter;
