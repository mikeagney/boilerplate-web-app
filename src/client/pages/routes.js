import React from 'react';
import { matchPath, Redirect } from 'react-router-dom';
import loadable from '@loadable/component';

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

/**
 * A route entry for the navbar
 * @typedef {Object} NavRoute
 * @property {string} Route.key
 *  A (locally) unique key for the route, matching an entry
 *  in the global route table.
 * @property {string} Route.name
 *  The human-readable name for the route in the navbar.
 * @property {string} Route.path
 *  The default path to the route.
 */

class Routes {
  /**
   * @type {()=>Route[]}
   */
  static getRoutes() {
    const Characters = loadable(() => import('./characters'));
    const Gauntlet = loadable(() => import('./gauntlet'));

    return [
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
  }

  /**
   * Gets the route table entry for the route that matches the current URL.
   * @param {string} pathname
   * @returns {Route}
   *  The matching route, or nothing if there are no matching routes.
   */
  static getMatchingRoute(pathname) {
    return Routes.getRoutes().find(route => matchPath(pathname, route));
  }

  /**
   * Gets the navigation bar routes, in navbar order.
   * @returns {NavRoute[]}
   */
  static getNavRoutes() {
    return [
      { key: 'characters', name: 'Characters', path: '/characters' },
      { key: 'gauntlet', name: 'Gauntlet', path: '/gauntlet' },
    ];
  }

  /**
   * Gets the navigation route that matches the given key.
   * @param {string} key
   * @returns {NavRoute}
   */
  static getNavRoute(key) {
    return Routes.getNavRoutes().find(route => route.key === key);
  }
}

export default Routes;
