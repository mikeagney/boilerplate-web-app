import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import CharacterList from './character-list.component';

describe('CharacterList component', () => {
  const defaultProps = {
    characterIds: ['a1a', 'b2b'],
    selectedId: 'b2b',
  };

  it('will render Character components with the appropriate character selected', () => {
    // Arrange
    const props = defaultProps;

    // Act
    const wrapper = shallow(<CharacterList {...props} />);

    // Assert
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
