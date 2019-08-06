import createCollectionActions from '../collection-base/collection-base.actions';
import { createApiAction } from '../api/api.action-creator';
import CharacterActionOptions from './characters.constants';

export const { add: addCharacter, setSelected, setName } = createCollectionActions(
  CharacterActionOptions,
);

export const getCharacterIds = createApiAction('CHARACTER.GET_CHARACTER_IDS', (cursor, limit) => ({
  request: {
    method: 'get',
    url: '/characters',
    params: { limit, cursor },
  },
}));

export const getCharacterById = createApiAction('CHARACTER.GET_CHARACTER_BY_ID', characterId => ({
  characterId,
  request: {
    method: 'get',
    url: `/characters/${encodeURIComponent(characterId)}`,
  },
}));

export const createCharacter = createApiAction(
  'CHARACTER.CREATE_CHARACTER',
  character => ({
    character,
    request: {
      method: 'post',
      url: '/characters',
      data: character,
    },
  }),
  () => ({
    onResponse: (dispatch, _getState, { data, headers: { location } }) => {
      const characterId = location.split('/').pop();
      dispatch(addCharacter(characterId, data));
    },
  }),
);
