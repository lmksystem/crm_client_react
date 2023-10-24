import React, { useEffect } from "react";

import {
  Col,
  CardBody,
  Label,
  Input,
  Form,
} from "reactstrap";
import { useFormik, validateYupSchema } from "formik";

import { handleAlert as onHandleAlert, getAlert as onGetAlert, deleteAlert as onDeleteAlert } from '../../slices/thunks'
import { useDispatch, useSelector } from "react-redux";

const AlertParametrage = () => {
  const { alerts } = useSelector((state) => ({
    alerts: state.Gestion.alerts,
  }));

  const dispatch = useDispatch();

  // Formulaire constante
  const alertForm = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {
      alerts: [...alerts] || []

    },
    onSubmit: (values) => {
      let alerts = values.alerts

      dispatch(onHandleAlert(alerts));
      return;


    },
  });


  useEffect(() => {
    dispatch(onGetAlert());
  }, [])


  return (
    <Form
      onSubmit={(e) => {
        e.preventDefault();
        alertForm.handleSubmit();
        return false;
      }} className="border-top border-top-dashed"
    >
      <CardBody>

        <Col lg={6}>
          <Label
            htmlFor="prefixe_libelle_fac-field"
            className="form-label m-2"
          >
            Rappel d'échéance facture
          </Label>
          {alertForm.values?.alerts.map((alert, i) => {
            return (
              <div key={i} className="m-2 input-group">
                <div className="input-group-text bg-primary border-primary text-white">
                  Nombres de jours
                </div>
                <Input
                  name={`alerts[${i}].aec_delai`}
                  id="prefixe_libelle_fac-field"
                  className="form-control"
                  placeholder="ex: 5"
                  type="text"
                  onChange={alertForm.handleChange}
                  onBlur={alertForm.handleBlur}
                  value={(Math.sign(alertForm.values?.alerts[i].aec_delai) == 1 ? "+" : "") + alertForm.values?.alerts[i].aec_delai || ""}
                />
                <div style={{ cursor: "pointer" }} onClick={() => { dispatch(onDeleteAlert(alert.aec_id)); }} className="input-group-text bg-danger border-danger text-white">
                  <i className="ri-close-fill"></i>
                </div>
              </div>
            );
          })

          }

        </Col>

        <div className="mx-auto d-flex" lg={12}>
          <div className="m-2">
            <button
              onClick={(e) => {
                e.preventDefault();
                alertForm.setValues({
                  ...alertForm.values, alerts: [...alertForm.values.alerts, {
                    aec_id: "",
                    aec_com_fk: "",
                    aec_delai: "",
                  }]
                })
              }}

              className="btn btn-secondary"
              id="add-btn"
            >
              + Ajouter
            </button>
          </div>
          <div className="m-2">
            <button
              type="submit"
              className="btn btn-success"
              id="add-btn"
            >
              Enregistrer
            </button>
          </div>
        </div>
      </CardBody>
    </Form>
  )
}

export default AlertParametrage;