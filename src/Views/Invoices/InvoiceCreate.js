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

import { Link, useNavigate } from "react-router-dom";
import Flatpickr from "react-flatpickr";

import BreadCrumb from "../../Components/Common/BreadCrumb";
import Select from "react-select";

import logoDark from "../../assets/images/logo-dark.png";
import logoLight from "../../assets/images/logo-light.png";

//formik
import { useFormik } from "formik";
import * as Yup from "yup";

//redux
import { useDispatch, useSelector } from "react-redux";
import {
  addNewInvoice as onAddNewInvoice,
  getCollaborateurs as onGetCollaborateurs,
  getCompany as onGetCompany,
  getTva as onGetTva,
} from "../../slices/thunks";
import SimpleBar from "simplebar-react";
import { parseInt } from "lodash";


const InvoiceCreate = () => {
  const { collaborateurs, company, tva } = useSelector((state) => ({
    collaborateurs: state.Gestion.collaborateurs,
    company: state.Company.company[0],
    tva: state.Gestion.tva,
  }));

  const dispatch = useDispatch();
  const history = useNavigate();

  const [isTva, setisTva] = useState(0);

  const [collaborateur, setCollaborateur] = useState(null);

  const [modal, setModal] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const tvaList = [
    {
      options: tva?.map((e) => ({ label: e.tva_value + "%", value: e.tva_value })),
    },
  ];

  const allstatus = [
    {
      options: [
        { label: "Select Payment Status", value: "" },
        { label: "Impayé", value: "Impayé" },
        { label: "Payé", value: "Payé" },
        { label: "Annulé", value: "Annulé" },
        { label: "Remboursé", value: "Remboursé" },
      ],
    },
  ];

  const initialValueLigne = {
    fli_name: "",
    fli_unit_ht: 0,
    fli_unit_ttc: 0,
    fli_total_ht: 0,
    fli_total_ttc: 0,
    fli_qty: 0,
    fli_tva: 0,
    fli_total_tva: 0,
    fli_pourcent_remise: 0,
    fli_total_remise: 0,
    fli_unit_remise: 0,
  }

  const toggle = useCallback(() => {
    if (modal) {
      setModal(false);
    } else {
      setModal(true);
    }
  }, [modal]);

  const dateFormat = () => {
    let d = new Date(),
      months = ['Jan', 'Feb', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aou', 'Sep', 'Oct', 'Nov', 'Dec'];
    return ((d.getDate() + ' ' + months[d.getMonth()] + ', ' + d.getFullYear()).toString());
  };

  const [date, setDate] = useState(dateFormat());

  const dateformate = (e) => {
    const date = e.toString().split(" ");
    const joinDate = (date[2] + " " + date[1] + ", " + date[3]).toString();
    setDate(joinDate);
  };

  useEffect(() => {
    if (collaborateurs && !collaborateurs.length) {
      dispatch(onGetCollaborateurs());
      dispatch(onGetCompany());
      dispatch(onGetTva());
    }
  }, [dispatch, collaborateurs]);

  document.title = "Création facture | Countano";

  const validation = useFormik({
    enableReinitialize: true,

    initialValues: {
      contact: {
        // Champs avec "cus" correspond au client
        fco_cus_email: "",
        fco_cus_phone: "",
        fco_cus_address: "",
        fco_cus_city: "",
        fco_cus_cp: "",
        fco_cus_name: "",

        fco_email: (company && company.com_email) || "",
        fco_phone: (company && company.com_phone) || "",
        fco_address: (company && company.com_adresse) || "",
        fco_city: (company && company.com_ville) || "",
        fco_cp: (company && company.com_cp) || "",
        fco_name: (company && company.com_name) || "",
      },
      header: {
        fen_den_fk: "",
        fen_com_fk: "",
        fen_ent_fk: "",
        fen_sujet: "",
        fen_date_expired: "",
        fen_etat: "",
        fen_total_ht: 0,
        fen_total_ttc: 0,
        fen_total_tva: 0,
        fen_total_remise: 0,
        fen_num_fac: company?.com_nb_fac,
      },
      ligne: [

      ]
    },
    validationSchema: Yup.object({
      contact: Yup.object({
        fco_cus_name: Yup.string().required("Champs obligatoire"),
        fco_cus_email: Yup.string().required("Champs obligatoire"),
        fco_cus_phone: Yup.string().required("Champs obligatoire"),
        fco_cus_address: Yup.string().required("Champs obligatoire"),
        fco_cus_city: Yup.string().required("Champs obligatoire"),
        fco_cus_cp: Yup.string().required("Champs obligatoire"),
        fco_name: Yup.string().required("Champs obligatoire"),
        fco_email: Yup.string().required("Champs obligatoire"),
        fco_phone: Yup.string().required("Champs obligatoire"),
        fco_address: Yup.string().required("Champs obligatoire"),
        fco_city: Yup.string().required("Champs obligatoire"),
        fco_cp: Yup.string().required("Champs obligatoire"),

      }),
      header: Yup.object({
        fen_sujet: Yup.string().required("Champs obligatoire"),
        fen_date_expired: Yup.string().required("Champs obligatoire"),
        fen_etat: Yup.string().required("Champs obligatoire"),
        fen_total_ht: Yup.number().required("Champs obligatoire"),
        fen_total_ttc: Yup.number().required("Champs obligatoire"),
        fen_total_tva: Yup.number().required("Champs obligatoire"),
        fen_total_remise: Yup.number().required("Champs obligatoire"),

      }),

    }),
    onSubmit: (values) => {
      console.log(values);
      dispatch(onAddNewInvoice(values));
      history("/factures/liste");
      validation.resetForm();
    },
  });

  const rounded = (number, length = 3) => {
    return parseFloat(parseFloat(number).toFixed(length));
  }

  /**
   * Fonction de recherche d'un client lors de la séléction
   * @returns 
   */
  const handleListClient = () => {
    let data = [...collaborateurs];

    if (searchValue != "") {
      data = data.filter(e =>
        e.ent_name?.toLowerCase()?.includes(searchValue.toLowerCase()) ||
        e.ent_email?.toLowerCase()?.includes(searchValue.toLowerCase()) ||
        e.ent_phone?.toLowerCase()?.includes(searchValue.toLowerCase())
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
          fen_ent_fk: (collaborateur && collaborateur.ent_id) || "",
        },
        contact: {
          ...validation.values.contact,
          fco_cus_email: (collaborateur && collaborateur.ent_email) || "",
          fco_cus_phone: (collaborateur && collaborateur.ent_phone) || "",
          fco_cus_address: (collaborateur && collaborateur.ent_adresse) || "",
          fco_cus_city: (collaborateur && collaborateur.ent_ville) || "",
          fco_cus_cp: (collaborateur && collaborateur.ent_cp) || "",
          fco_cus_name: (collaborateur && collaborateur.ent_name) || "",

        }
      })
    }
  }, [collaborateur]);

  const recalculateLigneData = (ligne) => {
    let { fli_unit_ht, fli_qty, fli_tva, fli_pourcent_remise } = ligne;

    // montant de la remise pour un produit
    let montant_unit_remise = fli_unit_ht * (fli_pourcent_remise / 100);

    // montant de la remise pour la totalité de la ligne 
    let total_remise = montant_unit_remise * fli_qty

    // montant ht d'un produit après application de la remise
    let total_unit_remise_ht = fli_unit_ht - montant_unit_remise;

    // Total de la tva pour un produit remisé
    let total_unit_remise_tva = total_unit_remise_ht * (fli_tva / 100);

    // Montant unitaire d'un produit avant remise
    let total_unit_tva = fli_unit_ht * (fli_tva / 100);

    // Montant total d'un produit ttc
    let total_unit_remise_ttc = total_unit_remise_ht + total_unit_remise_tva;

    // Montant ttc d'un produit avant remise
    let total_unit_ttc = fli_unit_ht + total_unit_tva;

    ligne.fli_total_ht = rounded(fli_qty * total_unit_remise_ht);
    ligne.fli_total_ttc = rounded(fli_qty * total_unit_remise_ttc);
    ligne.fli_unit_remise = rounded(montant_unit_remise);
    ligne.fli_total_remise = rounded(total_remise);
    ligne.fli_total_tva = rounded(fli_qty * total_unit_remise_tva);
    ligne.fli_unit_ttc = rounded(total_unit_ttc);
    return ligne;
  }

  /**
   * Fonction de calcule des prix de l'entete de la facture (total de la facture)
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

      total_ht += ligne.fli_total_ht;
      total_remise += ligne.fli_total_remise;
      total_tva += ligne.fli_total_tva;
      total_ttc += ligne.fli_total_ttc;
    }

    let header = { ...validation.values.header };

    header.fen_total_ht = total_ht;
    header.fen_total_remise = total_remise;
    header.fen_total_tva = total_tva;
    header.fen_total_ttc = total_ttc;

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

  useEffect(() => {
    if (validation.values.ligne.length < 1) {
      validation.setValues({
        ...validation.values,
        ligne: [
          initialValueLigne
        ]
      })
    }

  }, [validation.values.ligne])


  return (
    <div className="page-content">
      <Container fluid>
        <BreadCrumb title="Création facture" pageTitle="Factures" />
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
                              for="fco_name"
                              className="text-muted text-uppercase fw-semibold"
                            >
                              Sujet
                            </Label>
                          </div>
                          <div className="mb-2">
                            <Input
                              type="text"
                              className="form-control border-1"
                              id="fen_sujet"
                              name="header.fen_sujet"
                              value={validation.values.header?.fen_sujet || ""}
                              onBlur={validation.handleBlur}
                              onChange={validation.handleChange}
                              placeholder="Sujet complet"
                              invalid={validation.errors?.header?.fen_sujet && validation.touched?.header?.fen_sujet ? true : false}
                            />
                            {validation.errors?.header?.fen_sujet && validation.touched?.header?.fen_sujet ? (
                              <FormFeedback type="invalid">{validation.errors?.header?.fen_sujet}</FormFeedback>
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
                            for="fco_name"
                            className="text-muted text-uppercase fw-semibold"
                          >
                            Mes informations
                          </Label>
                        </div>
                        <div className="mb-2">
                          <Input
                            type="text"
                            className="form-control border-1"
                            id="fco_name"
                            name="contact.fco_name"
                            value={validation.values.contact.fco_name || ""}
                            onBlur={validation.handleBlur}
                            onChange={validation.handleChange}
                            placeholder="Nom complet"
                            invalid={validation.errors?.contact?.fco_name && validation.touched?.contact?.fco_name ? true : false}
                          />
                          {validation.errors?.contact?.fco_name && validation.touched?.contact?.fco_name ? (
                            <FormFeedback type="invalid">{validation.errors?.contact?.fco_name}</FormFeedback>
                          ) : null}

                        </div>
                        <div className="mb-2">
                          <Input
                            type="textarea"
                            className="form-control border-1"
                            id="billingAddress"
                            name="contact.fco_address"
                            value={validation.values.contact.fco_address || ""}
                            onBlur={validation.handleBlur}
                            onChange={validation.handleChange}
                            rows="3"
                            placeholder="Adresse"
                            invalid={validation.errors?.contact?.fco_address && validation.touched?.contact?.fco_address ? true : false}
                          />
                          {validation.errors?.contact?.fco_address && validation.touched?.contact?.fco_address ? (
                            <FormFeedback type="invalid">{validation.errors?.contact?.fco_address}</FormFeedback>
                          ) : null}

                        </div>
                        <div className="mb-2">
                          <Input
                            type="text"
                            className="form-control border-1"
                            id="fco_cp"
                            name="contact.fco_cp"
                            value={validation.values.contact.fco_cp || ""}
                            onBlur={validation.handleBlur}
                            onChange={validation.handleChange}
                            placeholder="Code postal"
                            invalid={validation.errors?.contact?.fco_cp && validation.touched?.contact?.fco_cp ? true : false}
                          />
                          {validation.errors?.contact?.fco_cp && validation.touched?.contact?.fco_cp ? (
                            <FormFeedback type="invalid">{validation.errors?.contact?.fco_cp}</FormFeedback>
                          ) : null}

                        </div>
                        <div className="mb-2">
                          <Input
                            type="text"
                            className="form-control border-1"
                            id="fco_city"
                            name="contact.fco_city"
                            value={validation.values.contact.fco_city || ""}
                            onBlur={validation.handleBlur}
                            onChange={validation.handleChange}
                            placeholder="Ville"
                            invalid={validation.errors?.contact?.fco_city && validation.touched?.contact?.fco_city ? true : false}
                          />
                          {validation.errors?.contact?.fco_city && validation.touched?.contact?.fco_city ? (
                            <FormFeedback type="invalid">{validation.errors?.contact?.fco_city}</FormFeedback>
                          ) : null}

                        </div>
                        <div className="mb-2">
                          <Input
                            type="text"
                            className="form-control border-1"
                            data-plugin="cleave-phone"
                            id="fco_phone"
                            name="contact.fco_phone"
                            value={validation.values.contact.fco_phone || ""}
                            onBlur={validation.handleBlur}
                            onChange={validation.handleChange}
                            placeholder="Téléphone"
                            invalid={validation.errors?.contact?.fco_phone && validation.touched?.contact?.fco_phone ? true : false}
                          />
                          {validation.errors?.contact?.fco_phone && validation.touched?.contact?.fco_phone ? (
                            <FormFeedback type="invalid">{validation.errors?.contact?.fco_phone}</FormFeedback>
                          ) : null}

                        </div>
                        <div className="mb-2">
                          <Input
                            type="text"
                            className="form-control border-1"
                            id="fco_email"
                            name="contact.fco_email"
                            value={validation.values.contact.fco_email || ""}
                            onBlur={validation.handleBlur}
                            onChange={validation.handleChange}
                            placeholder="Email"
                            invalid={validation.errors?.contact?.fco_email && validation.touched?.contact?.fco_email ? true : false}
                          />
                          {validation.errors?.contact?.fco_email && validation.touched?.contact?.fco_email ? (
                            <FormFeedback type="invalid">{validation.errors?.contact?.fco_email}</FormFeedback>
                          ) : null}

                        </div>
                      </Row>
                    </Col>
                    <Col lg={4} sm={6}>
                      <Row>
                        <Col>
                          <div className="title-client">
                            <Label
                              for="fco_cus_name"
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
                                id="fco_cus_name"
                                name="contact.fco_cus_name"
                                value={validation.values.contact.fco_cus_name || ""}
                                onBlur={validation.handleBlur}
                                onChange={validation.handleChange}
                                placeholder="Nom complet"
                                invalid={validation.errors?.contact?.fco_cus_name && validation.touched?.contact?.fco_cus_name ? true : false}
                              />
                              <button onClick={toggle} className="btn btn-primary" type="button" id="button-addon2">+</button>
                              {/* {showCollabDiv &&
                                <datalist id="list-company" style={{ display: "block", position: 'absolute', backgroundColor: 'white', width: "100%", border: "0.5px solid #dddddd", zIndex: 5000, height: "auto", maxHeight: "400px", overflowY: "scroll" }} >
                                  {collaborateurs.filter(e => e.ent_name.includes(validation.values.contact.fco_cus_name)).map((c, i) => {
                                    return (
                                      <option style={{ cursor: "pointer", padding: 8, borderBottom: "0.5px solid #dddddd" }} onClick={() => { setShowCollabDiv(() => false); setCollaborateur(c) }} key={i}>{c.ent_name}</option>
                                    )
                                  })}
                                </datalist>
                              } */}

                            </div>
                            {validation.errors?.contact?.fco_cus_name && validation.touched?.contact?.fco_cus_name ? (
                              <FormFeedback type="invalid">{validation.errors?.contact?.fco_cus_name}</FormFeedback>
                            ) : null}

                          </div>
                          <div className="mb-2">
                            <Input
                              type="textarea"
                              className="form-control border-1"
                              id="fco_cus_address"
                              name="contact.fco_cus_address"
                              value={validation.values.contact.fco_cus_address || ""}
                              onBlur={validation.handleBlur}
                              onChange={validation.handleChange}
                              rows="3"
                              placeholder="Adresse"
                              invalid={validation.errors?.contact?.fco_cus_address && validation.touched?.contact?.fco_cus_address ? true : false}
                            />
                            {validation.errors?.contact?.fco_cus_address && validation.touched?.contact?.fco_cus_address ? (
                              <FormFeedback type="invalid">{validation.errors?.contact?.fco_cus_address}</FormFeedback>
                            ) : null}

                          </div>
                          <div className="mb-2">
                            <Input
                              type="text"
                              className="form-control border-1"
                              id="fco_cp"
                              name="contact.fco_cus_cp"
                              value={validation.values.contact.fco_cus_cp || ""}
                              onBlur={validation.handleBlur}
                              onChange={validation.handleChange}
                              placeholder="Code postal"
                              invalid={validation.errors?.contact?.fco_cus_cp && validation.touched?.contact?.fco_cus_cp ? true : false}
                            />
                            {validation.errors?.contact?.fco_cus_cp && validation.touched?.contact?.fco_cus_cp ? (
                              <FormFeedback type="invalid">{validation.errors?.contact?.fco_cus_cp}</FormFeedback>
                            ) : null}

                          </div>
                          <div className="mb-2">
                            <Input
                              type="text"
                              className="form-control border-1"
                              id="fco_cus_city"
                              name="contact.fco_cus_city"
                              value={validation.values.contact.fco_cus_city || ""}
                              onBlur={validation.handleBlur}
                              onChange={validation.handleChange}
                              placeholder="Ville"
                              invalid={validation.errors?.contact?.fco_cus_city && validation.touched?.contact?.fco_cus_city ? true : false}
                            />
                            {validation.errors?.contact?.fco_cus_city && validation.touched?.contact?.fco_cus_city ? (
                              <FormFeedback type="invalid">{validation.errors?.contact?.fco_cus_city}</FormFeedback>
                            ) : null}

                          </div>
                          <div className="mb-2">
                            <Input
                              type="text"
                              className="form-control border-1"
                              data-plugin="cleave-phone"
                              id="fco_cus_phone"
                              name="contact.fco_cus_phone"
                              value={validation.values.contact.fco_cus_phone || ""}
                              onBlur={validation.handleBlur}
                              onChange={validation.handleChange}
                              placeholder="Téléphone"
                              invalid={validation.errors?.contact?.fco_cus_phone && validation.touched?.contact?.fco_cus_phone ? true : false}
                            />
                            {validation.errors?.contact?.fco_cus_phone && validation.touched?.contact?.fco_cus_phone ? (
                              <FormFeedback type="invalid">{validation.errors?.contact?.fco_cus_phone}</FormFeedback>
                            ) : null}

                          </div>
                          <div className="mb-2">
                            <Input
                              type="text"
                              className="form-control border-1"
                              id="fco_cus_email"
                              name="contact.fco_cus_email"
                              value={validation.values.contact.fco_cus_email || ""}
                              onBlur={validation.handleBlur}
                              onChange={validation.handleChange}
                              placeholder="Email"
                              invalid={validation.errors?.contact?.fco_cus_email && validation.touched?.contact?.fco_cus_email ? true : false}
                            />
                            {validation.errors?.contact?.fco_cus_email && validation.touched?.contact?.fco_cus_email ? (
                              <FormFeedback type="invalid">{validation.errors?.contact?.fco_cus_email}</FormFeedback>
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
                      <Label for="invoicenoInput">Facture N°</Label>
                      <Input
                        type="text"
                        className="form-control bg-light border-0"
                        id="fen_num_fac"
                        name="header.fen_num_fac"
                        value={`${validation.values.header.fen_num_fac}` || ""}
                        onBlur={validation.handleBlur}
                        onChange={validation.handleChange}
                        placeholder="Numéro de facture"
                        invalid={validation.errors?.header?.fen_num_fac && validation.touched?.header?.fen_num_fac ? true : false}
                        readOnly
                      />
                      {validation.errors?.header?.fen_num_fac && validation.touched?.header?.fen_num_fac ? (
                        <FormFeedback type="invalid">{validation.errors?.header?.fen_num_fac}</FormFeedback>
                      ) : null}
                    </Col>
                    <Col lg={3} sm={6}>
                      <div>
                        <Label for="date-field">Date</Label>
                        <Input
                          type="date"
                          name="header.fen_date_expired"
                          id="date-field"
                          className="form-control"
                          placeholder="Select a date"
                          onBlur={validation.handleBlur}
                          onChange={validation.handleChange}
                          value={validation.values.header.fen_date_expired || ""}
                          invalid={validation.errors?.header?.fen_date_expired && validation.touched?.header?.fen_date_expired ? true : false}
                          required
                        />
                        {validation.touched?.header?.fen_date_expired && validation.errors?.header?.fen_date_expired ? (
                          <FormFeedback type="invalid">{validation.errors?.header?.fen_date_expired}</FormFeedback>
                        ) : null}
                      </div>
                    </Col>
                    <Col lg={3} sm={6}>
                      <Label for="choices-payment-status">État</Label>
                      <div className="input-light">

                        <Input
                          name="header.fen_etat"
                          type="select"
                          className="border-1"
                          id="choices-payment-status"
                          onChange={validation.handleChange}
                          onBlur={validation.handleBlur}
                          required
                          value={
                            validation.values.header.fen_etat || ""
                          }
                        >
                          {allstatus.map((item, key) => (
                            <React.Fragment key={key}>
                              {item.options.map((item, key) => (<option value={item.value} key={key}>{item.label}</option>))}
                            </React.Fragment>
                          ))}
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
                          value={"€" + rounded(validation.values.header.fen_total_ttc, 2)}
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
                          let ligneNumber = i + 1;

                          return (
                            <tr key={ligneNumber} id="ligneNumber" className="product">
                              <th scope="row" className="product-id">
                                {ligneNumber}
                              </th>
                              <td className="text-start">
                                <div className="mb-2">
                                  <Input
                                    type="text"
                                    className="form-control border-1"
                                    id={`productName-${i}`}
                                    placeholder="Nom du produit"
                                    name={`ligne[${i}].fli_name`}
                                    value={validation.values?.ligne[i]?.fli_name || ""}
                                    onBlur={validation.handleBlur}
                                    onChange={validation.handleChange}
                                    required
                                  // invalid={validation.errors?.ligne[i]?.fli_name && validation.touched?.ligne[i]?.fli_name ? true : false}
                                  />
                                  {/* {validation.errors?.ligne[ligneNumber]?.fli_name && validation.touched?.ligne[i]?.fli_name ? (
                                    <FormFeedback type="invalid">{validation.errors?.ligne[i]?.fli_name}</FormFeedback>
                                  ) : null} */}

                                </div>
                                <Input
                                  type="textarea"
                                  className="form-control  border-1"
                                  id="productDetails-1"
                                  rows="2"
                                  placeholder="Details du produit"
                                ></Input>
                              </td>
                              <td>
                                <Select
                                  onChange={(option) => {
                                    let event = { target: { value: option.value, name: `ligne[${i}].fli_tva` }, };
                                    handleChangeValue(event, i);
                                  }}
                                  options={tvaList || []}
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
                                    // id="fli_unit_ht" 
                                    step="0.01"
                                    name={`ligne[${i}].fli_unit_ht`}
                                    value={validation.values?.ligne[i]?.fli_unit_ht || ""}
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
                                    // id="fli_unit_ht" 
                                    step="0.01"
                                    name={`ligne[${i}].fli_unit_ht`}
                                    value={validation.values?.ligne[i]?.fli_unit_ttc || ""}
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
                                    name={`ligne[${i}].fli_pourcent_remise`}
                                    value={validation.values?.ligne[i]?.fli_pourcent_remise || ""}
                                    onChange={(e) => handleChangeValue(e, i)}
                                    onBlur={validation.handleBlur} />
                                  <Label className="btn btn-primary btn-input-group">%</Label>
                                </div>
                              </td>
                              <td>


                                <div className="input-step">
                                  <button type="button" name={`ligne[${i}].fli_qty`} className="minus" value={parseInt(validation.values?.ligne[i]?.fli_qty) - 1} onClick={(e) => { handleChangeValue(e, i) }}>
                                    –
                                  </button>
                                  <Input
                                    type="number"
                                    className="product-quantity"
                                    id="product-qty-1"
                                    value={validation.values?.ligne[i]?.fli_qty || 0}
                                    name={`ligne[${i}].fli_qty`}
                                    onChange={(e) => { handleChangeValue(e, i) }}
                                    onBlur={validation.handleBlur}
                                  />
                                  <button type="button" name={`ligne[${i}].fli_qty`} value={parseInt(validation.values?.ligne[i]?.fli_qty) + 1} className="plus" onClick={(e) => { handleChangeValue(e, i) }}>
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
                                    value={"€" + rounded(validation.values?.ligne[i]?.fli_total_ht, 2)}
                                    readOnly
                                  />
                                  <Label className="btn btn-primary btn-input-group">ht</Label>
                                </div>
                                <div className="input-group mt-2">
                                  <Input
                                    type="text"
                                    className="form-control bg-light border-0 product-line-price"
                                    placeholder="€0.00"
                                    value={"€" + rounded(validation.values?.ligne[i]?.fli_total_ttc, 2)}
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
                                      value={"€" + rounded(validation.values.header.fen_total_ht, 2)}
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
                                      value={"€" + rounded(validation.values.header.fen_total_remise, 2)}
                                    />
                                  </td>
                                </tr>
                                {/* <tr>
                                  <th scope="row">
                                    Discount{" "}
                                    <small className="text-muted">
                                      (VELZON15)
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
                                      value={"€" + rounded(validation.values.header.fen_total_tva, 2)}
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
                                      value={"€" + rounded(validation.values.header.fen_total_ttc, 2)}
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
                  {/* <Row className="mt-3">
                    <Col lg={4}>
                      <div className="mb-2">
                        <Label
                          for="choices-payment-type"
                          className="form-label text-muted text-uppercase fw-semibold"
                        >
                          Payment Details
                        </Label>
                        <div className="input-light">
                          <Select
                            value={ispaymentDetails}
                            onChange={() => {
                              handleispaymentDetails();
                            }}
                            options={paymentdetails}
                            name="choices-single-default"
                            id="idStatus"
                            className="bg-light border-0"
                          ></Select>
                        </div>
                      </div>
                      <div className="mb-2">
                        <Input
                          className="form-control bg-light border-0"
                          type="text"
                          id="cardholderName"
                          placeholder="Card Holder Name"
                        />
                      </div>
                      <div className="mb-2">
                        <Input
                          className="form-control bg-light border-0"
                          type="text"
                          id="cardNumber"
                          placeholder="xxxx xxxx xxxx xxxx"
                        />
                      </div>
                      <div>
                        <Input
                          className="form-control  bg-light border-0"
                          type="text"
                          id="amountTotalPay"
                          placeholder="$0.00"
                          readOnly
                        />
                      </div>
                    </Col>
                  </Row> */}
                  <div className="mt-4">
                    {/* <Label
                      for="exampleFormControlTextarea1"
                      className="form-label text-muted text-uppercase fw-semibold"
                    >
                      NOTES
                    </Label>
                    <Input
                      type="textarea"
                      className="form-control alert alert-info"
                      id="exampleFormControlTextarea1"
                      placeholder="Notes"
                      rows="2"
                      defaultValue="All accounts are to be paid within 7 days from receipt of
                      invoice. To be paid by cheque or credit card or direct
                      payment online. If account is not paid within 7 days the
                      credits details supplied as confirmation of work
                      undertaken will be charged the agreed quoted fee noted
                      above."
                    /> */}
                  </div>
                  <div className="hstack gap-2 justify-content-end d-print-none mt-4">
                    <button type="submit" className="btn btn-success">
                      <i className="ri-printer-line align-bottom me-1"></i> Enregister
                    </button>
                    <Link to="#" className="btn btn-primary">
                      <i className="ri-download-2-line align-bottom me-1"></i>{" "}
                      Télécharger
                    </Link>
                    <Link to="#" className="btn btn-danger">
                      <i className="ri-send-plane-fill align-bottom me-1"></i>{" "}
                      Envoyer
                    </Link>
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
                          src={process.env.REACT_APP_API_URL + "/images/" + c.ent_img_url}
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
      </Container>
    </div >
  );
};

export default InvoiceCreate;
