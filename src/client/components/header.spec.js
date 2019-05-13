import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import Header from './header';

describe('Header component', () => {
  it('will render the header component', () => {
    // Arrange
    const wrapper = shallow(<Header />);

    // Act
    // Assert
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
