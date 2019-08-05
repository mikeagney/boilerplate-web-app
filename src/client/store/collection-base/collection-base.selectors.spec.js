import CollectionBaseSelectors from './collection-base.selectors';

describe('Base selectors for all collection store nodes', () => {
  describe('getRootNodeSelector', () => {
    it('will get a valid selector for an arbitrary node', () => {
      // Arrange
      const selectors = new CollectionBaseSelectors(root => root);
      const selectedIdSelector = selectors.getRootNodeSelector('selectedId', '');

      // Act
      const value = selectedIdSelector({ selectedId: 'foo' });

      // Assert
      expect(value).toEqual('foo');
    });

    it('will get the same selector when called twice', () => {
      // Arrange
      const selectors = new CollectionBaseSelectors(root => root);

      // Act
      const selectedIdSelector = selectors.getRootNodeSelector('selectedId', '');
      const selectedIdSelectorAgain = selectors.getRootNodeSelector('selectedId', '');

      // Assert
      expect(selectedIdSelectorAgain).toBe(selectedIdSelector);
    });
  });

  describe('getLoadingState', () => {
    it('will get all the loading-state properties', () => {
      // Arrange
      const expectedLoadingState = {
        pending: true,
        loading: true,
        loaded: true,
        nextCursor: '12345',
        error: 'mock error',
      };
      const state = {
        ...expectedLoadingState,
        otherProps: 'also exist',
      };
      const selectors = new CollectionBaseSelectors(root => root);

      // Act
      const loadingState = selectors.getLoadingState()(state);

      // Assert
      expect(loadingState).toEqual(expectedLoadingState);
    });
  });
});
