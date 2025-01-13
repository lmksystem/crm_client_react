import React from "react";
import { BankAccountService, GestionService, GoCardLessService } from "../../services";
import { Col, FormFeedback, Input, Label, Row, Form, Container, Card, CardHeader, CardBody, Button, ModalHeader, Modal, ModalBody, ListGroup, ListGroupItem, FormGroup } from "reactstrap";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useEffect, useState } from "react";
import { useProfile } from "../../Components/Hooks/UserHooks";
import BreadCrumb from "../../Components/Common/BreadCrumb";
import paysData from "../../Components/constants/paysPhone.json";
import SimpleBar from "simplebar-react";

const InputField = ({ label, name, type = "text", placeholder, validation, disabled }) => (
  <Col lg={6}>
    <div>
      <Label
        htmlFor={`${name}-field`}
        className="form-label">
        {label}
      </Label>
      <Input
        disabled={disabled}
        name={name}
        id={`${name}-field`}
        className="form-control"
        placeholder={placeholder}
        type={type}
        onChange={validation.handleChange}
        onBlur={validation.handleBlur}
        value={validation.values[name] || ""}
        invalid={validation.touched[name] && validation.errors[name] ? true : false}
      />
      {validation.touched[name] && validation.errors[name] ? <FormFeedback type="invalid">{validation.errors[name]}</FormFeedback> : null}
    </div>
  </Col>
);

export const Profile = () => {
  const { userProfile } = useProfile();

  const [collaborateur, setCollaborateur] = useState(null);
  const [listBank, setListBank] = useState(null);
  const [pays, setPays] = useState(null);
  const [isMandated, setIsMandated] = useState(false);

  const validation = useFormik({
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
      ent_methode_payment: (collaborateur && collaborateur.ent_methode_payment) || "",
      ent_tva_intracom: (collaborateur && collaborateur.ent_tva_intracom) || "",
      ent_gocardless_cus_id: (collaborateur && collaborateur.ent_gocardless_cus_id) || "",
      type: {
        client: (collaborateur && collaborateur.type?.client) || { eti_removed: 1 },
        prospect: (collaborateur && collaborateur.type?.prospect) || { eti_removed: 1 },
        fournisseur: (collaborateur && collaborateur.type?.fournisseur) || { eti_removed: 1 }
      }
    },
    validationSchema: Yup.object({
      ent_lastname: Yup.string().required("Veuillez entrer un nom"),
      ent_firstname: Yup.string().required("Veuillez entrer un prénom"),
      ent_phone: Yup.number().required("Veuillez entrer un téléphone").label("Le téléphone ne doit pas contenir de lettre"),
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
      ent_tva_intracom: Yup.string().matches(/^[A-Za-z]{2}[0-9]{9}$/, "Le champ doit contenir 2 lettres suivies de 9 chiffres.")
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
        ent_gocardless_cus_id: values.ent_gocardless_cus_id
      };

      const company_type = {
        fournisseur: values.type.fournisseur,
        client: values.type.client,
        prospect: values.type.prospect
      };

      let data = {
        company: { ...companyData },
        company_type: { ...company_type }
      };

      data.ent_id = collaborateur.ent_id || 0;
      GestionService.updateCollaborateur(data);

      validation.resetForm();
    }
  });

  const fetchCollaborateur = async () => {
    try {
      const response = await GestionService.getCollaborateurById(userProfile.ent_id);
      setIsMandated(response.ent_mandat_id ? true : false);
      setCollaborateur(response);
    } catch (error) {
      console.error("Erreur lors de la récupération du collaborateur", error);
    }
  };

  useEffect(() => {
    fetchCollaborateur();
  }, []);

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <BreadCrumb
            title="Domaines"
            pageTitle="Gestion"
          />
          <Row>
            <Col lg={12}>
              <Card id="domaineList">
                <CardHeader className="border-0">
                  <div className="d-flex align-items-start flex-column">
                    <div
                      className="d-flex flex-row"
                      lg={12}>
                      <h5 className="card-title mb-3 flex-grow-1">Profile</h5>
                      <div className="hstack text-nowrap gap-2"></div>
                    </div>
                    <div className="hstack text-nowrap gap-2 text-end">
                      <FormGroup switch>
                        <Label check>Prélèvement automatique</Label>
                        <Input
                          type="switch"
                          checked={isMandated}
                          onClick={() => {
                            if (isMandated) {
                              //alert pour confirmer 
                              
                              // remove le mandat
                            } else {
                              GoCardLessService.createMandate().then((response) => {
                                if (response.authorisation_url) {
                                  window.location.replace(response.authorisation_url);
                                }
                              });
                            }

                          }}
                        />
                      </FormGroup>
                    </div>
                  </div>
                </CardHeader>

                <CardBody className="pt-0">
                  <Form
                    className="tablelist-form"
                    onSubmit={(e) => {
                      e.preventDefault();
                      validation.handleSubmit();
                      return false;
                    }}>
                    <input
                      type="hidden"
                      id="id-field"
                    />
                    <Row className="g-3">
                      <h5>Informations Générales</h5>

                      <InputField
                        label="Nom"
                        name="ent_lastname"
                        placeholder="Entrer un nom"
                        validation={validation}
                      />
                      <InputField
                        label="Prénom"
                        name="ent_firstname"
                        placeholder="Entrer un prénom"
                        validation={validation}
                      />
                      <InputField
                        label="Entreprise"
                        name="ent_name"
                        placeholder="Entrer un nom d'entreprise"
                        validation={validation}
                        disabled
                      />

                      <InputField
                        label="Adresse"
                        name="ent_adresse"
                        placeholder="Entrer une adresse"
                        validation={validation}
                      />
                      <InputField
                        label="Code postal"
                        name="ent_cp"
                        placeholder="Entrer un code postal"
                        validation={validation}
                      />
                      <InputField
                        label="Ville"
                        name="ent_ville"
                        placeholder="Entrer une ville"
                        validation={validation}
                      />
                      <InputField
                        label="Email"
                        name="ent_email"
                        placeholder="Entrer un email"
                        validation={validation}
                      />
                      <InputField
                        label="Téléphone"
                        name="ent_phone"
                        placeholder="Entrer un téléphone"
                        validation={validation}
                      />
                      <InputField
                        label="IBAN"
                        name="ent_iban"
                        placeholder="Entrer un iban"
                        validation={validation}
                      />
                      <InputField
                        label="BIC"
                        name="ent_bic"
                        placeholder="Entrer bic"
                        validation={validation}
                      />

                      <InputField
                        label="TVA INTRACOM"
                        name="ent_tva_intracom"
                        placeholder="Entrer TVA Intracom"
                        validation={validation}
                      />
                    </Row>
                    <div className="hstack gap-2 justify-content-end">
                      <button
                        type="submit"
                        className="btn btn-success"
                        id="add-btn">
                        Enregistrer
                      </button>
                    </div>
                  </Form>
                </CardBody>
              </Card>
            </Col>
          </Row>
          <Row>
            <Col>
              <Card>
                <CardHeader className="border-0">
                  <div className="d-flex align-items-start flex-column">
                    <div className="w-100 d-flex flex-row">
                      <div className="w-100">
                        <h5 className="card-title mb-3 flex-grow-1"></h5>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardBody className="pt-0"></CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};
