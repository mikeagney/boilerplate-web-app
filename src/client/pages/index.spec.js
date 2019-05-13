import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import Pages from './index';

describe('Page route table component', () => {
  it('will render the pages', () => {
    // Arrange
    const wrapper = shallow(<Pages />);

    // Act
    // Assert
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
