import React, { useState } from 'react';
import {
  Button, Form, Row, Col, Spinner,
} from 'react-bootstrap';
import PropTypes from 'prop-types';
import { MdCancel, MdSave, MdEdit } from 'react-icons/md';

const ClickableEdit = ({ text, setText, loading }) => {
  const [isEditing, setEditing] = useState(false);
  const [currentText, setCurrentText] = useState(text);

  const onCancel = () => {
    setCurrentText(text);
    setEditing(false);
  };

  const onSave = () => {
    setText(currentText);
    setEditing(false);
  };

  return isEditing ? (
    <Form>
      <Row>
        <Col>
          <Form.Control
            className="textbox"
            size="sm"
            type="text"
            value={currentText}
            onChange={event => setCurrentText(event.target.value)}
          />
        </Col>
        {loading && (
          <Col xs="auto" className="px-0">
            <Spinner
              className="test-loading-spinner"
              size="sm"
              animation="border"
              variant="secondary"
              role="status"
            />
          </Col>
        )}
        <Col xs="auto" className="px-0">
          <Button className="cancel-button" size="sm" onClick={onCancel} disabled={loading}>
            <MdCancel />
          </Button>
        </Col>
        <Col xs="auto" className="px-0">
          <Button className="save-button" size="sm" onClick={onSave} disabled={loading}>
            <MdSave />
          </Button>
        </Col>
      </Row>
    </Form>
  ) : (
    <div>
      <Row>
        <Col>{text}</Col>
        {loading && (
          <Col xs="auto" className="px-0">
            <Spinner
              className="test-loading-spinner"
              size="sm"
              animation="border"
              variant="secondary"
              role="status"
            />
          </Col>
        )}
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
      </Row>
    </div>
  );
};

ClickableEdit.propTypes = {
  text: PropTypes.string.isRequired,
  setText: PropTypes.func.isRequired,
  loading: PropTypes.bool,
};

ClickableEdit.defaultProps = {
  loading: false,
};

export default ClickableEdit;
