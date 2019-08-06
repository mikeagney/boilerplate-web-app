import { createStructuredSelector } from 'reselect';
import { getIds, getAddStatusLoading } from '../../../store/characters/characters.selectors';

export default createStructuredSelector({
  characterIds: getIds(),
  loading: getAddStatusLoading(),
});
