import React from 'react';
import PropTypes from 'prop-types';
import { Card, Spinner } from 'react-bootstrap';
import ClickableEdit from '../../controls/clickable-edit';

const Character = ({
  characterId,
  name,
  pending,
  loading,
  patchStatus: { loading: patchLoading },
  // deleteStatus: { loading: deleteLoading },
  getCharacterById,
  patchCharacter,
  // deleteCharacter,
}) => {
  // Using namespace so that we can spy on it. This may be changed if we find a better way
  // to access React hooks in the shallow renderer.
  React.useEffect(() => {
    if (pending) {
      getCharacterById(characterId);
    }
  }, [pending]);
  const loaded = !(pending || loading);
  return (
    <Card key={characterId} className="character">
      <Card.Header as="h5" className="bg-primary text-white">
        <ClickableEdit
          text={name}
          setText={newName => patchCharacter(characterId, { name: newName })}
          loading={patchLoading}
        />
      </Card.Header>
      <Card.Body>
        {loaded ? (
          <Card.Text>Skills go here</Card.Text>
        ) : (
          <Spinner
            className="test-loading-spinner"
            animation="border"
            variant="secondary"
            role="status"
          >
            <span className="sr-only">Loading...</span>
          </Spinner>
        )}
      </Card.Body>
    </Card>
  );
};

Character.propTypes = {
  // From parent
  characterId: PropTypes.string.isRequired,
  // From mapStateToProps
  name: PropTypes.string.isRequired,
  pending: PropTypes.bool,
  loading: PropTypes.bool,
  patchStatus: PropTypes.shape({
    loading: PropTypes.bool.isRequired,
    error: PropTypes.shape({
      message: PropTypes.string,
    }),
  }),
  // deleteStatus: PropTypes.shape({
  //   loading: PropTypes.bool.isRequired,
  //   error: PropTypes.shape({
  //     message: PropTypes.string,
  //   }),
  // }),
  // From mapDispatchToProps
  patchCharacter: PropTypes.func.isRequired,
  // deleteCharacter: PropTypes.func.isRequired,
  getCharacterById: PropTypes.func.isRequired,
};

Character.defaultProps = {
  pending: false,
  loading: false,
  patchStatus: {},
  // deleteStatus: {},
};

export default Character;
