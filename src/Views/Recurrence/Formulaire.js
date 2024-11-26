import React, { useState } from "react";
import { Button, Col, FormFeedback, Input, Label, Row } from "reactstrap";
import * as Yup from "yup";
import Select from "react-select";
import { useFormik } from "formik";
import moment from "moment";
import ModalProducts from "../Product/ModalProducts";
import { useSelector } from "react-redux";

function Formulaire({ onClose = () => {} }) {
  const { devise } = useSelector((state) => ({
    devise: state.Company.devise
  }));

  const [modalProduct, setModalProduct] = useState(false);

  const daysOptions = [
    {
      options: new Array(30).fill(0).map((v, i) => ({ value: i + 1, label: i + 1 + " jours" }))
    }
  ];
  const validation = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {
      products: [],
      clients: {},
      recurrence_data: {
        rec_ent_fk: "",
        rec_desc: "",
        rec_nb: 1,
        rec_quand: 0,
        rec_repetition: 1,
        rec_date_create: "",
        rec_delai_echeance: ""
      }
    },
    validationSchema: Yup.object({
      recurrence_data: Yup.object({
        rec_ent_fk: Yup.number().required("Veuillez entrer un client"),
        rec_nb: Yup.number().required("Champs obligatoire"),
        rec_quand: Yup.number().min(1, "Veuillez sélectionnez une répétition").required("Champs obligatoire"),
        rec_repetition: Yup.string().required("Champs obligatoire")
      }),
      products: Yup.array().min(1, "Ajouter au moins un produit")
    }),
    onSubmit: (values) => {
      // for (let index = 0; index < values.products.length; index++) {
      //   const element = values.products[index];
      //   let data = { ...element, ...values.recurrence_data };
      //   delete data.pro_id;
      //   dispatch(onAddRecurrence(data));
      // }
      // setOpenCreate(false);
      // setShow(false);
      // validation.resetForm();
    }
  });

  function toggleModalProduct() {
    setModalProduct((res) => !res);
  }

  return (
    <>
      <Row>
        <Col lg={12}>
          <div className="w-10 d-flex input-group mb-2 position-relative">
            <Input
              style={{ flex: 1 }}
              type="text"
              autoComplete="off"
              className="form-control border-1"
              placeholder="Ajouter un client"
              onChange={() => {}}
              value={validation.values.clients.ent_name || ""}
              disabled
              required
              invalid={validation.errors?.recurrence_data?.rec_ent_fk && validation.touched?.recurrence_data?.rec_ent_fk ? true : false}
            />
            <button
              onClick={() => {
                toggleModalClient();
              }}
              className="btn btn-secondary"
              type="button"
              id="button-addon2">
              +
            </button>
            {validation.errors?.recurrence_data?.rec_ent_fk && validation.touched?.recurrence_data?.rec_ent_fk ? <FormFeedback type="invalid">{validation.errors?.recurrence_data?.rec_ent_fk}</FormFeedback> : null}
          </div>
        </Col>

        <Col lg={12}>
          <Label>Description</Label>
          <div className="w-10 d-flex input-group mb-2 position-relative">
            <Input
              style={{ flex: 1 }}
              type="text"
              name={`recurrence_data.rec_desc`}
              className="form-control border-1"
              onChange={validation.handleChange}
              onBlur={validation.handleBlur}
              value={validation.values.recurrence_data.rec_desc || ""}
            />
          </div>
        </Col>

        <Col lg={12}>
          <div className="mb-2">
            <Label for="date-field">Date de création</Label>
            <Input
              type="date"
              name="recurrence_data.rec_date_create"
              id="date-field"
              className="form-control"
              min={moment().add(1, "day").format("YYYY-MM-DD")}
              placeholder="Selectionnez une date"
              onBlur={validation.handleBlur}
              onChange={validation.handleChange}
              invalid={validation.errors?.recurrence_data?.rec_date_create && validation.touched?.recurrence_data?.rec_date_create ? true : false}
            />
            {validation.errors?.recurrence_data?.rec_date_create && validation.touched?.recurrence_data?.rec_date_create ? <FormFeedback type="invalid">{validation.errors?.recurrence_data?.rec_date_create}</FormFeedback> : null}
          </div>
        </Col>
        <Col lg={12}>
          <div className="mb-2">
            <Label for="date-field">Délai d'échéance</Label>
            <Select
              options={daysOptions}
              onChange={(e) => {
                validation.setValues({ ...validation.values, recurrence_data: { ...validation.values.recurrence_data, ...validation.values.recurrence_data.rec_delai_echeance, rec_delai_echeance: e.value } });
              }}
              name="choices-single-default"
              styles={{
                container: (styles) => ({
                  ...styles,
                  zIndex: 25
                })
              }}
              id="idStatus"
            />
            {validation.errors?.recurrence_data?.rec_delai_echeance && validation.touched?.recurrence_data?.rec_delai_echeance ? <FormFeedback type="invalid">{validation.errors?.recurrence_data?.rec_delai_echeance}</FormFeedback> : null}
          </div>
        </Col>

        <Label for="date-field">Créer la facture toute les</Label>
        <Col
          lg={12}
          className="d-flex">
          <div className="mb-2 input-group position-relative">
            <Input
              type="number"
              name="recurrence_data.rec_repetition"
              id="date-field"
              className="form-control w-5"
              placeholder=""
              onBlur={validation.handleBlur}
              onChange={validation.handleChange}
              value={validation.values.recurrence_data.rec_repetition}
              invalid={validation.errors?.recurrence_data?.rec_repetition && validation.touched?.recurrence_data?.rec_repetition ? true : false}
            />
            <Input
              type="select"
              name="recurrence_data.rec_quand"
              id="date-field"
              className="w-75 form-control"
              placeholder="Select a date"
              onBlur={validation.handleBlur}
              onChange={validation.handleChange}
              value={validation.values.recurrence_data.rec_quand}
              invalid={validation.errors?.recurrence_data?.rec_quand && validation.touched?.recurrence_data?.rec_quand ? true : false}>
              <option>Sélectionnez une répétition...</option>
              <option value={1}>Jours</option>
              <option value={2}>Semaines</option>
              <option value={3}>Mois</option>
              <option value={4}>Trimestres</option>
            </Input>
          </div>
          {validation.values.recurrence_data.rec_nb !== 0 ? (
            <div className="mb-2 ms-2 d-flex align-items-center">
              <span className="me-2">répéter</span>
              <Input
                type="number"
                name="recurrence_data.rec_nb"
                id="date-field"
                className="form-control w-5"
                placeholder=""
                onBlur={validation.handleBlur}
                onChange={validation.handleChange}
                value={validation.values.recurrence_data.rec_nb}
                invalid={validation.errors?.recurrence_data?.rec_nb && validation.touched?.recurrence_data?.rec_nb ? true : false}
              />
            </div>
          ) : (
            ""
          )}
        </Col>
        {validation.errors?.recurrence_data?.rec_quand && validation.touched?.recurrence_data?.rec_quand ? (
          <FormFeedback
            className="d-block"
            type="invalid">
            {validation.errors?.recurrence_data?.rec_quand}
          </FormFeedback>
        ) : null}
        <Col xl={12}>
          <Input
            onChange={(e) => validation.setValues({ ...validation.values, recurrence_data: { ...validation.values.recurrence_data, rec_nb: e.target.checked ? 0 : 1 } })}
            type="checkbox"
          />
          <Label>ne pas définir un nombre de répétition</Label>
        </Col>

        <Col lg={6}>
          <div>
            <Label
              htmlFor="pro_name-field"
              className="form-label">
              <button
                onClick={() => {
                  toggleModalProduct();
                }}
                className="btn btn-secondary"
                type="button"
                id="button-addon2">
                + Ajouter des produits
              </button>
            </Label>
          </div>
        </Col>
        <Col lg={12}>
          <div className="d-flex">
            <div style={{ flex: 2 }}>
              <Label>Nom</Label>
            </div>
            <div style={{ flex: 1 }}>
              <Label>Qté</Label>
            </div>
            <div style={{ flex: 1 }}>
              <Label>Prix unit ht</Label>
            </div>
          </div>
          {validation.values.products.length ? (
            validation?.values?.products?.map((product, i) => (
              <div
                key={i}
                className="d-flex">
                <div className="w-75 d-flex input-group mb-2 position-relative">
                  <Input
                    style={{ flex: 1 }}
                    type="text"
                    className="form-control border-1"
                    placeholder="Nom du produit"
                    value={product.rec_pro_name}
                    disabled
                    required
                  />
                  <div className="input-step">
                    <button
                      type="button"
                      className="minus"
                      onClick={(e) => {
                        if (product.rec_pro_qty > 1) {
                          validation.setValues({ ...validation.values, products: validation.values.products?.map((e) => (e.pro_id == product.pro_id ? { ...e, rec_pro_qty: e.rec_pro_qty - 1 } : e)) });
                        }
                      }}>
                      –
                    </button>
                    <Input
                      type="number"
                      placeholder="0"
                      className="product-quantity"
                      id="product-qty-1"
                      value={product?.rec_pro_qty}
                      onChange={(e) => {}}
                      // onBlur={validation.handleBlur}
                      required
                    />
                    <button
                      type="button"
                      className="plus"
                      onClick={(e) => {
                        validation.setValues({ ...validation.values, products: validation.values.products?.map((e) => (e.pro_id == product.pro_id ? { ...e, rec_pro_qty: e.rec_pro_qty + 1 } : e)) });
                      }}>
                      +
                    </button>
                  </div>
                </div>
                <div
                  style={{ width: "30%", display: "flex" }}
                  className="input-group mb-2 ms-2">
                  <Input
                    name={`products[${i}].rec_montant`}
                    type="number"
                    className="form-control border-1"
                    value={product.rec_montant}
                    onChange={validation.handleChange}
                    onBlur={validation.handleBlur}
                    required
                    min={1}
                  />

                  <label className="btn btn-secondary btn-input-group form-label">{devise}</label>
                </div>
              </div>
            ))
          ) : (
            <i>Aucun produit ajouté</i>
          )}
          {validation.errors?.products ? (
            <div
              type="invalid"
              style={{
                width: "100%",
                marginTop: "0.25rem",
                fontSize: "0.875em",
                color: "#fa896b",
                backgroundImage: 'url("data:image/svg+xml,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 12 12%27 width=%2712%27 height=%2712%27 fill=%27none%27 stroke=%27%23fa896b%27%3e%3ccircle cx=%276%27 cy=%276%27 r=%274.5%27/%3e%3cpath stroke-linejoin=%27round%27 d=%27M5.8 3.6h.4L6 6.5z%27/%3e%3ccircle cx=%276%27 cy=%278.2%27 r=%27.6%27 fill=%27%23fa896b%27 stroke=%27none%27/%3e%3c/svg%3e")',
                backgroundRepeat: "no-repeat",
                backgroundSize: "contain",
                backgroundPositionX: "0",
                paddingLeft: "20px"
              }}>
              {validation.errors?.products}
            </div>
          ) : null}
        </Col>
      </Row>
      <div className="d-flex m-0 p-2 border-top border-light align-items-center justify-content-end gap-2">
        <Button
          className=""
          color="light"
          onClick={onClose}>
          Fermer
        </Button>
        <Button
          color="success"
          onClick={validation.handleSubmit}>
          Enregister
        </Button>
      </div>
      <ModalProducts
        toggleModalProduct={toggleModalProduct}
        modalProduct={modalProduct}
        onUpdate={(products) => {
          validation.setFieldValue(
            "products",
            products.map((item) => {
              if (item.pro_name) {
                return {
                  pro_id: item.pro_id,
                  rec_pro_name: item.pro_name,
                  rec_pro_qty: 1,
                  rec_montant: item.pro_prix,
                  rec_tva: item.pro_tva
                };
              } else {
                return item;
              }
            })
          );
        }}
        selected={validation.values.products}
      />
    </>
  );
}

export default Formulaire;
