import PropTypes from "prop-types";
import React from "react";
import { Modal, ModalBody } from "reactstrap";

const ConfirmModal = ({ title, text, show, onActionClick, onCloseClick }) => {
  return (
    <Modal isOpen={show} toggle={onCloseClick} centered={true}>
      <ModalBody className="py-3 px-5">
        <script src="https://cdn.lordicon.com/bhenfmcm.js"></script>
        <div className="mt-2 text-center">
          <lord-icon
            src="https://cdn.lordicon.com/gsqxdxog.json"
            trigger="loop"
            colors="primary:#f7b84b,secondary:#fa896b"
            style={{ width: "100px", height: "100px" }}
          ></lord-icon>
          <div className="mt-4 pt-2 fs-15 mx-4 mx-sm-5">
            <h4>{title}</h4>
            <p className="text-muted mx-4 mb-0">
              {text}
            </p>
          </div>
        </div>
        <div className="d-flex gap-2 justify-content-center mt-4 mb-2">
          <button
            type="button"
            className="btn w-sm btn-light"
            data-bs-dismiss="modal"
            onClick={onCloseClick}
          >
            Fermer
          </button>
          <button
            type="button"
            className="btn w-sm btn-success "
            id="delete-record"
            onClick={onActionClick}
          >
            Oui, Confirmer !
          </button>
        </div>
      </ModalBody>
    </Modal>
  );
};

ConfirmModal.propTypes = {
  onCloseClick: PropTypes.func,
  onActionClick: PropTypes.func,
  show: PropTypes.any,
};

export default ConfirmModal;