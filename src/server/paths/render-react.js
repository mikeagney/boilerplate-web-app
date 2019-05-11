import { readFile } from 'fs';
import path from 'path';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { promisify } from 'util';
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
   * @returns {string} The markup for the application.
   */
  static renderApp() {
    return renderToString(<App />);
  }

  /**
   * Renders the React application on the server.
   * @param {Express.Request} req
   * @param {Express.Response} res
   * @param {(err?:any)=>void} next
   */
  static async route(req, res, next) {
    if (req.path !== '/') {
      next();
      return;
    }

    const template = await RenderReact.getTemplate();
    const content = RenderReact.renderApp();
    const response = template.replace('{content}', content);
    res.send(response);
  }
}

export default RenderReact;
