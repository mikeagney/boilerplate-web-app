import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import routes from './routes';

describe('React app route table', () => {
  it('will return valid objects', () => {
    // Arrange
    // Act
    const result = routes();

    // Assert
    expect(result.length).toEqual(3);
    result.forEach((route) => {
      expect(route).toBeDefined();
      expect(route.key).toEqual(expect.any(String));
      expect(route.path).toEqual(expect.any(String));
      const RouteMatch = route.component || route.render || route.children;
      expect(RouteMatch).toBeDefined();
      const wrapper = shallow(<RouteMatch />);
      expect(toJson(wrapper)).toMatchSnapshot(route.key);
    });
  });
});
