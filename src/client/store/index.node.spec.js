import { createStore, combineReducers } from 'redux';
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

  it('will not use Redux devTools in Node environment', () => {
    // Arrange
    const initialState = {};

    // Act
    const result = store(initialState);

    // Assert
    expect(result).toBe(mockStore);
    expect(createStore).toHaveBeenCalledWith(mockReducer, initialState, undefined);
  });
});
