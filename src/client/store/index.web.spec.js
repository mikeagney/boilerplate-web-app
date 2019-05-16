import { createStore, combineReducers } from 'redux';
import characters from './characters';
import store from '.';

jest.mock('redux');

describe('Root store creator', () => {
  const mockReducer = jest.fn();
  const mockStore = {};

  beforeEach(() => {
    jest.clearAllMocks();
    combineReducers.mockReturnValue(mockReducer);
    createStore.mockReturnValue(mockStore);
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
    delete window.__REDUX_DEVTOOLS_EXTENSION__;

    // Act
    const result = store(initialState);

    // Assert
    expect(result).toBe(mockStore);
    expect(createStore).toHaveBeenCalledWith(mockReducer, initialState, undefined);
  });

  it('will use Redux devTools when present', () => {
    // Arrange
    const devtoolsExtension = jest.fn();
    const devtoolsExtensionCreator = jest.fn(() => devtoolsExtension);
    const initialState = {};
    window.__REDUX_DEVTOOLS_EXTENSION__ = devtoolsExtensionCreator;

    // Act
    const result = store(initialState);

    // Assert
    expect(result).toBe(mockStore);
    expect(createStore).toHaveBeenCalledWith(mockReducer, initialState, devtoolsExtension);
  });
});
