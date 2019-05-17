import { connect } from 'react-redux';
import CharacterList from './character-list.component';
import mapStateToProps from './character-list.selector';

export default connect(mapStateToProps)(CharacterList);
