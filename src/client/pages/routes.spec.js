import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import loadable from '@loadable/component';
import Characters from './characters';
import Gauntlet from './gauntlet';
import Routes from './routes';

jest.mock('@loadable/component');

describe('React app route table', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getRoutes', () => {
    it('will return valid objects', () => {
      // Arrange
      loadable.mockReturnValueOnce(Characters).mockReturnValueOnce(Gauntlet);

      // Act
      const result = Routes.getRoutes();

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

  describe('getMatchingRoute', () => {
    it.each([['/', 'root'], ['/characters', 'characters'], ['/gauntlet', 'gauntlet']])(
      'will find the expected route for path %s',
      (pathname, expectedRouteKey) => {
        // Arrange
        // Act
        const route = Routes.getMatchingRoute(pathname);

        // Assert
        expect(route.key).toEqual(expectedRouteKey);
      },
    );

    it('will find empty for nonexistent route', () => {
      // Arrange
      // Act
      const route = Routes.getMatchingRoute('/this-route/does-not-exist');

      // Assert
      expect(route).toBeFalsy();
    });
  });

  describe('getNavRoutes', () => {
    it('will return valid nav routes', () => {
      // Arrange
      // Act
      const result = Routes.getNavRoutes();

      // Assert
      expect(result.length).toEqual(2);
      result.forEach((navRoute) => {
        expect(navRoute).toBeDefined();
        expect(navRoute.key).toEqual(expect.any(String));
        expect(navRoute.name).toEqual(expect.any(String));
        expect(navRoute.path).toEqual(expect.any(String));
      });
    });
  });

  describe('getNavRoute', () => {
    it('will return matching nav route', () => {
      // Arrange
      // Act
      const result = Routes.getNavRoute('gauntlet');

      // Assert
      expect(result).toBeDefined();
      expect(result.path).toEqual('/gauntlet');
    });

    it('will return nothing if key does not match', () => {
      // Arrange
      // Act
      const result = Routes.getNavRoute('this-route-does-not-exist');

      // Assert
      expect(result).toBeFalsy();
    });
  });
});
