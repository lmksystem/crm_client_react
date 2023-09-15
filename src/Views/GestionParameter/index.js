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

const GestionParameter = () => {
  const dispatch = useDispatch();
  const { tva, isTvaSuccess, error, prefix_facture, prefix_devis,date_start_exercice } =
    useSelector((state) => ({
      prefix_facture: state.Gestion.constantes?.find(
        (cst) => cst?.con_title === "Prefixe facture"
      ) || { con_title: "Prefixe facture", con_value: "" },
      prefix_devis: state.Gestion.constantes?.find(
        (cst) => cst?.con_title === "Prefixe devis"
      ) || { con_title: "Prefixe devis", con_value: "" },
      date_start_exercice:state.Gestion.constantes?.find(
        (cst) => cst?.con_title === "Date démarrage exercice"
      ) || { con_title: "Date démarrage exercice", con_date: null },
      tva: state.Gestion.tva,
      constanteComp: state.Gestion.constantes,
      isTvaSuccess: state.Gestion.isTvaSuccess,
      error: state.Gestion.error,
    }));
  useEffect(() => {
    // console.log(tva);
    // if (tva && !tva?.length) {
    dispatch(onGetTva());
    dispatch(onGetConstantes());

    // }
  }, [dispatch]);

  // useEffect(() => {
  //   setConstanteCompState(constanteComp);
  //   // console.log(constanteComp);
  // }, [constanteComp]);

  useEffect(() => {
    setTvaState(tva);
  }, [tva]);

  useEffect(() => {
    if (!isEmpty(tva)) {
      setIsEdit(false);
    }
  }, [tva]);

  const [isEdit, setIsEdit] = useState(false);
  const [tvaState, setTvaState] = useState({});
  const [constanteCompState, setConstanteCompState] = useState([]);

  //delete Conatct
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteModalMulti, setDeleteModalMulti] = useState(false);

  const [modal, setModal] = useState(false);

  const toggle = useCallback(() => {
    if (modal) {
      setModal(false);
      setTvaState(null);
    } else {
      setModal(true);
    }
  }, [modal]);

  // Delete Data
  const handleDeleteTva = () => {
    if (tvaState) {
      dispatch(onDeleteTva(tvaState.tva_id));
      setDeleteModal(false);
    }
  };

  const onClickDelete = (tva) => {
    setTvaState(tva);
    setDeleteModal(true);
  };

  // validation
  const validation = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {
      tva_id: (tvaState && tvaState.tva_id) || 0,
      tva_com_id: (tvaState && tvaState.tva_com_id) || "",
      tva_libelle: (tvaState && tvaState.tva_libelle) || "",
      tva_value: (tvaState && tvaState.tva_value) || 0,
    },
    validationSchema: Yup.object({
      tva_libelle: Yup.string().required("Veuillez entrer un libelle"),
      tva_value: Yup.number().required("Veuillez entrer une valeur"),
    }),

    onSubmit: (values) => {
      console.log(values);
      if (isEdit) {
        const updateTva = {
          tva_id: tvaState ? tvaState.tva_id : 0,
          tva_libelle: values.tva_libelle,
          tva_value: values.tva_value,
        };

        // update tva
        dispatch(onUpdateTva(updateTva));
        validation.resetForm();
      } else {
        const newTva = {
          tva_libelle: values.tva_libelle,
          tva_value: values.tva_value,
        };
        console.log(newTva);
        // save new tva
        dispatch(onAddNewTva(newTva));
        validation.resetForm();
      }
      toggle();
    },
  });

  // Formulaire constante
  const constanteForm = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {
      prefixe_libelle_fac: prefix_facture?.con_value || "",
      prefixe_libelle_dev: prefix_devis?.con_value || "",
      date_start_exercice: date_start_exercice?.con_date||null,
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

      let newPrefixes = [newPrefixeFacture, newPrefixeDevis,newStartExercice];
      dispatch(onHandleConstantes(newPrefixes));
      return;

      // constanteForm.resetForm();
    },
  });

  // Update Data
  const handleTvaClick = useCallback(
    (arg) => {
      const tva = arg;

      setTvaState({
        tva_id: tva.tva_id,
        tva_libelle: tva.tva_libelle,
        tva_value: tva.tva_value,
      });

      setIsEdit(true);
      toggle();
    },
    [toggle]
  );

  // Checked All
  const checkedAll = useCallback(() => {
    const checkall = document.getElementById("checkBoxAll");
    const ele = document.querySelectorAll(".tvaCheckBox");

    if (checkall.checked) {
      ele.forEach((ele) => {
        ele.checked = true;
      });
    } else {
      ele.forEach((ele) => {
        ele.checked = false;
      });
    }
    deleteCheckbox();
  }, []);

  // Delete Multiple
  const [selectedCheckBoxDelete, setSelectedCheckBoxDelete] = useState([]);
  const [isMultiDeleteButton, setIsMultiDeleteButton] = useState(false);

  const deleteMultiple = () => {
    const checkall = document.getElementById("checkBoxAll");
    console.log(selectedCheckBoxDelete);
    selectedCheckBoxDelete.forEach((element) => {
      console.log(element.value);
      dispatch(onDeleteTva(element.value));
      setTimeout(() => {
        toast.clearWaitingQueue();
      }, 3000);
    });
    setIsMultiDeleteButton(false);
    checkall.checked = false;
  };

  const deleteCheckbox = () => {
    const ele = document.querySelectorAll(".tvaCheckBox:checked");
    ele.length > 0
      ? setIsMultiDeleteButton(true)
      : setIsMultiDeleteButton(false);
    setSelectedCheckBoxDelete(ele);
  };

  // Column
  const columns = useMemo(
    () => [
      {
        Header: (
          <input
            type="checkbox"
            id="checkBoxAll"
            className="form-check-input"
            onClick={() => checkedAll()}
          />
        ),
        Cell: (cellProps) => {
          return (
            <input
              type="checkbox"
              className="tvaCheckBox form-check-input"
              value={cellProps.row.original.tva_id}
              onChange={() => deleteCheckbox()}
            />
          );
        },
        id: "#",
      },
      {
        id: "hidden-id",
        accessor: "tva_id",
        hiddenColumns: true,
        Cell: (cell) => {
          return <input type="hidden" value={cell.value} />;
        },
      },
      {
        Header: "Libellé",
        accessor: "tva_libelle",
        filterable: false,
      },
      {
        Header: "Taux",
        accessor: "tva_value",
        filterable: false,
      },
      {
        Header: "Action",
        Cell: (cellProps) => {
          let tva = cellProps.row.original;
          return (
            <ul className="list-inline hstack gap-2 mb-0">
              <li className="list-inline-item edit" title="Call">
                <Link
                  to="#"
                  onClick={() => {
                    handleTvaClick(tva);
                  }}
                  className="text-primary d-inline-block edit-item-btn"
                >
                  <i className="ri-pencil-fill fs-16"></i>
                </Link>
              </li>
              <li className="list-inline-item edit" title="Call">
                <Link
                  to="#"
                  onClick={() => {
                    onClickDelete(tva);
                  }}
                  className="text-danger d-inline-block remove-item-btn"
                >
                  <i className="ri-delete-bin-5-fill fs-16"></i>
                </Link>
              </li>
            </ul>
          );
        },
      },
    ],
    [handleTvaClick, checkedAll]
  );

  // Add Data
  const handleCompanyClicks = () => {
    setCollaborateur("");
    setIsEdit(false);
    toggle();
  };

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

        <DeleteModal
          show={deleteModal}
          onDeleteClick={handleDeleteTva}
          onCloseClick={() => setDeleteModal(false)}
        />

        <DeleteModal
          show={deleteModalMulti}
          onDeleteClick={() => {
            deleteMultiple();
            setDeleteModalMulti(false);
          }}
          onCloseClick={() => setDeleteModalMulti(false)}
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
              <Card>
                <CardHeader>
                  <div className="d-flex align-items-center flex-wrap gap-2 ">
                    <div className="d-flex flex-grow-1 justify-content-end">
                      <button
                        className="btn btn-info add-btn"
                        onClick={() => {
                          setModal(true);
                        }}
                      >
                        <i className="ri-add-fill me-1 align-bottom"></i>
                        Ajouter règle
                      </button>
                    </div>
                    <div className="flex-shrink-0">
                      <div className="hstack text-nowrap gap-2">
                        {isMultiDeleteButton && (
                          <button
                            className="btn btn-danger"
                            onClick={() => setDeleteModalMulti(true)}
                          >
                            <i className="ri-delete-bin-2-line"></i>
                          </button>
                        )}

                        {/* <button className="btn btn-soft-success" onClick={() => setIsExportCSV(true)}>Export</button> */}
                      </div>
                    </div>
                  </div>
                </CardHeader>

                <CardBody className="pt-0">
                  <div>
                    {isTvaSuccess ? (
                      <TableContainer
                        columns={columns}
                        data={tva || []}
                        isGlobalFilter={false}
                        isAddUserList={false}
                        customPageSize={7}
                        className="custom-header-css"
                        divClass="table-responsive table-card mb-2"
                        tableClass="align-middle table-nowrap"
                        theadClass="table-light"
                        handleCompanyClick={handleCompanyClicks}
                        isCompaniesFilter={true}
                      />
                    ) : (
                      <Loader error={error} />
                    )}
                  </div>
                  <Modal
                    id="showModal"
                    isOpen={modal}
                    toggle={toggle}
                    centered
                    size="lg"
                  >
                    <ModalHeader className="bg-soft-info p-3" toggle={toggle}>
                      {!!isEdit ? "Modifier règle" : "Ajouter règle"}
                    </ModalHeader>
                    <Form
                      className="tablelist-form"
                      onSubmit={(e) => {
                        e.preventDefault();
                        validation.handleSubmit();
                        return false;
                      }}
                    >
                      <ModalBody>
                        <input type="hidden" id="id-field" />
                        <Row className="g-3">
                          <Col lg={12}>
                            <div>
                              <Label
                                htmlFor="tva_libelle-field"
                                className="form-label"
                              >
                                Tva libellé
                              </Label>
                              <Input
                                name="tva_libelle"
                                id="tva_libelle-field"
                                className="form-control"
                                placeholder="Entrer un libellé"
                                type="text"
                                validate={{
                                  required: { value: true },
                                }}
                                onChange={validation.handleChange}
                                onBlur={validation.handleBlur}
                                value={validation.values.tva_libelle || ""}
                                invalid={
                                  validation.touched.tva_libelle &&
                                  validation.errors.tva_libelle
                                    ? true
                                    : false
                                }
                              />
                              {validation.touched.tva_libelle &&
                              validation.errors.tva_libelle ? (
                                <FormFeedback type="invalid">
                                  {validation.errors.tva_libelle}
                                </FormFeedback>
                              ) : null}
                            </div>
                          </Col>
                          <Col lg={12}>
                            <div>
                              <Label
                                htmlFor="tva_value-field"
                                className="form-label"
                              >
                                Tva valeur
                              </Label>
                              <Input
                                name="tva_value"
                                id="tva_value-field"
                                className="form-control"
                                placeholder="Entrer une valeur"
                                type="number"
                                validate={{
                                  required: { value: true },
                                }}
                                onChange={validation.handleChange}
                                onBlur={validation.handleBlur}
                                value={validation.values.tva_value || ""}
                                invalid={
                                  validation.touched.tva_value &&
                                  validation.errors.tva_value
                                    ? true
                                    : false
                                }
                              />
                              {validation.touched.tva_value &&
                              validation.errors.tva_value ? (
                                <FormFeedback type="invalid">
                                  {validation.errors.tva_value}
                                </FormFeedback>
                              ) : null}
                            </div>
                          </Col>
                        </Row>
                      </ModalBody>
                      <ModalFooter>
                        <div className="hstack gap-2 justify-content-end">
                          <button
                            type="button"
                            className="btn btn-light"
                            onClick={() => {
                              setModal(false);
                            }}
                          >
                            {" "}
                            Fermer{" "}
                          </button>
                          <button
                            type="submit"
                            className="btn btn-success"
                            id="add-btn"
                          >
                            {" "}
                            {!!isEdit ? "Modifier" : "Ajouter la règle"}{" "}
                          </button>
                        </div>
                      </ModalFooter>
                    </Form>
                  </Modal>
                  <ToastContainer closeButton={false} limit={1} />
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default GestionParameter;
