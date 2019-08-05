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
    loadingState: {
      pending: false,
      loading: false,
      nextCursor: null,
    },
    setSelected: jest.fn(),
    getCharacterIds: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('will render one Character component with the appropriate character ID', () => {
    // Arrange
    const props = defaultProps;

    // Act
    const wrapper = shallow(<CharacterList {...props} />);

    // Assert
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  describe('useEffect', () => {
    beforeEach(() => {
      jest.spyOn(React, 'useEffect');
    });

    afterEach(() => {
      React.useEffect.mockRestore();
    });

    it('will set up useEffect hook', () => {
      // Arrange
      const props = defaultProps;

      // Act
      shallow(<CharacterList {...props} />);

      // Assert
      expect(React.useEffect).toHaveBeenCalledTimes(1);
      expect(React.useEffect).toHaveBeenCalledWith(expect.any(Function), [
        false,
        expect.any(Function),
      ]);
    });

    it('will not invoke getCharacterIds if not pending', () => {
      // Arrange
      const props = defaultProps;
      shallow(<CharacterList {...props} />);
      const effectFunc = React.useEffect.mock.calls[0][0];

      // Act
      effectFunc();

      // Assert
      expect(props.getCharacterIds).not.toHaveBeenCalled();
    });

    it('will invoke getCharacterIds if pending', () => {
      // Arrange
      const props = { ...defaultProps, loadingState: { pending: true } };
      shallow(<CharacterList {...props} />);
      const effectFunc = React.useEffect.mock.calls[0][0];

      // Act
      effectFunc();

      // Assert
      expect(props.getCharacterIds).toHaveBeenCalledTimes(1);
      expect(props.getCharacterIds).toHaveBeenCalledWith();
    });
  });

  it('will render spinner if pending is true', () => {
    // Arrange
    const props = {
      ...defaultProps,
      loadingState: {
        pending: true,
      },
    };

    // Act
    const wrapper = shallow(<CharacterList {...props} />);

    // Assert
    expect(toJson(wrapper)).toMatchSnapshot();
    expect(wrapper.find('.test-loading-spinner').length).toEqual(1);
  });

  it('will render spinner if loading is true', () => {
    // Arrange
    const props = {
      ...defaultProps,
      loadingState: {
        loading: true,
      },
    };

    // Act
    const wrapper = shallow(<CharacterList {...props} />);

    // Assert
    expect(toJson(wrapper)).toMatchSnapshot();
    expect(wrapper.find('.test-loading-spinner').length).toEqual(1);
  });

  it('will render More button if nextCursor is not null', () => {
    // Arrange
    const props = {
      ...defaultProps,
      loadingState: {
        nextCursor: '12345',
      },
    };

    // Act
    const wrapper = shallow(<CharacterList {...props} />);

    // Assert
    expect(toJson(wrapper)).toMatchSnapshot();
    expect(wrapper.find('.test-more-button').length).toEqual(1);
  });

  it('will invoke getCharacterIds if More button is clicked', () => {
    // Arrange
    const props = {
      ...defaultProps,
      loadingState: {
        nextCursor: '12345',
      },
    };
    const wrapper = shallow(<CharacterList {...props} />);

    // Act
    wrapper.find('.test-more-button').simulate('click');

    // Assert
    expect(props.getCharacterIds).toHaveBeenCalledWith('12345');
  });
});
