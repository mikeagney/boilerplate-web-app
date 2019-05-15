import { readFile } from 'fs';
import path from 'path';
import React from 'react';
import { ChunkExtractor } from '@loadable/server';
import { renderToString } from 'react-dom/server';
import { promisify } from 'util';
import { StaticRouter } from 'react-router-dom';
import Routes from '../../client/pages/routes';
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
    const statsFile = path.resolve(__dirname, '../../../dist/client/loadable-stats.json');
    const extractor = new ChunkExtractor({ statsFile });
    const jsx = extractor.collectChunks(
      <StaticRouter location={url} context={context}>
        <App />
      </StaticRouter>,
    );

    return {
      content: renderToString(jsx),
      scriptTags: extractor.getScriptTags(),
    };
  }

  /**
   * Renders the React application on the server.
   * @param {Express.Request} req
   * @param {Express.Response} res
   * @param {(err?:any)=>void} next
   */
  static async route(req, res, next) {
    const match = Routes.getMatchingRoute(req.url);
    if (!match) {
      next();
      return;
    }

    const context = {};
    const { content, scriptTags } = RenderReact.renderApp(req.url, context);
    if (context.url) {
      res.redirect(context.url);
      return;
    }

    const template = await RenderReact.getTemplate();
    const response = template.replace('{content}', content).replace('{scriptTags}', scriptTags);
    res.send(response);
  }
}

export default RenderReact;
