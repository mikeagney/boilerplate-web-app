import React from 'react';
import PropTypes from 'prop-types';
import { ListGroup } from 'react-bootstrap';
import Character from '../character';

const CharacterList = ({ characterIds, selectedId }) => (
  <ListGroup>
    {characterIds.map(id => (
      <ListGroup.Item key={id}>
        <Character characterId={id} selected={id === selectedId} />
      </ListGroup.Item>
    ))}
  </ListGroup>
);

CharacterList.propTypes = {
  // From mapStateToProps
  characterIds: PropTypes.arrayOf(PropTypes.string).isRequired,
  selectedId: PropTypes.string,
};

CharacterList.defaultProps = {
  selectedId: '',
};

export default CharacterList;
