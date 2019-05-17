import React from 'react';
import PropTypes from 'prop-types';
import { Card } from 'react-bootstrap';

const Character = ({ characterId, name }) => (
  <Card key={characterId} className="character">
    <Card.Header as="h5" className="bg-primary text-white">
      {name}
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
};

export default Character;
