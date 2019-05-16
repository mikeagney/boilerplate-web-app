import { readFile } from 'fs';
import path from 'path';
import React from 'react';
import { ChunkExtractor } from '@loadable/server';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import Routes from '../../client/pages/routes';
import createStore from '../../client/store';
import RenderReact from './render-react';

jest
  .mock('fs')
  .mock('path')
  .mock('@loadable/server')
  .mock('react-dom/server')
  .mock('react-router-dom')
  .mock('../../client/pages/routes')
  .mock('../../client/store');

describe('RenderReact route', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getTemplate', () => {
    it('will return the template from the expected path', () => {
      // Arrange
      const indexPath = 'root/dist/client/templates/index.html';
      path.resolve.mockReturnValue(indexPath);

      // Act
      RenderReact.getTemplate();

      // Assert
      expect(path.resolve).toHaveBeenCalledWith(
        expect.any(String),
        '../../../dist/client/templates/index.html',
      );
      expect(readFile).toHaveBeenCalledWith(indexPath, { encoding: 'utf8' }, expect.any(Function));
    });

    it('will resolve with the expected content when file read succeeds', async () => {
      // Arrange
      const templateResult = 'Template Result';
      const templatePromise = RenderReact.getTemplate();
      const readFileCallback = readFile.mock.calls[0][2];

      // Act
      readFileCallback(null, templateResult);

      // Assert
      expect(templatePromise).resolves.toEqual(templateResult);
    });

    it('will reject with the expected error when file read fails', async () => {
      // Arrange
      const templateError = new Error('File read failed');
      const templatePromise = RenderReact.getTemplate();
      const readFileCallback = readFile.mock.calls[0][2];

      // Act
      readFileCallback(templateError);

      // Assert
      expect(templatePromise).rejects.toBe(templateError);
    });
  });

  describe('renderApp', () => {
    // eslint-disable-next-line react/prefer-stateless-function
    class MockStaticRouter extends React.Component {
      render() {
        const { children, ...otherProps } = this.props;
        return (
          <div {...otherProps}>
            Mock static router
            <>{children}</>
          </div>
        );
      }
    }
    const mockChunkExtractor = {
      collectChunks: jest.fn(),
      getScriptTags: jest.fn(),
    };

    beforeEach(() => {
      StaticRouter.mockImplementation(props => new MockStaticRouter(props));
      jest.spyOn(RenderReact, 'createStore');
    });

    afterEach(() => {
      RenderReact.createStore.mockRestore();
    });

    it('will render the expected app', () => {
      // Arrange
      const statsFile = 'root/dist/client/loadable-stats.json';
      const initialState = { mockState: true };
      const store = { getState: jest.fn(() => initialState) };
      RenderReact.createStore.mockReturnValue(store);
      path.resolve.mockReturnValue(statsFile);
      renderToString.mockReturnValue('Mock app');
      ChunkExtractor.mockImplementation(() => mockChunkExtractor);
      mockChunkExtractor.collectChunks.mockReturnValue(<div>Mock rendered app</div>);
      mockChunkExtractor.getScriptTags.mockReturnValue('script tags');

      // Act
      const result = RenderReact.renderApp({ url: '/' });

      // Assert
      expect(result).toEqual({
        context: {},
        content: 'Mock app',
        scriptTags: 'script tags',
        initialState: JSON.stringify(initialState),
      });
      expect(ChunkExtractor).toHaveBeenCalledWith({ statsFile });
      expect(renderToString).toHaveBeenCalledWith(expect.anything());
      const renderedApp = mockChunkExtractor.collectChunks.mock.calls[0][0];
      expect(toJson(shallow(renderedApp))).toMatchSnapshot();
    });
  });

  describe('createStore', () => {
    it('will call client createStore', () => {
      // Arrange
      const store = {};
      createStore.mockReturnValue(store);

      // Act
      const result = RenderReact.createStore();

      // Assert
      expect(result).toBe(store);
    });
  });

  describe('route', () => {
    const getTemplate = jest.fn();
    const renderApp = jest.fn();

    beforeEach(() => {
      jest.spyOn(RenderReact, 'getTemplate').mockImplementation(getTemplate);
      jest.spyOn(RenderReact, 'renderApp').mockImplementation(renderApp);
    });

    afterEach(() => {
      RenderReact.getTemplate.mockRestore();
      RenderReact.renderApp.mockRestore();
    });

    it('will not render for unsupported paths', async () => {
      // Arrange
      const req = {};
      const res = { send: jest.fn() };
      const next = jest.fn();
      Routes.getMatchingRoute.mockReturnValue(null);

      // Act
      await RenderReact.route(req, res, next);

      // Assert
      expect(next).toHaveBeenCalledTimes(1);
      expect(res.send).not.toHaveBeenCalled();
    });

    it('will redirect if the component renders as a redirect', async () => {
      // Arrange
      getTemplate.mockResolvedValue('Html template with content "{content}{scriptTags}" here');
      renderApp.mockReturnValue({
        context: { url: '/redirect-url' },
        content: 'Mock content',
        scriptTags: ' and mock script tags',
      });

      const req = { path: '/' };
      const res = { send: jest.fn(), redirect: jest.fn() };
      const next = jest.fn();
      Routes.getMatchingRoute.mockReturnValue({});

      // Act
      await RenderReact.route(req, res, next);

      // Assert
      expect(next).not.toHaveBeenCalled();
      expect(res.send).not.toHaveBeenCalled();
      expect(res.redirect).toHaveBeenCalledWith('/redirect-url');
    });

    it('will load the template, render the app, and return the expected result', async () => {
      // Arrange
      getTemplate.mockResolvedValue('Html template with content "{content}{scriptTags}" here');
      renderApp.mockReturnValue({
        context: {},
        content: 'Mock content',
        scriptTags: ' and mock script tags',
      });

      const req = { path: '/' };
      const res = { send: jest.fn() };
      const next = jest.fn();
      Routes.getMatchingRoute.mockReturnValue({});

      // Act
      await RenderReact.route(req, res, next);

      // Assert
      expect(next).not.toHaveBeenCalled();
      expect(res.send).toHaveBeenCalledWith(
        'Html template with content "Mock content and mock script tags" here',
      );
    });
  });
});
