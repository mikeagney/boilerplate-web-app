import React from 'react';
import { Nav, Navbar } from 'react-bootstrap';
import PropTypes from 'prop-types';
import Routes from '../../pages/routes';

class Header extends React.Component {
  onSelect = (eventKey) => {
    const { history } = this.props;
    const navRoute = Routes.getNavRoute(eventKey);
    if (navRoute) {
      history.push(navRoute.path);
    }
  };

  render() {
    const { location } = this.props;
    const matchedRoute = Routes.getMatchingRoute(location.pathname);
    return (
      <div className="myapp-header">
        <Navbar bg="dark" variant="dark" expand="sm">
          <Navbar.Toggle aria-controls="header-nav" />
          <Navbar.Collapse id="header-nav">
            <Nav activeKey={matchedRoute && matchedRoute.key} onSelect={this.onSelect}>
              {Routes.getNavRoutes().map(route => (
                <Nav.Item key={route.key}>
                  <Nav.Link eventKey={route.key}>{route.name}</Nav.Link>
                </Nav.Item>
              ))}
            </Nav>
          </Navbar.Collapse>
        </Navbar>
      </div>
    );
  }
}

Header.propTypes = {
  // From withRouter
  location: PropTypes.shape({
    pathname: PropTypes.string.isRequired,
  }).isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
};

export default Header;
