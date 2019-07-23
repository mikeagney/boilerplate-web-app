import createCollectionActions from '../collection-base/collection-base.actions';
import { createApiAction } from '../api/api.action-creator';
import CharacterActionOptions from './characters.constants';

export const { add: addCharacter, setSelected, setName } = createCollectionActions(
  CharacterActionOptions,
);

export const getCharacterIds = createApiAction('CHARACTER.GET_CHARACTER_IDS', () => ({
  request: {
    method: 'get',
    url: '/characters',
  },
}));

export const getCharacterById = createApiAction('CHARACTER.GET_CHARACTER_BY_ID', characterId => ({
  characterId,
  request: {
    method: 'get',
    url: `/characters/${encodeURIComponent(characterId)}`,
  },
}));
