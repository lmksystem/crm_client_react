import React, { useEffect, useState } from "react";
import { Button, Card, CardBody, CardHeader, Col, Container, Form, FormFeedback, Input, Label, Row, Table } from "reactstrap";
import BreadCrumb from "../../../Components/Common/BreadCrumb";

import { useDispatch } from "react-redux";
import moment from "moment";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import DeleteModal from "../../../Components/Common/DeleteModal";
import SimpleBar from "simplebar-react";
import { useParams } from "react-router-dom";
import { getImage } from "../../../utils/getImages";

const africanCountries = [
  "Algérie",
  "Angola",
  "Bénin",
  "Botswana",
  "Burkina Faso",
  "Burundi",
  "Cameroun",
  "Cap-Vert",
  "République centrafricaine",
  "Tchad",
  "Comores",
  "Congo (Brazzaville)",
  "Congo (Kinshasa)",
  "Côte d'Ivoire",
  "Djibouti",
  "Égypte",
  "Guinée équatoriale",
  "Érythrée",
  "Éthiopie",
  "Gabon",
  "Gambie",
  "Ghana",
  "Guinée",
  "Guinée-Bissau",
  "Côte d'Ivoire",
  "Kenya",
  "Lesotho",
  "Libéria",
  "Libye",
  "Madagascar",
  "Malawi",
  "Mali",
  "Mauritanie",
  "Maurice",
  "Mayotte",
  "Maroc",
  "Mozambique",
  "Namibie",
  "Niger",
  "Nigeria",
  "Rwanda",
  "Réunion",
  "Sao Tomé-et-Principe",
  "Sénégal",
  "Seychelles",
  "Sierra Leone",
  "Somalie",
  "Afrique du Sud",
  "Soudan du Sud",
  "Soudan",
  "Swaziland",
  "Tanzanie",
  "Togo",
  "Tunisie",
  "Ouganda",
  "Sahara occidental",
  "Zambie",
  "Zimbabwe"
];

moment.locale("fr");

