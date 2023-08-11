import React, { useEffect, useState, useCallback, useMemo } from "react";
import { Link } from "react-router-dom";

// Import Images
import multiUser from '../../assets/images/users/multi-user.jpg';

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
  Button,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  FormFeedback,
  Collapse,
} from "reactstrap";
import BreadCrumb from "../../Components/Common/BreadCrumb";
import DeleteModal from "../../Components/Common/DeleteModal";
import { isEmpty } from "lodash";

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
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Export Modal
import ExportCSVModal from "../../Components/Common/ExportCSVModal";

const Collaborateurs = () => {
  const dispatch = useDispatch();
  const { collaborateurs, isCollaborateurSuccess, error } = useSelector((state) => ({
    collaborateurs: state.Gestion.collaborateurs,
    isCollaborateurSuccess: state.Gestion.isCollaborateurSuccess,
    error: state.Gestion.error,
  }));


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
    if (collaborateurs && !collaborateurs.length) {
      dispatch(onGetCollaborateur());
    }
  }, [dispatch, collaborateurs]);

  useEffect(() => {
    setCollaborateur(collaborateurs);
  }, [collaborateurs]);

  useEffect(() => {
    if (!isEmpty(collaborateurs)) {
      setCollaborateur(collaborateurs);
      setIsEdit(false);
    }
  }, [collaborateurs]);


  const [isEdit, setIsEdit] = useState(false);
  const [collaborateur, setCollaborateur] = useState(null);
  const [cliCompta, setCliCompta] = useState(null);
  const [fourCompta, setFourCompta] = useState(null);

  //delete Company
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteModalMulti, setDeleteModalMulti] = useState(false);

  const [modal, setModal] = useState(false);

  const [isClient, setIsClient] = useState(false);
  const [isFournisseur, setIsFournisseur] = useState(false);
  const [toggleType, setToggeType] = useState(0);

  const toggle = useCallback(() => {

    if (modal) {
      setModal(false);
      setCollaborateur(null);
      setCliCompta(null);
      setFourCompta(null);
      setToggeType(0);
      setIsClient(false);
      setIsFournisseur(false);
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
      ent_lastname: (collaborateur && collaborateur.ent_lastname) || '',
      ent_firstname: (collaborateur && collaborateur.ent_firstname) || '',
      ent_phone: (collaborateur && collaborateur.ent_phone) || '',
      ent_email: (collaborateur && collaborateur.ent_email) || '',
      ent_name: (collaborateur && collaborateur.ent_name) || '',
      ent_adresse: (collaborateur && collaborateur.ent_adresse) || '',
      ent_cp: (collaborateur && collaborateur.ent_cp) || '',
      ent_ville: (collaborateur && collaborateur.ent_ville) || '',
      ent_pays: (collaborateur && collaborateur.ent_pays) || '',
      ent_img_url: (collaborateur && collaborateur.ent_img_url) || '',
      ent_info: (collaborateur && collaborateur.ent_info) || '',
      ent_bic: (collaborateur && collaborateur.ent_bic) || '',
      ent_iban: (collaborateur && collaborateur.ent_iban) || '',
      ent_siren: (collaborateur && collaborateur.ent_siren) || '',
      ent_methode_payment: (collaborateur && collaborateur.ent_methode_payment) || '',
      // CLIENT
      eco_id_client: (cliCompta && cliCompta.eco_id) || null,
      eco_ety_fk_client: 2,
      eco_code_client: (cliCompta && cliCompta.eco_code) || "",
      eco_journal_client: (cliCompta && cliCompta.eco_journal) || "",
      eco_cat_client: (cliCompta && cliCompta.eco_cat) || "",
      eco_tva_default_client: (cliCompta && cliCompta.eco_tva_default) || "",
      eco_intra_tva_client: (cliCompta && cliCompta.eco_intra_tva),
      eco_tva_collect_client: (cliCompta && cliCompta.eco_tva_collect) || "",
      eco_tva_deduct_client: (cliCompta && cliCompta.eco_tva_deduct) || "",
      eco_removed_client: (cliCompta && cliCompta.eco_removed) || 0,
      //FOURNISSEUR
      eco_id_fournisseur: (fourCompta && fourCompta.eco_id) || null,
      eco_ety_fk_fournisseur: 3,
      eco_code_fournisseur: (fourCompta && fourCompta.eco_code) || "",
      eco_journal_fournisseur: (fourCompta && fourCompta.eco_journal) || "",
      eco_cat_fournisseur: (fourCompta && fourCompta.eco_cat) || "",
      eco_tva_default_fournisseur: (fourCompta && fourCompta.eco_tva_default) || "",
      eco_intra_tva_fournisseur: (fourCompta && fourCompta.eco_intra_tva) || 0,
      eco_tva_collect_fournisseur: (fourCompta && fourCompta.eco_tva_collect) || "",
      eco_tva_deduct_fournisseur: (fourCompta && fourCompta.eco_tva_deduct) || "",
      eco_removed_fournisseur: (fourCompta && fourCompta.eco_removed) || 0,
    },

    validationSchema: Yup.object({
      ent_lastname: Yup.string().required("Veuillez entrer un nom"),
      ent_firstname: Yup.string().required("Veuillez entrer un prénom"),
      ent_phone: Yup.number().required("Veuillez entrer un téléphone").label('Le téléphone ne doit pas contenir de lettre'),
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
      };


      let clientCompta = {
        eco_ety_fk: 1,
        eco_code: values.eco_code_client,
        eco_journal: values.eco_journal_client,
        eco_cat: values.eco_cat_client,
        eco_tva_default: values.eco_tva_default_client,
        eco_intra_tva: values.eco_intra_tva_client.length > 0 ? 1 : 0,
        eco_tva_collect: values.eco_tva_collect_client,
        eco_tva_deduct: values.eco_tva_deduct_client,
        eco_removed: values.eco_removed_client,
      };

      let FournisseurCompta = {
        eco_ety_fk: 3,
        eco_code: values.eco_code_fournisseur,
        eco_journal: values.eco_journal_fournisseur,
        eco_cat: values.eco_cat_fournisseur,
        eco_tva_default: values.eco_tva_default_fournisseur,
        eco_intra_tva: values.eco_intra_tva_fournisseur.length > 0 ? 1 : 0,
        eco_tva_collect: values.eco_tva_collect_fournisseur,
        eco_tva_deduct: values.eco_tva_deduct_fournisseur,
        eco_removed: values.eco_removed_fournisseur,
      }

      let data = {
        ...companyData,
        compta: {
          client: (isClient || cliCompta?.eco_id) ? clientCompta : null,
          fournisseur: (isFournisseur || fourCompta?.eco_id) ? FournisseurCompta : null
        }
      }

      if (isEdit) {
        console.log("values ", values);
        data.ent_id = collaborateur.ent_id || 0;

        if (cliCompta?.eco_id) {
          data.compta.client.eco_id = cliCompta.eco_id;
        }

        if (fourCompta?.eco_id) {
          data.compta.fournisseur.eco_id = fourCompta.eco_id;
        }

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
  const handleCompanyClick = useCallback((arg) => {
    const collaborateur = arg;
    const client = arg.compta.client;
    const fournisseur = arg.compta.fournisseur;

    if (client) {
      setCliCompta(client);
      setIsClient(client.eco_removed == 0 ? true : false);
    }

    if (fournisseur) {
      setFourCompta(fournisseur);
      setIsFournisseur(fournisseur.eco_removed == 0 ? true : false);
    }

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
    });

    setIsEdit(true);
    toggle();
  }, [toggle]);


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
      setTimeout(() => { toast.clearWaitingQueue(); }, 3000);
    });
    setIsMultiDeleteButton(false);
    checkall.checked = false;
  };

  const deleteCheckbox = () => {
    const ele = document.querySelectorAll(".companyCheckBox:checked");
    ele.length > 0 ? setIsMultiDeleteButton(true) : setIsMultiDeleteButton(false);
    setSelectedCheckBoxDelete(ele);
  };

  // Column
  const columns = useMemo(

    () => [

      {
        Header: <input type="checkbox" id="checkBoxAll" className="form-check-input" onClick={() => checkedAll()} />,
        Cell: (cellProps) => {

          return <input type="checkbox" className="companyCheckBox form-check-input" value={cellProps.row.original.ent_id} onChange={() => deleteCheckbox()} />;
        },
        id: '#',
      },
      {
        id: "logo",
        Cell: (company) => (
          <>
            <div className="flex-shrink-0">
              {company.row.original.ent_img_url ? <img
                src={process.env.REACT_APP_API_URL + "/images/" + company.row.original.ent_img_url}
                alt=""
                className="avatar-xxs rounded-circle"
              /> :
                <div className="flex-shrink-0 avatar-xs me-2">
                  <div className="avatar-title bg-soft-success text-success rounded-circle fs-13">
                    {company.row.original.ent_name.charAt(0)}
                  </div>
                </div>
                // <img src={multiUser} alt="" className="avatar-xxs rounded-circle" />
              }
            </div>
          </>
        ),
      },
      {
        Header: "Entreprise",
        accessor: "ent_name"
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
              {collaborateur.ent_adresse} {collaborateur.ent_cp}, {collaborateur.ent_ville}
            </>
          )
        },
      },
      {
        Header: "Action",
        Cell: (cellProps) => {
          let collaborateur = cellProps.row.original;
          return (
            <ul className="list-inline hstack gap-2 mb-0">
              <li className="list-inline-item edit" title="Call">
                <a href={`tel:${collaborateur.ent_phone}`} className="text-muted d-inline-block">
                  <i className="ri-phone-line fs-16"></i>
                </a>
              </li>
              <li className="list-inline-item" title="View">
                <Link to="#"
                  onClick={() => { const companyData = cellProps.row.original; setInfo(companyData); }}
                >
                  <i className="ri-eye-fill align-bottom text-muted"></i>
                </Link>
              </li>
              <li className="list-inline-item" title="Edit">
                <Link className="edit-item-btn" to="#"
                  onClick={() => {
                    const collaborateurData = cellProps.row.original;

                    handleCompanyClick(collaborateurData);
                  }}
                >
                  <i className="ri-pencil-fill align-bottom text-muted"></i>
                </Link>
              </li>
              <li className="list-inline-item" title="Delete">
                <Link
                  className="remove-item-btn"
                  onClick={() => { const companyData = cellProps.row.original; onClickDelete(companyData); }}
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

  // SideBar Company Deatail
  const [info, setInfo] = useState([]);

  // Export Modal
  const [isExportCSV, setIsExportCSV] = useState(false);

  document.title = "Companies | Countano";
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
          <BreadCrumb title="Companies" pageTitle="CRM" />

          <Row>
            <Col lg={12}>
              <Card>
                <CardHeader>
                  <div className="d-flex align-items-center flex-wrap gap-2">
                    <div className="flex-grow-1">
                      <button className="btn btn-info add-btn" onClick={() => { setIsEdit(false); toggle(); }}>
                        <i className="ri-add-fill me-1 align-bottom"></i> Ajouter un collaborateur
                      </button>
                    </div>
                    <div className="flex-shrink-0">
                      <div className="hstack text-nowrap gap-2">
                        {isMultiDeleteButton && <button className="btn btn-soft-danger"
                          onClick={() => setDeleteModalMulti(true)}
                        ><i className="ri-delete-bin-2-line"></i></button>}

                        <button className="btn btn-soft-primary" onClick={() => setIsExportCSV(true)}>Export</button>
                        <UncontrolledDropdown>
                          <DropdownToggle
                            href="#"
                            className="btn btn-soft-info btn-icon"
                            tag="button"
                          >
                            <i className="ri-more-2-fill"></i>
                          </DropdownToggle>
                          <DropdownMenu className="dropdown-menu-end">
                            <DropdownItem className="dropdown-item" href="#">
                              All
                            </DropdownItem>
                            <DropdownItem className="dropdown-item" href="#">
                              Last Week
                            </DropdownItem>
                            <DropdownItem className="dropdown-item" href="#">
                              Last Month
                            </DropdownItem>
                            <DropdownItem className="dropdown-item" href="#">
                              Last Year
                            </DropdownItem>
                          </DropdownMenu>
                        </UncontrolledDropdown>
                      </div>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            </Col>
            <Col xxl={9}>
              <Card id="companyList">

                <CardBody className="pt-0">
                  <div>
                    {isCollaborateurSuccess && collaborateurs.length ? (
                      <TableContainer
                        columns={columns}
                        data={(collaborateurs || [])}
                        isGlobalFilter={true}
                        isAddUserList={false}
                        customPageSize={7}
                        className="custom-header-css"
                        divClass="table-responsive table-card mb-2"
                        tableClass="align-middle table-nowrap"
                        theadClass="table-light"
                        handleCompanyClick={handleCompanyClicks}
                        isCompaniesFilter={true}
                        SearchPlaceholder='Search for company...'
                      />
                    ) : (<Loader error={error} />)
                    }
                  </div>
                  <Modal id="showModal" isOpen={modal} toggle={toggle} centered size="lg">
                    <ModalHeader className="bg-soft-info p-3" toggle={toggle}>
                      {!!isEdit ? "Modifier collaborateur" : "Ajouter collaborateur"}
                    </ModalHeader>
                    <Form className="tablelist-form" onSubmit={(e) => {

                      e.preventDefault();
                      validation.handleSubmit();
                      return false;
                    }}>
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
                                  validation.touched.ent_lastname && validation.errors.ent_lastname ? true : false
                                }
                              />
                              {validation.touched.ent_lastname && validation.errors.ent_lastname ? (
                                <FormFeedback type="invalid">{validation.errors.ent_lastname}</FormFeedback>
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
                                  validation.touched.ent_firstname && validation.errors.ent_firstname ? true : false
                                }
                              />
                              {validation.touched.ent_firstname && validation.errors.ent_firstname ? (
                                <FormFeedback type="invalid">{validation.errors.ent_firstname}</FormFeedback>
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
                                placeholder="entrer un nom d'entreprise"
                                type="text"
                                validate={{
                                  required: { value: true },
                                }}
                                onChange={validation.handleChange}
                                onBlur={validation.handleBlur}
                                value={validation.values.ent_name || ""}
                                invalid={
                                  validation.touched.ent_name && validation.errors.ent_name ? true : false
                                }
                              />
                              {validation.touched.ent_name && validation.errors.ent_name ? (
                                <FormFeedback type="invalid">{validation.errors.ent_name}</FormFeedback>
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
                                  validation.touched.ent_pays && validation.errors.ent_pays ? true : false
                                }
                                value={validation.values.ent_pays}
                                onChange={validation.handleChange}
                                onBlur={validation.handleBlur}
                                name="ent_pays"
                                id="ent_pays-field"
                              >
                                <option disabled={true} value={""}>Choisir un pays</option>
                                {country.map((e, i) => (
                                  <option key={i} value={e.value}>{e.label}</option>
                                ))}
                              </Input>
                              {validation.touched.ent_pays && validation.errors.ent_pays ? (
                                <FormFeedback type="invalid">{validation.errors.ent_pays}</FormFeedback>
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
                                  validation.touched.ent_adresse && validation.errors.ent_adresse ? true : false
                                }
                              />
                              {validation.touched.ent_adresse && validation.errors.ent_adresse ? (
                                <FormFeedback type="invalid">{validation.errors.ent_adresse}</FormFeedback>
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
                                  validation.touched.ent_cp && validation.errors.ent_cp ? true : false
                                }
                              />
                              {validation.touched.ent_cp && validation.errors.ent_cp ? (
                                <FormFeedback type="invalid">{validation.errors.ent_cp}</FormFeedback>
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
                                  validation.touched.ent_ville && validation.errors.ent_ville ? true : false
                                }
                              />
                              {validation.touched.ent_ville && validation.errors.ent_ville ? (
                                <FormFeedback type="invalid">{validation.errors.ent_ville}</FormFeedback>
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
                                placeholder="Enter Contact email"
                                type="text"
                                validate={{
                                  required: { value: true },
                                }}
                                onChange={validation.handleChange}
                                onBlur={validation.handleBlur}
                                value={validation.values.ent_email || ""}
                                invalid={
                                  validation.touched.ent_email && validation.errors.ent_email ? true : false
                                }
                              />
                              {validation.touched.ent_email && validation.errors.ent_email ? (
                                <FormFeedback type="invalid">{validation.errors.ent_email}</FormFeedback>
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
                                  validation.touched.ent_phone && validation.errors.ent_phone ? true : false
                                }
                              />
                              {validation.touched.ent_phone && validation.errors.ent_phone ? (
                                <FormFeedback type="invalid">{validation.errors.ent_phone}</FormFeedback>
                              ) : null}
                            </div>
                          </Col>
                          <Col lg={8}>
                            <div>
                              <Label
                                htmlFor="iban-field"
                                className="form-label"
                              >
                                IBAN
                              </Label>
                              <Input
                                name="iban"
                                id="iban-field"
                                className="form-control"
                                placeholder="Entrer un iban"
                                type="text"
                                validate={{
                                  required: { value: true },
                                }}
                                onChange={validation.handleChange}
                                onBlur={validation.handleBlur}
                                value={validation.values.iban || ""}
                                invalid={
                                  validation.touched.iban && validation.errors.iban ? true : false
                                }
                              />
                              {validation.touched.iban && validation.errors.iban ? (
                                <FormFeedback type="invalid">{validation.errors.iban}</FormFeedback>
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
                                  validation.touched.ent_bic && validation.errors.ent_bic ? true : false
                                }
                              />
                              {validation.touched.ent_bic && validation.errors.ent_bic ? (
                                <FormFeedback type="invalid">{validation.errors.ent_bic}</FormFeedback>
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
                                  validation.touched.ent_siren && validation.errors.ent_siren ? true : false
                                }
                              />
                              {validation.touched.ent_siren && validation.errors.ent_siren ? (
                                <FormFeedback type="invalid">{validation.errors.ent_siren}</FormFeedback>
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
                                placeholder="Enter ent_methode_payment"
                                type="text"
                                validate={{
                                  required: { value: true },
                                }}
                                onChange={validation.handleChange}
                                onBlur={validation.handleBlur}
                                value={validation.values.ent_methode_payment || ""}
                                invalid={
                                  validation.touched.ent_methode_payment && validation.errors.ent_methode_payment ? true : false
                                }
                              />
                              {validation.touched.ent_methode_payment && validation.errors.ent_methode_payment ? (
                                <FormFeedback type="invalid">{validation.errors.ent_methode_payment}</FormFeedback>
                              ) : null}
                            </div>
                          </Col>

                          <Col lg={3} className="d-flex justify-content-center align-items-end">
                            <div>
                              <Label
                                htmlFor="isclient-field"
                                className="form-label"
                              >
                                Client
                              </Label>
                              <Input
                                defaultChecked={isClient}
                                className="form-check-input  ms-2"
                                type="checkbox"
                                value={isClient}
                                onChange={() => {
                                  if (cliCompta?.eco_id) {
                                    setCliCompta((cliCompta) => ({ ...cliCompta, eco_removed: !isClient ? 0 : 1 }))
                                  }
                                  setIsClient(!isClient)

                                }}
                                id="isclient-field"
                              />
                            </div>
                          </Col>
                          <Col lg={3} className="d-flex justify-content-center align-items-end">
                            <div>
                              <Label
                                htmlFor="isfournisseur-field"
                                className="form-label"
                              >
                                Fournisseur
                              </Label>
                              <Input
                                defaultChecked={fourCompta?.eco_removed == 0 ? true : false}
                                type="checkbox"
                                className="form-check-input ms-2"
                                value={fourCompta?.eco_removed == 0 ? true : false}
                                onChange={() => {
                                  if (fourCompta?.eco_id) {
                                    setFourCompta((fourCompta) => ({ ...fourCompta, eco_removed: !isFournisseur ? 0 : 1 }));
                                  }
                                  setIsFournisseur(!isFournisseur);
                                }}
                                id="isfournisseur-field"
                              />
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
                              validation.touched.ent_info && validation.errors.ent_info ? "true" : "false"
                            }
                            rows={5}
                          />
                          {validation.touched.ent_info && validation.errors.ent_info ? (
                            <FormFeedback type="invalid">{validation.errors.ent_info}</FormFeedback>
                          ) : null}

                          {/*(isClient || isFournisseur) &&
                            <>
                              <h5>Comptabilité</h5>
                              <div style={{ padding: 0, border: "1px solid #dfdfdf", borderRadius: "3px", }}>
                                {isClient &&
                                  <Card style={{ marginBottom: "0" }} className="accordion-item">
                                    <CardHeader style={{ cursor: "pointer" }} onClick={() => setToggeType((value) => (value == 2 ? 0 : 2))}>
                                      <span className="font-weight-bold"><b>Client</b></span>
                                    </CardHeader>
                                    <Collapse isOpen={toggleType == 2 ? true : false}>
                                      <CardBody style={{ borderBottom: "1px solid #dfdfdf" }}>
                                        <Row>

                                          <Col lg={6}>
                                            <div>
                                              <Label
                                                htmlFor="eco_code_client-field"
                                                className="form-label"
                                              >
                                                Code
                                              </Label>
                                              <Input
                                                name="eco_code_client"
                                                id="eco_code_client-field"
                                                className="form-control"
                                                placeholder="Enter since"
                                                type="text"
                                                validate={{
                                                  required: { value: true },
                                                }}
                                                onChange={validation.handleChange}
                                                onBlur={validation.handleBlur}
                                                value={validation.values.eco_code_client || ""}
                                                invalid={
                                                  validation.touched.eco_code_client && validation.errors.eco_code_client ? true : false
                                                }
                                              />
                                              {validation.touched.eco_code_client && validation.errors.eco_code_client ? (
                                                <FormFeedback type="invalid">{validation.errors.eco_code_client}</FormFeedback>
                                              ) : null}
                                            </div>
                                          </Col>
                                          <Col lg={6}>
                                            <div>
                                              <Label
                                                htmlFor="since-field"
                                                className="form-label"
                                              >
                                                Journal
                                              </Label>
                                              <Input
                                                name="eco_journal_client"
                                                id="eco_journal_client-field"
                                                className="form-control"
                                                placeholder="Enter since"
                                                type="text"
                                                validate={{
                                                  required: { value: true },
                                                }}
                                                onChange={validation.handleChange}
                                                onBlur={validation.handleBlur}
                                                value={validation.values.eco_journal_client || ""}
                                                invalid={
                                                  validation.touched.eco_journal_client && validation.errors.eco_journal_client ? true : false
                                                }
                                              />
                                              {validation.touched.eco_journal_client && validation.errors.eco_journal_client ? (
                                                <FormFeedback type="invalid">{validation.errors.eco_journal_client}</FormFeedback>
                                              ) : null}
                                            </div>
                                          </Col>
                                          <Col lg={12}>
                                            <div>
                                              <Label
                                                htmlFor="since-field"
                                                className="form-label"
                                              >
                                                Catégorie
                                              </Label>
                                              <Input
                                                name="eco_cat_client"
                                                id="eco_cat_client-field"
                                                className="form-control"
                                                placeholder="Enter since"
                                                type="text"
                                                validate={{
                                                  required: { value: true },
                                                }}
                                                onChange={validation.handleChange}
                                                onBlur={validation.handleBlur}
                                                value={validation.values.eco_cat_client || ""}
                                                invalid={
                                                  validation.touched.eco_cat_client && validation.errors.eco_cat_client ? true : false
                                                }
                                              />
                                              {validation.touched.eco_cat_client && validation.errors.eco_cat_client ? (
                                                <FormFeedback type="invalid">{validation.errors.eco_cat_client}</FormFeedback>
                                              ) : null}
                                            </div>
                                          </Col>
                                          <Col lg={8}>
                                            <div>
                                              <Label
                                                htmlFor="eco_tva_default_client-field"
                                                className="form-label"
                                              >
                                                Taux de TVA par défaut
                                              </Label>
                                              <Input
                                                name="eco_tva_default_client"
                                                id="eco_tva_default_client-field"
                                                className="form-control"
                                                placeholder="Enter since"
                                                type="text"
                                                validate={{
                                                  required: { value: true },
                                                }}
                                                onChange={validation.handleChange}
                                                onBlur={validation.handleBlur}
                                                value={validation.values.eco_tva_default_client || ""}
                                                invalid={
                                                  validation.touched.eco_tva_default_client && validation.errors.eco_tva_default_client ? true : false
                                                }
                                              />
                                              {validation.touched.eco_tva_default_client && validation.errors.eco_tva_default_client ? (
                                                <FormFeedback type="invalid">{validation.errors.eco_tva_default_client}</FormFeedback>
                                              ) : null}
                                            </div>
                                          </Col>
                                          <Col lg={4}>
                                            <div>
                                              {console.log(validation.values.eco_intra_tva_client)}
                                              <Label
                                                htmlFor="since-field"
                                                className="form-label"
                                              >
                                                TVA intracommunautaire
                                              </Label>
                                              <Input
                                                name="eco_intra_tva_client"
                                                id="eco_intra_tva_client-field"
                                                className="form-control"
                                                type="checkbox"
                                                onChange={validation.handleChange}

                                                defaultChecked={validation.values.eco_intra_tva_client == 1 ? true : false}
                                              />

                                            </div>
                                          </Col>
                                          <Col lg={6}>
                                            <div>
                                              <Label
                                                htmlFor="eco_tva_collect_client-field"
                                                className="form-label"
                                              >
                                                TVA collectée
                                              </Label>
                                              <Input
                                                name="eco_tva_collect_client"
                                                id="eco_tva_collect_client-field"
                                                className="form-control"
                                                placeholder="Enter since"
                                                type="text"
                                                validate={{
                                                  required: { value: true },
                                                }}
                                                onChange={validation.handleChange}
                                                onBlur={validation.handleBlur}
                                                value={validation.values.eco_tva_collect_client || ""}
                                                invalid={
                                                  validation.touched.eco_tva_collect_client && validation.errors.eco_tva_collect_client ? true : false
                                                }
                                              />
                                              {validation.touched.eco_tva_collect_client && validation.errors.eco_tva_collect_client ? (
                                                <FormFeedback type="invalid">{validation.errors.eco_tva_collect_client}</FormFeedback>
                                              ) : null}
                                            </div>
                                          </Col>
                                          <Col lg={6}>
                                            <div>
                                              <Label
                                                htmlFor="eco_tva_deduct_client-field"
                                                className="form-label"
                                              >
                                                TVA déductible
                                              </Label>
                                              <Input
                                                name="eco_tva_deduct_client"
                                                id="eco_tva_deduct_client-field"
                                                className="form-control"
                                                placeholder="Enter since"
                                                type="text"
                                                validate={{
                                                  required: { value: true },
                                                }}
                                                onChange={validation.handleChange}
                                                onBlur={validation.handleBlur}
                                                value={validation.values.eco_tva_deduct_client || ""}
                                                invalid={
                                                  validation.touched.eco_tva_deduct_client && validation.errors.eco_tva_deduct_client ? true : false
                                                }
                                              />
                                              {validation.touched.eco_tva_deduct_client && validation.errors.eco_tva_deduct_client ? (
                                                <FormFeedback type="invalid">{validation.errors.eco_tva_deduct_client}</FormFeedback>
                                              ) : null}
                                            </div>
                                          </Col>
                                        </Row>
                                      </CardBody>
                                    </Collapse>
                                  </Card>
                                }
                                {isFournisseur &&
                                  <Card style={{ marginBottom: "0" }} className="accordion-item">
                                    <CardHeader style={{ cursor: "pointer" }} onClick={() => setToggeType((value) => (value == 1 ? 0 : 1))}>
                                      <span className="font-weight-bold"><b>Fournisseur</b></span>
                                    </CardHeader>
                                    <Collapse isOpen={toggleType == 1 ? true : false}>
                                      <CardBody style={{ borderBottom: "1px solid #dfdfdf" }}>
                                        <Row>
                                          <Col lg={6}>
                                            <div>
                                              <Label
                                                htmlFor="eco_code_fournisseur-field"
                                                className="form-label"
                                              >
                                                Code
                                              </Label>
                                              <Input
                                                name="eco_code_fournisseur"
                                                id="eco_code_fournisseur-field"
                                                className="form-control"
                                                placeholder="Enter since"
                                                type="text"
                                                validate={{
                                                  required: { value: true },
                                                }}
                                                onChange={validation.handleChange}
                                                onBlur={validation.handleBlur}
                                                value={validation.values.eco_code_fournisseur || ""}
                                                invalid={
                                                  validation.touched.eco_code_fournisseur && validation.errors.eco_code_fournisseur ? true : false
                                                }
                                              />
                                              {validation.touched.eco_code_fournisseur && validation.errors.eco_code_fournisseur ? (
                                                <FormFeedback type="invalid">{validation.errors.eco_code_fournisseur}</FormFeedback>
                                              ) : null}
                                            </div>
                                          </Col>
                                          <Col lg={6}>
                                            <div>
                                              <Label
                                                htmlFor="since-field"
                                                className="form-label"
                                              >
                                                Journal
                                              </Label>
                                              <Input
                                                name="eco_journal_fournisseur"
                                                id="eco_journal_fournisseur-field"
                                                className="form-control"
                                                placeholder="Enter since"
                                                type="text"
                                                validate={{
                                                  required: { value: true },
                                                }}
                                                onChange={validation.handleChange}
                                                onBlur={validation.handleBlur}
                                                value={validation.values.eco_journal_fournisseur || ""}
                                                invalid={
                                                  validation.touched.eco_journal_fournisseur && validation.errors.eco_journal_fournisseur ? true : false
                                                }
                                              />
                                              {validation.touched.eco_journal_fournisseur && validation.errors.eco_journal_fournisseur ? (
                                                <FormFeedback type="invalid">{validation.errors.eco_journal_fournisseur}</FormFeedback>
                                              ) : null}
                                            </div>
                                          </Col>
                                          <Col lg={12}>
                                            <div>
                                              <Label
                                                htmlFor="since-field"
                                                className="form-label"
                                              >
                                                Catégorie
                                              </Label>
                                              <Input
                                                name="eco_cat_fournisseur"
                                                id="eco_cat_fournisseur-field"
                                                className="form-control"
                                                placeholder="Enter since"
                                                type="text"
                                                validate={{
                                                  required: { value: true },
                                                }}
                                                onChange={validation.handleChange}
                                                onBlur={validation.handleBlur}
                                                value={validation.values.eco_cat_fournisseur || ""}
                                                invalid={
                                                  validation.touched.eco_cat_fournisseur && validation.errors.eco_cat_fournisseur ? true : false
                                                }
                                              />
                                              {validation.touched.eco_cat_fournisseur && validation.errors.eco_cat_fournisseur ? (
                                                <FormFeedback type="invalid">{validation.errors.eco_cat_fournisseur}</FormFeedback>
                                              ) : null}
                                            </div>
                                          </Col>
                                          <Col lg={8}>
                                            <div>
                                              <Label
                                                htmlFor="eco_tva_default_fournisseur-field"
                                                className="form-label"
                                              >
                                                Taux de TVA par défaut
                                              </Label>
                                              <Input
                                                name="eco_tva_default_fournisseur"
                                                id="eco_tva_default_fournisseur-field"
                                                className="form-control"
                                                placeholder="Enter since"
                                                type="text"
                                                validate={{
                                                  required: { value: true },
                                                }}
                                                onChange={validation.handleChange}
                                                onBlur={validation.handleBlur}
                                                value={validation.values.eco_tva_default_fournisseur || ""}
                                                invalid={
                                                  validation.touched.eco_tva_default_fournisseur && validation.errors.eco_tva_default_fournisseur ? true : false
                                                }
                                              />
                                              {validation.touched.eco_tva_default_fournisseur && validation.errors.eco_tva_default_fournisseur ? (
                                                <FormFeedback type="invalid">{validation.errors.eco_tva_default_fournisseur}</FormFeedback>
                                              ) : null}
                                            </div>
                                          </Col>
                                          <Col lg={4}>
                                            <div>
                                              <Label
                                                htmlFor="since-field"
                                                className="form-label"
                                              >
                                                TVA intracommunautaire
                                              </Label>
                                              <Input
                                                name="eco_intra_tva_fournisseur"
                                                id="eco_intra_tva_fournisseur-field"
                                                className="form-control"
                                                placeholder="Enter since"
                                                type="checkbox"
                                                validate={{
                                                  required: { value: true },
                                                }}
                                                onChange={validation.handleChange}
                                                onBlur={validation.handleBlur}
                                                value={validation.values.eco_intra_tva_fournisseur || 0}
                                                invalid={
                                                  validation.touched.eco_intra_tva_fournisseur && validation.errors.eco_intra_tva_fournisseur ? true : false
                                                }
                                              />
                                              {validation.touched.since && validation.errors.eco_intra_tva_fournisseur ? (
                                                <FormFeedback type="invalid">{validation.errors.eco_intra_tva_fournisseur}</FormFeedback>
                                              ) : null}
                                            </div>
                                          </Col>
                                          <Col lg={6}>
                                            <div>
                                              <Label
                                                htmlFor="eco_tva_collect_fournisseur-field"
                                                className="form-label"
                                              >
                                                TVA collectée
                                              </Label>
                                              <Input
                                                name="eco_tva_collect_fournisseur"
                                                id="eco_tva_collect_fournisseur-field"
                                                className="form-control"
                                                placeholder="Enter since"
                                                type="text"
                                                validate={{
                                                  required: { value: true },
                                                }}
                                                onChange={validation.handleChange}
                                                onBlur={validation.handleBlur}
                                                value={validation.values.eco_tva_collect_fournisseur || ""}
                                                invalid={
                                                  validation.touched.eco_tva_collect_fournisseur && validation.errors.eco_tva_collect_fournisseur ? true : false
                                                }
                                              />
                                              {validation.touched.eco_tva_collect_fournisseur && validation.errors.eco_tva_collect_fournisseur ? (
                                                <FormFeedback type="invalid">{validation.errors.eco_tva_collect_fournisseur}</FormFeedback>
                                              ) : null}
                                            </div>
                                          </Col>
                                          <Col lg={6}>
                                            <div>
                                              <Label
                                                htmlFor="eco_tva_deduct_fournisseur-field"
                                                className="form-label"
                                              >
                                                TVA déductible
                                              </Label>
                                              <Input
                                                name="eco_tva_deduct_fournisseur"
                                                id="eco_tva_deduct_fournisseur-field"
                                                className="form-control"
                                                placeholder="Enter since"
                                                type="text"
                                                validate={{
                                                  required: { value: true },
                                                }}
                                                onChange={validation.handleChange}
                                                onBlur={validation.handleBlur}
                                                value={validation.values.eco_tva_deduct_fournisseur || ""}
                                                invalid={
                                                  validation.touched.eco_tva_deduct_fournisseur && validation.errors.eco_tva_deduct_fournisseur ? true : false
                                                }
                                              />
                                              {validation.touched.eco_tva_deduct_fournisseur && validation.errors.eco_tva_deduct_fournisseur ? (
                                                <FormFeedback type="invalid">{validation.errors.eco_tva_deduct_fournisseur}</FormFeedback>
                                              ) : null}
                                            </div>
                                          </Col>
                                        </Row>
                                      </CardBody>
                                    </Collapse>
                                  </Card>
                                }


                              </div>
                            </>
                              */}



                        </Row>
                      </ModalBody>
                      <ModalFooter>
                        <div className="hstack gap-2 justify-content-end">
                          <button type="button" className="btn btn-light" onClick={() => { setModal(false); }} > Fermer </button>
                          <button type="submit" className="btn btn-success" id="add-btn" >  {!!isEdit ? "Modifier" : "Ajouter Collaborateur"} </button>
                        </div>
                      </ModalFooter>
                    </Form>
                  </Modal>
                  <ToastContainer closeButton={false} limit={1} />
                </CardBody>

              </Card>
            </Col>
            <Col xxl={3}>
              <Card id="company-view-detail">
                <CardBody className="text-center">
                  <div className="position-relative d-inline-block">
                    <div className="avatar-md">
                      <div className="avatar-title bg-light rounded-circle">
                        <img src={process.env.REACT_APP_API_URL + "/images/" + (info.image_src || "brands/mail_chimp.png")} alt="" className="avatar-sm rounded-circle object-cover" />
                      </div>
                    </div>
                  </div>
                  <h5 className="mt-3 mb-1">{info.name || "Syntyce Solution"}</h5>
                  <p className="text-muted">{info.owner || "Michael Morris"}</p>

                  <ul className="list-inline mb-0">
                    <li className="list-inline-item avatar-xs">
                      <Link
                        to="#"
                        className="avatar-title bg-soft-success text-success fs-15 rounded"
                      >
                        <i className="ri-global-line"></i>
                      </Link>
                    </li>
                    <li className="list-inline-item avatar-xs">
                      <Link
                        to="#"
                        className="avatar-title bg-soft-danger text-danger fs-15 rounded"
                      >
                        <i className="ri-mail-line"></i>
                      </Link>
                    </li>
                    <li className="list-inline-item avatar-xs">
                      <Link
                        to="#"
                        className="avatar-title bg-soft-warning text-warning fs-15 rounded"
                      >
                        <i className="ri-question-answer-line"></i>
                      </Link>
                    </li>
                  </ul>
                </CardBody>
                <div className="card-body">
                  <h6 className="text-muted text-uppercase fw-semibold mb-3">
                    Information
                  </h6>
                  <p className="text-muted mb-4">
                    A company incurs fixed and variable costs such as the
                    purchase of raw materials, salaries and overhead, as
                    explained by AccountingTools, Inc. Business owners have the
                    discretion to determine the actions.
                  </p>
                  <div className="table-responsive table-card">
                    <table className="table table-borderless mb-0">
                      <tbody>
                        <tr>
                          <td className="fw-medium">
                            Industry Type
                          </td>
                          <td>{info.industry_type || "Chemical Industries"}</td>
                        </tr>
                        <tr>
                          <td className="fw-medium">
                            Location
                          </td>
                          <td>{info.location || "Damascus, Syria"}</td>
                        </tr>
                        <tr>
                          <td className="fw-medium">
                            Employee
                          </td>
                          <td>{info.employee || "10-50"}</td>
                        </tr>
                        <tr>
                          <td className="fw-medium">
                            Rating
                          </td>
                          <td>
                            {info.star_value || "4.0"}{" "}
                            <i className="ri-star-fill text-warning align-bottom"></i>
                          </td>
                        </tr>
                        <tr>
                          <td className="fw-medium">
                            Website
                          </td>
                          <td>
                            <Link
                              to="#"
                              className="link-primary text-decoration-underline"
                            >
                              {info.website || "www.syntycesolution.com"}
                            </Link>
                          </td>
                        </tr>
                        <tr>
                          <td className="fw-medium">
                            Contact Email
                          </td>
                          <td>{info.contact_email || "info@syntycesolution.com"}</td>
                        </tr>
                        <tr>
                          <td className="fw-medium">
                            Since
                          </td>
                          <td>{info.since || "1995"}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default Collaborateurs;
