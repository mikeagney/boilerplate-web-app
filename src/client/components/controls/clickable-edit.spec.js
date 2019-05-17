import React from 'react';
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';
import ClickableEdit from './clickable-edit';

describe('ClickableEdit common component', () => {
  const defaultProps = {
    text: 'foo',
    setText: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('will render the expected initial state', () => {
    // Arrange
    const props = defaultProps;

    // Act
    const wrapper = shallow(<ClickableEdit {...props} />);

    // Assert
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('will render the expected edit mode when edit is clicked', () => {
    // Arrange
    const props = defaultProps;
    const wrapper = shallow(<ClickableEdit {...props} />);

    // Act
    wrapper.find('.edit-button').simulate('click');

    // Assert
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('will render expected text changes in edit mode', () => {
    // Arrange
    const props = defaultProps;
    const wrapper = shallow(<ClickableEdit {...props} />);

    // Act
    wrapper.find('.edit-button').simulate('click');
    wrapper.find('.textbox').simulate('change', { target: { value: 'bar' } });

    // Assert
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('will set text when save is clicked', () => {
    // Arrange
    const props = defaultProps;
    const wrapper = shallow(<ClickableEdit {...props} />);

    // Act
    wrapper.find('.edit-button').simulate('click');
    wrapper.find('.textbox').simulate('change', { target: { value: 'bar' } });
    wrapper.find('.save-button').simulate('click');

    // Assert
    expect(toJson(wrapper)).toMatchSnapshot();
    expect(props.setText).toHaveBeenCalledWith('bar');
  });

  it('will not set text when cancel is clicked', () => {
    // Arrange
    const props = defaultProps;
    const wrapper = shallow(<ClickableEdit {...props} />);

    // Act
    wrapper.find('.edit-button').simulate('click');
    wrapper.find('.textbox').simulate('change', { target: { value: 'bar' } });
    wrapper.find('.cancel-button').simulate('click');

    // Assert
    expect(toJson(wrapper)).toMatchSnapshot();
    expect(props.setText).not.toHaveBeenCalled();
  });
});
