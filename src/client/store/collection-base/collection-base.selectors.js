import delve from 'dlv';
import mapValues from 'lodash/mapValues';
import { createSelector } from 'reselect';

/**
 * @typedef {Object} CollectionItem
 * @property {string} CollectionItem.name
 */

/**
 * Information about the loading status of a store object supported by a backing store.
 * @typedef {Object} LoadingState
 * @property {boolean} pending   True if the object has not yet been loaded.
 * @property {boolean} loading   True if an object load is in progress.
 * @property {boolean} loaded    True if an object load is complete.
 * @property {string} nextCursor A value that can be used to get an additional page of results.
 * @property {any} error         An object that contains error information about the most recent
 *                               failed attempt to load the object.
 */

/**
 * @typedef {Object} CollectionRoot
 * @property {{[id:string]:CollectionItem}} CollectionRoot.byId
 * @property {string[]} CollectionRoot.ids
 * @property {string} CollectionRoot.selectedId
 */

class CollectionBaseSelectors {
  /**
   * Creates an object to generate collection base selectors.
   * @param {(state:*)=>CollectionRoot} rootSelector
   */
  constructor(rootSelector) {
    this.rootSelector = rootSelector;
    this.memoizedRootNodeSelectors = {};
  }

  /**
   * Creates a selector that gets one of the root properties of the collection
   * store node.
   * Not intended to be used directly by components.
   *
   * @param {string} key
   *   The key into the root collection store node.
   * @param {any} defaultValue
   *   The value to return if the root collection has no value for the specified key.
   * @returns {(state:*)=>any}
   *   A selector that gets the relevant key from the root of the collection store.
   */
  getRootNodeSelector = (key, defaultValue) => {
    this.memoizedRootNodeSelectors[key] = this.memoizedRootNodeSelectors[key]
      || createSelector(
        this.rootSelector,
        collectionRoot => delve(collectionRoot, key, defaultValue),
      );
    return this.memoizedRootNodeSelectors[key];
  };

  /**
   * Creates a selector that gets the collection of objects indexed by id.
   * @returns {(state:*)=>{[id:string]:CollectionItem}}
   *   A selector that gets the object collection.
   */
  getById = () => this.getRootNodeSelector('byId', {});

  /**
   * Creates a selector that gets the collection of object IDs.
   * @returns {(state:*)=>string[]}
   *   A selector that gets the object IDs.
   */
  getIds = () => this.getRootNodeSelector('ids', []);

  /**
   * Creates a selector that gets a map of item names indexed by ID.
   * @returns {(state:*)=>{[id:string]:string}}
   *   A selector that gets a map of object IDs to names.
   */
  getNames = () => {
    this.getNamesSelector = this.getNamesSelector
      || createSelector(
        this.getById(),
        byId => mapValues(byId, item => item.name),
      );
    return this.getNamesSelector;
  };

  /**
   * Creates a selector that gets the selected collection ID.
   * @returns {(state:*)=>string}
   *   A selector that gets the selected item ID, or an empty string if
   *   no item is selected.
   */
  getSelectedId = () => this.getRootNodeSelector('selectedId', '');

  /**
   * Creates a selector that gets the item with an ID specified by a
   * component prop.
   * @param {(state:*,props:*)=>string} idPropSelector
   *   An input selector that returns the value of the prop containing the
   *   item ID.
   * @returns {(state:*,props:*)=>CollectionItem}
   *   A selector that returns the item with the specified item ID.
   */
  getItemById = idPropSelector =>
    createSelector(
      this.getById(),
      idPropSelector,
      (byId, id) => delve(byId, id, {}),
    );

  /**
   * Creates a selector that gets the loading state for the collection.
   * @returns {(state:*)=>LoadingState}
   *   The current status of operations to load the collection from the backing store.
   */
  getLoadingState = () => {
    this.getLoadingStateSelector = this.getLoadingStateSelector
      || createSelector(
        this.getRootNodeSelector('pending', false),
        this.getRootNodeSelector('loading', false),
        this.getRootNodeSelector('loaded', false),
        this.getRootNodeSelector('nextCursor', null),
        this.getRootNodeSelector('error', null),
        (pending, loading, loaded, nextCursor, error) => ({
          pending,
          loading,
          loaded,
          nextCursor,
          error,
        }),
      );
    return this.getLoadingStateSelector;
  };
}

export default CollectionBaseSelectors;
