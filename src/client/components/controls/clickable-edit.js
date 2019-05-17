import React, { useState } from 'react';
import {
  Button, Form, Row, Col,
} from 'react-bootstrap';
import PropTypes from 'prop-types';
import { MdCancel, MdSave, MdEdit } from 'react-icons/md';

const ClickableEdit = ({ text, setText }) => {
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
        <Col xs="auto" className="px-0">
          <Button className="cancel-button" size="sm" onClick={onCancel}>
            <MdCancel />
          </Button>
        </Col>
        <Col xs="auto" className="px-0">
          <Button className="save-button" size="sm" onClick={onSave}>
            <MdSave />
          </Button>
        </Col>
      </Row>
    </Form>
  ) : (
    <div>
      <Row>
        <Col>{text}</Col>
        <Col xs="auto" className="px-0">
          <Button className="edit-button" size="sm" onClick={() => setEditing(true)}>
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
};

export default ClickableEdit;
