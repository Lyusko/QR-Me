import React from 'react';
import './ModalSession.css';

const Modal = ({ isOpen, closeModal, message }) => {
  if (!isOpen) return null; // Don't render the modal if it's not open

  return (
    <div className="modal-container">
      <div className="modal-backdrop" onClick={closeModal}></div>
      <div className="modal-dialog">
        <div className="modal-content">
          <p id="message">{message}</p>
          <button id="closeModal" onClick={closeModal}>Close</button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
