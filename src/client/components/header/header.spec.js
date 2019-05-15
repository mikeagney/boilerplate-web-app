import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import { Nav } from 'react-bootstrap';
import Routes from '../../pages/routes';
import Header from './header';

jest.mock('../../pages/routes');

describe('Header component', () => {
  const defaultProps = {
    location: {
      pathname: '/',
    },
    history: {
      push: jest.fn(),
    },
  };
  const navRoutes = [
    { key: 'route1', path: '/route1', name: 'Route 1' },
    { key: 'route2', path: '/route2', name: 'Route 2' },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    Routes.getNavRoutes.mockReturnValue(navRoutes);
  });

  it('will render the header component', () => {
    // Arrange
    const props = defaultProps;
    const wrapper = shallow(<Header {...props} />);

    // Act
    // Assert
    expect(toJson(wrapper)).toMatchSnapshot();
    expect(wrapper.find(Nav.Item).length).toEqual(navRoutes.length);
    expect(Routes.getMatchingRoute).toHaveBeenCalledWith('/');
  });

  it('will set active nav based on the matched route', () => {
    // Arrange
    const props = defaultProps;
    const matchedKey = 'route2';
    Routes.getMatchingRoute.mockReturnValue({ key: matchedKey });
    const wrapper = shallow(<Header {...props} />);

    // Act
    // Assert
    expect(toJson(wrapper)).toMatchSnapshot();
    expect(wrapper.find(Nav).prop('activeKey')).toEqual(matchedKey);
  });

  it('will do nothing when an event key for a nonexistent route is selected', () => {
    // Arrange
    const props = defaultProps;
    const wrapper = shallow(<Header {...props} />);
    const header = wrapper.instance();
    Routes.getNavRoute.mockReturnValue(undefined);

    // Act
    header.onSelect('route3');

    // Assert
    expect(Routes.getNavRoute).toHaveBeenCalledWith('route3');
    expect(defaultProps.history.push).not.toHaveBeenCalled();
  });

  it('will push to history when a route is selected', () => {
    // Arrange
    const props = defaultProps;
    const wrapper = shallow(<Header {...props} />);
    const header = wrapper.instance();
    Routes.getNavRoute.mockReturnValue({ path: '/foo' });

    // Act
    header.onSelect('route4');

    // Assert
    expect(Routes.getNavRoute).toHaveBeenCalledWith('route4');
    expect(defaultProps.history.push).toHaveBeenCalledWith('/foo');
  });
});
