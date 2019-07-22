import {
  applyMiddleware, createStore, compose, combineReducers,
} from 'redux';
import characters from './characters';
import store from '.';

jest.mock('redux');

describe('Root store creator', () => {
  const mockReducer = jest.fn();
  const mockStore = {};
  const mockMiddleware = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    combineReducers.mockReturnValue(mockReducer);
    createStore.mockReturnValue(mockStore);
    applyMiddleware.mockReturnValue(mockMiddleware);
  });

  it('will create the root reducer by combining reducers as expected', () => {
    // Arrange
    // Act
    store();

    // Assert
    expect(combineReducers).toHaveBeenCalledWith({ characters });
  });

  it('will not use Redux devTools when not present', () => {
    // Arrange
    const initialState = {};
    const defaultEnhancer = jest.fn();
    delete window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__;
    compose.mockReturnValue(defaultEnhancer);

    // Act
    const result = store(initialState);

    // Assert
    expect(result).toBe(mockStore);
    expect(compose).toHaveBeenCalledWith(mockMiddleware);
    expect(createStore).toHaveBeenCalledWith(mockReducer, initialState, defaultEnhancer);
  });

  it('will use Redux devTools when present', () => {
    // Arrange
    const devtoolsExtension = jest.fn();
    const devtoolsExtensionCompose = jest.fn(() => devtoolsExtension);
    const initialState = {};
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ = devtoolsExtensionCompose;

    // Act
    const result = store(initialState);

    // Assert
    expect(result).toBe(mockStore);
    expect(devtoolsExtensionCompose).toHaveBeenCalledWith(mockMiddleware);
    expect(createStore).toHaveBeenCalledWith(mockReducer, initialState, devtoolsExtension);
  });
});
