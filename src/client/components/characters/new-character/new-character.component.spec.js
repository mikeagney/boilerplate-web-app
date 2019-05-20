import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import NewCharacter from './new-character.component';

describe('NewCharacter component', () => {
  const defaultProps = {
    characterIds: ['a1a', 'b2b'],
    setSelected: jest.fn(),
    addCharacter: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('will render the expected new character form', () => {
    // Arrange
    const props = defaultProps;

    // Act
    const wrapper = shallow(<NewCharacter {...props} />);

    // Assert
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('will update the edit field when name edit is committed', () => {
    // Arrange
    const props = defaultProps;
    const wrapper = shallow(<NewCharacter {...props} />);

    // Act
    wrapper
      .find('.name-clickable-edit')
      .props()
      .setText('Changed Character');

    // Assert
    expect(wrapper.find('.name-clickable-edit').props().text).toEqual('Changed Character');
  });

  it('will reset to default name and reset selected character ID on cancel', () => {
    // Arrange
    const props = defaultProps;
    const wrapper = shallow(<NewCharacter {...props} />);
    wrapper
      .find('.name-clickable-edit')
      .props()
      .setText('Changed Character');

    // Act
    wrapper.find('.cancel-button').simulate('click');

    // Assert
    expect(wrapper.find('.name-clickable-edit').props().text).toEqual('New Character');
    expect(props.setSelected).toHaveBeenCalledTimes(1);
    expect(props.setSelected).toHaveBeenCalledWith('a1a');
  });

  it('will set selected character ID to empty on cancel when there are no character IDs', () => {
    // Arrange
    const props = { ...defaultProps, characterIds: [] };
    const wrapper = shallow(<NewCharacter {...props} />);

    // Act
    wrapper.find('.cancel-button').simulate('click');

    // Assert
    expect(props.setSelected).toHaveBeenCalledTimes(1);
    expect(props.setSelected).toHaveBeenCalledWith('');
  });

  it('will reset to default name and invoke addCharacter on save', () => {
    // Arrange
    const props = defaultProps;
    const wrapper = shallow(<NewCharacter {...props} />);
    wrapper
      .find('.name-clickable-edit')
      .props()
      .setText('Changed Character');

    // Act
    wrapper.find('.save-button').simulate('click');

    // Assert
    expect(wrapper.find('.name-clickable-edit').props().text).toEqual('New Character');
    expect(props.addCharacter).toHaveBeenCalledTimes(1);
    expect(props.addCharacter).toHaveBeenCalledWith(expect.any(String), {
      name: 'Changed Character',
    });
  });
});
