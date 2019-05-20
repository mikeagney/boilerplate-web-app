import { createStructuredSelector } from 'reselect';
import { getCharacterIds } from '../../../store/characters/characters.selectors';

export default createStructuredSelector({
  characterIds: getCharacterIds,
});
