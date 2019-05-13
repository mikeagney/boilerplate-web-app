import React from 'react';
import { Redirect } from 'react-router-dom';
import Characters from './characters';
import Gauntlet from './gauntlet';

/**
 * An entry in a React route table.
 * @typedef {Object} Route
 * @property {string} Route.key
 *  A (locally) unique key for the route.
 * @property {string} Route.path
 *  The path to the route.
 * @property {boolean} Route.exact
 *  Whether the path match must be exact.
 * @property {((props:any)=>JSX.Element)=} Route.render
 * @property {React.Component=} Route.component
 */
const routes = [
  {
    key: 'root',
    path: '/',
    exact: true,
    render: () => <Redirect to="/characters" />,
  },
  {
    key: 'characters',
    path: '/characters',
    exact: true,
    component: Characters,
  },
  {
    key: 'gauntlet',
    path: '/gauntlet',
    exact: true,
    component: Gauntlet,
  },
];

/**
 * @type {()=>Route[]}
 */
export default () => routes;
