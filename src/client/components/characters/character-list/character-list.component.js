import React from 'react';
import PropTypes from 'prop-types';
import {
  Tab, Row, Col, Nav,
} from 'react-bootstrap';
import { MdAdd } from 'react-icons/md';
import Character from '../character';
import NewCharacter from '../new-character';

const CharacterList = ({
  characterIds, characterNames, selectedId, setSelected,
}) => (
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
      </Col>
      <Col sm={9}>
        <Tab.Content>
          {characterIds.map(id => (
            <Tab.Pane key={id} eventKey={id}>
              <Character characterId={id} selected={id === selectedId} />
            </Tab.Pane>
          ))}
          <Tab.Pane eventKey="">
            <NewCharacter />
          </Tab.Pane>
        </Tab.Content>
      </Col>
    </Row>
  </Tab.Container>
);

CharacterList.propTypes = {
  // From mapStateToProps
  characterIds: PropTypes.arrayOf(PropTypes.string).isRequired,
  characterNames: PropTypes.objectOf(PropTypes.string).isRequired,
  selectedId: PropTypes.string,
  // From mapDispatchToProps
  setSelected: PropTypes.func.isRequired,
};

CharacterList.defaultProps = {
  selectedId: '',
};

export default CharacterList;
