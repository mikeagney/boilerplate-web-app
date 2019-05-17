import { connect } from 'react-redux';
import Character from './character.component';
import mapStateToProps from './character.selector';
import mapDispatchToProps from './character.actions';

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Character);
