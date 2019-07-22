import {
  applyMiddleware, createStore, compose, combineReducers,
} from 'redux';
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

  it('will not use Redux devTools in Node environment', () => {
    // Arrange
    const initialState = {};
    const defaultEnhancer = jest.fn();
    compose.mockReturnValue(defaultEnhancer);

    // Act
    const result = store(initialState);

    // Assert
    expect(result).toBe(mockStore);
    expect(compose).toHaveBeenCalledWith(mockMiddleware);
    expect(createStore).toHaveBeenCalledWith(mockReducer, initialState, defaultEnhancer);
  });
});
