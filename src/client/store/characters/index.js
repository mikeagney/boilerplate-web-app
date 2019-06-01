import createReducer from '../collection-base/collection-base.reducer';
import CharacterActionOptions from './characters.constants';
import initialState from './characters.initial-state';

export default createReducer({}, initialState, CharacterActionOptions);
