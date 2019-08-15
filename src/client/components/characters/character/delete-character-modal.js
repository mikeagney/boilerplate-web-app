import React from 'react';
import PropTypes from 'prop-types';
import { Button, Modal } from 'react-bootstrap';

const DeleteCharacterModal = ({
  name, show, onCancel, onConfirm,
}) => (
  <Modal show={show} onHide={onCancel}>
    <Modal.Header closeButton>
      <Modal.Title>Confirm Delete</Modal.Title>
    </Modal.Header>
    <Modal.Body>{`Really delete character ${name}?`}</Modal.Body>
    <Modal.Footer>
      <Button className="delete-button-cancel" variant="secondary" onClick={onCancel}>
        Keep
      </Button>
      <Button className="delete-button-confirm" variant="primary" onClick={onConfirm}>
        Delete
      </Button>
    </Modal.Footer>
  </Modal>
);

DeleteCharacterModal.propTypes = {
  name: PropTypes.string.isRequired,
  show: PropTypes.bool.isRequired,
  onCancel: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
};

export default DeleteCharacterModal;
