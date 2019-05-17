import { createStructuredSelector } from 'reselect';
import {
  getCharacterIds,
  getSelectedCharacterId,
  getCharacterNames,
} from '../../../store/characters/characters.selectors';

export default createStructuredSelector({
  characterIds: getCharacterIds,
  characterNames: getCharacterNames,
  selectedId: getSelectedCharacterId,
});
