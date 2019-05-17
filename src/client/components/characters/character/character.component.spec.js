import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import ClickableEdit from '../../controls/clickable-edit';
import Character from './character.component';

describe('Character component', () => {
  const defaultProps = {
    characterId: 'b2b',
    name: 'Mock name',
    setName: jest.fn(),
  };

  it('will render Character component', () => {
    // Arrange
    const props = {
      ...defaultProps,
    };

    // Act
    const wrapper = shallow(<Character {...props} />);

    // Assert
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('will call setText when ClickableEdit sets text', () => {
    // Arrange
    const props = {
      ...defaultProps,
    };
    const wrapper = shallow(<Character {...props} />);
    const { setText } = wrapper.find(ClickableEdit).props();

    // Act
    setText('new text');

    // Assert
    expect(props.setName).toHaveBeenCalledWith(props.characterId, 'new text');
  });
});
