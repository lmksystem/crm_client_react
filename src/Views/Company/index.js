import React, { useEffect, useState } from "react";
import { CardBody, Container, Card, Form, Row, Col, Label, FormFeedback, Input, Button, CardHeader, Table } from "reactstrap";
import BreadCrumb from "../../Components/Common/BreadCrumb";
import * as Yup from "yup";
import { useFormik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import { getCompany as onGetCompany, updateCompany as onUpdateCompany, updateLogoAction as onUpdateLogoAction, addLicense as onAddLicense, getLicense as onGetLicense, deleteLicense as onDeleteLicense } from "../../slices/thunks";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";

import { getImage } from "../../utils/getImages";
import SimpleBar from "simplebar-react";
import DeleteModal from "../../Components/Common/DeleteModal";

const CompanyProfil = () => {
  const dispatch = useDispatch();

  const { companyredux, error, license } = useSelector((state) => ({
    companyredux: state?.Company?.company,
    license: state.Company.license
  }));
  // console.log(license);
  const [company, setCompany] = useState({});

  const [image, setImage] = useState("");
  const [numEntreprise, setNumEntreprise] = useState("Identifiant d'entreprise");
  const [addActifView, setAddActifView] = useState(false);
  const [selectedId, setSelectedId] = useState(false);
  const [showModalDelete, setShowModalDelete] = useState(false);

  useEffect(() => {
    dispatch(onGetCompany());
  }, []);

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

  const validationUser = useFormik({
    enableReinitialize: true,
    initialValues: {
      use_rank: 3,
      use_lastname: "",
      use_firstname: "",
      use_email: ""
    },

    validationSchema: Yup.object({
      use_lastname: Yup.string().required("Veuillez entrer un nom d'entreprise"),
      use_firstname: Yup.string().required("Veuillez entrer une adresse"),
      use_email: Yup.string().required("Veuillez entrer une ville")
    }),

    onSubmit: (values) => {
      dispatch(onAddLicense(values));
      setAddActifView(false);
    }
  });

  const deleteUser = () => {
    dispatch(onDeleteLicense(selectedId));
    setShowModalDelete(false);
  };

  const onSelectFile = (e) => {
    const url = "/v1/company/logo";
    const formData = new FormData();
    console.log(e.target.files[0]);
    formData.append("file", e.target.files[0]);
    const config = {
      headers: {
        "content-type": "multipart/form-data"
      }
    };

    axios.post(url, formData, config).then((response) => {
      dispatch(onUpdateLogoAction(response.data.com_logo));
    });
  };
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

  useEffect(() => {
    if (companyredux?.length > 0) {
      setCompany(companyredux[0]);

      if (companyredux[0].com_logo) {
        let path = (companyredux[0].com_id + "/" + companyredux[0].com_logo).replaceAll("/", " ");
        getImage(path).then((response) => {
          setImage("data:image/png;base64," + response);
        });
      }

      if (companyredux[0].com_pays == "France") {
        setNumEntreprise("Siren");
      } else if (companyredux[0].com_pays == "Belgium") {
        setNumEntreprise("Numéro d’entreprise");
      } else if (africanCountries.includes(companyredux[0].com_pays)) {
        setNumEntreprise("NINEA");
      } else {
        setNumEntreprise("Identifiant d'entreprise");
      }
    }
  }, [companyredux]);

  useEffect(() => {
    dispatch(onGetLicense());
  }, []);

  return (
    <React.Fragment>
      <div className="page-content">
        <ToastContainer
          closeButton={false}
          limit={1}
        />
        <DeleteModal
          show={showModalDelete}
          onCloseClick={() => setShowModalDelete(false)}
          onDeleteClick={() => deleteUser()}
        />
        <Container fluid>
          <BreadCrumb
            title="Entreprise"
            pageTitle="Profil"
          />
        </Container>

        <Card>
          <CardHeader>
            <Row>
              <Col
                lg={12}
                className="d-flex">
                <div className="profile-user mx-auto  mb-3">
                  <Input
                    id="profile-img-file-input"
                    type="file"
                    accept="image/png, image/jpeg"
                    className="profile-img-file-input"
                    onChange={(e) => onSelectFile(e)}
                  />
                  <Label
                    for="profile-img-file-input"
                    className="d-block">
                    <span
                      className="overflow-hidden border border-dashed d-flex align-items-center justify-content-center rounded"
                      style={{ height: "auto", minHeight: 80, width: "356px" }}>
                      {company.com_logo ? (
                        <img
                          src={image}
                          className="card-logo user-profile-image img-fluid"
                          alt="logo light"
                          width="260"
                        />
                      ) : (
                        <i className="text-muted position-absolute">Cliquer ici pour ajouter votre logo</i>
                      )}
                    </span>
                  </Label>
                </div>
              </Col>
            </Row>
          </CardHeader>
          <CardBody>
            <Form
              onSubmit={(e) => {
                e.preventDefault();
                validation.handleSubmit();
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

                {/* <Col
                  lg={6}
                  className="mb-3">
                  <Label
                    htmlFor="com_nif"
                    className="form-label">
                    NIF
                  </Label>
                  <Input
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
                </Col> */}
              </Row>

              <div className="mt-4">
                <Button
                  color="success"
                  /*disabled={error ? null : loading ? true : false}*/ className="btn btn-success w-100"
                  type="submit">
                  {/* {loading ? <Spinner size="sm" className='me-2'> Loading... </Spinner> : null} */}
                  Valider les informations
                </Button>
              </div>
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
                      <th className="text-end">
                        <button
                          onClick={() => setAddActifView(() => true)}
                          className="d-print-none btn btn-secondary btn-icon "
                          style={{ width: "25px", height: "25px" }}>
                          +
                        </button>
                      </th>
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
                            <td width={40}>
                              <button
                                onClick={() => {
                                  setShowModalDelete(() => true);
                                  setSelectedId(element.use_id);
                                }}
                                className="btn btn-danger btn-icon "
                                style={{ width: "25px", height: "25px" }}>
                                <div style={{ position: "absolute", transform: "rotate(45deg)" }}>+</div>
                              </button>
                            </td>
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

export default CompanyProfil;
