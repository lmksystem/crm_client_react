import React, { useEffect, useState, useCallback } from "react";

import {
  CardBody,
  Row,
  Col,
  Card,
  Container,
  Form,
  Input,
  Label,
  Table,
  FormFeedback,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter
} from "reactstrap";

import { Link, useLocation, useNavigate, useParams } from "react-router-dom";

import BreadCrumb from "../../Components/Common/BreadCrumb";
import Select from "react-select";

import logoDark from "../../assets/images/logo_countano.png";
import logoLight from "../../assets/images/logo_countano.png";

//formik
import { useFormik } from "formik";
import * as Yup from "yup";

//redux
import { useDispatch, useSelector } from "react-redux";
import {
  addNewDevis as onAddNewDevis,
  getCollaborateurs as onGetCollaborateurs,
  getCompany as onGetCompany,
  getTva as onGetTva,
  getProducts as onGetProducts,
  getConstantes as onGetConstantes,
} from "../../slices/thunks";
import SimpleBar from "simplebar-react";
import { parseInt } from "lodash";
import { allstatus } from "../../common/data/invoiceList";
import { rounded } from "../../utils/function";
import { api } from "../../config";
import moment from "moment";
import { allstatusDevis } from "../../common/data/devisList";


const InvoiceCreate = () => {
  const { collaborateurs, company, tva, products, prefix_devis } = useSelector((state) => ({
    collaborateurs: state.Gestion.collaborateurs,
    company: state.Company.company[0],
    tva: state.Gestion.tva,
    products: state.Product.products,
    prefix_devis: state.Gestion.constantes?.find(
      (cst) => cst.con_title === "Prefixe devis"
    ),
  }));

  let { state } = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();


  const [collaborateur, setCollaborateur] = useState(null);

  const [modal, setModal] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const [searchValueProduct, setSearchValueProduct] = useState("");
  const [selectedLigne, setSelectedLigne] = useState(null);

  const [modalProduct, setModalProduct] = useState(false);

  const tvaList = tva?.map((e) => ({ id: e.tva_id, label: e.tva_value + "%", value: e.tva_value }));

  const initialValueLigne = {
    dli_name: "",
    dli_detail: "",
    dli_unit_ht: 0,
    dli_unit_ttc: 0,
    dli_total_ht: 0,
    dli_total_ttc: 0,
    dli_qty: 0,
    dli_tva: 0,
    dli_total_tva: 0,
    dli_pourcent_remise: 0,
    dli_total_remise: 0,
    dli_unit_remise: 0,
  }

  const toggle = useCallback(() => {
    if (modal) {
      setModal(false);
    } else {
      setModal(true);
    }
  }, [modal]);

  const toggleModalProduct = useCallback(() => {
    if (modalProduct) {
      setModalProduct(false);
    } else {
      setModalProduct(true);
    }
  }, [modalProduct]);

  useEffect(() => {

    dispatch(onGetCollaborateurs());
    dispatch(onGetCompany());
    dispatch(onGetTva());
    dispatch(onGetProducts());
    dispatch(onGetConstantes());


  }, [dispatch]);

  document.title = "Création devis | Countano";
  // console.log(company);
  const validation = useFormik({
    enableReinitialize: true,

    initialValues: {
      contact: {
        // Champs avec "cus" correspond au client
        dco_cus_email: "",
        dco_cus_phone: "",
        dco_cus_address: "",
        dco_cus_city: "",
        dco_cus_cp: "",
        dco_cus_name: "",

        dco_email: (company && company.com_email) || "",
        dco_phone: (company && company.com_phone) || "",
        dco_address: (company && company.com_adresse) || "",
        dco_city: (company && company.com_ville) || "",
        dco_cp: (company && company.com_cp) || "",
        dco_name: (company && company.com_name) || "",
      },
      header: {
        den_com_fk: "",
        den_ent_fk: "",
        den_sujet: "",
        den_date_valid: moment().format('YYYY-MM-DD'),
        den_etat: "",
        den_total_ht: 0,
        den_total_ttc: 0,
        den_total_tva: 0,
        den_total_remise: 0,
        den_num:(prefix_devis?.con_value ?prefix_devis?.con_value:"")+company?.com_nb_dev,
        den_note: ""
      },
      ligne: []
    },
    validationSchema: Yup.object({
      contact: Yup.object({
        dco_cus_name: Yup.string().required("Champs obligatoire"),
        dco_cus_email: Yup.string().required("Champs obligatoire"),
        dco_cus_phone: Yup.string().required("Champs obligatoire"),
        dco_cus_address: Yup.string().required("Champs obligatoire"),
        dco_cus_city: Yup.string().required("Champs obligatoire"),
        dco_cus_cp: Yup.string().required("Champs obligatoire"),
        dco_name: Yup.string().required("Champs obligatoire"),
        dco_email: Yup.string().required("Champs obligatoire"),
        dco_phone: Yup.string().required("Champs obligatoire"),
        dco_address: Yup.string().required("Champs obligatoire"),
        dco_city: Yup.string().required("Champs obligatoire"),
        dco_cp: Yup.string().required("Champs obligatoire"),

      }),
      header: Yup.object({
        den_sujet: Yup.string().required("Champs obligatoire"),
        den_date_valid: Yup.string().required("Champs obligatoire"),
        den_etat: Yup.string().required("Champs obligatoire"),
        den_total_ht: Yup.number().required("Champs obligatoire"),
        den_total_ttc: Yup.number().required("Champs obligatoire"),
        den_total_tva: Yup.number().required("Champs obligatoire"),
        den_total_remise: Yup.number().required("Champs obligatoire"),

      }),

    }),
    onSubmit: (values) => {
      dispatch(onAddNewDevis(values)).then(() => {
        navigate("/devis/liste");
        validation.resetForm();

      });
    },
  });

  /**
   * Fonction de recherche d'un client lors de la séléction
   * @returns 
   */
  const handleListClient = () => {
    let data = [...collaborateurs];

    if (searchValue != "") {
      data = data.filter(e =>
        e.ent_name?.toLowerCase()?.includes(searchValue?.toLowerCase()) ||
        e.ent_email?.toLowerCase()?.includes(searchValue?.toLowerCase()) ||
        e.ent_phone?.toLowerCase()?.includes(searchValue?.toLowerCase())
      );
    }

    return data
  }

  useEffect(() => {
    if (collaborateur) {
      validation.setValues({
        ...validation.values,
        header: {
          ...validation.values.header,
          den_ent_fk: (collaborateur && collaborateur.ent_id) || "",
        },
        contact: {
          ...validation.values.contact,
          dco_cus_email: (collaborateur && collaborateur.ent_email) || "",
          dco_cus_phone: (collaborateur && collaborateur.ent_phone) || "",
          dco_cus_address: (collaborateur && collaborateur.ent_adresse) || "",
          dco_cus_city: (collaborateur && collaborateur.ent_ville) || "",
          dco_cus_cp: (collaborateur && collaborateur.ent_cp) || "",
          dco_cus_name: (collaborateur && collaborateur.ent_name) || "",

        }
      })
    }
  }, [collaborateur]);

  const recalculateLigneData = (ligne) => {
    let { dli_unit_ht, dli_qty, dli_tva, dli_pourcent_remise } = ligne;

    // montant de la remise pour un produit
    let montant_unit_remise = dli_unit_ht * (dli_pourcent_remise / 100);

    // montant de la remise pour la totalité de la ligne 
    let total_remise = montant_unit_remise * dli_qty

    // montant ht d'un produit après application de la remise
    let total_unit_remise_ht = dli_unit_ht - montant_unit_remise;

    // Total de la tva pour un produit remisé
    let total_unit_remise_tva = total_unit_remise_ht * (dli_tva / 100);

    // Montant unitaire d'un produit avant remise
    let total_unit_tva = dli_unit_ht * (dli_tva / 100);

    // Montant total d'un produit ttc
    let total_unit_remise_ttc = total_unit_remise_ht + total_unit_remise_tva;

    // Montant ttc d'un produit avant remise
    let total_unit_ttc = dli_unit_ht + total_unit_tva;

    ligne.dli_total_ht = rounded(dli_qty * total_unit_remise_ht);
    ligne.dli_total_ttc = rounded(dli_qty * total_unit_remise_ttc);
    ligne.dli_unit_remise = rounded(montant_unit_remise);
    ligne.dli_total_remise = rounded(total_remise);
    ligne.dli_total_tva = rounded(dli_qty * total_unit_remise_tva);
    ligne.dli_unit_ttc = rounded(total_unit_ttc);
    return ligne;
  }

  /**
   * Fonction de calcule des prix de l'entete de la devis (total de la devis)
   * @param {*} lignes 
   * @returns 
   */
  const handleHeaderValue = (lignes) => {

    let total_ht = 0;
    let total_remise = 0;
    let total_tva = 0;
    let total_ttc = 0;

    for (let index = 0; index < lignes.length; index++) {
      const ligne = lignes[index];

      total_ht += ligne.dli_total_ht;
      total_remise += ligne.dli_total_remise;
      total_tva += ligne.dli_total_tva;
      total_ttc += ligne.dli_total_ttc;
    }

    let header = { ...validation.values.header };

    header.den_total_ht = total_ht;
    header.den_total_remise = total_remise;
    header.den_total_tva = total_tva;
    header.den_total_ttc = total_ttc;

    return header
  }

  /**
   * Fonction d'actualisation des prix en fonction des champs de prix modifiable pour les ligne (calcule ttc, ht, ect...)
   * @param {*} e 
   * @param {*} i 
   */
  const handleChangeValue = (e, i) => {

    let value = parseFloat(e.target.value) || 0;
    let lignesData = [...validation.values.ligne];

    lignesData.map((ligne, index) => {
      if (index == i) {
        ligne[e.target.name.split('.').pop()] = value

        let updatingLine = recalculateLigneData(ligne);

        validation.setValues({ ...validation.values, ligne: [...validation.values.ligne].map((l) => i == index ? updatingLine : l) })
      }
    });

    let header = handleHeaderValue(lignesData);
    validation.setValues({ ...validation.values, header: header })
  }

  const deleteLigne = (index) => {

    let lignesData = [...validation.values.ligne].filter((e, i) => i != index);

    let header = handleHeaderValue(lignesData);

    validation.setValues({ ...validation.values, header: header, ligne: lignesData })
  }

  // useEffect(() => {
  //   if (validation.values.ligne.length < 1) {
  //     validation.setValues({
  //       ...validation.values,
  //       ligne: [
  //         initialValueLigne
  //       ]
  //     })
  //   }

  // }, [validation.values.ligne])

  useEffect(() => {
    if (validation && state && Object.keys(state).length > 0) {
      console.log("state", state);
      validation.setValues(state);
    }

  }, [])


  return (
    <div className="page-content">
      <Container fluid>
        <BreadCrumb title="Création devis" pageTitle="Devis" />
        <Row className="justify-content-center">
          <Col xxl={9}>
            <Card>
              <Form
                onSubmit={(e) => {
                  console.log("submit ");
                  e.preventDefault();
                  validation.handleSubmit();
                  return false;
                }}
                className="needs-validation"
                id="invoice_form"
              >
                <CardBody className="p-4">
                  <Row>
                    <Col lg={6} className="d-flex">
                      <div className="profile-user mx-auto  mb-3">
                        <Input
                          id="profile-img-file-input"
                          type="file"
                          className="profile-img-file-input"
                        />
                        <Label for="profile-img-file-input" className="d-block">
                          <span
                            className="overflow-hidden border border-dashed d-flex align-items-center justify-content-center rounded"
                            style={{ height: "60px", width: "256px" }}
                          >
                            <img
                              src={logoDark}
                              className="card-logo card-logo-dark user-profile-image img-fluid"
                              alt="logo dark"
                            />
                            <img
                              src={logoLight}
                              className="card-logo card-logo-light user-profile-image img-fluid"
                              alt="logo light"
                            />

                          </span>

                        </Label>

                      </div>


                    </Col>
                    <Col lg={6} sm={6} className="mb-3">
                      <Row className="d-flex justify-content-around">
                        <Col lg={8}>
                          <div>
                            <Label
                              for="dco_name"
                              className="text-muted text-uppercase fw-semibold"
                            >
                              Sujet
                            </Label>
                          </div>
                          <div className="mb-2">
                            <Input
                              type="text"
                              className="form-control border-1"
                              id="den_sujet"
                              name="header.den_sujet"
                              value={validation.values.header?.den_sujet || ""}
                              onBlur={validation.handleBlur}
                              onChange={validation.handleChange}
                              placeholder="Sujet complet"
                              invalid={validation.errors?.header?.den_sujet && validation.touched?.header?.den_sujet ? true : false}
                            />
                            {validation.errors?.header?.den_sujet && validation.touched?.header?.den_sujet ? (
                              <FormFeedback type="invalid">{validation.errors?.header?.den_sujet}</FormFeedback>
                            ) : null}

                          </div>
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                </CardBody>

                <CardBody className="p-4">

                  <Row className="d-flex justify-content-around">

                    <Col lg={4} sm={6}>

                      <Row>
                        <div>
                          <Label
                            for="dco_name"
                            className="text-muted text-uppercase fw-semibold"
                          >
                            Mes informations
                          </Label>
                        </div>
                        <div className="mb-2">
                          <Input
                            type="text"
                            className="form-control border-1"
                            id="dco_name"
                            name="contact.dco_name"
                            value={validation.values.contact.dco_name || ""}
                            onBlur={validation.handleBlur}
                            onChange={validation.handleChange}
                            placeholder="Nom complet"
                            invalid={validation.errors?.contact?.dco_name && validation.touched?.contact?.dco_name ? true : false}
                          />
                          {validation.errors?.contact?.dco_name && validation.touched?.contact?.dco_name ? (
                            <FormFeedback type="invalid">{validation.errors?.contact?.dco_name}</FormFeedback>
                          ) : null}

                        </div>
                        <div className="mb-2">
                          <Input
                            type="textarea"
                            className="form-control border-1"
                            id="billingAddress"
                            name="contact.dco_address"
                            value={validation.values.contact.dco_address || ""}
                            onBlur={validation.handleBlur}
                            onChange={validation.handleChange}
                            rows="3"
                            placeholder="Adresse"
                            invalid={validation.errors?.contact?.dco_address && validation.touched?.contact?.dco_address ? true : false}
                          />
                          {validation.errors?.contact?.dco_address && validation.touched?.contact?.dco_address ? (
                            <FormFeedback type="invalid">{validation.errors?.contact?.dco_address}</FormFeedback>
                          ) : null}

                        </div>
                        <div className="mb-2">
                          <Input
                            type="text"
                            className="form-control border-1"
                            id="dco_cp"
                            name="contact.dco_cp"
                            value={validation.values.contact.dco_cp || ""}
                            onBlur={validation.handleBlur}
                            onChange={validation.handleChange}
                            placeholder="Code postal"
                            invalid={validation.errors?.contact?.dco_cp && validation.touched?.contact?.dco_cp ? true : false}
                          />
                          {validation.errors?.contact?.dco_cp && validation.touched?.contact?.dco_cp ? (
                            <FormFeedback type="invalid">{validation.errors?.contact?.dco_cp}</FormFeedback>
                          ) : null}

                        </div>
                        <div className="mb-2">
                          <Input
                            type="text"
                            className="form-control border-1"
                            id="dco_city"
                            name="contact.dco_city"
                            value={validation.values.contact.dco_city || ""}
                            onBlur={validation.handleBlur}
                            onChange={validation.handleChange}
                            placeholder="Ville"
                            invalid={validation.errors?.contact?.dco_city && validation.touched?.contact?.dco_city ? true : false}
                          />
                          {validation.errors?.contact?.dco_city && validation.touched?.contact?.dco_city ? (
                            <FormFeedback type="invalid">{validation.errors?.contact?.dco_city}</FormFeedback>
                          ) : null}

                        </div>
                        <div className="mb-2">
                          <Input
                            type="text"
                            className="form-control border-1"
                            data-plugin="cleave-phone"
                            id="dco_phone"
                            name="contact.dco_phone"
                            value={validation.values.contact.dco_phone || ""}
                            onBlur={validation.handleBlur}
                            onChange={validation.handleChange}
                            placeholder="Téléphone"
                            invalid={validation.errors?.contact?.dco_phone && validation.touched?.contact?.dco_phone ? true : false}
                          />
                          {validation.errors?.contact?.dco_phone && validation.touched?.contact?.dco_phone ? (
                            <FormFeedback type="invalid">{validation.errors?.contact?.dco_phone}</FormFeedback>
                          ) : null}

                        </div>
                        <div className="mb-2">
                          <Input
                            type="text"
                            className="form-control border-1"
                            id="dco_email"
                            name="contact.dco_email"
                            value={validation.values.contact.dco_email || ""}
                            onBlur={validation.handleBlur}
                            onChange={validation.handleChange}
                            placeholder="Email"
                            invalid={validation.errors?.contact?.dco_email && validation.touched?.contact?.dco_email ? true : false}
                          />
                          {validation.errors?.contact?.dco_email && validation.touched?.contact?.dco_email ? (
                            <FormFeedback type="invalid">{validation.errors?.contact?.dco_email}</FormFeedback>
                          ) : null}

                        </div>
                      </Row>
                    </Col>
                    <Col lg={4} sm={6}>
                      <Row>
                        <Col>
                          <div className="title-client">
                            <Label
                              for="dco_cus_name"
                              className="text-muted text-uppercase fw-semibold"
                            >
                              Client information

                            </Label>

                          </div>
                          <div className="mb-2">
                            <div className="input-group" style={{ position: 'relative' }}>
                              <Input
                                autoComplete="off"
                                type="text"
                                className="form-control border-1"
                                id="dco_cus_name"
                                name="contact.dco_cus_name"
                                value={validation.values.contact.dco_cus_name || ""}
                                onBlur={validation.handleBlur}
                                onChange={validation.handleChange}
                                placeholder="Nom complet"
                                invalid={validation.errors?.contact?.dco_cus_name && validation.touched?.contact?.dco_cus_name ? true : false}
                              />
                              <button onClick={toggle} className="btn btn-primary" type="button" id="button-addon2">+</button>
                              {/* {showCollabDiv &&
                                <datalist id="list-company" style={{ display: "block", position: 'absolute', backgroundColor: 'white', width: "100%", border: "0.5px solid #dddddd", zIndex: 5000, height: "auto", maxHeight: "400px", overflowY: "scroll" }} >
                                  {collaborateurs.filter(e => e.ent_name.includes(validation.values.contact.dco_cus_name)).map((c, i) => {
                                    return (
                                      <option style={{ cursor: "pointer", padding: 8, borderBottom: "0.5px solid #dddddd" }} onClick={() => { setShowCollabDiv(() => false); setCollaborateur(c) }} key={i}>{c.ent_name}</option>
                                    )
                                  })}
                                </datalist>
                              } */}

                            </div>
                            {validation.errors?.contact?.dco_cus_name && validation.touched?.contact?.dco_cus_name ? (
                              <FormFeedback type="invalid">{validation.errors?.contact?.dco_cus_name}</FormFeedback>
                            ) : null}

                          </div>
                          <div className="mb-2">
                            <Input
                              type="textarea"
                              className="form-control border-1"
                              id="dco_cus_address"
                              name="contact.dco_cus_address"
                              value={validation.values.contact.dco_cus_address || ""}
                              onBlur={validation.handleBlur}
                              onChange={validation.handleChange}
                              rows="3"
                              placeholder="Adresse"
                              invalid={validation.errors?.contact?.dco_cus_address && validation.touched?.contact?.dco_cus_address ? true : false}
                            />
                            {validation.errors?.contact?.dco_cus_address && validation.touched?.contact?.dco_cus_address ? (
                              <FormFeedback type="invalid">{validation.errors?.contact?.dco_cus_address}</FormFeedback>
                            ) : null}

                          </div>
                          <div className="mb-2">
                            <Input
                              type="text"
                              className="form-control border-1"
                              id="dco_cp"
                              name="contact.dco_cus_cp"
                              value={validation.values.contact.dco_cus_cp || ""}
                              onBlur={validation.handleBlur}
                              onChange={validation.handleChange}
                              placeholder="Code postal"
                              invalid={validation.errors?.contact?.dco_cus_cp && validation.touched?.contact?.dco_cus_cp ? true : false}
                            />
                            {validation.errors?.contact?.dco_cus_cp && validation.touched?.contact?.dco_cus_cp ? (
                              <FormFeedback type="invalid">{validation.errors?.contact?.dco_cus_cp}</FormFeedback>
                            ) : null}

                          </div>
                          <div className="mb-2">
                            <Input
                              type="text"
                              className="form-control border-1"
                              id="dco_cus_city"
                              name="contact.dco_cus_city"
                              value={validation.values.contact.dco_cus_city || ""}
                              onBlur={validation.handleBlur}
                              onChange={validation.handleChange}
                              placeholder="Ville"
                              invalid={validation.errors?.contact?.dco_cus_city && validation.touched?.contact?.dco_cus_city ? true : false}
                            />
                            {validation.errors?.contact?.dco_cus_city && validation.touched?.contact?.dco_cus_city ? (
                              <FormFeedback type="invalid">{validation.errors?.contact?.dco_cus_city}</FormFeedback>
                            ) : null}

                          </div>
                          <div className="mb-2">
                            <Input
                              type="text"
                              className="form-control border-1"
                              data-plugin="cleave-phone"
                              id="dco_cus_phone"
                              name="contact.dco_cus_phone"
                              value={validation.values.contact.dco_cus_phone || ""}
                              onBlur={validation.handleBlur}
                              onChange={validation.handleChange}
                              placeholder="Téléphone"
                              invalid={validation.errors?.contact?.dco_cus_phone && validation.touched?.contact?.dco_cus_phone ? true : false}
                            />
                            {validation.errors?.contact?.dco_cus_phone && validation.touched?.contact?.dco_cus_phone ? (
                              <FormFeedback type="invalid">{validation.errors?.contact?.dco_cus_phone}</FormFeedback>
                            ) : null}

                          </div>
                          <div className="mb-2">
                            <Input
                              type="text"
                              className="form-control border-1"
                              id="dco_cus_email"
                              name="contact.dco_cus_email"
                              value={validation.values.contact.dco_cus_email || ""}
                              onBlur={validation.handleBlur}
                              onChange={validation.handleChange}
                              placeholder="Email"
                              invalid={validation.errors?.contact?.dco_cus_email && validation.touched?.contact?.dco_cus_email ? true : false}
                            />
                            {validation.errors?.contact?.dco_cus_email && validation.touched?.contact?.dco_cus_email ? (
                              <FormFeedback type="invalid">{validation.errors?.contact?.dco_cus_email}</FormFeedback>
                            ) : null}

                          </div>
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                </CardBody>
                <CardBody className="p-4 border-top border-bottom border-bottom-dashed border-top-dashed">
                  <Row className="g-3">
                    <Col lg={3} sm={6}>
                      <Label for="invoicenoInput">Devis N°</Label>
                      <Input
                        type="text"
                        className="form-control bg-light border-0"
                        id="den_num"
                        name="header.den_num"
                        value={`${validation.values.header.den_num}` || ""}
                        onBlur={validation.handleBlur}
                        onChange={validation.handleChange}
                        placeholder="Numéro de devis"
                        invalid={validation.errors?.header?.den_num && validation.touched?.header?.den_num ? true : false}
                        readOnly
                      />
                      {validation.errors?.header?.den_num && validation.touched?.header?.den_num ? (
                        <FormFeedback type="invalid">{validation.errors?.header?.den_num}</FormFeedback>
                      ) : null}
                    </Col>
                    <Col lg={3} sm={6}>
                      <div>

                        <Label for="date-field">Date de validité</Label>
                        <Input
                          type="date"
                          name="header.den_date_valid"
                          id="date-field"
                          className="form-control"
                          placeholder="Select a date"
                          onBlur={validation.handleBlur}
                          onChange={validation.handleChange}
                          value={validation.values.header.den_date_valid || ""}
                          invalid={validation.errors?.header?.den_date_valid && validation.touched?.header?.den_date_valid ? true : false}
                          required
                        />
                        {validation.touched?.header?.den_date_valid && validation.errors?.header?.den_date_valid ? (
                          <FormFeedback type="invalid">{validation.errors?.header?.den_date_valid}</FormFeedback>
                        ) : null}
                      </div>
                    </Col>
                    <Col lg={3} sm={6}>
                      <Label for="choices-payment-status">État</Label>
                      <div className="input-light">

                        <Input
                          name="header.den_etat"
                          type="select"
                          className="border-1"
                          id="choices-payment-status"
                          onChange={validation.handleChange}
                          onBlur={validation.handleBlur}
                          required
                          value={
                            validation.values.header.den_etat || ""
                          }
                        >
                          {allstatusDevis.map((item, key) => (<option value={item.value} key={key}>{item.label}</option>))}
                        </Input>
                        {validation.touched.status && validation.errors.status ? (
                          <FormFeedback type="invalid">{validation.errors.status}</FormFeedback>
                        ) : null}

                      </div>
                    </Col>
                    <Col lg={3} sm={6}>
                      <div>
                        <Label for="totalamountInput">Montant total</Label>
                        <Input
                          type="text"
                          className="form-control bg-light border-0"
                          id="totalamountInput"
                          placeholder="€0.00"
                          readOnly
                          value={"€" + rounded(validation.values.header.den_total_ttc, 2)}
                        />
                      </div>
                    </Col>
                  </Row>
                </CardBody>
                <CardBody className="p-4">
                  <div className="table-responsive">
                    <Table className="invoice-table table-borderless table-nowrap mb-0">
                      <thead className="align-middle">
                        <tr className="table-active">
                          <th scope="col" style={{ width: "20px" }}>
                            #
                          </th>
                          <th scope="col">Details Produit </th>
                          <th scope="col" style={{ width: "115px" }}>Tva</th>
                          <th scope="col" style={{ width: "150px" }}>Prix unitaire</th>
                          <th scope="col" style={{ width: "110px" }}>Remise</th>
                          <th scope="col" style={{ width: "120px" }}>
                            Quantité
                          </th>
                          <th
                            scope="col"
                            className="text-end"
                            style={{ width: "150px" }}
                          >
                            Total
                          </th>
                          <th
                            scope="col"
                            className="text-end"
                            style={{ width: "70px" }}
                          ></th>
                        </tr>
                      </thead>
                      <tbody id="newlink">
                        {validation.values.ligne.map((e, i) => {

                          return (
                            <tr key={i} id="ligneNumber" className="product">
                              <th scope="row" className="product-id">
                                {i + 1}
                              </th>
                              <td className="text-start">
                                <div className="input-group mb-2 position-relative">
                                  <Input
                                    type="text"
                                    autoComplete="off"
                                    className="form-control border-1"
                                    id={`productName-${i}`}
                                    placeholder="Nom du produit"
                                    name={`ligne[${i}].dli_name`}
                                    value={validation.values?.ligne[i]?.dli_name || ""}
                                    onBlur={validation.handleBlur}
                                    onChange={validation.handleChange}
                                    required
                                  />
                                  <button onClick={() => { toggleModalProduct(); setSelectedLigne(i) }} className="btn btn-primary" type="button" id="button-addon2">+</button>

                                </div>
                                <Input
                                  name={`ligne[${i}].dli_detail`}
                                  type="textarea"
                                  className="form-control  border-1"
                                  id="productDetails-1"
                                  rows="2"
                                  placeholder="Details du produit"
                                  onBlur={validation.handleBlur}
                                  onChange={validation.handleChange}
                                  value={validation.values?.ligne[i]?.dli_detail || ""}
                                ></Input>
                              </td>
                              <td>
                                <Select
                                  onChange={(option) => {
                                    let event = { target: { value: option.value, name: `ligne[${i}].dli_tva` }, };
                                    handleChangeValue(event, i);
                                  }}
                                  options={tvaList || []}
                                  value={tvaList && tvaList.find((tva) => tva.value == validation.values.ligne[i].dli_tva)}
                                  id="choices-payment-currency"
                                  className="form-selectborder-0 bg-light"
                                />
                              </td>
                              <td>
                                <div className="input-group">
                                  <Input
                                    type="number"
                                    className="form-control product-price border-1"
                                    placeholder="0.00"
                                    // id="dli_unit_ht" 
                                    step="0.01"
                                    name={`ligne[${i}].dli_unit_ht`}
                                    value={validation.values?.ligne[i]?.dli_unit_ht || ""}
                                    onChange={(e) => { handleChangeValue(e, i); }}
                                    onBlur={validation.handleBlur}
                                  />
                                  <Label className="btn btn-primary btn-input-group">ht</Label>
                                </div>
                                <div className="input-group  mt-2">
                                  <Input
                                    type="number"
                                    className="form-control product-price bg-light border-0"
                                    placeholder="0.00"
                                    // id="dli_unit_ht" 
                                    step="0.01"
                                    name={`ligne[${i}].dli_unit_ht`}
                                    value={validation.values?.ligne[i]?.dli_unit_ttc || ""}
                                    onBlur={validation.handleBlur}
                                    readOnly
                                  />
                                  <Label className="btn btn-primary btn-input-group">ttc</Label>
                                </div>
                              </td>
                              <td>
                                <div className="input-group">
                                  <Input
                                    type="number"
                                    className="form-control product-price border-1"
                                    placeholder="0.00"
                                    step="0.01"
                                    name={`ligne[${i}].dli_pourcent_remise`}
                                    value={validation.values?.ligne[i]?.dli_pourcent_remise || ""}
                                    onChange={(e) => handleChangeValue(e, i)}
                                    onBlur={validation.handleBlur} />
                                  <Label className="btn btn-primary btn-input-group">%</Label>
                                </div>
                              </td>
                              <td>


                                <div className="input-step">
                                  <button type="button" name={`ligne[${i}].dli_qty`} className="minus" value={parseInt(validation.values?.ligne[i]?.dli_qty) - 1} onClick={(e) => { handleChangeValue(e, i) }}>
                                    –
                                  </button>
                                  <Input
                                    type="number"
                                    className="product-quantity"
                                    id="product-qty-1"
                                    value={validation.values?.ligne[i]?.dli_qty || 0}
                                    name={`ligne[${i}].dli_qty`}
                                    onChange={(e) => { handleChangeValue(e, i) }}
                                    onBlur={validation.handleBlur}
                                  />
                                  <button type="button" name={`ligne[${i}].dli_qty`} value={parseInt(validation.values?.ligne[i]?.dli_qty) + 1} className="plus" onClick={(e) => { handleChangeValue(e, i) }}>
                                    +
                                  </button>
                                </div>


                              </td>
                              <td className="text-end">
                                <div className="input-group">
                                  <Input
                                    type="text"
                                    className="form-control bg-light border-0 product-line-price"
                                    id="productPrice-1"
                                    placeholder="€0.00"
                                    value={"€" + rounded(validation.values?.ligne[i]?.dli_total_ht, 2)}
                                    readOnly
                                  />
                                  <Label className="btn btn-primary btn-input-group">ht</Label>
                                </div>
                                <div className="input-group mt-2">
                                  <Input
                                    type="text"
                                    className="form-control bg-light border-0 product-line-price"
                                    placeholder="€0.00"
                                    value={"€" + rounded(validation.values?.ligne[i]?.dli_total_ttc, 2)}
                                    readOnly
                                  />
                                  <Label className="btn btn-primary btn-input-group">ttc</Label>
                                </div>
                              </td>
                              <td className="product-removal text-end">

                                <Link onClick={() => {
                                  deleteLigne(i)

                                }}
                                  to="#" className="btn btn-danger">
                                  <i className="las la-trash"></i>
                                </Link>
                              </td>
                            </tr>
                          )
                        })

                        }

                      </tbody>
                      <tbody>
                        <tr id="newForm" style={{}}><td className="d-none" colSpan="5"><p>Add New Form</p></td></tr>
                        <tr>
                          <td colSpan="5">
                            <Link
                              to="#"
                              onClick={() => {

                                validation.setValues({
                                  ...validation.values, ligne: [
                                    ...validation.values.ligne,
                                    { ...initialValueLigne }
                                  ]
                                })
                              }
                              }
                              className="btn btn-soft-secondary fw-medium"
                              id="add-item"
                            >
                              <i className="ri-add-fill me-1 align-bottom"></i>{" "}
                              Ajouter
                            </Link>
                          </td>
                        </tr>
                        <tr className="border-top border-top-dashed mt-2">
                          <td colSpan="5"></td>
                          <td colSpan="2" className="p-0">
                            <Table className="table-borderless table-sm table-nowrap align-middle mb-0">
                              <tbody>
                                <tr>
                                  <th scope="row">Sous total (ht)</th>
                                  <td style={{ width: "150px" }}>
                                    <Input
                                      type="text"
                                      className="form-control bg-light border-0"
                                      id="cart-subtotal"
                                      placeholder="€0.00"
                                      readOnly
                                      value={"€" + rounded(validation.values.header.den_total_ht, 2)}
                                    />
                                  </td>
                                </tr>
                                <tr>
                                  <th scope="row">Total remise</th>
                                  <td>
                                    <Input
                                      type="text"
                                      className="form-control bg-light border-0"
                                      id="cart-tax"
                                      placeholder="$0.00"
                                      readOnly
                                      value={"€" + rounded(validation.values.header.den_total_remise, 2)}
                                    />
                                  </td>
                                </tr>
                                {/* <tr>
                                  <th scope="row">
                                    Discount{" "}
                                    <small className="text-muted">
                                      (Coutanto15)
                                    </small>
                                  </th>
                                  <td>
                                    <Input
                                      type="text"
                                      className="form-control bg-light border-0"
                                      id="cart-discount"
                                      placeholder="$0.00"
                                      readOnly
                                      value={"€" + dis}
                                    />
                                  </td>
                                </tr> */}
                                <tr>
                                  <th scope="row">Total TVA</th>
                                  <td>
                                    <Input
                                      type="text"
                                      className="form-control bg-light border-0"
                                      id="cart-shipping"
                                      placeholder="$0.00"
                                      readOnly
                                      value={"€" + rounded(validation.values.header.den_total_tva, 2)}
                                    />
                                  </td>
                                </tr>
                                <tr className="border-top border-top-dashed">
                                  <th scope="row">Total (TTC)</th>
                                  <td>
                                    <Input
                                      type="text"
                                      className="form-control bg-light border-0"
                                      id="cart-total"
                                      placeholder="$0.00"
                                      readOnly
                                      value={"€" + rounded(validation.values.header.den_total_ttc, 2)}
                                    />
                                  </td>
                                </tr>
                              </tbody>
                            </Table>
                          </td>
                        </tr>
                      </tbody>
                    </Table>
                  </div>

                  <div className="mt-4">
                    <Label
                      for="exampleFormControlTextarea1"
                      className="form-label text-muted text-uppercase fw-semibold"
                    >
                      NOTES
                    </Label>
                    <Input
                      type="textarea"
                      className="form-control alert alert-info"
                      name="header.den_note"
                      id="exampleFormControlTextarea1"
                      placeholder="Notes"
                      rows="2"
                      value={validation.values?.header?.den_note || ""}
                      onBlur={validation.handleBlur}
                      onChange={validation.handleChange}
                    />
                  </div>
                  <div className="hstack gap-2 justify-content-end d-print-none mt-4">
                    <button type="submit" className="btn btn-success">
                      <i className="ri-printer-line align-bottom me-1"></i> Enregister
                    </button>
                    {/* <Link to="#" className="btn btn-primary">
                      <i className="ri-download-2-line align-bottom me-1"></i>{" "}
                      Télécharger
                    </Link>
                    <Link to="#" className="btn btn-danger">
                      <i className="ri-send-plane-fill align-bottom me-1"></i>{" "}
                      Envoyer
                    </Link> */}
                  </div>
                </CardBody>
              </Form>
            </Card>
          </Col>
        </Row>
        <Modal id="showModal" isOpen={modal} toggle={toggle} centered>
          <ModalHeader className="bg-soft-info p-3" toggle={toggle}>
            Séléctionner un client
          </ModalHeader>


          <ModalBody>

            <Row className="g-3">
              <Input type="text"
                className="form-control bg-light border-0"
                id="cart-total"
                placeholder="Recherche par nom, téléphone, email..."

                onChange={(e) => { setSearchValue(e.target.value) }}
                value={searchValue}
              />
              <SimpleBar autoHide={false} style={{ maxHeight: "220px" }} className="px-3">
                {handleListClient()?.map((c, i) => {
                  return (
                    <div key={i} style={{ display: "flex", alignItems: "center", width: "100%", borderBottom: "0.5px solid #dddddd", margin: 3 }}>
                      <div className="flex-shrink-0">
                        {c.ent_img_url ? <img
                          src={api.API_URL + "/images/" + c.ent_img_url}
                          alt=""
                          className="avatar-xxs rounded-circle"
                        /> :
                          <div className="flex-shrink-0 avatar-xs me-2">
                            <div className="avatar-title bg-soft-success text-success rounded-circle fs-13">
                              {c.ent_name.charAt(0)}
                            </div>
                          </div>
                        }
                      </div>
                      <div style={{ cursor: "pointer", padding: 8, display: "flex", flexDirection: "column", width: "100%" }} onClick={() => { setModal(() => false); setCollaborateur(c) }} key={i}>

                        <span>{c.ent_name}</span>
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                          <span><i>{c.ent_email}</i></span>  <span><i>{c.ent_phone}</i></span>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </SimpleBar>
            </Row>
          </ModalBody>
          <ModalFooter>
            <div className="hstack gap-2 justify-content-end">
              <button type="button" className="btn btn-light" onClick={() => { setModal(false); }} > Fermer </button>
              <button type="submit" className="btn btn-success" id="add-btn" > Séléctionner </button>
            </div>
          </ModalFooter>

        </Modal>
        <Modal id="showModal" isOpen={modalProduct} toggle={toggleModalProduct} centered>
          <ModalHeader className="bg-soft-info p-3" toggle={toggleModalProduct}>
            Séléctionner un produit
          </ModalHeader>


          <ModalBody>

            <Row className="g-3">
              <Input type="text"
                className="form-control bg-light border-0"
                id="cart-total"
                placeholder="Recherche par nom"

                onChange={(e) => { setSearchValueProduct(e.target.value) }}
                value={searchValueProduct}
              />
              <SimpleBar autoHide={false} style={{ maxHeight: "220px" }} className="px-3">
                <div style={{ cursor: "pointer", zIndex: 5000, padding: 8, borderBottom: "0.5px solid #dddddd" }}>
                  <Row>
                    <Col lg={6}><b>Nom</b></Col>
                    <Col className="text-end" lg={2}><b>Tva</b></Col>
                    <Col className="text-end" lg={4}><b>Prix</b></Col>
                  </Row>
                </div>
                {
                  products.filter((product) => product.pro_name.includes(searchValueProduct)).map((p, key) => {
                    return (
                      <div style={{ cursor: "pointer", zIndex: 5000, padding: 8, borderBottom: "0.5px solid #dddddd" }}
                        onClick={() => {
                          let newData = {
                            ...initialValueLigne,
                            dli_tva: p.pro_tva,
                            dli_name: p.pro_name,
                            dli_detail: p.pro_detail,
                            dli_unit_ht: p.pro_prix,
                          }


                          validation.setValues({
                            ...validation.values,
                            ligne: validation.values.ligne.map((l, lingeIndex) => { return selectedLigne == lingeIndex ? newData : l })
                          })

                        }}
                        key={key}
                      >
                        <Row>
                          <Col lg={6}>{p.pro_name}</Col>
                          <Col className="text-end" lg={2}>{p.pro_tva}%</Col>
                          <Col className="text-end" lg={4}>{p.pro_prix}€</Col>
                        </Row>
                      </div>
                    )
                  })


                }
              </SimpleBar>
            </Row>
          </ModalBody>
          <ModalFooter>
            <div className="hstack gap-2 justify-content-end">
              <button type="button" className="btn btn-light" onClick={() => { setModalProduct(false); }} > Fermer </button>
            </div>
          </ModalFooter>

        </Modal>
      </Container>
    </div >
  );
};

export default InvoiceCreate;
