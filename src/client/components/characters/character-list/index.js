import { connect } from 'react-redux';
import CharacterList from './character-list.component';
import mapStateToProps from './character-list.selector';
import mapDispatchToProps from './character-list.actions';

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(CharacterList);
