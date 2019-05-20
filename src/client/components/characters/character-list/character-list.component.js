import React from 'react';
import PropTypes from 'prop-types';
import { Tabs, Tab } from 'react-bootstrap';
import { MdAdd } from 'react-icons/md';
import Character from '../character';
import NewCharacter from '../new-character';

const CharacterList = ({
  characterIds, characterNames, selectedId, setSelected,
}) => (
  <Tabs className="character-list" activeKey={selectedId} onSelect={setSelected}>
    {characterIds.map(id => (
      <Tab key={id} eventKey={id} title={characterNames[id]}>
        <Character characterId={id} selected={id === selectedId} />
      </Tab>
    ))}
    <Tab title={<MdAdd />} eventKey="">
      <NewCharacter />
    </Tab>
  </Tabs>
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
