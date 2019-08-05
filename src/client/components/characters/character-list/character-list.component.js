import React from 'react';
import PropTypes from 'prop-types';
import {
  Button, Tab, Row, Col, Nav, Spinner,
} from 'react-bootstrap';
import { MdAdd, MdExpandMore } from 'react-icons/md';
import Character from '../character';
import NewCharacter from '../new-character';

const CharacterList = ({
  characterIds,
  characterNames,
  selectedId,
  setSelected,
  loadingState: { pending, loading, nextCursor },
  getCharacterIds,
}) => {
  // Using namespace so that we can spy on it. This may be changed if we find a better way
  // to access React hooks in the shallow renderer.
  React.useEffect(() => {
    if (pending) {
      getCharacterIds();
    }
  }, [pending, getCharacterIds]);

  return (
    <Tab.Container className="character-list" activeKey={selectedId} onSelect={setSelected}>
      <Row>
        <Col sm={3}>
          <Nav variant="pills" className="flex-column">
            {characterIds.map(id => (
              <Nav.Link key={id} eventKey={id}>
                {characterNames[id]}
              </Nav.Link>
            ))}
            <Nav.Link eventKey="">
              <MdAdd />
            </Nav.Link>
          </Nav>
          {nextCursor && (
            <Button
              className="test-more-button"
              variant="outline-primary"
              onClick={() => getCharacterIds(nextCursor)}
            >
              <MdExpandMore />
            </Button>
          )}
          {(pending || loading) && (
            <div className="text-center test-loading-spinner">
              <Spinner animation="border" size="sm" variant="secondary" role="status">
                <span className="sr-only">Loading...</span>
              </Spinner>
            </div>
          )}
        </Col>
        <Col sm={9}>
          <Tab.Content>
            {selectedId && (
              <Tab.Pane eventKey={selectedId}>
                <Character characterId={selectedId} selected />
              </Tab.Pane>
            )}
            <Tab.Pane eventKey="">
              <NewCharacter />
            </Tab.Pane>
          </Tab.Content>
        </Col>
      </Row>
    </Tab.Container>
  );
};

CharacterList.propTypes = {
  // From mapStateToProps
  characterIds: PropTypes.arrayOf(PropTypes.string).isRequired,
  characterNames: PropTypes.objectOf(PropTypes.string).isRequired,
  selectedId: PropTypes.string,
  loadingState: PropTypes.shape({
    pending: PropTypes.bool,
    loading: PropTypes.bool,
    nextCursor: PropTypes.string,
  }).isRequired,
  // From mapDispatchToProps
  setSelected: PropTypes.func.isRequired,
  getCharacterIds: PropTypes.func.isRequired,
};

CharacterList.defaultProps = {
  selectedId: '',
};

export default CharacterList;
