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

import BreadCrumb from "../../Components/Common/BreadCrumb";
import DeleteModal from "../../Components/Common/DeleteModal";

//Import actions
import {
  getTva as onGetTva,
  addNewTva as onAddNewTva,
  updateTva as onUpdateTva,
  deleteTva as onDeleteTva,
  getConstantes as onGetConstantes,
  handleConstantes as onHandleConstantes,
} from "../../slices/thunks";
//redux
import { useSelector, useDispatch } from "react-redux";
import TableContainer from "../../Components/Common/TableContainer";

// Formik
import * as Yup from "yup";
import { useFormik } from "formik";

import Loader from "../../Components/Common/Loader";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Export Modal
import ExportCSVModal from "../../Components/Common/ExportCSVModal";

import TvaParameter from "./tvaParameter";

const GestionParameter = () => {
  const dispatch = useDispatch();
  const { tva, isTvaSuccess, error, prefix_facture, prefix_devis, date_start_exercice } =
    useSelector((state) => ({
      prefix_facture: state.Gestion.constantes?.find(
        (cst) => cst?.con_title === "Prefixe facture"
      ) || { con_title: "Prefixe facture", con_value: "" },
      prefix_devis: state.Gestion.constantes?.find(
        (cst) => cst?.con_title === "Prefixe devis"
      ) || { con_title: "Prefixe devis", con_value: "" },
      date_start_exercice: state.Gestion.constantes?.find(
        (cst) => cst?.con_title === "Date démarrage exercice"
      ) || { con_title: "Date démarrage exercice", con_date: null },
      tva: state.Gestion.tva,
      constanteComp: state.Gestion.constantes,
      isTvaSuccess: state.Gestion.isTvaSuccess,
      error: state.Gestion.error,
    }));

  // Formulaire constante
  const constanteForm = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {
      prefixe_libelle_fac: prefix_facture?.con_value || "",
      prefixe_libelle_dev: prefix_devis?.con_value || "",
      date_start_exercice: date_start_exercice?.con_date || null,
    },
    onSubmit: (values) => {
      let newPrefixeFacture = {
        ...prefix_facture,
        con_value: values.prefixe_libelle_fac,
      };
      let newPrefixeDevis = {
        ...prefix_devis,
        con_value: values.prefixe_libelle_dev,
      };
      let newStartExercice = {
        ...date_start_exercice,
        con_date: values.date_start_exercice,
      };

      let newPrefixes = [newPrefixeFacture, newPrefixeDevis, newStartExercice];
      dispatch(onHandleConstantes(newPrefixes));
      return;

      // constanteForm.resetForm();
    },
  });


 

  // Export Modal
  const [isExportCSV, setIsExportCSV] = useState(false);

  document.title = "Paramètre | Countano";
  return (
    <React.Fragment>
      <div className="page-content">
        <ExportCSVModal
          show={isExportCSV}
          onCloseClick={() => setIsExportCSV(false)}
          data={tva}
        />

        <Container fluid>
          <BreadCrumb title="Paramètre" pageTitle="Gestion" />
          <Row>
            <Col lg={12}>
              <Card>
                <Form
                  className="tablelist-form"
                  onSubmit={(e) => {
                    e.preventDefault();
                    constanteForm.handleSubmit();
                    return false;
                  }}
                >
                  <CardBody>
                    <Row lg={12}>
                      <Col lg={6}>
                        <div className="m-2">
                          <Label
                            htmlFor="prefixe_libelle_fac-field"
                            className="form-label"
                          >
                            Préfixe de facture
                          </Label>
                          <Input
                            name="prefixe_libelle_fac"
                            id="prefixe_libelle_fac-field"
                            className="form-control"
                            placeholder="Entrer un préfixe"
                            type="text"
                            onChange={constanteForm.handleChange}
                            onBlur={constanteForm.handleBlur}
                            value={
                              constanteForm.values.prefixe_libelle_fac || ""
                            }
                          />
                        </div>
                        <div className="m-2">
                          <Label
                            htmlFor="prefixe_libelle_dev-field"
                            className="form-label"
                          >
                            Préfixe de devis
                          </Label>
                          <Input
                            name="prefixe_libelle_dev"
                            id="prefixe_libelle_dev-field"
                            className="form-control"
                            placeholder="Entrer un préfixe"
                            type="text"
                            onChange={constanteForm.handleChange}
                            onBlur={constanteForm.handleBlur}
                            value={
                              constanteForm.values.prefixe_libelle_dev || ""
                            }
                          />
                        </div>
                      </Col>

                      <Col lg={6}>
                        <div className="m-2">
                          <Label
                            htmlFor="date_start_exercice-field"
                            className="form-label"
                          >
                            Date démarrage exercice
                          </Label>
                          <Input
                            name="date_start_exercice"
                            id="date_start_exercice-field"
                            className="form-control"
                            type="date"
                            onChange={constanteForm.handleChange}
                            onBlur={constanteForm.handleBlur}
                            value={constanteForm.values.date_start_exercice || null}

                          />
                        </div>
                      </Col>
                    </Row>
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