const FormCompany = () => {
  const dispatch = useDispatch();

  const { id } = useParams();

  const [company, setCompany] = useState(null);
  const [license, setLicense] = useState([]);
  const [modules, setModules] = useState(null);
  const [image, setImage] = useState("");
  const [numEntreprise, setNumEntreprise] = useState("Identifiant d'entreprise");
  const [addActifView, setAddActifView] = useState(false);
  const [selectedId, setSelectedId] = useState(false);
  const [showModalDelete, setShowModalDelete] = useState(false);

  const validation = useFormik({
    enableReinitialize: true,
    initialValues: {
      com_id: company?.com_id,
      com_name: company?.com_name || "",
      com_adresse: company?.com_adresse || "",
      com_ville: company?.com_ville || "",
      com_cp: company?.com_cp || "",
      com_email: company?.com_email || "",
      com_phone: company?.com_phone || "",
      com_naf: company?.com_naf || "",
      com_conv_name: company?.com_conv_name || "",
      com_conv_num: company?.com_conv_num || "",
      com_siren: company?.com_siren || "",
      com_bank_acc: company?.com_bank_acc || "",
      com_nif: company?.com_nif || ""
    },

    validationSchema: Yup.object({
      com_name: Yup.string().required("Veuillez entrer un nom d'entreprise"),
      com_adresse: Yup.string().required("Veuillez entrer une adresse"),
      com_ville: Yup.string().required("Veuillez entrer une ville"),
      com_cp: Yup.string().required("Veuillez entrer un code postal"),
      com_email: Yup.string().required("Veuillez entrer un email"),
      com_phone: Yup.string().required("Veuillez entrer un numéro de téléphone")
    }),

    onSubmit: (values) => {
      dispatch(onUpdateCompany(values));
    }
  });

  // const validationUser = useFormik({
  //   enableReinitialize: true,
  //   initialValues: {
  //     use_rank: 3,
  //     use_lastname: "",
  //     use_firstname: "",
  //     use_email: ""
  //   },

  //   validationSchema: Yup.object({
  //     use_lastname: Yup.string().required("Veuillez entrer un nom d'entreprise"),
  //     use_firstname: Yup.string().required("Veuillez entrer une adresse"),
  //     use_email: Yup.string().required("Veuillez entrer une ville")
  //   }),

  //   onSubmit: (values) => {
  //     if (license.length < 5) {
  //       dispatch(onAddLicense(values));
  //       setAddActifView(false);
  //     } else {
  //       toast.error(`Nombre de licence atteint (Max: ${company.com_license_nb})`, { autoClose: 3000 });
  //     }
  //   }
  // });

  const changeModule = (moduleId) => {
    axios
      .post("/v1/admin/modules", { com_mod_fk: moduleId, com_id: company.com_id })
      .then((res) => {
        setCompany({ ...company, com_mod_fk: moduleId });
      })
      .catch((err) => {
        toast.error("Un erreur s'est produite");
        console.log(err);
      });
  };

  useEffect(() => {
    if (company) {
      if (company.com_logo) {
        let path = (company.com_id + "/" + company.com_logo).replaceAll("/", " ");

        getImage(path).then((response) => {
          setImage("data:image/png;base64," + response);
        });
      }
      if (company.com_pays == "France") {
        setNumEntreprise("Siren");
      } else if (company.com_pays == "Belgium") {
        setNumEntreprise("Numéro d’entreprise");
      } else if (africanCountries.includes(company.com_pays)) {
        setNumEntreprise("NINEA");
      } else {
        setNumEntreprise("Identifiant d'entreprise");
      }
    }
  }, [company]);

  useEffect(() => {
    axios
      .get(`/v1/admin/company/${id}`)
      .then((res) => {
        setCompany(res);
        validation.setValues(res);
      })
      .catch((err) => {
        toast.error("Une erreur s'est produite");
        console.log(err);
      });
  }, []);

  useEffect(() => {
    axios.get(`/v1/admin/modules`).then((res) => {
      console.log(res);
      setModules(res);
    });
  }, []);

  useEffect(() => {
    axios.get(`/v1/admin/licences/${id}`).then((res) => {
      setLicense(res);
    });
  }, []);
  
  return (
    <React.Fragment>
      <div className="page-content">
        <ToastContainer
          closeButton={false}
          limit={1}
        />

        <Container fluid>
          <BreadCrumb
            title="Entreprise"
            pageTitle="Admin"
          />
        </Container>

        <Card>
          <CardHeader>
            <Row>
              <Col
                lg={6}
                className="d-flex">
                <div className="profile-user mx-auto  mb-3">
                  <Label
                    for="profile-img-file-input"
                    className="d-block">
                    <span
                      className="overflow-hidden border border-dashed d-flex align-items-center justify-content-center rounded"
                      style={{ height: "auto", minHeight: 80, width: "356px" }}>
                      {company?.com_logo ? (
                        <img
                          src={image}
                          className="card-logo user-profile-image img-fluid"
                          alt="logo light"
                          width="260"
                        />
                      ) : (
                        <i>Aucun logo</i>
                      )}
                    </span>
                  </Label>
                </div>
              </Col>
              <Col lg={6}>
                <select
                  onChange={(e) => changeModule(e.target.value)}
                  value={company?.com_mod_fk}
                  className="form-control">
                  {modules &&
                    modules.map((module) => {
                      return <option value={module.mod_id}>{module.mod_name}</option>;
                    })}
                </select>
              </Col>
            </Row>
          </CardHeader>
          <CardBody>
            <Form
              onSubmit={(e) => {
                e.preventDefault();

                return false;
              }}
              action="#">
              <Row>
                <Col
                  lg={12}
                  className="mb-3">
                  <Label
                    htmlFor="email"
                    className="form-label">
                    Nom de l'entreprise
                  </Label>
                  <Input
                    disabled
                    name="com_name"
                    className="form-control"
                    placeholder="Entrer un nom"
                    type={"text"}
                    onChange={validation.handleChange}
                    onBlur={validation.handleBlur}
                    value={validation.values.com_name || ""}
                    invalid={validation.touched.com_name && validation.errors.com_name ? true : false}
                  />
                  {validation.touched.com_name && validation.errors.com_name ? <FormFeedback type="invalid">{validation.errors.com_name}</FormFeedback> : null}
                </Col>
                <Col
                  lg={5}
                  className="mb-3">
                  <Label
                    htmlFor="email"
                    className="form-label">
                    Adresse
                  </Label>
                  <Input
                    disabled
                    name="com_adresse"
                    className="form-control"
                    placeholder="Entrer une adresse"
                    type={"text"}
                    onChange={validation.handleChange}
                    onBlur={validation.handleBlur}
                    value={validation.values.com_adresse || ""}
                    invalid={validation.touched.com_adresse && validation.errors.com_adresse ? true : false}
                  />
                  {validation.touched.com_adresse && validation.errors.com_adresse ? <FormFeedback type="invalid">{validation.errors.com_adresse}</FormFeedback> : null}
                </Col>
                <Col
                  lg={4}
                  className="mb-3">
                  <Label
                    htmlFor="email"
                    className="form-label">
                    Ville
                  </Label>
                  <Input
                    disabled
                    name="com_ville"
                    className="form-control"
                    placeholder="Entrer une ville"
                    type={"text"}
                    onChange={validation.handleChange}
                    onBlur={validation.handleBlur}
                    value={validation.values.com_ville || ""}
                    invalid={validation.touched.com_ville && validation.errors.com_ville ? true : false}
                  />
                  {validation.touched.com_ville && validation.errors.com_ville ? <FormFeedback type="invalid">{validation.errors.com_ville}</FormFeedback> : null}
                </Col>
                <Col
                  lg={3}
                  className="mb-3">
                  <Label
                    htmlFor="email"
                    className="form-label">
                    Code postal
                  </Label>
                  <Input
                    disabled
                    name="com_cp"
                    className="form-control"
                    placeholder="Entrer un code postal"
                    type={"text"}
                    onChange={validation.handleChange}
                    onBlur={validation.handleBlur}
                    value={validation.values.com_cp || ""}
                    invalid={validation.touched.com_cp && validation.errors.com_cp ? true : false}
                  />
                  {validation.touched.com_cp && validation.errors.com_cp ? <FormFeedback type="invalid">{validation.errors.com_cp}</FormFeedback> : null}
                </Col>
                <Col
                  lg={6}
                  className="mb-3">
                  <Label
                    htmlFor="email"
                    className="form-label">
                    Email
                  </Label>
                  <Input
                    disabled
                    name="com_email"
                    className="form-control"
                    placeholder="Entrer un email"
                    type={"text"}
                    onChange={validation.handleChange}
                    onBlur={validation.handleBlur}
                    value={validation.values.com_email || ""}
                    invalid={validation.touched.com_email && validation.errors.com_email ? true : false}
                  />
                  {validation.touched.com_email && validation.errors.com_email ? <FormFeedback type="invalid">{validation.errors.com_email}</FormFeedback> : null}
                </Col>
                <Col
                  lg={6}
                  className="mb-3">
                  <Label
                    htmlFor="email"
                    className="form-label">
                    Téléphone
                  </Label>
                  <Input
                    disabled
                    name="com_phone"
                    className="form-control"
                    placeholder="Entrer un téléphone"
                    type={"text"}
                    onChange={validation.handleChange}
                    onBlur={validation.handleBlur}
                    value={validation.values.com_phone || ""}
                    invalid={validation.touched.com_phone && validation.errors.com_phone ? true : false}
                  />
                  {validation.touched.com_phone && validation.errors.com_phone ? <FormFeedback type="invalid">{validation.errors.com_phone}</FormFeedback> : null}
                </Col>

                <Col
                  lg={6}
                  className="mb-3">
                  <Label className="form-label">{numEntreprise}</Label>
                  <Input
                    disabled
                    name="com_siren"
                    className="form-control"
                    placeholder={`Entrer votre ${numEntreprise}`}
                    type={"text"}
                    onChange={validation.handleChange}
                    onBlur={validation.handleBlur}
                    value={validation.values.com_siren || ""}
                    invalid={validation.touched.com_siren && validation.errors.com_siren ? true : false}
                  />
                  {validation.touched.com_siren && validation.errors.com_siren ? <FormFeedback type="invalid">{validation.errors.com_siren}</FormFeedback> : null}
                </Col>
                <Col
                  lg={6}
                  className="mb-3">
                  <Label className="form-label">Compte bancaire</Label>
                  <Input
                    disabled
                    name="com_bank_acc"
                    className="form-control"
                    placeholder={`Entrer votre compte bancaire`}
                    type={"text"}
                    onChange={validation.handleChange}
                    onBlur={validation.handleBlur}
                    value={validation.values.com_bank_acc || ""}
                    invalid={validation.touched.com_bank_acc && validation.errors.com_bank_acc ? true : false}
                  />
                  {validation.touched.com_bank_acc && validation.errors.com_bank_acc ? <FormFeedback type="invalid">{validation.errors.com_bank_acc}</FormFeedback> : null}
                </Col>
                {company?.com_pays?.toLowerCase() == "france" && (
                  <>
                    <Col
                      lg={2}
                      className="mb-3">
                      <Label
                        htmlFor="email"
                        className="form-label">
                        Code NAF
                      </Label>
                      <Input
                        disabled
                        name="com_naf"
                        className="form-control"
                        placeholder="Entrer votre code NAF"
                        type={"text"}
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.com_naf || ""}
                        invalid={validation.touched.com_naf && validation.errors.com_naf ? true : false}
                      />
                      {validation.touched.com_naf && validation.errors.com_naf ? <FormFeedback type="invalid">{validation.errors.com_naf}</FormFeedback> : null}
                    </Col>
                    <Col
                      lg={5}
                      className="mb-3">
                      <Label
                        htmlFor="email"
                        className="form-label">
                        Nom de convention
                      </Label>
                      <Input
                        disabled
                        name="com_conv_name"
                        className="form-control"
                        placeholder="Entrer un nom de convention"
                        type={"text"}
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.com_conv_name || ""}
                        invalid={validation.touched.com_conv_name && validation.errors.com_conv_name ? true : false}
                      />
                      {validation.touched.com_conv_name && validation.errors.com_conv_name ? <FormFeedback type="invalid">{validation.errors.com_conv_name}</FormFeedback> : null}
                    </Col>
                    <Col
                      lg={5}
                      className="mb-3">
                      <Label
                        htmlFor="email"
                        className="form-label">
                        Numéro de convention
                      </Label>
                      <Input
                        disabled
                        name="com_conv_num"
                        className="form-control"
                        placeholder="Entrer un numéro de convention"
                        type={"text"}
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.com_conv_num || ""}
                        invalid={validation.touched.com_conv_num && validation.errors.com_conv_num ? true : false}
                      />
                      {validation.touched.com_conv_num && validation.errors.com_conv_num ? <FormFeedback type="invalid">{validation.errors.com_conv_num}</FormFeedback> : null}
                    </Col>
                  </>
                )}

                <Col
                  lg={6}
                  className="mb-3">
                  <Label
                    htmlFor="com_nif"
                    className="form-label">
                    NIF
                  </Label>
                  <Input
                    disabled
                    name="com_nif"
                    className="form-control"
                    placeholder="Entre un code NIF"
                    type={"text"}
                    onChange={validation.handleChange}
                    onBlur={validation.handleBlur}
                    value={validation.values.com_nif || ""}
                    invalid={validation.touched.com_nif && validation.errors.com_nif ? true : false}
                  />
                  {validation.touched.com_nif && validation.errors.com_nif ? <FormFeedback type="invalid">{validation.errors.com_nif}</FormFeedback> : null}
                </Col>
              </Row>
            </Form>
          </CardBody>
        </Card>
        <Card>
          <CardHeader>
            <h4>Utilisateurs</h4>
          </CardHeader>
          <CardBody>
            <div>
              <SimpleBar autoHide={false}>
                <Table className="table-nowrap align-middle mb-0 ms-auto mt-3">
                  <thead>
                    <tr className="table-active">
                      <th scope="col">#</th>
                      <th scope="col">Nom</th>
                      <th scope="col">Prénom</th>
                      <th scope="col">Email</th>
                      <th scope="col">Type</th>
                    </tr>
                  </thead>
                  <tbody className="border-bottom border-bottom-dashed fs-15">
                    {license.length > 0 &&
                      license.map((element, index) => {
                        return (
                          <tr key={index + 1}>
                            <td>#{index + 1}</td>
                            <td>{element.use_lastname}</td>
                            <td>{element.use_firstname}</td>
                            <td>{element.use_email}</td>
                            <td>{element.use_rank == 0 ? "Propriétaire du compte" : "Utilisateur"}</td>
                          </tr>
                        );
                      })}
                  </tbody>
                </Table>

                {!license.length && (
                  <Row>
                    <Col
                      xl={12}
                      className="mt-3 mb-3 text-center">
                      <i>Aucun utilisateur ajouter</i>
                    </Col>
                  </Row>
                )}

                <form
                  className="d-print-none"
                  onSubmit={(e) => {
                    e.preventDefault();
                    validationUser.handleSubmit();
                    return false;
                  }}>
                  {addActifView ? (
                    <Row>
                      <Col lg={3}>
                        <Input
                          disabled
                          type="text"
                          className="form-control border-1 mb-2"
                          id="use_lastname"
                          name="use_lastname"
                          value={validationUser.values.use_lastname || ""}
                          onBlur={validationUser.handleBlur}
                          onChange={validationUser.handleChange}
                          invalid={validationUser.errors?.use_lastname && validationUser.touched?.use_lastname ? true : false}
                          placeholder="Nom"
                        />
                        {validationUser.errors?.use_lastname && validationUser.touched?.use_lastname ? <FormFeedback type="invalid">{validationUser.errors?.use_lastname}</FormFeedback> : null}
                      </Col>
                      <Col lg={3}>
                        <Input
                          disabled
                          type="text"
                          className="form-control border-1 mb-2"
                          id="use_firstname"
                          name="use_firstname"
                          value={validationUser.values.use_firstname || ""}
                          onBlur={validationUser.handleBlur}
                          onChange={validationUser.handleChange}
                          placeholder="Prénom"
                          invalid={validationUser.errors?.use_firstname && validationUser.touched?.use_firstname ? true : false}
                        />
                        {validationUser.errors?.use_firstname && validationUser.touched?.use_firstname ? <FormFeedback type="invalid">{validationUser.errors?.use_firstname}</FormFeedback> : null}
                      </Col>
                      <Col lg={2}>
                        <Input
                          disabled
                          type="email"
                          className="form-control border-1 mb-2"
                          id="use_email"
                          name="use_email"
                          value={validationUser.values.use_email || ""}
                          onBlur={validationUser.handleBlur}
                          onChange={validationUser.handleChange}
                          placeholder="Email"
                          invalid={validationUser.errors?.use_email && validationUser.touched?.use_email ? true : false}
                        />
                        {validationUser.errors?.use_email && validationUser.touched?.use_email ? <FormFeedback type="invalid">{validationUser.errors?.use_email}</FormFeedback> : null}
                      </Col>
                      <Col
                        lg={4}
                        className="d-flex">
                        <div className="w-50 pr-1">
                          <button
                            type="submit"
                            className=" px-2 btn btn-secondary w-100">
                            Enregistrer
                          </button>
                        </div>
                        <div className="w-50 ps-1">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              setAddActifView(() => false);
                            }}
                            className="btn btn-danger w-100">
                            Annuler
                          </button>
                        </div>
                      </Col>
                    </Row>
                  ) : (
                    ""
                  )}
                </form>
              </SimpleBar>
            </div>
          </CardBody>
        </Card>
      </div>
    </React.Fragment>
  );
};

export default FormCompany;
