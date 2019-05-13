import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import Gauntlet from './gauntlet';

describe('Gauntlet page component', () => {
  it('will render the Gauntlet page', () => {
    // Arrange
    const wrapper = shallow(<Gauntlet />);

    // Act
    // Assert
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
