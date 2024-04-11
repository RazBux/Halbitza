import React from 'react';
import "../App.css";

/*
Modal used for showing child component that send to him, mainly it's a form - add/delete 
while the rest of the app is unavilable. 
*/
const Modal = ({ show, children, onClose }) => {
  if (!show) {
    return null;
  }

  return (
    ///////without scrollable container //////
    ///////that hold the X button allways in the /////
    <div className="modal-backdrop">
      <div className="modal-content">
        <button onClick={onClose} className="modal-close-button">X</button>
        <div className="modal-scroll-container">
          {children}
        </div>
      </div>
    </div>
    );
};

export default Modal;
