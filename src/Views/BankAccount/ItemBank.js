import React, { useState } from "react";
import { Col, Row, ListGroupItem } from "reactstrap";

//Import actions
import { insertBankAccount as onInsertBankAccount, insertAccountLinkToBank as onInsertAccountLinkToBank, getAccountBank as onGetAccountBank } from "../../slices/thunks";
//redux
import { useDispatch, useSelector } from "react-redux";
import "react-toastify/dist/ReactToastify.css";
import moment from "moment";
import { customFormatNumber } from "../../utils/function";
import { SketchPicker } from "react-color";
import DeleteModal from "../../Components/Common/DeleteModal";
import axios from "axios";

const ItemBank = ({ item, remove }) => {
  const dispatch = useDispatch();

  const { devise } = useSelector((state) => ({
    devise: state?.Company?.devise
  }));

  const [showModalDelete, setShowModalDelete] = useState(false);

  const [libelle, setLibelle] = useState(item?.bua_libelle ? item?.bua_libelle : "");
  const [display_Cust, setdisplay_Cust] = useState(false);
  const [colorCust, setcolorCust] = useState(item?.bua_color || "rgba(95, 208, 243, 1)");

  const onSwatchHover_Cust = (color) => {
    const format1 = "rgba(" + color.rgb.r + "," + color.rgb.g + "," + color.rgb.b + "," + color.rgb.a + ")";
    setcolorCust(format1);
  };
  function handleCust() {
    setdisplay_Cust(!display_Cust);
  }

  return (
    <>
      <DeleteModal
        show={showModalDelete}
        onCloseClick={() => setShowModalDelete(false)}
        onDeleteClick={() => {
        
          remove(item.bua_id);
        }}
        text="êtes-vous sûr de vouloir supprimer ce compte ?"
      />
      <ListGroupItem
        data-id="1"
        style={{}}
        className={"list-group-item flex-wrap d-flex justify-content-between"}>
        <div
          onClick={handleCust}
          style={{ position: "absolute", backgroundColor: "lightgray", width: 30, height: 30, justifyContent: "center", alignItems: "center", display: "flex", borderRadius: 50, top: 3, left: 5 }}>
          <i class="fs-5 mdi mdi-cog-outline"></i>
        </div>
        <div
          onClick={() => setShowModalDelete(true)}
          style={{ position: "absolute", backgroundColor: "lightgray", width: 30, height: 30, justifyContent: "center", alignItems: "center", display: "flex", borderRadius: 50, bottom: 3, left: 5, color: "red" }}>
          <i className="las la-trash"></i>
        </div>
        {display_Cust ? (
          <div
            style={{
              backgroundColor: "white",
              position: "absolute",
              zIndex: 2,
              top: 40,
              left: 0
            }}>
            <div className="input-group ">
              <div
                style={{ position: "relative" }}
                className="input-group-append">
                <div
                  className="monolith-colorpicker"
                  onClick={handleCust}>
                  <i
                    style={{
                      height: "39px",
                      width: "39px",
                      background: colorCust,
                      display: "block",
                      borderTopLeftRadius: "5px",
                      borderBottomLeftRadius: "5px",
                      border: "1px solid lightgray"
                    }}
                  />
                </div>

                {display_Cust ? (
                  <div
                    style={{
                      position: "absolute",
                      zIndex: 2,
                      top: 40,
                      left: 0
                    }}>
                    <SketchPicker
                      color="#fff"
                      value={colorCust}
                      width="268.5px"
                      onChangeComplete={onSwatchHover_Cust}
                    />
                  </div>
                ) : null}
              </div>
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
                        bua_color: colorCust,
                        bua_account_id: item.bua_account_id,
                        bua_libelle: libelle
                      })
                    );
                    handleCust();
                  }}
                  className="btn btn-outline-success"
                  type="button">
                  <i className=" las la-check"></i>
                </button>
              </div>
            </div>
            <SketchPicker
              color="#fff"
              value={colorCust}
              width="268px"
              onChangeComplete={onSwatchHover_Cust}
            />
          </div>
        ) : null}

        <div className="d-flex flex-wrap mb-1">
          <i
            style={{
              height: "15px",
              width: "15px",
              background: colorCust,
              borderRadius: "50px",
              border: "1px solid lightgray",
              position: "absolute",
              left: "108px",
              top: 6
            }}
          />

          <img
            style={{ height: "100px", width: "100px", objectFit: "cover" }}
            src={item.bac_logo}
            className="img-fluid"
          />
          <div className="m-1 d-flex flex-column">
            <span className="">{item.bac_name}</span>
            <span
              className=""
              style={{ fontWeight: "bolder" }}>
              N° de compte : {item.bua_iban?.length > 0 ? item.bua_iban : "Désynchronisé"}
            </span>
            <span className="p-0">
              Solde du compte : {customFormatNumber(parseFloat(item.bua_solde))} {devise}
            </span>
            {item.bua_last_tra && <span className="p-0">Dernière transaction : {moment(item.bua_last_tra).format("L")}</span>}
          </div>
        </div>

        <div className="d-flex flex-column justify-content-around">
          <button
            type="button"
            class={`mb-1 btn ${item.bua_account_id?.length > 0 ? " btn-outline-primary" : "btn-outline-danger"}`}
            onClick={() => {
              dispatch(onGetAccountBank("insert"));
            }}>
            Charger mes transactions
          </button>
          <button
            type="button"
            class={`btn ${item.bua_account_id?.length > 0 ? " btn-outline-primary" : "btn-outline-danger"}`}
            onClick={() => {
              dispatch(
                onInsertBankAccount({
                  bac_instit_id: item.bac_instit_id,
                  bac_logo: item.bac_logo,
                  bac_name: item.bac_name,
                  oldLinkId: item.bac_id
                })
              );
            }}>
            Renouveler l’autorisation
          </button>
          {item.bua_account_id?.length > 0 ? "Date expiration : " + moment(item.bac_date_expired).format("D MMM YYYY") : "Informations du compte obsolètes "} {/* </p> */}
        </div>
      </ListGroupItem>
    </>
  );
};

export default ItemBank;
