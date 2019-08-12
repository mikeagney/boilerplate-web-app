import router from 'express-promise-router';
import ApiRouterV0 from './v0/api-router';

class ApiVersionRouter {
  /**
   * Handle errors thrown by REST API methods.
   *
   * @param {any} err
   * The error that was thrown.
   * @param {express.Request} _req
   * The Express request.
   * @param {express.Response} res
   * The Express response.
   * @param {()=>void} next
   * The callback to go to the next middleware.
   */
  error = (err, _req, res, next) => {
    if (res.headersSent) {
      next(err);
      return;
    }

    const { status = 500, headers = {}, message } = err;
    res.status(status).type('application/json');
    Object.keys(headers).forEach(header => res.set(header, headers[header]));
    res.send({ status, message });
  };

  initialize() {
    this.router = router();
    this.router.use('/v0', new ApiRouterV0().initialize().router);
    this.router.use(this.error);
    return this;
  }
}

export default ApiVersionRouter;
