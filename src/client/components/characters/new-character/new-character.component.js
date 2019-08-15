import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Card, Spinner } from 'react-bootstrap';
import ClickableEdit from '../../controls/clickable-edit';

const NewCharacter = ({
  characterIds, setSelected, createCharacter, loading,
}) => {
  const defaultCharacterName = 'New Character';
  const [firstCharacterId = ''] = characterIds;
  const [name, setName] = useState(defaultCharacterName);
  const [nameError, setNameError] = useState('');

  const onCancel = () => {
    setName(defaultCharacterName);
    setSelected(firstCharacterId);
  };
  const onSave = () => {
    setName(defaultCharacterName);
    createCharacter({ name });
  };
  const onSetName = (newName) => {
    if (!newName) {
      setNameError('Name must have a value.');
      return true;
    }
    setName(newName);
    setNameError('');
    return false;
  };

  return (
    <Card className="character">
      <Card.Header as="h5" className="bg-primary text-white">
        <ClickableEdit
          className="name-clickable-edit"
          text={name}
          errorMessage={nameError}
          setText={onSetName}
        />
      </Card.Header>
      <Card.Body>
        <Card.Text>Creating a new character</Card.Text>
      </Card.Body>
      <Card.Footer>
        {loading ? (
          <Spinner
            className="test-creating-spinner"
            animation="border"
            variant="secondary"
            role="status"
          >
            <span className="sr-only">Creating...</span>
          </Spinner>
        ) : (
          <>
            <Button className="save-button mr-1" variant="primary" onClick={onSave}>
              Save
            </Button>
            <Button className="cancel-button" variant="secondary" onClick={onCancel}>
              Cancel
            </Button>
          </>
        )}
      </Card.Footer>
    </Card>
  );
};

NewCharacter.propTypes = {
  // From mapStateToProps
  characterIds: PropTypes.arrayOf(PropTypes.string).isRequired,
  loading: PropTypes.bool,
  // From mapDispatchToProps
  setSelected: PropTypes.func.isRequired,
  createCharacter: PropTypes.func.isRequired,
};

NewCharacter.defaultProps = {
  loading: false,
};

export default NewCharacter;
