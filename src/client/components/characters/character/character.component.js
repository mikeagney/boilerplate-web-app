import React from 'react';
import PropTypes from 'prop-types';
import { Card } from 'react-bootstrap';

class Character extends React.Component {
  onClick = () => {
    const { characterId, setSelected } = this.props;
    setSelected(characterId);
  };

  render() {
    const { selected, name } = this.props;
    const selectedClass = selected ? 'bg-primary text-white' : '';
    return (
      <Card>
        {/* TODO: Add appropriate ARIA attributes once UX is stabilized */}
        <Card.Header as="h5" onClick={this.onClick} className={selectedClass}>
          {name}
        </Card.Header>
        <Card.Body>
          <Card.Text>Skills go here</Card.Text>
        </Card.Body>
      </Card>
    );
  }
}

Character.propTypes = {
  // From parent
  characterId: PropTypes.string.isRequired,
  selected: PropTypes.bool,
  // From mapStateToProps
  name: PropTypes.string.isRequired,
  // From mapDispatchToProps
  setSelected: PropTypes.func.isRequired,
};

Character.defaultProps = {
  selected: false,
};

export default Character;
