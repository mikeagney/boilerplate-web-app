import { createStructuredSelector } from 'reselect';
import {
  getCharacterIds,
  getSelectedCharacterId,
} from '../../../store/characters/characters.selectors';

export default createStructuredSelector({
  characterIds: getCharacterIds,
  selectedId: getSelectedCharacterId,
});
