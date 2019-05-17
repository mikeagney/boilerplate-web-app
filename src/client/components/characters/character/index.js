import { connect } from 'react-redux';
import Character from './character.component';
import mapStateToProps from './character.selector';

export default connect(mapStateToProps)(Character);
