import { connect } from 'react-redux';
import NewCharacter from './new-character.component';
import mapStateToProps from './new-character.selector';
import mapDispatchToProps from './new-character.actions';

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(NewCharacter);
