import delve from 'dlv';
import CollectionBaseSelectors from '../collection-base/collection-base.selectors';

const charactersSelectors = new CollectionBaseSelectors(state => delve(state, 'characters', {}));

export const getCharacterIds = charactersSelectors.getIds();

export const getCharacterNames = charactersSelectors.getNames();

export const getSelectedCharacterId = charactersSelectors.getSelectedId();

export const createGetCharacterById = () =>
  charactersSelectors.getItemById((_state, props) => props.characterId);
