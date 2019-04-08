import { render } from 'react-dom';
import renderPage from './index';

jest.mock('react-dom');

describe('client/client', () => {
  beforeEach(() => {
    render.mockClear();
    jest.spyOn(document, 'getElementById').mockImplementation(() => {});
  });

  afterEach(() => {
    document.getElementById.mockRestore();
  });

  it('will render into the root node', () => {
    // Arrange
    const rootElement = {};
    document.getElementById.mockReturnValue(rootElement);
    // Act
    renderPage();

    // Assert
    expect(render).toHaveBeenCalledTimes(1);
    expect(render).toHaveBeenCalledWith(expect.anything(), rootElement);

    expect(document.getElementById).toHaveBeenCalledTimes(1);
    expect(document.getElementById).toHaveBeenCalledWith('root');
  });
});
