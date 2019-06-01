import delve from 'dlv';
import mapValues from 'lodash/mapValues';
import { createSelector } from 'reselect';

/**
 * @typedef {Object} CollectionItem
 * @property {string} CollectionItem.name
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
  }

  /**
   * Creates a selector that gets the collection of objects indexed by id.
   * @returns {(state:*)=>{[id:string]:CollectionItem}}
   *   A selector that gets the object collection.
   */
  getById() {
    this.getByIdSelector = this.getByIdSelector
      || createSelector(
        this.rootSelector,
        collectionRoot => delve(collectionRoot, 'byId', {}),
      );
    return this.getByIdSelector;
  }

  /**
   * Creates a selector that gets the collection of object IDs.
   * @returns {(state:*)=>string[]}
   *   A selector that gets the object IDs.
   */
  getIds() {
    this.getIdsSelector = this.getIdsSelector
      || createSelector(
        this.rootSelector,
        collectionRoot => delve(collectionRoot, 'ids', []),
      );
    return this.getIdsSelector;
  }

  /**
   * Creates a selector that gets a map of item names indexed by ID.
   * @returns {(state:*)=>{[id:string]:string}}
   *   A selector that gets a map of object IDs to names.
   */
  getNames() {
    this.getNamesSelector = this.getNamesSelector
      || createSelector(
        this.getById(),
        byId => mapValues(byId, item => item.name),
      );
    return this.getNamesSelector;
  }

  /**
   * Creates a selector that gets the selected collection ID.
   * @returns {(state:*)=>string}
   *   A selector that gets the selected item ID, or an empty string if
   *   no item is selected.
   */
  getSelectedId() {
    this.getSelectedIdSelector = this.getSelectedIdSelector
      || createSelector(
        this.rootSelector,
        collectionRoot => delve(collectionRoot, 'selectedId', ''),
      );
    return this.getSelectedIdSelector;
  }

  /**
   * Creates a selector that gets the item with an ID specified by a
   * component prop.
   * @param {(state:*,props:*)=>string} idPropSelector
   *   An input selector that returns the value of the prop containing the
   *   item ID.
   * @returns {(state:*,props:*)=>CollectionItem}
   *   A selector that returns the item with the specified item ID.
   */
  getItemById(idPropSelector) {
    return createSelector(
      this.getById(),
      idPropSelector,
      (byId, id) => delve(byId, id, {}),
    );
  }
}

export default CollectionBaseSelectors;
