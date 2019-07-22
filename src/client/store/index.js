import {
  applyMiddleware, createStore, compose, combineReducers,
} from 'redux';
import thunk from 'redux-thunk';
import characters from './characters';

export default function (initialState) {
  const reducer = combineReducers({
    characters,
  });

  const composeEnhancers = (typeof window !== 'undefined' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) || compose;

  return createStore(reducer, initialState, composeEnhancers(applyMiddleware(thunk)));
}
