import { createActions } from 'redux-actions';
import ActionTypes from './collection-base.constants';

function createCollectionActions(options) {
  return createActions(
    {
      [ActionTypes.ADD]: (id, item) => ({ id, item }),
      [ActionTypes.SET_SELECTED]: id => ({ id }),
      [ActionTypes.SET_NAME]: (id, name) => ({ id, name }),
    },
    options,
  );
}

export default createCollectionActions;
