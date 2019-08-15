import React, { useState } from 'react';
import {
  Button, Form, Row, Col, Spinner,
} from 'react-bootstrap';
import PropTypes from 'prop-types';
import { MdCancel, MdSave, MdEdit } from 'react-icons/md';

const EditView = ({
  currentText, setCurrentText, errorMessage, loading, onCancel, onSave,
}) => (
  <Form>
    <Row>
      <Col>
        <Form.Control
          className="textbox"
          size="sm"
          type="text"
          value={currentText}
          onChange={event => setCurrentText(event.target.value)}
          isInvalid={!!errorMessage}
          disabled={loading}
        />
        <Form.Control.Feedback type="invalid">{errorMessage}</Form.Control.Feedback>
      </Col>
      <Col xs="auto" className="px-0">
        <Button className="cancel-button" size="sm" onClick={onCancel} disabled={loading}>
          <MdCancel />
        </Button>
      </Col>
      {loading ? (
        <Col xs="auto" className="px-0">
          <Spinner
            className="test-loading-spinner"
            size="sm"
            animation="border"
            variant="light"
            role="status"
          />
        </Col>
      ) : (
        <Col xs="auto" className="px-0">
          <Button className="save-button" size="sm" onClick={onSave} disabled={loading}>
            <MdSave />
          </Button>
        </Col>
      )}
    </Row>
  </Form>
);

EditView.propTypes = {
  currentText: PropTypes.string.isRequired,
  setCurrentText: PropTypes.func.isRequired,
  errorMessage: PropTypes.string,
  loading: PropTypes.bool.isRequired,
  onCancel: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
};

EditView.defaultProps = {
  errorMessage: null,
};

/**
 * The static view of the ClickableEdit component.
 * @param {Object} props
 *  The props of the component.
 * @param {string} props.text
 *  The current value of the editable string.
 * @param {boolean} props.loading
 *  If the underlying value is editable asynchronously, this property will be
 *  true while a set operation is in progress.
 * @param {(editMode:boolean)=>void} props.setEditing
 *  A method to call to enable edit mode.
 */
const StaticView = ({ text, loading, setEditing }) => (
  <div>
    <Row>
      <Col>{text}</Col>
      {loading ? (
        <Col xs="auto" className="px-0">
          <Spinner
            className="test-loading-spinner"
            size="sm"
            animation="border"
            variant="light"
            role="status"
          />
        </Col>
      ) : (
        <Col xs="auto" className="px-0">
          <Button
            className="edit-button"
            size="sm"
            onClick={() => setEditing(true)}
            disabled={loading}
          >
            <MdEdit />
          </Button>
        </Col>
      )}
    </Row>
  </div>
);

StaticView.propTypes = {
  text: PropTypes.string.isRequired,
  loading: PropTypes.bool.isRequired,
  setEditing: PropTypes.func.isRequired,
};

/**
 * A component that allows editing a text value. It renders as a block element
 * with a clickable button to allow editing of the value.
 * @param {Object} props
 *  The props of the component.
 * @param {string} props.text
 *  The current value of the editable string.
 * @param {(newText:string)=>boolean} props.setText
 *  A function to call to set the new value of the string. If the function
 *  returns true, either the set operation is asynchronous or the set operation
 *  failed.
 * @param {boolean} props.loading
 *  If the underlying value is editable asynchronously, this property will be
 *  true while a set operation is in progress.
 * @param {string} props.errorMessage
 *  If the underlying value is editable asynchronosuly, this property will
 *  have a value with a message if the set operation failed.
 */
const ClickableEdit = ({
  text, setText, loading, errorMessage,
}) => {
  const [isEditing, setEditing] = useState(false);
  const [currentText, setCurrentText] = useState(text);

  const onCancel = () => {
    setCurrentText(text);
    setEditing(false);
  };

  const onSave = () => {
    if (!setText(currentText)) {
      setEditing(false);
    }
  };

  React.useEffect(() => {
    if (!loading) {
      // Changed from loading to not loading; check error state
      if (!errorMessage) {
        setEditing(false);
      }
    }
  }, [loading, errorMessage]);

  React.useEffect(() => {
    setCurrentText(text);
  }, [text]);

  // Possible modes of the component.
  // isEditing is true:
  // - loading is false, error is empty: Normal edit mode.
  // - loading is false, error has a value: Normal edit mode with an error indicator.
  // - loading is true: Save of edit is in progress; editing is disabled and a spinner
  //   is shown. error is ignored.
  // isEditing is false:
  // - loading is false, error is empty: Normal display mode.
  // - loading is false, error has a value: Normal display mode with an error indicator.
  // - loading is true: Save of edit is in progress; going into edit mode is disabled
  //   and a spinner is shown. error is ignored. Can't-happen case.

  return isEditing ? (
    <EditView
      currentText={currentText}
      setCurrentText={setCurrentText}
      errorMessage={errorMessage}
      loading={loading}
      onCancel={onCancel}
      onSave={onSave}
    />
  ) : (
    <StaticView text={text} loading={loading} setEditing={setEditing} />
  );
};

ClickableEdit.propTypes = {
  text: PropTypes.string.isRequired,
  setText: PropTypes.func.isRequired,
  loading: PropTypes.bool,
  errorMessage: PropTypes.string,
};

ClickableEdit.defaultProps = {
  loading: false,
  errorMessage: null,
};

ClickableEdit.EditView = EditView;
ClickableEdit.StaticView = StaticView;

export default ClickableEdit;
