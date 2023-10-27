import React, { useEffect, useState, useCallback, useMemo } from "react";
import { Link, useLocation } from "react-router-dom";

// Import Images
import multiUser from "../../assets/images/users/multi-user.jpg";

import {
  Col,
  Container,
  Row,
  Card,
  CardHeader,
  CardBody,
  ModalBody,
  Label,
  Input,
  Modal,
  ModalHeader,
  Form,
  ModalFooter,
  Table,
  Button,
  FormFeedback,
  Collapse,
} from "reactstrap";
import BreadCrumb from "../../Components/Common/BreadCrumb";
import DeleteModal from "../../Components/Common/DeleteModal";
import { forIn, isEmpty } from "lodash";

//Import actions
import {
  getCollaborateurs as onGetCollaborateur,
  addNewCollaborateur as onAddNewCollaborateur,
  updateCollaborateur as onUpdateCollaborateur,
  deleteCollaborateurs as onDeleteCollaborateur,
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
import { api } from "../../config";

const Collaborateurs = () => {
  const dispatch = useDispatch();

  const { collaborateurs, isCollaborateurSuccess, error } = useSelector(
    (state) => ({
      collaborateurs: state.Gestion.collaborateurs,
      isCollaborateurSuccess: state.Gestion.isCollaborateurSuccess,
      error: state.Gestion.error,
    })
  );

  const country = [
    { label: "Argentina", value: "Argentina" },
    { label: "Belgium", value: "Belgium" },
    { label: "Brazil", value: "Brazil" },
    { label: "Colombia", value: "Colombia" },
    { label: "Denmark", value: "Denmark" },
    { label: "France", value: "France" },
    { label: "Germany", value: "Germany" },
    { label: "Mexico", value: "Mexico" },
    { label: "Russia", value: "Russia" },
    { label: "Spain", value: "Spain" },
    { label: "Syria", value: "Syria" },
    { label: "United Kingdom", value: "United Kingdom" },
    { label: "United States of America", value: "United States of America" },
  ];

  useEffect(() => {
    dispatch(onGetCollaborateur());
  }, [dispatch]);

  // useEffect(() => {
  //   setCollaborateur(collaborateurs);
  // }, [collaborateurs]);

  useEffect(() => {
    if (!isEmpty(collaborateur)) {
      // setCollaborateur(collaborateurs);
      setIsEdit(false);
    }
  }, [collaborateurs]);

  const [isEdit, setIsEdit] = useState(false);
  const [collaborateur, setCollaborateur] = useState(null);

  //delete Company
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteModalMulti, setDeleteModalMulti] = useState(false);

  const [modal, setModal] = useState(false);

  const [show, setShow] = useState(false);

  const toggle = useCallback(() => {
    if (modal) {
      setModal(false);
      setCollaborateur(null);
    } else {
      setModal(true);
    }
  }, [modal]);

  // Delete Data
  const handleDeleteCompany = () => {
    if (collaborateur) {
      dispatch(onDeleteCollaborateur(collaborateur.ent_id));
      setDeleteModal(false);
    }
  };

  const onClickDelete = (collaborateur) => {
    setCollaborateur(collaborateur);
    setDeleteModal(true);
  };

  // Add Data
  const handleCompanyClicks = () => {
    setCollaborateur("");
    setIsEdit(false);
    toggle();
  };
  // validation
  const validation = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,
    initialValues: {
      ent_lastname: (collaborateur && collaborateur.ent_lastname) || "",
      ent_firstname: (collaborateur && collaborateur.ent_firstname) || "",
      ent_phone: (collaborateur && collaborateur.ent_phone) || "",
      ent_email: (collaborateur && collaborateur.ent_email) || "",
      ent_name: (collaborateur && collaborateur.ent_name) || "",
      ent_adresse: (collaborateur && collaborateur.ent_adresse) || "",
      ent_cp: (collaborateur && collaborateur.ent_cp) || "",
      ent_ville: (collaborateur && collaborateur.ent_ville) || "",
      ent_pays: (collaborateur && collaborateur.ent_pays) || "",
      ent_img_url: (collaborateur && collaborateur.ent_img_url) || "",
      ent_info: (collaborateur && collaborateur.ent_info) || "",
      ent_bic: (collaborateur && collaborateur.ent_bic) || "",
      ent_iban: (collaborateur && collaborateur.ent_iban) || "",
      ent_siren: (collaborateur && collaborateur.ent_siren) || "",
      ent_methode_payment:
        (collaborateur && collaborateur.ent_methode_payment) || "",
      ent_tva_intracom:
        (collaborateur && collaborateur.ent_tva_intracom) || "",
      type: {
        // { eti_removed: 1 } permet au backend de savoir si il doit l'inserrer ou non  (1 : non / 0: oui)
        client: (collaborateur && collaborateur.type?.client) || {
          eti_removed: 1,
        },
        prospect: (collaborateur && collaborateur.type?.prospect) || {
          eti_removed: 1,
        },
        fournisseur: (collaborateur && collaborateur.type?.fournisseur) || {
          eti_removed: 1,
        },
      },
    },

    validationSchema: Yup.object({
      ent_lastname: Yup.string().required("Veuillez entrer un nom"),
      ent_firstname: Yup.string().required("Veuillez entrer un prénom"),
      ent_phone: Yup.number()
        .required("Veuillez entrer un téléphone")
        .label("Le téléphone ne doit pas contenir de lettre"),
      ent_email: Yup.string().required("Veuillez entrer un email"),
      ent_name: Yup.string().required("Veuillez entrer un nom d'entreprise"),
      ent_adresse: Yup.string().required("Veuillez entrer une adresse"),
      ent_cp: Yup.string().required("Veuillez entrer un code postale"),
      ent_ville: Yup.string().required("Veuillez entrer une ville"),
      ent_pays: Yup.string().required("Veuillez entrer un pays"),
      ent_img_url: Yup.string(),
      ent_info: Yup.string(),
      ent_bic: Yup.string(),
      ent_iban: Yup.string(),
      ent_siren: Yup.string(),
      ent_methode_payment: Yup.string(),
      ent_tva_intracom:Yup.string().matches(/^[A-Za-z]{2}[0-9]{9}$/, 'Le champ doit contenir 2 lettres suivies de 9 chiffres.'),
    }),

    onSubmit: (values) => {
      const companyData = {
        ent_lastname: values.ent_lastname,
        ent_firstname: values.ent_firstname,
        ent_phone: values.ent_phone,
        ent_email: values.ent_email,
        ent_name: values.ent_name,
        ent_adresse: values.ent_adresse,
        ent_cp: values.ent_cp,
        ent_ville: values.ent_ville,
        ent_pays: values.ent_pays,
        ent_img_url: values.ent_img_url,
        ent_info: values.ent_info,
        ent_bic: values.ent_bic,
        ent_iban: values.ent_iban,
        ent_siren: values.ent_siren,
        ent_methode_payment: values.ent_methode_payment,
        ent_tva_intracom: values.ent_tva_intracom,

      };

      const company_type = {
        fournisseur: values.type.fournisseur,
        client: values.type.client,
        prospect: values.type.prospect,
      };

      let data = {
        company: { ...companyData },
        company_type: { ...company_type },
      };

      if (isEdit) {
        data.ent_id = collaborateur.ent_id || 0;

        // update Company
        dispatch(onUpdateCollaborateur(data));
      } else {
        // save new Company
        dispatch(onAddNewCollaborateur(data));
      }

      validation.resetForm();
      toggle();
    },
  });

  // Update Data
  const handleCompanyClick = useCallback(
    (arg) => {
      const collaborateur = arg;
      setCollaborateur({
        ent_id: collaborateur.ent_id,
        ent_lastname: collaborateur.ent_lastname,
        ent_firstname: collaborateur.ent_firstname,
        ent_phone: collaborateur.ent_phone,
        ent_email: collaborateur.ent_email,
        ent_name: collaborateur.ent_name,
        ent_adresse: collaborateur.ent_adresse,
        ent_cp: collaborateur.ent_cp,
        ent_ville: collaborateur.ent_ville,
        ent_pays: collaborateur.ent_pays,
        ent_img_url: collaborateur.ent_img_url,
        ent_info: collaborateur.ent_info,
        ent_bic: collaborateur.ent_bic,
        ent_iban: collaborateur.ent_iban,
        ent_siren: collaborateur.ent_siren,
        ent_methode_payment: collaborateur.ent_methode_payment,
        ent_tva_intracom: collaborateur.ent_tva_intracom,
        type: {
          client: collaborateur.type.client,
          prospect: collaborateur.type.prospect,
          fournisseur: collaborateur.type.fournisseur,
        },
      });

      setIsEdit(true);
      toggle();
    },
    [toggle]
  );

  // Checked All
  const checkedAll = useCallback(() => {
    const checkall = document.getElementById("checkBoxAll");
    const ele = document.querySelectorAll(".companyCheckBox");

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
    selectedCheckBoxDelete.forEach((element) => {
      dispatch(onDeleteCollaborateur(element.value));
      setTimeout(() => {
        toast.clearWaitingQueue();
      }, 3000);
    });
    setIsMultiDeleteButton(false);
    checkall.checked = false;
  };

  const deleteCheckbox = () => {
    const ele = document.querySelectorAll(".companyCheckBox:checked");
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
              className="companyCheckBox form-check-input"
              value={cellProps.row.original.ent_id}
              onChange={() => deleteCheckbox()}
            />
          );
        },
        id: "#",
      },
      {
        id: "logo",
        Cell: (company) => {
          let LETTERS_CLI = "";
          for (const key in company.row.original.type) {
            if (Object.hasOwnProperty.call(company.row.original.type, key)) {
              const element = company.row.original.type[key];
              if (element.eti_removed == 0) {
                LETTERS_CLI += " " + key.charAt(0).toUpperCase();
              }
            }
          }
          return (
            <>
              <div className="flex-shrink-0">
                {
                  company.row.original.ent_img_url ? (
                    <img
                      src={
                        api.API_URL +
                        "/images/" +
                        company.row.original.ent_img_url
                      }
                      alt=""
                      className="avatar-xxs rounded-circle"
                    />
                  ) : (
                    <div className="flex-shrink-0 avatar-xs me-2">
                      <div className="avatar-title bg-soft-success text-success rounded-circle fs-13">
                        {LETTERS_CLI}
                      </div>
                    </div>
                  )
                  // <img src={multiUser} alt="" className="avatar-xxs rounded-circle" />
                }
              </div>
            </>
          );
        },
      },
      {
        Header: "Entreprise",
        accessor: "ent_name",
      },

      {
        Header: "Email",
        accessor: "ent_email",
      },
      {
        Header: "Téléphone",
        accessor: "ent_phone",
      },
      {
        Header: "Localisation",

        Cell: (cellProps) => {
          let collaborateur = cellProps.row.original;
          return (
            <>
              {collaborateur.ent_adresse} {collaborateur.ent_cp},{" "}
              {collaborateur.ent_ville}
            </>
          );
        },
      },
      {
        Header: "Action",
        Cell: (cellProps) => {
          let collaborateur = cellProps.row.original;
          // console.log(collaborateur);
          return (
            <ul className="list-inline hstack gap-2 mb-0">
              <li className="list-inline-item" title="View">
                <Link
                  to="#"
                  onClick={() => {
                    setInfo(collaborateur);
                    setShow(true);
                  }}
                >
                  <i className="ri-eye-fill align-bottom text-muted"></i>
                </Link>
              </li>
              <li className="list-inline-item" title="Edit">
                <Link
                  className="edit-item-btn"
                  to="#"
                  onClick={() => {
                    handleCompanyClick(collaborateur);
                  }}
                >
                  <i className="ri-pencil-fill align-bottom text-muted"></i>
                </Link>
              </li>
              <li className="list-inline-item" title="Delete">
                <Link
                  className="remove-item-btn"
                  onClick={() => {
                    onClickDelete(collaborateur);
                  }}
                  to="#"
                >
                  <i className="ri-delete-bin-fill align-bottom text-muted"></i>
                </Link>
              </li>
            </ul>
          );
        },
      },
    ],
    [handleCompanyClick, checkedAll]
  );

  const handleTypeEntity = (e) => {
    let value = e.target.checked;

    validation.setValues({
      ...validation.values,
      type: {
        ...validation.values.type,
        [e.target.name]: {
          ...validation.values.type[e.target.name],
          eti_removed: value ? 0 : 1,
        },
      },
    });
  };

  useEffect(() => {
    if (show) {
      setTimeout(() => {
        document.getElementById('start-anime').classList.add("show-cus")
      }, 350);
    } else {
      document.getElementById('start-anime').classList.remove("show-cus")
    }
  }, [show]);

  // SideBar Company Deatail
  const [info, setInfo] = useState([]);

  // Export Modal
  const [isExportCSV, setIsExportCSV] = useState(false);

  document.title = "Clients - Fournisseur | Countano";
  return (
    <React.Fragment>
      <div className="page-content">
        <ExportCSVModal
          show={isExportCSV}
          onCloseClick={() => setIsExportCSV(false)}
          data={collaborateurs}
        />

        <DeleteModal
          show={deleteModal}
          onDeleteClick={handleDeleteCompany}
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
          <BreadCrumb title="Clients / Fournisseurs" pageTitle="Gestion" />

          <Row>
            <Col lg={12}>
              <Card>
                <CardHeader>
                  <div className="d-flex align-items-center flex-wrap gap-2">
                    <div className="flex-grow-1">
                      <button
                        className="btn btn-secondary add-btn d-flex flex-row  align-items-center"
                        onClick={() => {
                          setIsEdit(false);
                          toggle();
                        }}
                      >
                        <i className="ri-add-fill me-1 align-bottom "></i>
                       <p className="p-0 m-0"> {" "}Ajouter un client / fournisseur</p> 
                      </button>
                    </div>
                    <div className="flex-shrink-0">
                      <div className="hstack text-nowrap gap-2">
                        {isMultiDeleteButton && (
                          <button
                            className="btn btn-soft-danger"
                            onClick={() => setDeleteModalMulti(true)}
                          >
                            <i className="ri-delete-bin-2-line"></i>
                          </button>
                        )}

                        <button
                          className="btn btn-soft-primary"
                          onClick={() => setIsExportCSV(true)}
                        >
                          Export
                        </button>
                      </div>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            </Col>
            <Col className="view-animate" xxl={show ? 9 : 12}>
              <Card id="companyList">
                <CardBody className="pt-0">
                  <div>
                    {isCollaborateurSuccess ? (
                      <TableContainer
                        columns={columns}
                        data={collaborateurs || []}
                        isGlobalFilter={true}
                        isAddUserList={false}
                        customPageSize={7}
                        className="custom-header-css"
                        divClass="table-responsive table-card mb-2"
                        tableClass="align-middle table-nowrap"
                        theadClass="table-light"
                        handleCompanyClick={handleCompanyClicks}
                        isCompaniesFilter={true}
                        SearchPlaceholder="Search for company..."
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
                      {!!isEdit ? "Modifier" : "Ajouter"}
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
                          {/* <Col lg={12}>
                            <div className="text-center">
                              <div className="position-relative d-inline-block">
                                <div className="position-absolute bottom-0 end-0">
                                  <Label htmlFor="company-logo-input" className="mb-0">
                                    <div className="avatar-xs cursor-pointer">
                                      <div className="avatar-title bg-light border rounded-circle text-muted">
                                        <i className="ri-image-fill"></i>
                                      </div>
                                    </div>
                                  </Label>
                                  <Input name="ent_img_url" className="form-control d-none" id="company-logo-input" type="file"
                                    accept="image/png, image/gif, image/jpeg"
                                    onChange={validation.handleChange}
                                    onBlur={validation.handleBlur}
                                    value={validation.values.ent_img_url || ""}
                                    invalid={
                                      validation.touched.ent_img_url && validation.errors.ent_img_url ? true : false
                                    }
                                  />
                                </div>
                                <div className="avatar-lg p-1">
                                  <div className="avatar-title bg-light rounded-circle">
                                    <img src={multiUser} alt="multiUser" id="companylogo-img" className="avatar-md rounded-circle object-cover" />
                                  </div>
                                </div>
                              </div>
                              <h5 className="fs-13 mt-3">Collaborateur Logo</h5>
                            </div>
                          </Col> */}
                          <h5>Informations Générales</h5>
                          <Col
                            lg={4}
                            className="d-flex justify-content-center align-items-end"
                          >
                            <div>
                              <Label
                                htmlFor="isclient-field"
                                className="form-label"
                              >
                                Client
                              </Label>

                              <Input
                                className="form-check-input  ms-2"
                                type="checkbox"
                                checked={
                                  validation.values.type.client.eti_removed == 0
                                    ? true
                                    : false
                                }
                                onChange={(e) => handleTypeEntity(e)}
                                name="client"
                                id="isclient-field"
                              />
                            </div>
                          </Col>
                          <Col
                            lg={4}
                            className="d-flex justify-content-center align-items-end"
                          >
                            <div>
                              <Label
                                htmlFor="isfournisseur-field"
                                className="form-label"
                              >
                                Fournisseur
                              </Label>
                              <Input
                                type="checkbox"
                                className="form-check-input ms-2"
                                checked={validation.values.type.fournisseur.eti_removed == 0 ? true : false}
                                onChange={(e) => handleTypeEntity(e)}
                                name="fournisseur"
                                id="isfournisseur-field"
                              />
                            </div>
                          </Col>
                          <Col
                            lg={4}
                            className="d-flex justify-content-center align-items-end"
                          >
                            <div>
                              <Label
                                htmlFor="isfournisseur-field"
                                className="form-label"
                              >
                                Prospect
                              </Label>
                              <Input
                                type="checkbox"
                                className="form-check-input ms-2"
                                checked={
                                  validation.values.type.prospect.eti_removed ==
                                  0
                                    ? true
                                    : false
                                }
                                onChange={(e) => handleTypeEntity(e)}
                                name="prospect"
                                id="isfournisseur-field"
                              />
                            </div>
                          </Col>
                          <Col lg={6}>
                            <div>
                              <Label
                                htmlFor="ent_lastname-field"
                                className="form-label"
                              >
                                Nom
                              </Label>

                              <Input
                                name="ent_lastname"
                                id="ent_lastname-field"
                                className="form-control"
                                placeholder="Entrer un nom"
                                type="text"
                                validate={{
                                  required: { value: true },
                                }}
                                onChange={validation.handleChange}
                                onBlur={validation.handleBlur}
                                value={validation.values.ent_lastname || ""}
                                invalid={
                                  validation.touched.ent_lastname &&
                                  validation.errors.ent_lastname
                                    ? true
                                    : false
                                }
                              />
                              {validation.touched.ent_lastname &&
                              validation.errors.ent_lastname ? (
                                <FormFeedback type="invalid">
                                  {validation.errors.ent_lastname}
                                </FormFeedback>
                              ) : null}
                            </div>
                          </Col>
                          <Col lg={6}>
                            <div>
                              <Label
                                htmlFor="ent_firstname-field"
                                className="form-label"
                              >
                                Prénom
                              </Label>
                              <Input
                                name="ent_firstname"
                                id="ent_firstname-field"
                                className="form-control"
                                placeholder="Entrer un prénom"
                                type="text"
                                validate={{
                                  required: { value: true },
                                }}
                                onChange={validation.handleChange}
                                onBlur={validation.handleBlur}
                                value={validation.values.ent_firstname || ""}
                                invalid={
                                  validation.touched.ent_firstname &&
                                  validation.errors.ent_firstname
                                    ? true
                                    : false
                                }
                              />
                              {validation.touched.ent_firstname &&
                              validation.errors.ent_firstname ? (
                                <FormFeedback type="invalid">
                                  {validation.errors.ent_firstname}
                                </FormFeedback>
                              ) : null}
                            </div>
                          </Col>
                          <Col lg={8}>
                            <div>
                              <Label
                                htmlFor="ent_name-field"
                                className="form-label"
                              >
                                Entreprise
                              </Label>

                              <Input
                                name="ent_name"
                                id="ent_name-field"
                                className="form-control"
                                placeholder="Entrer un nom d'entreprise"
                                type="text"
                                validate={{
                                  required: { value: true },
                                }}
                                onChange={validation.handleChange}
                                onBlur={validation.handleBlur}
                                value={validation.values.ent_name || ""}
                                invalid={
                                  validation.touched.ent_name &&
                                  validation.errors.ent_name
                                    ? true
                                    : false
                                }
                              />
                              {validation.touched.ent_name &&
                              validation.errors.ent_name ? (
                                <FormFeedback type="invalid">
                                  {validation.errors.ent_name}
                                </FormFeedback>
                              ) : null}
                            </div>
                          </Col>
                          <Col lg={4}>
                            <div>
                              <Label
                                htmlFor="ent_pays-field"
                                className="form-label"
                              >
                                Pays
                              </Label>

                              <Input
                                type="select"
                                className="form-select mb-0"
                                validate={{
                                  required: { value: true },
                                }}
                                invalid={
                                  validation.touched.ent_pays &&
                                  validation.errors.ent_pays
                                    ? true
                                    : false
                                }
                                value={validation.values.ent_pays}
                                onChange={validation.handleChange}
                                onBlur={validation.handleBlur}
                                name="ent_pays"
                                id="ent_pays-field"
                              >
                                <option disabled={true} value={""}>
                                  Choisir un pays
                                </option>
                                {country.map((e, i) => (
                                  <option key={i} value={e.value}>
                                    {e.label}
                                  </option>
                                ))}
                              </Input>
                              {validation.touched.ent_pays &&
                              validation.errors.ent_pays ? (
                                <FormFeedback type="invalid">
                                  {validation.errors.ent_pays}
                                </FormFeedback>
                              ) : null}
                            </div>
                          </Col>
                          <Col lg={6}>
                            <div>
                              <Label
                                htmlFor="ent_adresse-field"
                                className="form-label"
                              >
                                Adresse
                              </Label>
                              <Input
                                name="ent_adresse"
                                id="ent_adresse-field"
                                className="form-control"
                                placeholder="Entrer une adresse"
                                type="text"
                                validate={{
                                  required: { value: true },
                                }}
                                onChange={validation.handleChange}
                                onBlur={validation.handleBlur}
                                value={validation.values.ent_adresse || ""}
                                invalid={
                                  validation.touched.ent_adresse &&
                                  validation.errors.ent_adresse
                                    ? true
                                    : false
                                }
                              />
                              {validation.touched.ent_adresse &&
                              validation.errors.ent_adresse ? (
                                <FormFeedback type="invalid">
                                  {validation.errors.ent_adresse}
                                </FormFeedback>
                              ) : null}
                            </div>
                          </Col>
                          <Col lg={2}>
                            <div>
                              <Label
                                htmlFor="ent_cp-field"
                                className="form-label"
                              >
                                Code postal
                              </Label>
                              <Input
                                name="ent_cp"
                                id="ent_cp-field"
                                className="form-control"
                                placeholder="Entrer un code postal"
                                type="text"
                                validate={{
                                  required: { value: true },
                                }}
                                onChange={validation.handleChange}
                                onBlur={validation.handleBlur}
                                value={validation.values.ent_cp || ""}
                                invalid={
                                  validation.touched.ent_cp &&
                                  validation.errors.ent_cp
                                    ? true
                                    : false
                                }
                              />
                              {validation.touched.ent_cp &&
                              validation.errors.ent_cp ? (
                                <FormFeedback type="invalid">
                                  {validation.errors.ent_cp}
                                </FormFeedback>
                              ) : null}
                            </div>
                          </Col>
                          <Col lg={4}>
                            <div>
                              <Label
                                htmlFor="ent_ville-field"
                                className="form-label"
                              >
                                Ville
                              </Label>
                              <Input
                                name="ent_ville"
                                id="ent_ville-field"
                                className="form-control"
                                placeholder="Entrer une ville"
                                type="text"
                                validate={{
                                  required: { value: true },
                                }}
                                onChange={validation.handleChange}
                                onBlur={validation.handleBlur}
                                value={validation.values.ent_ville || ""}
                                invalid={
                                  validation.touched.ent_ville &&
                                  validation.errors.ent_ville
                                    ? true
                                    : false
                                }
                              />
                              {validation.touched.ent_ville &&
                              validation.errors.ent_ville ? (
                                <FormFeedback type="invalid">
                                  {validation.errors.ent_ville}
                                </FormFeedback>
                              ) : null}
                            </div>
                          </Col>
                          <Col lg={7}>
                            <div>
                              <Label
                                htmlFor="ent_email-field"
                                className="form-label"
                              >
                                Email
                              </Label>
                              <Input
                                name="ent_email"
                                id="ent_email-field"
                                className="form-control"
                                placeholder="Entrer un email"
                                type="text"
                                validate={{
                                  required: { value: true },
                                }}
                                onChange={validation.handleChange}
                                onBlur={validation.handleBlur}
                                value={validation.values.ent_email || ""}
                                invalid={
                                  validation.touched.ent_email &&
                                  validation.errors.ent_email
                                    ? true
                                    : false
                                }
                              />
                              {validation.touched.ent_email &&
                              validation.errors.ent_email ? (
                                <FormFeedback type="invalid">
                                  {validation.errors.ent_email}
                                </FormFeedback>
                              ) : null}
                            </div>
                          </Col>
                          <Col lg={5}>
                            <div>
                              <Label
                                htmlFor="ent_phone-field"
                                className="form-label"
                              >
                                Téléphone
                              </Label>
                              <Input
                                name="ent_phone"
                                id="ent_phone-field"
                                className="ent_phone-control"
                                placeholder="Entrer un téléphone"
                                type="text"
                                validate={{
                                  required: { value: true },
                                }}
                                onChange={validation.handleChange}
                                onBlur={validation.handleBlur}
                                value={validation.values.ent_phone || ""}
                                invalid={
                                  validation.touched.ent_phone &&
                                  validation.errors.ent_phone
                                    ? true
                                    : false
                                }
                              />
                              {validation.touched.ent_phone &&
                              validation.errors.ent_phone ? (
                                <FormFeedback type="invalid">
                                  {validation.errors.ent_phone}
                                </FormFeedback>
                              ) : null}
                            </div>
                          </Col>
                          <Col lg={8}>
                            <div>
                              <Label
                                htmlFor="ent_iban-field"
                                className="form-label"
                              >
                                IBAN
                              </Label>
                              <Input
                                name="ent_iban"
                                id="ent_iban-field"
                                className="form-control"
                                placeholder="Entrer un iban"
                                type="text"
                                validate={{
                                  required: { value: true },
                                }}
                                onChange={validation.handleChange}
                                onBlur={validation.handleBlur}
                                value={validation.values.ent_iban || ""}
                                invalid={
                                  validation.touched.ent_iban &&
                                  validation.errors.ent_iban
                                    ? true
                                    : false
                                }
                              />
                              {validation.touched.ent_iban &&
                              validation.errors.ent_iban ? (
                                <FormFeedback type="invalid">
                                  {validation.errors.ent_iban}
                                </FormFeedback>
                              ) : null}
                            </div>
                          </Col>
                          <Col lg={4}>
                            <div>
                              <Label
                                htmlFor="ent_bic-field"
                                className="form-label"
                              >
                                BIC
                              </Label>
                              <Input
                                name="ent_bic"
                                id="ent_bic-field"
                                className="form-control"
                                placeholder="Entrer ent_bic"
                                type="text"
                                validate={{
                                  required: { value: true },
                                }}
                                onChange={validation.handleChange}
                                onBlur={validation.handleBlur}
                                value={validation.values.ent_bic || ""}
                                invalid={
                                  validation.touched.ent_bic &&
                                  validation.errors.ent_bic
                                    ? true
                                    : false
                                }
                              />
                              {validation.touched.ent_bic &&
                              validation.errors.ent_bic ? (
                                <FormFeedback type="invalid">
                                  {validation.errors.ent_bic}
                                </FormFeedback>
                              ) : null}
                            </div>
                          </Col>
                          <Col lg={12}>
                            <div>
                              <Label
                                htmlFor="ent_siren-field"
                                className="form-label"
                              >
                                Siren
                              </Label>
                              <Input
                                name="ent_siren"
                                id="ent_siren-field"
                                className="form-control"
                                placeholder="Entrer un siren"
                                type="text"
                                validate={{
                                  required: { value: true },
                                }}
                                onChange={validation.handleChange}
                                onBlur={validation.handleBlur}
                                value={validation.values.ent_siren || ""}
                                invalid={
                                  validation.touched.ent_siren &&
                                  validation.errors.ent_siren
                                    ? true
                                    : false
                                }
                              />
                              {validation.touched.ent_siren &&
                              validation.errors.ent_siren ? (
                                <FormFeedback type="invalid">
                                  {validation.errors.ent_siren}
                                </FormFeedback>
                              ) : null}
                            </div>
                          </Col>
                          <Col lg={6}>
                            <div>
                              <Label
                                htmlFor="ent_methode_payment-field"
                                className="form-label"
                              >
                                Méthode de paiement par défaut
                              </Label>
                              <Input
                                name="ent_methode_payment"
                                id="ent_methode_payment-field"
                                className="form-control"
                                placeholder="Entrer methode de paiement"
                                type="text"
                                validate={{
                                  required: { value: true },
                                }}
                                onChange={validation.handleChange}
                                onBlur={validation.handleBlur}
                                value={
                                  validation.values.ent_methode_payment || ""
                                }
                                invalid={
                                  validation.touched.ent_methode_payment &&
                                  validation.errors.ent_methode_payment
                                    ? true
                                    : false
                                }
                              />
                              {validation.touched.ent_methode_payment &&
                              validation.errors.ent_methode_payment ? (
                                <FormFeedback type="invalid">
                                  {validation.errors.ent_methode_payment}
                                </FormFeedback>
                              ) : null}
                            </div>
                          </Col>
                          <Col lg={6}>
                            <div>
                              <Label
                                htmlFor="ent_tva_intracom-field"
                                className="form-label"
                              >
                                TVA INTRACOM
                              </Label>
                              <Input
                                name="ent_tva_intracom"
                                id="ent_tva_intracom-field"
                                className="form-control"
                                placeholder="Entrer TVA Intracom"
                                type="text"
                                // validate={{
                                //   required: { value: true },
                                // }}
                                onChange={validation.handleChange}
                                onBlur={validation.handleBlur}
                                value={
                                  validation.values.ent_tva_intracom || ""
                                }
                                invalid={
                                  validation.touched.ent_tva_intracom &&
                                  validation.errors.ent_tva_intracom
                                    ? true
                                    : false
                                }
                              />
                              {validation.touched.ent_tva_intracom &&
                              validation.errors.ent_tva_intracom ? (
                                <FormFeedback type="invalid">
                                  {validation.errors.ent_tva_intracom}
                                </FormFeedback>
                              ) : null}
                            </div>
                          </Col>
                          <Label
                            htmlFor="ent_info-field"
                            className="form-label"
                          >
                            Information complémentaire
                          </Label>

                          <textarea
                            name="ent_info"
                            id="ent_info-field"
                            className="form-control"
                            placeholder="Information"
                            type="select"
                            validate={{
                              required: { value: false },
                            }}
                            onChange={validation.handleChange}
                            onBlur={validation.handleBlur}
                            value={validation.values.ent_info || ""}
                            invalid={
                              validation.touched.ent_info &&
                              validation.errors.ent_info
                                ? "true"
                                : "false"
                            }
                            rows={5}
                          />
                          {validation.touched.ent_info &&
                          validation.errors.ent_info ? (
                            <FormFeedback type="invalid">
                              {validation.errors.ent_info}
                            </FormFeedback>
                          ) : null}
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
                            {!!isEdit ? "Modifier" : "Ajouter"}{" "}
                          </button>
                        </div>
                      </ModalFooter>
                    </Form>
                  </Modal>
                  <ToastContainer closeButton={false} limit={1} />
                </CardBody>
              </Card>
            </Col>
            <Col xxl={3}>
              <div id="start-anime">
                <Card id="contact-view-detail">
                  <CardBody className="text-center">
                    <div style={{ position: "absolute", right: 10, top: 5 }}><i onClick={() => setShow(false)} className="ri-close-fill" style={{ cursor: "pointer", fontSize: "20px" }}></i></div>
                    <div className="position-relative d-inline-block">
                      <img
                        src={api.API_URL + "v1/images/user-dummy-img.jpg"}
                        alt=""
                        className="avatar-lg rounded-circle img-thumbnail"
                      />
                      <span className="contact-active position-absolute rounded-circle bg-success">
                        <span className="visually-hidden"></span>
                      </span>
                    </div>
                    <h5 className="mt-4 mb-1">{info.ent_name}</h5>
                    <h6 className="text-muted">
                      {info.ent_lastname + " " + info.ent_firstname}
                    </h6>

                    <ul className="list-inline mb-0">
                      <li className="list-inline-item avatar-xs">
                        <Link
                          to={`tel:${info.ent_phone}`}
                          className="avatar-title bg-soft-success text-success fs-15 rounded"
                        >
                          <i className="ri-phone-line"></i>
                        </Link>
                      </li>
                      <li className="list-inline-item avatar-xs">
                        <Link
                          to={`mailto:${info.ent_email}`}
                          className="avatar-title bg-soft-danger text-danger fs-15 rounded"
                        >
                          <i className="ri-mail-line"></i>
                        </Link>
                      </li>
                    </ul>
                  </CardBody>
                  <CardBody>
                    <h6 className="text-muted text-uppercase fw-semibold mb-3">
                      Information complémentaire
                    </h6>
                    <p className="text-muted mb-4">
                      {info.ent_info || "Non renseigné"}
                    </p>
                    <div className="table-responsive table-card">
                      <Table className="table table-borderless mb-0">
                        <tbody>
                          <tr>
                            <td className="fw-medium">Entreprise</td>
                            <td>{info.ent_name}</td>
                          </tr>
                          <tr>
                            <td className="fw-medium">Adresse</td>
                            <td>
                              {info.ent_adresse}, {info.ent_cp} {info.ent_ville}
                            </td>
                          </tr>
                          <tr>
                            <td className="fw-medium">Email</td>
                            <td>{info.ent_email}</td>
                          </tr>
                          <tr>
                            <td className="fw-medium">Téléphone</td>
                            <td>{info.ent_phone}</td>
                          </tr>
                          <tr>
                            <td className="fw-medium">Siren</td>
                            <td>{info.ent_siren}</td>
                          </tr>
                          <tr>
                            <td className="fw-medium">Iban</td>
                            <td>{info.ent_iban}</td>
                          </tr>
                          <tr>
                            <td className="fw-medium">Bic</td>
                            <td>{info.ent_bic}</td>
                          </tr>
                        </tbody>
                      </Table>
                    </div>
                  </CardBody>
                </Card>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default Collaborateurs;
