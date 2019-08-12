import express from 'express';
import router from 'express-promise-router';
import Character from './character';

class ApiRouter {
  initialize() {
    this.router = router();
    this.router.use(express.json());
    this.router.use('/characters', new Character().initialize().router);
    return this;
  }
}

export default ApiRouter;
