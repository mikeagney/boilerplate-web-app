import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import Characters from './characters';

describe('Characters page component', () => {
  it('will render the Characters page', () => {
    // Arrange
    const wrapper = shallow(<Characters />);

    // Act
    // Assert
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
