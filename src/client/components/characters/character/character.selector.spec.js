import { getItemById } from '../../../store/characters/characters.selectors';
import mapStateToProps from './character.selector';

jest.mock('../../../store/characters/characters.selectors');

describe('Character object selector', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('will use the getItemById selector', () => {
    // Arrange
    const expectedResult = jest.fn();
    getItemById.mockReturnValue(expectedResult);

    // Act
    const result = mapStateToProps();

    // Assert
    expect(result).toBe(expectedResult);
    expect(getItemById).toHaveBeenCalledTimes(1);
    expect(getItemById).toHaveBeenCalledWith(expect.any(Function));
  });

  it('will pass a props selector that gets characterId to getItemById', () => {
    // Arrange
    mapStateToProps();
    const propsSelector = getItemById.mock.calls[0][0];

    // Act
    const result = propsSelector(null, { characterId: 'foo' });

    // Assert
    expect(result).toEqual('foo');
  });
});
