import React, { useState } from 'react';
import PropTypes from 'prop-types';
import uuid from 'uuidv4';
import { Button, Card } from 'react-bootstrap';
import ClickableEdit from '../../controls/clickable-edit';

const NewCharacter = ({ characterIds, setSelected, addCharacter }) => {
  const defaultCharacterName = 'New Character';
  const [firstCharacterId = ''] = characterIds;
  const [name, setName] = useState(defaultCharacterName);

  const onCancel = () => {
    setName(defaultCharacterName);
    setSelected(firstCharacterId);
  };
  const onSave = () => {
    setName(defaultCharacterName);
    addCharacter(uuid(), { name });
  };

  return (
    <Card className="character">
      <Card.Header as="h5" className="bg-primary text-white">
        <ClickableEdit className="name-clickable-edit" text={name} setText={setName} />
      </Card.Header>
      <Card.Body>
        <Card.Text>Creating a new character</Card.Text>
      </Card.Body>
      <Card.Footer>
        <Button className="save-button mr-1" variant="primary" onClick={onSave}>
          Save
        </Button>
        <Button className="cancel-button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
      </Card.Footer>
    </Card>
  );
};

NewCharacter.propTypes = {
  // From mapStateToProps
  characterIds: PropTypes.arrayOf(PropTypes.string).isRequired,
  // From mapDispatchToProps
  setSelected: PropTypes.func.isRequired,
  addCharacter: PropTypes.func.isRequired,
};

export default NewCharacter;
