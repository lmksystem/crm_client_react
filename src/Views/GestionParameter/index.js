import React, { useEffect, useState, useCallback, useMemo } from "react";
import { Link } from "react-router-dom";
import { isEmpty } from "lodash";
import * as moment from "moment";

// Import Images
import dummyImg from "../../assets/images/users/user-dummy-img.jpg";

import { Col, Container, Row, Card, CardBody, Label, Input, Form, Button, InputGroup, InputGroupText } from "reactstrap";

import BreadCrumb from "../../Components/Common/BreadCrumb";

//Import actions
import { handleConstantes as onHandleConstantes, updateCompany } from "../../slices/thunks";
//redux
import { useSelector, useDispatch } from "react-redux";

// Formik
import { useFormik } from "formik";

import "react-toastify/dist/ReactToastify.css";

// Export Modal
import ExportCSVModal from "../../Components/Common/ExportCSVModal";

import TvaParameter from "./tvaParameter";
import AlertParametrage from "./AlertParametrage";
import { updateCompanyData } from "../../slices/company/reducer";

const GestionParameter = () => {
  const dispatch = useDispatch();
  const { tva, company, prefix_facture, prefix_devis, date_start_exercice, nb_fac, nb_dev } = useSelector((state) => ({
    nb_fac: state.Invoice.invoices.length,
    nb_dev: state.Devis.devisList.length,
    prefix_facture: state.Gestion.constantes?.find((cst) => cst?.con_title === "Prefixe facture") || { con_title: "Prefixe facture", con_value: "" },
    prefix_devis: state.Gestion.constantes?.find((cst) => cst?.con_title === "Prefixe devis") || { con_title: "Prefixe devis", con_value: "" },
    date_start_exercice: state.Gestion.constantes?.find((cst) => cst?.con_title === "Date démarrage exercice") || { con_title: "Date démarrage exercice", con_value: null },
    tva: state.Gestion.tva,
    constanteComp: state.Gestion.constantes,
    isTvaSuccess: state.Gestion.isTvaSuccess,
    error: state.Gestion.error,
    company: state.Company.company[0]
  }));
console.log( company);
  // Formulaire constante
  const constanteForm = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {
      prefixe_libelle_fac: prefix_facture?.con_value || "",
      prefixe_libelle_dev: prefix_devis?.con_value || "",
      date_start_exercice: date_start_exercice?.con_value || ""
    },
    onSubmit: (values) => {
      let newPrefixeFacture = {
        ...prefix_facture,
        con_value: values.prefixe_libelle_fac
      };
      let newPrefixeDevis = {
        ...prefix_devis,
        con_value: values.prefixe_libelle_dev
      };
      let newStartExercice = {
        ...date_start_exercice,
        con_value: values?.date_start_exercice ? values?.date_start_exercice.toString() : ""
      };

      let newPrefixes = [newPrefixeFacture, newPrefixeDevis, newStartExercice];

      let error = false;

      if (values.prefixe_libelle_dev == prefix_facture.con_value && company?.com_nb_dev == 1 ) {
      
      }

      dispatch(updateCompany(company[0]));
      dispatch(onHandleConstantes(newPrefixes));
      return;

      // constanteForm.resetForm();
    }
  });

  const resetPrefixeDevis = () => {
    let newCompany = { ...company[0], com_nb_dev: 1 };
    dispatch(updateCompanyData(newCompany));
  };

  const resetPrefixeFacture = () => {
    let newCompany = { ...company[0], com_nb_fac: 1 };
    dispatch(updateCompanyData(newCompany));
  };

  // Export Modal
  const [isExportCSV, setIsExportCSV] = useState(false);
  console.log(company?.com_nb_dev);
  document.title = "Paramétrage | Countano";
  return (
    <React.Fragment>
      <div className="page-content">
        <ExportCSVModal
          show={isExportCSV}
          onCloseClick={() => setIsExportCSV(false)}
          data={tva}
        />

        <Container fluid>
          <BreadCrumb
            title="Paramétrage"
            pageTitle=""
          />
          <Row>
            <Col lg={12}>
              <Card>
                <Form
                  className="tablelist-form"
                  onSubmit={(e) => {
                    e.preventDefault();
                    constanteForm.handleSubmit();
                    return false;
                  }}>
                  <CardBody>
                    <Row lg={12}>
                      <Col lg={6}>
                        <div className="m-2">
                          <Label
                            htmlFor="prefixe_libelle_fac-field"
                            className="form-label">
                            Préfixe de facture
                          </Label>

                          <div className="input-group">
                            <InputGroup>
                              <Input
                                name="prefixe_libelle_fac"
                                id="prefixe_libelle_fac-field"
                                className="form-control"
                                placeholder="Entrer un préfixe"
                                type="text"
                                onChange={constanteForm.handleChange}
                                onBlur={constanteForm.handleBlur}
                                value={constanteForm.values.prefixe_libelle_fac || ""}
                              />
                              <InputGroupText style={{ width: "80px", justifyContent: "center" }}>{company?.com_nb_fac}</InputGroupText>
                              <Button onClick={() => {resetPrefixeFacture()}}>Reset</Button>
                            </InputGroup>
                          </div>
                        </div>
                        <div className="m-2">
                          <Label
                            htmlFor="prefixe_libelle_dev-field"
                            className="form-label">
                            Préfixe de devis
                          </Label>
                          <div className="input-group">
                            <InputGroup>
                              <Input
                                name="prefixe_libelle_dev"
                                id="prefixe_libelle_dev-field"
                                className="form-control"
                                placeholder="Entrer un préfixe"
                                type="text"
                                onChange={constanteForm.handleChange}
                                onBlur={constanteForm.handleBlur}
                                value={constanteForm.values.prefixe_libelle_dev || ""}
                              />
                              <InputGroupText style={{ width: "80px", justifyContent: "center" }}>{company?.com_nb_dev}</InputGroupText>
                              <Button
                                onClick={() => {
                                  resetPrefixeDevis(company[0].com_nb_dev);
                                }}>
                                Reset
                              </Button>
                            </InputGroup>
                          </div>
                        </div>
                      </Col>

                      <Col lg={6}>
                        <div className="m-2">
                          <Label
                            htmlFor="date_start_exercice-field"
                            className="form-label">
                            Date démarrage exercice
                          </Label>
                          <Input
                            name="date_start_exercice"
                            id="date_start_exercice-field"
                            className="form-control"
                            type="date"
                            onChange={constanteForm.handleChange}
                            onBlur={constanteForm.handleBlur}
                            value={constanteForm?.values?.date_start_exercice || ""}
                          />
                        </div>
                      </Col>
                    </Row>
                    <Row
                      className="mx-auto"
                      lg={12}>
                      <div className="m-2">
                        <button
                          type="submit"
                          className="btn btn-success"
                          id="add-btn">
                          Enregistrer
                        </button>
                      </div>
                    </Row>
                  </CardBody>
                </Form>
                <AlertParametrage />
              </Card>
              <TvaParameter />
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default GestionParameter;
