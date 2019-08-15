import React from 'react';
import { Modal } from 'react-bootstrap';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import DeleteCharacterModal from './delete-character-modal';

describe('Modal dialog box for deleting a character', () => {
  const defaultProps = {
    name: 'John Doe',
    show: true,
    onCancel: jest.fn(),
    onConfirm: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('will render normally if show is false', () => {
    // Arrange
    const props = defaultProps;

    // Act
    const wrapper = shallow(<DeleteCharacterModal {...props} />);

    // Assert
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('will render hidden if show is false', () => {
    // Arrange
    const props = {
      ...defaultProps,
      show: false,
    };

    // Act
    const wrapper = shallow(<DeleteCharacterModal {...props} />);

    // Assert
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('will call onCancel when closed', () => {
    // Arrange
    const props = defaultProps;
    const wrapper = shallow(<DeleteCharacterModal {...props} />);

    // Act
    const onHide = wrapper.find(Modal).prop('onHide');
    onHide();

    // Assert
    expect(props.onCancel).toHaveBeenCalledTimes(1);
    expect(props.onConfirm).not.toHaveBeenCalled();
  });

  it('will call onCancel when cancel button is clicked', () => {
    // Arrange
    const props = defaultProps;
    const wrapper = shallow(<DeleteCharacterModal {...props} />);

    // Act
    wrapper.find('.delete-button-cancel').simulate('click');

    // Assert
    expect(props.onCancel).toHaveBeenCalledTimes(1);
    expect(props.onConfirm).not.toHaveBeenCalled();
  });

  it('will call onConfirm when confirm button is clicked', () => {
    // Arrange
    const props = defaultProps;
    const wrapper = shallow(<DeleteCharacterModal {...props} />);

    // Act
    wrapper.find('.delete-button-confirm').simulate('click');

    // Assert
    expect(props.onCancel).not.toHaveBeenCalled();
    expect(props.onConfirm).toHaveBeenCalledTimes(1);
  });
});
