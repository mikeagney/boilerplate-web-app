import React from 'react';
import PropTypes from 'prop-types';
import { Card } from 'react-bootstrap';
import ClickableEdit from '../../controls/clickable-edit';

const Character = ({ characterId, name, setName }) => (
  <Card key={characterId} className="character">
    <Card.Header as="h5" className="bg-primary text-white">
      <ClickableEdit text={name} setText={newName => setName(characterId, newName)} />
    </Card.Header>
    <Card.Body>
      <Card.Text>Skills go here</Card.Text>
    </Card.Body>
  </Card>
);

Character.propTypes = {
  // From parent
  characterId: PropTypes.string.isRequired,
  // From mapStateToProps
  name: PropTypes.string.isRequired,
  // From mapDispatchToProps
  setName: PropTypes.func.isRequired,
};

export default Character;
