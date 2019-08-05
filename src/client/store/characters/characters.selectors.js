import delve from 'dlv';
import CollectionBaseSelectors from '../collection-base/collection-base.selectors';

class CharactersSelectors extends CollectionBaseSelectors {
  constructor() {
    super(state => delve(state, 'characters', {}));
  }
}

const charactersSelectors = new CharactersSelectors();

export const {
  getIds,
  getNames,
  getSelectedId,
  getItemById,
  getLoadingState,
} = charactersSelectors;
