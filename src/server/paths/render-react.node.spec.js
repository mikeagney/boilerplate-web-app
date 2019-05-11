import { readFile } from 'fs';
import path from 'path';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import App from '../../client/app';
import RenderReact from './render-react';

jest
  .mock('fs')
  .mock('path')
  .mock('react-dom/server')
  .mock('../../client/app');

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
    it('will render the expected app', () => {
      // Arrange
      renderToString.mockReturnValue('Mock app');
      App.mockImplementation(() => <div>Mock app</div>);

      // Act
      const result = RenderReact.renderApp();

      // Assert
      expect(result).toEqual('Mock app');
      expect(renderToString).toHaveBeenCalledWith(expect.anything());
      const renderedApp = renderToString.mock.calls[0][0];
      expect(toJson(shallow(renderedApp))).toMatchSnapshot();
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
      const req = { path: 'not /' };
      const res = { send: jest.fn() };
      const next = jest.fn();

      // Act
      await RenderReact.route(req, res, next);

      // Assert
      expect(next).toHaveBeenCalledTimes(1);
      expect(res.send).not.toHaveBeenCalled();
    });

    it('will load the template, render the app, and return the expected result', async () => {
      // Arrange
      getTemplate.mockResolvedValue('Html template with content "{content}" here');
      renderApp.mockReturnValue('Mock content');

      const req = { path: '/' };
      const res = { send: jest.fn() };
      const next = jest.fn();

      // Act
      await RenderReact.route(req, res, next);

      // Assert
      expect(next).not.toHaveBeenCalled();
      expect(res.send).toHaveBeenCalledWith('Html template with content "Mock content" here');
    });
  });
});
