import { createStructuredSelector } from 'reselect';
import {
  getIds,
  getSelectedId,
  getNames,
  getLoadingState,
} from '../../../store/characters/characters.selectors';

export default createStructuredSelector({
  characterIds: getIds(),
  characterNames: getNames(),
  selectedId: getSelectedId(),
  loadingState: getLoadingState(),
});
