import { createStore, combineReducers } from 'redux';
import characters from './characters';

export default function (initialState) {
  const reducer = combineReducers({
    characters,
  });
  const enhancer = (typeof window !== 'undefined'
      && window.__REDUX_DEVTOOLS_EXTENSION__
      && window.__REDUX_DEVTOOLS_EXTENSION__())
    || undefined;

  return createStore(reducer, initialState, enhancer);
}
