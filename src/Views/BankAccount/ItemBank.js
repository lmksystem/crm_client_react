import React, { useState } from "react";
import { Col, Row, ListGroupItem } from "reactstrap";

//Import actions
import {
  insertBankAccount as onInsertBankAccount,
  insertAccountLinkToBank as onInsertAccountLinkToBank,
} from "../../slices/thunks";
//redux
import { useDispatch } from "react-redux";
import "react-toastify/dist/ReactToastify.css";

const ItemBank = ({ item }) => {
  const dispatch = useDispatch();
  const [libelle, setLibelle] = useState(
    item?.bua_libelle ? item?.bua_libelle : ""
  );
  return (
    <ListGroupItem data-id="1" className={"list-group-item-action"}>
      <Row lg={12} xs={12}>
        <Col md={8} xs={12} className="row">
          <Col xs={2} md={1} style={{ minWidth: 95, maxWidth: 120 }}>
            <img src={item.bac_logo} className="img-fluid" />
          </Col>
          <Col xs={8} md={7}>
            <Col xs={12}>
              <p className="m-1">{item.bac_name}</p>
              <p className="m-1" style={{ fontWeight: "bolder" }}>
                Numéro de compte :{" "}
                {item.bua_account_id?.length > 0
                  ? item.bua_account_id
                  : "Désynchronisé"}
              </p>
            </Col>
          </Col>
         {item.bua_account_id?.length>0 && <Col xs={12}>
            <div class="input-group ">
              <input
                type="text"
                class="form-control"
                placeholder="Libellé personnalisé"
                aria-label="Libellé personnalisé"
                value={libelle}
                onChange={(e) => {
                  setLibelle(e.target.value);
                }}
              />
              <div class="input-group-append">
                <button
                  onClick={() => {
                    dispatch(
                      onInsertAccountLinkToBank({
                        bua_account_id: item.bua_account_id,
                        bua_libelle: libelle,
                      })
                    );
                  }}
                  class="btn btn-outline-success"
                  type="button"
                >
                  <i className=" las la-check"></i>
                </button>
              </div>
            </div>
          </Col>}
        </Col>
        <Col md={4} xs={12} className="row my-4">
          <Col xs={6} md={12} className="d-flex justify-content-center">
            <button
              type="button"
              class={`btn ${
                item.bua_account_id?.length > 0
                  ? " btn-outline-primary"
                  : "btn-outline-danger"
              }`}
              onClick={() => {
                dispatch(
                  onInsertBankAccount({
                    bac_instit_id: item.bac_instit_id,
                    bac_logo: item.bac_logo,
                    bac_name: item.bac_name,
                    oldLinkId: item.bac_id,
                  })
                );
              }}
            >
              Mettre à jour
            </button>
          </Col>
          <Col xs={6} md={12} className="d-flex justify-content-center">
            <p
              className="m-0"
              style={{
                color: item.bua_account_id?.length > 0 ? "black" : "red",
                fontWeight: "bolder",
                textAlign: "center",
                minWidth: 147,
              }}
            >
              {item.bua_account_id?.length > 0
                ? "Date expiration : " + item.bac_date_expired
                : "Veuillez vous mettre à jour avec cette banque"}{" "}
            </p>
          </Col>
        </Col>
      </Row>
    </ListGroupItem>
  );
};

export default ItemBank;
