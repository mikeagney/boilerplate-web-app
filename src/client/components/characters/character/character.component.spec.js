import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import ClickableEdit from '../../controls/clickable-edit';
import Character from './character.component';

describe('Character component', () => {
  const defaultProps = {
    characterId: 'b2b',
    name: 'Mock name',
    getCharacterById: jest.fn(),
    patchCharacter: jest.fn(),
    deleteCharacter: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('will render Character component', () => {
    // Arrange
    const props = {
      ...defaultProps,
    };

    // Act
    const wrapper = shallow(<Character {...props} />);

    // Assert
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('will set ClickableEdit.loading to true if patchCharacter is in progress', () => {
    // Arrange
    const props = {
      ...defaultProps,
      patchStatus: {
        loading: true,
      },
    };

    // Act
    const wrapper = shallow(<Character {...props} />);

    // Assert
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('will call patchCharacter when ClickableEdit sets text', () => {
    // Arrange
    const props = {
      ...defaultProps,
    };
    const wrapper = shallow(<Character {...props} />);
    const { setText } = wrapper.find(ClickableEdit).props();

    // Act
    setText('new text');

    // Assert
    expect(props.patchCharacter).toHaveBeenCalledWith(props.characterId, { name: 'new text' });
  });

  it('will display a loading spinner if pending is true', () => {
    // Arrange
    const props = {
      ...defaultProps,
      pending: true,
    };

    // Act
    const wrapper = shallow(<Character {...props} />);

    // Assert
    expect(toJson(wrapper)).toMatchSnapshot();
    expect(wrapper.find('.test-loading-spinner').length).toEqual(1);
  });

  it('will display a loading spinner if loading is true', () => {
    // Arrange
    const props = {
      ...defaultProps,
      loading: true,
    };

    // Act
    const wrapper = shallow(<Character {...props} />);

    // Assert
    expect(toJson(wrapper)).toMatchSnapshot();
    expect(wrapper.find('.test-loading-spinner').length).toEqual(1);
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
      const props = { ...defaultProps, pending: true };

      // Act
      shallow(<Character {...props} />);

      // Assert
      expect(React.useEffect).toHaveBeenCalledTimes(1);
      expect(React.useEffect).toHaveBeenCalledWith(expect.any(Function), [true]);
    });

    it('will not invoke getCharacterById if not pending', () => {
      // Arrange
      const props = { ...defaultProps, pending: false };
      shallow(<Character {...props} />);
      const effectFunc = React.useEffect.mock.calls[0][0];

      // Act
      effectFunc();

      // Assert
      expect(props.getCharacterById).not.toHaveBeenCalled();
    });

    it('will invoke getCharacterById if pending', () => {
      // Arrange
      const props = { ...defaultProps, pending: true };
      shallow(<Character {...props} />);
      const effectFunc = React.useEffect.mock.calls[0][0];

      // Act
      effectFunc();

      // Assert
      expect(props.getCharacterById).toHaveBeenCalledTimes(1);
      expect(props.getCharacterById).toHaveBeenCalledWith(props.characterId);
    });
  });
});
