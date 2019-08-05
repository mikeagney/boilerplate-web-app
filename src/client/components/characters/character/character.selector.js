import { getItemById } from '../../../store/characters/characters.selectors';

export default () => getItemById((_state, props) => props.characterId);
