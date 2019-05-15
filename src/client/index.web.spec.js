import { hydrate } from 'react-dom';
import { loadableReady } from '@loadable/component';
import renderPage from './index';

jest.mock('react-dom').mock('@loadable/component');

describe('client/client', () => {
  beforeEach(() => {
    hydrate.mockClear();
    jest.spyOn(document, 'getElementById').mockImplementation(() => {});
  });

  afterEach(() => {
    document.getElementById.mockRestore();
  });

  it('will trigger loading of loadable components', () => {
    // Arrange
    const rootElement = {};
    document.getElementById.mockReturnValue(rootElement);

    // Act
    renderPage();

    // Assert
    expect(loadableReady).toHaveBeenCalledWith(expect.any(Function));
  });

  it('will render into the root node', () => {
    // Arrange
    const rootElement = {};
    document.getElementById.mockReturnValue(rootElement);
    renderPage();
    const [loadableCallback] = loadableReady.mock.calls[0];

    // Act
    loadableCallback();

    // Assert
    expect(loadableReady).toHaveBeenCalledWith(expect.any(Function));

    expect(hydrate).toHaveBeenCalledTimes(1);
    expect(hydrate).toHaveBeenCalledWith(expect.anything(), rootElement);

    expect(document.getElementById).toHaveBeenCalledTimes(1);
    expect(document.getElementById).toHaveBeenCalledWith('root');
  });
});
