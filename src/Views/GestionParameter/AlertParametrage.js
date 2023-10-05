import React, { useEffect, useState, useCallback, useMemo } from "react";
import { Link } from "react-router-dom";
import { isEmpty } from "lodash";
import * as moment from "moment";

// Import Images
import dummyImg from "../../assets/images/users/user-dummy-img.jpg";

import {
  Col,
  Container,
  Row,
  Card,
  CardHeader,
  CardBody,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Label,
  Input,
  Modal,
  ModalHeader,
  ModalBody,
  Form,
  ModalFooter,
  Table,
  FormFeedback,
} from "reactstrap";
import Select from "react-select";
import { useFormik, validateYupSchema } from "formik";

const AlertParametrage = () => {



  // Formulaire constante
  const alertForm = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {
      alerts: [
        {
          aec_id: "",
          aec_com_fk: "",
          aec_delai: "",
        },
        {
          aec_id: "",
          aec_com_fk: "",
          aec_delai: "",
        }
      ]

    },
    onSubmit: (values) => {

      // dispatch(onHandleConstantes(newPrefixes));
      return;

      // constanteForm.resetForm();
    },
  });


  return (
    <Form>
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
              <div className="m-2 input-group">
                <div className="input-group-text bg-primary border-primary text-white">
                  Nombres de jours
                </div>
                <Input
                  name={`alerts[${i}].aec_delai`}
                  id="prefixe_libelle_fac-field"
                  className="form-control"
                  placeholder="ex: 5"
                  type="number"
                  onChange={alertForm.handleChange}
                  onBlur={alertForm.handleBlur}
                  value={alertForm.values?.alerts[i].aec_delai || ""}
                />
                <div style={{ cursor: "pointer" }} onClick={() => console.log("delete")} className="input-group-text bg-danger border-danger text-white">
                  <i className="ri-close-fill"></i>
                </div>
              </div>
            );
          })

          }

        </Col>

        <Row className="mx-auto" w lg={12}>
          <div className="m-2">
            <button
              type="submit"
              className="btn btn-success"
              id="add-btn"
            >
              Enregistrer
            </button>
          </div>
        </Row>
      </CardBody>
    </Form>
  )
}

export default AlertParametrage;