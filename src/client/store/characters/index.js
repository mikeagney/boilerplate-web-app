import createReducer from '../collection-base/collection-base.reducer';
import CharacterActionOptions from './characters.constants';
import initialState from './characters.initial-state';

export default createReducer(
  {
    GET_CHARACTER_IDS: {
      REQUEST: state => ({ ...state, loading: true }),
      RESPONSE: (
        state,
        {
          payload: {
            response: { data },
          },
        },
      ) => ({ ...state, loading: false, idsFromApi: data }),
      ERROR: (state, { payload: { error } }) => ({
        ...state,
        loading: false,
        error,
      }),
    },
    GET_CHARACTER_BY_ID: {
      REQUEST: (state, { payload: { characterId } }) => ({
        ...state,
        byId: {
          ...state.byId,
          [characterId]: {
            ...state.byId[characterId],
            loading: true,
          },
        },
      }),
      RESPONSE: (
        state,
        {
          payload: {
            characterId,
            response: { data },
          },
        },
      ) => ({
        ...state,
        byId: {
          ...state.byId,
          [characterId]: data,
        },
      }),
      ERROR: (state, { payload: { characterId, error } }) => ({
        ...state,
        byId: {
          ...state.byId,
          [characterId]: {
            ...state.byId[characterId],
            loading: false,
            error,
          },
        },
      }),
    },
  },
  initialState,
  CharacterActionOptions,
);
