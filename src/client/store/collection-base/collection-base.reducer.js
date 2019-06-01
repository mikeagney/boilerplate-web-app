import { handleActions } from 'redux-actions';
import ActionTypes from './collection-base.constants';

const createReducer = (actionMap, initialState, options) => handleActions(
  {
    ...actionMap,
    [ActionTypes.ADD]: (state, { payload: { id, item } }) => ({
      ...state,
      byId: {
        ...state.byId,
        [id]: item,
      },
      ids: [...state.ids.filter(existingId => id !== existingId), id],
      selectedId: id,
    }),
    [ActionTypes.SET_SELECTED]: (state, { payload: { id } }) => ({
      ...state,
      selectedId: id,
    }),
    [ActionTypes.SET_NAME]: (state, { payload: { id, name } }) => ({
      ...state,
      byId: {
        ...state.byId,
        [id]: {
          ...state.byId[id],
          name,
        },
      },
    }),
  },
  initialState,
  options,
);

export default createReducer;
