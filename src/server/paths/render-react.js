import { readFile } from 'fs';
import path from 'path';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { promisify } from 'util';
import { matchPath, StaticRouter } from 'react-router-dom';
import routes from '../../client/pages/routes';
import App from '../../client/app';

const readFileAsync = promisify(readFile);

class RenderReact {
  /**
   * Gets the HTML markup template.
   * @returns {string} The HTML template.
   */
  static async getTemplate() {
    const indexPath = path.resolve(__dirname, '../../../dist/client/templates/index.html');
    return readFileAsync(indexPath, {
      encoding: 'utf8',
    });
  }

  /**
   * Renders the React application
   * @param {string} url The URL being browsed to.
   * @param {any} context Routing context.
   * @returns {string} The markup for the application.
   */
  static renderApp(url, context) {
    return renderToString(
      <StaticRouter location={url} context={context}>
        <App />
      </StaticRouter>,
    );
  }

  /**
   * Renders the React application on the server.
   * @param {Express.Request} req
   * @param {Express.Response} res
   * @param {(err?:any)=>void} next
   */
  static async route(req, res, next) {
    const match = routes().find(route => matchPath(req.url, route));
    if (!match) {
      next();
      return;
    }

    const context = {};
    const content = RenderReact.renderApp(req.url, context);
    if (context.url) {
      res.redirect(context.url);
      return;
    }

    const template = await RenderReact.getTemplate();
    const response = template.replace('{content}', content);
    res.send(response);
  }
}

export default RenderReact;
