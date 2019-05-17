import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import Character from './character.component';

describe('Character component', () => {
  const defaultProps = {
    characterId: 'b2b',
    name: 'Mock name',
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
});
