import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Routes from './routes';

const Pages = () => (
  <Switch>
    {Routes.getRoutes().map(route => (
      <Route {...route} />
    ))}
  </Switch>
);

export default Pages;
