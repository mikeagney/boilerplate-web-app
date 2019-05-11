import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import App from './app';

describe('App root container', () => {
  it('will render the root app', () => {
    // Arrange
    const wrapper = shallow(<App />);

    // Act
    // Assert
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
