import { createAction } from 'redux-actions';
import ActionTypes from './characters.constants';

// eslint-disable-next-line import/prefer-default-export
export const setSelected = createAction(ActionTypes.SET_SELECTED, characterId => ({ characterId }));
