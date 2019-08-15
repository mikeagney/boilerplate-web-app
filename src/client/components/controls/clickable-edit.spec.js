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
    jest.spyOn(React, 'useEffect');
  });

  afterEach(() => {
    React.useEffect.mockRestore();
  });

  describe('EditView', () => {
    const defaultEditProps = {
      currentText: 'foo',
      setCurrentText: jest.fn(),
      loading: false,
      onCancel: jest.fn(),
      onSave: jest.fn(),
    };

    it('will render the expected initial state', () => {
      // Arrange
      const props = defaultEditProps;

      // Act
      const wrapper = shallow(<ClickableEdit.EditView {...props} />);

      // Assert
      expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('will render the expected validation error if edit fails', () => {
      // Arrange
      const props = { ...defaultEditProps, errorMessage: 'Mock error' };

      // Act
      const wrapper = shallow(<ClickableEdit.EditView {...props} />);

      // Assert
      expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('will disable the save and cancel buttons if loading is true with edit mode on', () => {
      // Arrange
      const props = { ...defaultEditProps, loading: true };

      // Act
      const wrapper = shallow(<ClickableEdit.EditView {...props} />);

      // Assert
      expect(toJson(wrapper)).toMatchSnapshot();
      const cancelButton = wrapper.find('.cancel-button');
      expect(cancelButton.props('disabled')).toBeTruthy();
      const saveButton = wrapper.find('.save-button');
      expect(saveButton.length).toEqual(0);
    });

    it('will render expected text changes in edit mode', () => {
      // Arrange
      const props = defaultEditProps;
      const wrapper = shallow(<ClickableEdit.EditView {...props} />);

      // Act
      wrapper.find('.textbox').simulate('change', { target: { value: 'bar' } });

      // Assert
      expect(props.setCurrentText).toHaveBeenCalledWith('bar');
    });

    it('will set text when save is clicked', () => {
      // Arrange
      const props = defaultEditProps;
      const wrapper = shallow(<ClickableEdit.EditView {...props} />);

      // Act
      wrapper.find('.textbox').simulate('change', { target: { value: 'bar' } });
      wrapper.find('.save-button').simulate('click');

      // Assert
      expect(props.onCancel).not.toHaveBeenCalled();
      expect(props.onSave).toHaveBeenCalledTimes(1);
    });

    it('will not set text when cancel is clicked', () => {
      // Arrange
      const props = defaultEditProps;
      const wrapper = shallow(<ClickableEdit.EditView {...props} />);

      // Act
      wrapper.find('.textbox').simulate('change', { target: { value: 'bar' } });
      wrapper.find('.cancel-button').simulate('click');

      // Assert
      expect(props.onCancel).toHaveBeenCalledTimes(1);
      expect(props.onSave).not.toHaveBeenCalled();
    });
  });

  describe('StaticView', () => {
    const defaultStaticProps = {
      text: 'foo',
      loading: false,
      setEditing: jest.fn(),
    };

    it('will render the expected initial state', () => {
      // Arrange
      const props = defaultStaticProps;

      // Act
      const wrapper = shallow(<ClickableEdit.StaticView {...props} />);

      // Assert
      expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('will hide the edit button if loading is true with edit mode off', () => {
      // Arrange
      const props = { ...defaultStaticProps, loading: true };

      // Act
      const wrapper = shallow(<ClickableEdit.StaticView {...props} />);

      // Assert
      expect(toJson(wrapper)).toMatchSnapshot();
      const editButton = wrapper.find('.edit-button');
      expect(editButton.length).toEqual(0);
    });

    it('will render the expected edit mode when edit is clicked', () => {
      // Arrange
      const props = defaultStaticProps;
      const wrapper = shallow(<ClickableEdit.StaticView {...props} />);

      // Act
      wrapper.find('.edit-button').simulate('click');

      // Assert
      expect(toJson(wrapper)).toMatchSnapshot();
      expect(props.setEditing).toHaveBeenCalledWith(true);
    });
  });

  it('will render the static view by default', () => {
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
    wrapper.find(ClickableEdit.StaticView).prop('setEditing')(true);

    // Assert
    expect(toJson(wrapper)).toMatchSnapshot();
  });

  it('will change edit mode text when setCurrentText is called', () => {
    // Arrange
    const props = defaultProps;
    const wrapper = shallow(<ClickableEdit {...props} />);
    wrapper.find(ClickableEdit.StaticView).prop('setEditing')(true);

    // Act
    wrapper.find(ClickableEdit.EditView).prop('setCurrentText')('bar');

    // Assert
    expect(wrapper.find(ClickableEdit.EditView).prop('currentText')).toEqual('bar');
  });

  it('will return to static mode when onCancel is called', () => {
    // Arrange
    const props = defaultProps;
    const wrapper = shallow(<ClickableEdit {...props} />);
    wrapper.find(ClickableEdit.StaticView).prop('setEditing')(true);
    wrapper.find(ClickableEdit.EditView).prop('setCurrentText')('bar');

    // Act
    wrapper.find(ClickableEdit.EditView).prop('onCancel')();

    // Assert
    expect(wrapper.find(ClickableEdit.StaticView).length).toEqual(1);
  });

  it('will set currentText to original text when onCancel is called', () => {
    // Arrange
    const props = defaultProps;
    const wrapper = shallow(<ClickableEdit {...props} />);
    wrapper.find(ClickableEdit.StaticView).prop('setEditing')(true);
    wrapper.find(ClickableEdit.EditView).prop('setCurrentText')('bar');

    // Act
    wrapper.find(ClickableEdit.EditView).prop('onCancel')();
    wrapper.find(ClickableEdit.StaticView).prop('setEditing')(true);

    // Assert
    expect(wrapper.find(ClickableEdit.EditView).prop('currentText')).toEqual('foo');
  });

  it('will attempt to set text to currentText when onSave is called', () => {
    // Arrange
    const props = defaultProps;
    const wrapper = shallow(<ClickableEdit {...props} />);
    wrapper.find(ClickableEdit.StaticView).prop('setEditing')(true);
    wrapper.find(ClickableEdit.EditView).prop('setCurrentText')('bar');

    // Act
    wrapper.find(ClickableEdit.EditView).prop('onSave')();

    // Assert
    expect(props.setText).toHaveBeenCalledTimes(1);
    expect(props.setText).toHaveBeenCalledWith('bar');
  });

  it('will return to static mode when onSave is called if setText returns false', () => {
    // Arrange
    const props = defaultProps;
    props.setText.mockReturnValue(false);
    const wrapper = shallow(<ClickableEdit {...props} />);
    wrapper.find(ClickableEdit.StaticView).prop('setEditing')(true);
    wrapper.find(ClickableEdit.EditView).prop('setCurrentText')('bar');

    // Act
    wrapper.find(ClickableEdit.EditView).prop('onSave')();

    // Assert
    expect(wrapper.find(ClickableEdit.StaticView).length).toEqual(1);
  });

  it('will stay in edit mode when onSave is called if setText returns false', () => {
    // Arrange
    const props = defaultProps;
    props.setText.mockReturnValue(true);
    const wrapper = shallow(<ClickableEdit {...props} />);
    wrapper.find(ClickableEdit.StaticView).prop('setEditing')(true);
    wrapper.find(ClickableEdit.EditView).prop('setCurrentText')('bar');

    // Act
    wrapper.find(ClickableEdit.EditView).prop('onSave')();

    // Assert
    expect(wrapper.find(ClickableEdit.EditView).length).toEqual(1);
  });

  describe('useEffect', () => {
    const NUMBER_OF_USE_EFFECT_CALLS = 2;

    it('will set up two effects on render', () => {
      // Arrange
      const props = defaultProps;

      // Act
      shallow(<ClickableEdit {...props} />);

      // Assert
      expect(React.useEffect).toHaveBeenCalledTimes(NUMBER_OF_USE_EFFECT_CALLS);
      expect(React.useEffect).toHaveBeenCalledWith(expect.any(Function), [false, null]);
      expect(React.useEffect).toHaveBeenCalledWith(expect.any(Function), ['foo']);
    });

    describe('onLoadingChanged', () => {
      const USE_EFFECT_INDEX = 0;

      it('will stay in edit mode when loading goes from false to true', () => {
        // Arrange
        const props = defaultProps;
        const wrapper = shallow(<ClickableEdit {...props} />);
        wrapper.find(ClickableEdit.StaticView).prop('setEditing')(true);

        // Act
        wrapper.setProps({ loading: true });
        const [onLoadingChanged] = React.useEffect.mock.calls[
          NUMBER_OF_USE_EFFECT_CALLS * 2 + USE_EFFECT_INDEX
        ];
        onLoadingChanged();

        // Assert
        expect(wrapper.find(ClickableEdit.EditView).length).toEqual(1);
      });

      it('will return to static mode when loading goes from true to false and there is no error message', () => {
        // Arrange
        const props = { ...defaultProps, loading: true };
        const wrapper = shallow(<ClickableEdit {...props} />);
        wrapper.find(ClickableEdit.StaticView).prop('setEditing')(true);

        // Act
        wrapper.setProps({ loading: false });
        const [onLoadingChanged] = React.useEffect.mock.calls[
          NUMBER_OF_USE_EFFECT_CALLS * 2 + USE_EFFECT_INDEX
        ];
        onLoadingChanged();

        // Assert
        expect(wrapper.find(ClickableEdit.StaticView).length).toEqual(1);
      });

      it('will stay in edit mode when loading goes from true to false and there is an error message', () => {
        // Arrange
        const props = { ...defaultProps, loading: true };
        const wrapper = shallow(<ClickableEdit {...props} />);
        wrapper.find(ClickableEdit.StaticView).prop('setEditing')(true);

        // Act
        wrapper.setProps({ loading: false, errorMessage: 'Mock error' });
        const [onLoadingChanged] = React.useEffect.mock.calls[
          NUMBER_OF_USE_EFFECT_CALLS * 2 + USE_EFFECT_INDEX
        ];
        onLoadingChanged();

        // Assert
        expect(wrapper.find(ClickableEdit.EditView).length).toEqual(1);
      });
    });

    describe('onTextChanged', () => {
      const USE_EFFECT_INDEX = 1;

      it('will update edit mode text when normal text changes', () => {
        // Arrange
        const props = defaultProps;
        const wrapper = shallow(<ClickableEdit {...props} />);

        // Act
        wrapper.setProps({ text: 'bar' });
        const [onTextChanged] = React.useEffect.mock.calls[
          NUMBER_OF_USE_EFFECT_CALLS * 1 + USE_EFFECT_INDEX
        ];
        onTextChanged();
        wrapper.find(ClickableEdit.StaticView).prop('setEditing')(true);

        // Assert
        expect(wrapper.find(ClickableEdit.EditView).prop('currentText')).toEqual('bar');
      });
    });
  });
});
