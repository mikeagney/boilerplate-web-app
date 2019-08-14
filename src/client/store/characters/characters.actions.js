import createCollectionActions from '../collection-base/collection-base.actions';
import { createApiAction } from '../api/api.action-creator';
import CharacterActionOptions from './characters.constants';

/**
 * @typedef {import('../../../server/proxy/character-proxy').Character} Character
 * @typedef {import('redux-thunk').ThunkAction} ThunkAction
 */

export const { add: addCharacter, setSelected, setName } = createCollectionActions(
  CharacterActionOptions,
);

/**
 * Issue an API request to get part of the list of characters.
 * @type {(cursor:string,limit:number)=>ThunkAction}
 * @param {string} cursor
 *  A token to the page of results to get.
 * @param {number} limit
 *  The number of characters to get.
 */
export const getCharacterIds = createApiAction('CHARACTER.GET_CHARACTER_IDS', (cursor, limit) => ({
  request: {
    method: 'get',
    url: '/characters',
    params: { limit, cursor },
  },
}));

/**
 * Issue an API request to get a character.
 * @type {(characterId:string)=>ThunkAction}
 */
export const getCharacterById = createApiAction('CHARACTER.GET_CHARACTER_BY_ID', characterId => ({
  characterId,
  request: {
    method: 'get',
    url: `/characters/${encodeURIComponent(characterId)}`,
  },
}));

/**
 * Issue an API request to create a new character.
 * @type {(character:Character)=>ThunkAction}
 */
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

/**
 * Issue an API request to modify a character.
 * @type {(characterId:string,character:Character)=>import('redux-thunk').ThunkAction}
 */
export const patchCharacter = createApiAction(
  'CHARACTER.PATCH_CHARACTER',
  (characterId, character) => ({
    characterId,
    character,
    request: {
      method: 'patch',
      url: `/characters/${encodeURIComponent(characterId)}`,
      data: character,
    },
  }),
);

// If a scenario for replace comes up, uncomment this
// export const replaceCharacter = createApiAction('CHARACTER.REPLACE_CHARACTER', () => ({}));

/**
 * Issue an API request to delete a character.
 * @type {(characterId:string)=>ThunkAction}
 */
export const deleteCharacter = createApiAction('CHARACTER.DELETE_CHARACTER', characterId => ({
  characterId,
  request: {
    method: 'delete',
    url: `/characters/${encodeURIComponent(characterId)}`,
  },
}));
