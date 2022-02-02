import React from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

const ModalAcceptReject = (props) => {
  const { show, onAccept, onReject, title, header, message, acceptBtn, rejectBtn } = props;

  return (
    <Modal isOpen={show} >
      <ModalHeader toggle={onReject}>{title || 'Modal'}</ModalHeader>
      <ModalBody>
        {header &&
          <h5>{header}</h5>
        }
        <div style={{padding: '5px'}}>
          {message || ''}
        </div>
      </ModalBody>
      <ModalFooter>
        <Button color="primary" onClick={onAccept}>{acceptBtn || 'OK'}</Button>{' '}
        <Button color="secondary" onClick={onReject}>{rejectBtn || 'Cancel'}</Button>
      </ModalFooter>
    </Modal>
  );
}

export default ModalAcceptReject;
