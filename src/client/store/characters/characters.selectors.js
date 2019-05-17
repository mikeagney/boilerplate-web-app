import delve from 'dlv';
import mapValues from 'lodash/mapValues';
import { createSelector } from 'reselect';

/**
 * @typedef {Object} Character
 * @property {string} Character.name
 * @property {*} Character.skills
 */

const getCharacters = state => delve(state, 'characters', {});

/**
 * @type {(state:*)=>{[characterId:string]:Character}}
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
 * @type {(state:*)=>{[characterId:string]:string}}
 */
export const getCharacterNames = createSelector(
  getCharactersById,
  charactersById => mapValues(charactersById, character => character.name),
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
