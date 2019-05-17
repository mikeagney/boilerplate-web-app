import { createAction } from 'redux-actions';
import ActionTypes from './characters.constants';

export const setSelected = createAction(ActionTypes.SET_SELECTED, characterId => ({ characterId }));

export const setName = createAction(ActionTypes.SET_NAME, (characterId, name) => ({
  characterId,
  name,
}));
