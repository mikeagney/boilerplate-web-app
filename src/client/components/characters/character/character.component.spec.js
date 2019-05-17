import React from 'react';
import { Card } from 'react-bootstrap';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import Character from './character.component';

describe('Character component', () => {
  const defaultProps = {
    characterId: 'b2b',
    selected: false,
    name: 'Mock name',
    setSelected: jest.fn(),
  };

  it.each([false, true])('will render Character component when selected=%s', (selected) => {
    // Arrange
    const props = {
      ...defaultProps,
      selected,
    };

    // Act
    const wrapper = shallow(<Character {...props} />);

    // Assert
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('will invoke setSelected when header is clicked', () => {
    // Arrange
    const props = defaultProps;
    const wrapper = shallow(<Character {...props} />);

    // Act
    wrapper.find(Card.Header).simulate('click');

    // Assert
    expect(props.setSelected).toHaveBeenCalledWith(props.characterId);
  });
});
