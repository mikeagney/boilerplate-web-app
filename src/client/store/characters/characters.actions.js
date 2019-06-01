import createCollectionActions from '../collection-base/collection-base.actions';
import CharacterActionOptions from './characters.constants';

export const { add: addCharacter, setSelected, setName } = createCollectionActions(
  CharacterActionOptions,
);
