import { createStructuredSelector } from 'reselect';
import { getIds } from '../../../store/characters/characters.selectors';

export default createStructuredSelector({
  characterIds: getIds(),
});
