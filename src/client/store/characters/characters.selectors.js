import delve from 'dlv';
import { createSelector } from 'reselect';

/**
 * @typedef {Object} Character
 * @property {string} Character.name
 * @property {*} Character.skills
 */

const getCharacters = state => delve(state, 'characters', {});

/**
 * @type {(state:*)=>Object.<string,Character>}
 */
const getCharactersById = createSelector(
  getCharacters,
  characters => delve(characters, 'byId', {}),
);

/**
 * @type {(state:*)=>string[]}
 */
export const getCharacterIds = createSelector(
  getCharacters,
  characters => delve(characters, 'ids', []),
);

/**
 * @type {(state:*)=>string}
 */
export const getSelectedCharacterId = createSelector(
  getCharacters,
  characters => delve(characters, 'selectedId', ''),
);

/**
 * @type {()=>(state:*,props:{characterId:string})=>Character}
 */
export const createGetCharacterById = () => createSelector(
  getCharactersById,
  (_state, props) => props.characterId,
  (charactersById, characterId) => delve(charactersById, characterId, {}),
);
