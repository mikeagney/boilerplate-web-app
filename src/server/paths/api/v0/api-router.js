import express from 'express';
import Character from './character';

class ApiRouter {
  initialize() {
    this.router = express.Router();
    this.router.use('/character', new Character().initialize().router);
    return this;
  }
}

export default ApiRouter;
