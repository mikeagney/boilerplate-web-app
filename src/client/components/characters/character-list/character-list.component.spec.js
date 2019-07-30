import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import CharacterList from './character-list.component';

describe('CharacterList component', () => {
  const defaultProps = {
    characterIds: ['a1a', 'b2b'],
    characterNames: {
      a1a: 'Mock Character 1',
      b2b: 'Mock Character 2',
    },
    selectedId: 'b2b',
    setSelected: jest.fn(),
  };

  it('will render one Character component with the appropriate character ID', () => {
    // Arrange
    const props = defaultProps;

    // Act
    const wrapper = shallow(<CharacterList {...props} />);

    // Assert
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
