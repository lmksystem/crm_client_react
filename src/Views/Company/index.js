import React, { useEffect, useState } from "react";
import {
  CardBody,
  Container,
  Card,
  Form,
  Row,
  Col,
  Label,
  FormFeedback,
  Input,
  Button,
} from "reactstrap";
import BreadCrumb from "../../Components/Common/BreadCrumb";
import * as Yup from "yup";
import { useFormik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import { getCompany as onGetCompany ,updateCompany as onUpdateCompany} from "../../slices/thunks";

const CompanyProfil = () => {
  const dispatch = useDispatch();

  const { companyredux, error } = useSelector((state) => ({
    companyredux: state?.Company?.company,
  }));
  const[company,setCompany]= useState({});

  useEffect(() => {
    dispatch(onGetCompany());
  }, []);

  useEffect(() => {
    console.log("company",company);
    console.log("companyredux",companyredux)
    if(companyredux?.length>0){
        setCompany(companyredux[0])

    }
  }, [companyredux]);

  const validation = useFormik({
    enableReinitialize: true,
    initialValues: {
    //   com_name: company?.com_id || 0,
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
    },

    validationSchema: Yup.object({
        com_name: Yup.string().required("Veuillez entrer un nom d'entreprise"),
        com_adresse: Yup.string().required("Veuillez entrer une adresse"),
        com_ville: Yup.string().required("Veuillez entrer une ville"),
        com_cp: Yup.string().required("Veuillez entrer un code postal"),
        com_email: Yup.string().required("Veuillez entrer un email"),
        com_phone: Yup.string().required("Veuillez entrer un numéro de téléphone"),

    }),

    onSubmit: (values) => {
      dispatch(onUpdateCompany(values))
    },
  });
  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <BreadCrumb title="Entreprise" pageTitle="Profil" />
        </Container>

        <Card>
          <CardBody>
            <Form
              onSubmit={(e) => {
                e.preventDefault();
                validation.handleSubmit();
                return false;
              }}
              action="#"
            >
              <Row>
                <Col lg={12} className="mb-3">
                  <Label htmlFor="email" className="form-label">
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
                    invalid={
                      validation.touched.com_name && validation.errors.com_name
                        ? true
                        : false
                    }
                  />
                  {validation.touched.com_name && validation.errors.com_name ? (
                    <FormFeedback type="invalid">
                      {validation.errors.com_name}
                    </FormFeedback>
                  ) : null}
                </Col>
                <Col lg={5} className="mb-3">
                  <Label htmlFor="email" className="form-label">
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
                    invalid={
                      validation.touched.com_adresse &&
                      validation.errors.com_adresse
                        ? true
                        : false
                    }
                  />
                  {validation.touched.com_adresse &&
                  validation.errors.com_adresse ? (
                    <FormFeedback type="invalid">
                      {validation.errors.com_adresse}
                    </FormFeedback>
                  ) : null}
                </Col>
                <Col lg={4} className="mb-3">
                  <Label htmlFor="email" className="form-label">
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
                    invalid={
                      validation.touched.com_ville &&
                      validation.errors.com_ville
                        ? true
                        : false
                    }
                  />
                  {validation.touched.com_ville &&
                  validation.errors.com_ville ? (
                    <FormFeedback type="invalid">
                      {validation.errors.com_ville}
                    </FormFeedback>
                  ) : null}
                </Col>
                <Col lg={3} className="mb-3">
                  <Label htmlFor="email" className="form-label">
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
                    invalid={
                      validation.touched.com_cp && validation.errors.com_cp
                        ? true
                        : false
                    }
                  />
                  {validation.touched.com_cp && validation.errors.com_cp ? (
                    <FormFeedback type="invalid">
                      {validation.errors.com_cp}
                    </FormFeedback>
                  ) : null}
                </Col>
                <Col lg={6} className="mb-3">
                  <Label htmlFor="email" className="form-label">
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
                    invalid={
                      validation.touched.com_email &&
                      validation.errors.com_email
                        ? true
                        : false
                    }
                  />
                  {validation.touched.com_email &&
                  validation.errors.com_email ? (
                    <FormFeedback type="invalid">
                      {validation.errors.com_email}
                    </FormFeedback>
                  ) : null}
                </Col>
                <Col lg={6} className="mb-3">
                  <Label htmlFor="email" className="form-label">
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
                    invalid={
                      validation.touched.com_phone &&
                      validation.errors.com_phone
                        ? true
                        : false
                    }
                  />
                  {validation.touched.com_phone &&
                  validation.errors.com_phone ? (
                    <FormFeedback type="invalid">
                      {validation.errors.com_phone}
                    </FormFeedback>
                  ) : null}
                </Col>
                <Col lg={4} className="mb-3">
                  <Label htmlFor="email" className="form-label">
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
                    invalid={
                      validation.touched.com_naf && validation.errors.com_naf
                        ? true
                        : false
                    }
                  />
                  {validation.touched.com_naf && validation.errors.com_naf ? (
                    <FormFeedback type="invalid">
                      {validation.errors.com_naf}
                    </FormFeedback>
                  ) : null}
                </Col>
                <Col lg={8} className="mb-3">
                  <Label htmlFor="email" className="form-label">
                    Siren
                  </Label>
                  <Input
                    name="com_siren"
                    className="form-control"
                    placeholder="Entrer votre Siren"
                    type={"text"}
                    onChange={validation.handleChange}
                    onBlur={validation.handleBlur}
                    value={validation.values.com_siren || ""}
                    invalid={
                      validation.touched.com_siren &&
                      validation.errors.com_siren
                        ? true
                        : false
                    }
                  />
                  {validation.touched.com_siren &&
                  validation.errors.com_siren ? (
                    <FormFeedback type="invalid">
                      {validation.errors.com_siren}
                    </FormFeedback>
                  ) : null}
                </Col>
                <Col lg={6} className="mb-3">
                  <Label htmlFor="email" className="form-label">
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
                    invalid={
                      validation.touched.com_conv_name &&
                      validation.errors.com_conv_name
                        ? true
                        : false
                    }
                  />
                  {validation.touched.com_conv_name &&
                  validation.errors.com_conv_name ? (
                    <FormFeedback type="invalid">
                      {validation.errors.com_conv_name}
                    </FormFeedback>
                  ) : null}
                </Col>
                <Col lg={6} className="mb-3">
                  <Label htmlFor="email" className="form-label">
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
                    invalid={
                      validation.touched.com_conv_num &&
                      validation.errors.com_conv_num
                        ? true
                        : false
                    }
                  />
                  {validation.touched.com_conv_num &&
                  validation.errors.com_conv_num ? (
                    <FormFeedback type="invalid">
                      {validation.errors.com_conv_num}
                    </FormFeedback>
                  ) : null}
                </Col>
              </Row>

              <div className="mt-4">
                <Button
                  color="success"
                  /*disabled={error ? null : loading ? true : false}*/ className="btn btn-success w-100"
                  type="submit"
                >
                  {/* {loading ? <Spinner size="sm" className='me-2'> Loading... </Spinner> : null} */}
                  Valider les informations
                </Button>
              </div>
            </Form>
          </CardBody>
        </Card>
      </div>
    </React.Fragment>
  );
};

export default CompanyProfil;
