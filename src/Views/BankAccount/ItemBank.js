import React, { useState } from "react";
import { Col, Row, ListGroupItem } from "reactstrap";

//Import actions
import {
  insertBankAccount as onInsertBankAccount,
  insertAccountLinkToBank as onInsertAccountLinkToBank,
  getAccountBank as onGetAccountBank,
} from "../../slices/thunks";
//redux
import { useDispatch } from "react-redux";
import "react-toastify/dist/ReactToastify.css";
import moment from "moment";
import { customFormatNumber } from "../../utils/function";

const ItemBank = ({ item }) => {
  const dispatch = useDispatch();
  const [libelle, setLibelle] = useState(
    item?.bua_libelle ? item?.bua_libelle : ""
  );
  return (
    <ListGroupItem data-id="1" className={"list-group-item"}>
      <Row lg={12} xs={12}>
        <Col md={6} xs={12} className="row">
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
          {item.bua_account_id?.length > 0 && (
            <>
            <Col xs={12} md={6}>
              <div className="input-group ">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Libellé personnalisé"
                  aria-label="Libellé personnalisé"
                  value={libelle}
                  onChange={(e) => {
                    setLibelle(e.target.value);
                  }}
                />
                <div className="input-group-append">
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
            </Col>
            <Col xs={12} md={6} className="d-flex align-items-center">
              <p className="p-0 m-0">Solde du compte : {customFormatNumber(parseFloat(item.bua_solde))}€</p>
            </Col>
            </>
          )}
        </Col>
        <Col md={4} xs={12} className="row my-4 d-flex justify-content-center">
          <Col xs={12} md={6} className="d-flex justify-content-center flex-column">
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
              Renouveler l’autorisation<br/>
              {/* <p
              className="m-0"
              style={{
                color: item.bua_account_id?.length > 0 ? "black" : "red",
                fontWeight: "bolder",
                textAlign: "center",
                // minWidth: 147,
              }}
            > */}
              {item.bua_account_id?.length > 0
                ? "Date expiration : " + moment(item.bac_date_expired).format("D MMM YYYY")
                : "Informations du compte obsolètes "}{" "}
            {/* </p> */}
            </button>
          </Col>
        </Col>
        {item.bua_account_id?.length > 0 && (
          <Col md={2} xs={12} className="row my-4 d-flex justify-content-center">
            <Col xs={12} md={12} className="d-flex justify-content-center">
              <button
                type="button"
                class={`btn ${
                  item.bua_account_id?.length > 0
                    ? " btn-outline-primary"
                    : "btn-outline-danger"
                }`}
                onClick={() => {
                  dispatch(onGetAccountBank("insert"))
                }}
              >
                Charger mes transactions
              </button>
            </Col>
          </Col>
        )}
      </Row>
    </ListGroupItem>
  );
};

export default ItemBank;
