import React, { useEffect } from "react";

import {
  Col,
  CardBody,
  Label,
  Input,
  Form,
} from "reactstrap";
import { useFormik } from "formik";

import { handleAlert as onHandleAlert, getAlert as onGetAlert, deleteAlert as onDeleteAlert } from '../../slices/thunks'
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

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
      let alerts = values.alerts;
      const occurrences = {};
      values.alerts.forEach(({ aec_delai }) => {
        occurrences[aec_delai] = (occurrences[aec_delai] || 0) + 1;
      });
      const valeursSimilaires = Object.entries(occurrences)
        .filter(([_, count]) => count > 1)
        .map(([valeur]) => valeur);
      if (valeursSimilaires.length > 0) {
        toast.error('Des valeurs sont similaires ! ', { autoClose: 3000 });
        return
      }
      dispatch(onHandleAlert(alerts));
      return;


    },
  });


  useEffect(() => {
    dispatch(onGetAlert());
  }, [dispatch])


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

          <div class="alert alert-primary d-flex flex-column" role="alert">
            <div>
              * Une valeur négative enverra un rappel avant la date d'échéance
            </div>
            <div>

              * Une valeur positive enverra un rappel après la date d'échéance
            </div>
          </div>
          {alertForm.values?.alerts.map((alert, i) => {

            let isPositive = alert.aec_delai > 0 && !(alert.aec_delai.toString().includes('+')) && alert.aec_delai.length > 0 ? "+" : "";

            return (
              <div key={i} className="m-2 input-group">
                <div className="input-group-text bg-primary border-primary text-white">
                  Nombres de jours
                </div>

                <Input
                  type="text"
                  name={`alerts[${i}].aec_delai`}
                  id="prefixe_libelle_fac-field"
                  className="form-control"
                  placeholder="ex: 5"
                  onChange={(e) => {

                    alertForm.handleChange(e);
                  }}
                  onBlur={alertForm.handleBlur}
                  value={isPositive + alertForm.values?.alerts[i].aec_delai || ""}
                />
                <div style={{ cursor: "pointer" }} onClick={() => {
                  // console.log(alert)
                  if (alert.aec_id) {
                    dispatch(onDeleteAlert(alert.aec_id));
                  } else {
                    const updatedAlerts = [...alertForm.values.alerts];
                    updatedAlerts.splice(i, 1);
                    alertForm.setFieldValue('alerts', updatedAlerts);
                  }
                }} className="input-group-text bg-danger border-danger text-white">
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