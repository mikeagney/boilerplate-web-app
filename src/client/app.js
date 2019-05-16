import React from 'react';
import PropTypes from 'prop-types';
import { Provider } from 'react-redux';
import Header from './components/header';
import Pages from './pages';
import createStore from './store';

const App = ({ initialState }) => (
  <Provider store={createStore(initialState)}>
    <div>
      <Header />
      <Pages />
    </div>
  </Provider>
);

App.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  initialState: PropTypes.object,
};

App.defaultProps = { initialState: {} };

export default App;
