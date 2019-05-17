import { handleActions } from 'redux-actions';
import ActionTypes from './characters.constants';
import initialState from './characters.initial-state';

export default handleActions(
  {
    [ActionTypes.SET_SELECTED]: (state, { payload: { characterId } }) => ({
      ...state,
      selectedId: characterId,
    }),
    [ActionTypes.SET_NAME]: (state, { payload: { characterId, name } }) => ({
      ...state,
      byId: {
        ...state.byId,
        [characterId]: {
          ...state.byId[characterId],
          name,
        },
      },
    }),
  },
  initialState,
);
