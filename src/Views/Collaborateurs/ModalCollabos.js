import React from "react";
import { Input, Modal, ModalBody, ModalFooter, ModalHeader, Row } from "reactstrap";
import SimpleBar from "simplebar-react";

function ModalCollabos() {
  return (
    <Modal
      id="showModal"
      isOpen={modalClient}
      toggle={toggleModalClient}
      centered>
      <ModalHeader
        className="bg-soft-info p-3"
        toggle={toggleModalClient}>
        Sélectionnez un client
      </ModalHeader>

      <ModalBody>
        <Row className="g-3">
          <Input
            type="text"
            className="form-control bg-light border-0"
            id="cart-total"
            placeholder="Recherche par nom, téléphone, email..."
            onChange={(e) => {
              setSearchValueClient(e.target.value);
            }}
            value={searchValueClient}
          />
          <SimpleBar
            autoHide={false}
            style={{ maxHeight: "220px" }}
            className="px-3">
            {handleListClient()?.map((c, i) => {
              return (
                <div
                  key={i}
                  style={{ display: "flex", alignItems: "center", width: "100%", borderBottom: "0.5px solid #dddddd", margin: 3 }}>
                  <div className="flex-shrink-0">
                    {c.ent_img_url ? (
                      <img
                        src={process.env.REACT_APP_API_URL + "/images/" + c.ent_img_url}
                        alt=""
                        className="avatar-xxs rounded-circle"
                      />
                    ) : (
                      <div className="flex-shrink-0 avatar-xs me-2">
                        <div className="avatar-title bg-soft-success text-success rounded-circle fs-13">{c.ent_name.charAt(0)}</div>
                      </div>
                    )}
                  </div>
                  <div
                    style={{ cursor: "pointer", padding: 8, display: "flex", flexDirection: "column", width: "100%" }}
                    onClick={() => {
                      setModalClient(() => false);
                      validation.setValues({
                        ...validation.values,
                        recurrence_data: {
                          ...validation.values.recurrence_data,
                          rec_ent_fk: c.ent_id
                        },
                        clients: c
                      });
                    }}
                    key={i}>
                    <span>{c.ent_name}</span>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span>
                        <i>{c.ent_email}</i>
                      </span>{" "}
                      <span>
                        <i>{c.ent_phone}</i>
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </SimpleBar>
        </Row>
      </ModalBody>
      <ModalFooter>
        <div className="hstack gap-2 justify-content-end">
          <button
            type="button"
            className="btn btn-light"
            onClick={() => {
              setModalClient(false);
            }}>
            {" "}
            Fermer{" "}
          </button>
          <button
            type="submit"
            className="btn btn-success"
            id="add-btn">
            {" "}
            Sélectionner{" "}
          </button>
        </div>
      </ModalFooter>
    </Modal>
  );
}

export default ModalCollabos;
