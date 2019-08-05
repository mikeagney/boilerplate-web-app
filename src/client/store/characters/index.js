import fromPairs from 'lodash/fromPairs';
import createReducer from '../collection-base/collection-base.reducer';
import CharacterActionOptions from './characters.constants';
import initialState from './characters.initial-state';

export default createReducer(
  {
    GET_CHARACTER_IDS: {
      REQUEST: state => ({ ...state, pending: false, loading: true }),
      RESPONSE: (
        state,
        {
          payload: {
            response: { data },
          },
        },
      ) => {
        // Add the incoming IDs to the end of the id list.
        // Add entries to byId with the names from the request and pending:true.
        // If selectedId is not already set, set it to the first item in the response.
        // Retain the nextCursor value.
        const newIds = data.items.map(item => item.id);
        const selectedId = state.selectedId || (newIds.length > 0 && newIds[0]);
        const newById = fromPairs(
          data.items.map(item => [
            item.id,
            {
              ...state.byId[item.id],
              name: item.name,
              pending: true,
            },
          ]),
        );
        return {
          ...state,
          loading: false,
          byId: {
            ...state.byId,
            ...newById,
          },
          ids: [...state.ids, ...newIds],
          selectedId,
          nextCursor: data.nextCursor,
        };
      },
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
            pending: false,
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
