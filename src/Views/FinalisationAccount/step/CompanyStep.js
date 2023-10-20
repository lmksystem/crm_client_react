import React, { useState } from 'react';
import { Card, CardBody, Col, Container, Input, Label, Row, Button, Form, FormFeedback, Alert, Spinner, CardHeader } from 'reactstrap';

import * as Yup from "yup";
import { useFormik } from "formik";

const CompanyStep = ({ handleCompany, setStep, step, position }) => {
  let isStep = 2;

  const [passwordShow, setPasswordShow] = useState(false);

  const [passwordShow1, setPasswordShow1] = useState(false);

  const validation = useFormik({
    enableReinitialize: true,
    initialValues: {
      com_name: "",
      com_adresse: "",
      com_ville: "",
      com_cp: "",
      com_email: "",
      com_phone: "",
      com_naf: "",
      com_conv_name: "",
      com_conv_num: "",
      com_siren: "",
    },

    validationSchema: Yup.object({

    }),

    onSubmit: (values) => {
      setStep(step + 1);
      handleCompany(values);
    }
  })

  return (
    <React.Fragment>
      <Card className={`mt-4 mb-4 position-absolute w-100 ${position} element`} >

        <CardBody className="p-4">
          <div className='w-100 d-flex'>
            <i onClick={() => setStep(step - 1)} className='ri-arrow-left-circle-line' style={{ color: "grays", fontSize: "25px", cursor: "pointer" }}></i>
          </div>
          <div className="text-center mt-2">

            <p className="text-muted">Maintenant créer votre entreprise !</p>
          </div>
          {/* {error && error ? (<Alert color="danger"> {error} </Alert>) : null} */}
          <div className="p-2 mt-4">

            <Form
              onSubmit={(e) => {
                e.preventDefault();
                validation.handleSubmit();
                return false;
              }}
              action="#">
              <Row>
                <Col lg={12} className="mb-3">
                  <Label htmlFor="email" className="form-label">Nom de l'entreprise</Label>
                  <Input
                    name="com_name"
                    className="form-control"
                    placeholder="Entrer un nom"
                    type={"text"}
                    onChange={validation.handleChange}
                    onBlur={validation.handleBlur}
                    value={validation.values.com_name || ""}
                    invalid={
                      validation.touched.com_name && validation.errors.com_name ? true : false
                    }
                  />
                  {validation.touched.com_name && validation.errors.com_name ? (
                    <FormFeedback type="invalid">{validation.errors.com_name}</FormFeedback>
                  ) : null}

                </Col>
                <Col lg={5} className="mb-3">
                  <Label htmlFor="email" className="form-label">Adresse</Label>
                  <Input
                    name="com_adresse"
                    className="form-control"
                    placeholder="Entrer une adresse"
                    type={"text"}
                    onChange={validation.handleChange}
                    onBlur={validation.handleBlur}
                    value={validation.values.com_adresse || ""}
                    invalid={
                      validation.touched.com_adresse && validation.errors.com_adresse ? true : false
                    }
                  />
                  {validation.touched.com_adresse && validation.errors.com_adresse ? (
                    <FormFeedback type="invalid">{validation.errors.com_adresse}</FormFeedback>
                  ) : null}

                </Col>
                <Col lg={4} className="mb-3">
                  <Label htmlFor="email" className="form-label">Ville</Label>
                  <Input
                    name="com_ville"
                    className="form-control"
                    placeholder="Entrer une ville"
                    type={"text"}
                    onChange={validation.handleChange}
                    onBlur={validation.handleBlur}
                    value={validation.values.com_ville || ""}
                    invalid={
                      validation.touched.com_ville && validation.errors.com_ville ? true : false
                    }
                  />
                  {validation.touched.com_ville && validation.errors.com_ville ? (
                    <FormFeedback type="invalid">{validation.errors.com_ville}</FormFeedback>
                  ) : null}

                </Col>
                <Col lg={3} className="mb-3">
                  <Label htmlFor="email" className="form-label">Code postale</Label>
                  <Input
                    name="com_cp"
                    className="form-control"
                    placeholder="Entrer un code postal"
                    type={"text"}
                    onChange={validation.handleChange}
                    onBlur={validation.handleBlur}
                    value={validation.values.com_cp || ""}
                    invalid={
                      validation.touched.com_cp && validation.errors.com_cp ? true : false
                    }
                  />
                  {validation.touched.com_cp && validation.errors.com_cp ? (
                    <FormFeedback type="invalid">{validation.errors.com_cp}</FormFeedback>
                  ) : null}

                </Col>
                <Col lg={6} className="mb-3">
                  <Label htmlFor="email" className="form-label">Email</Label>
                  <Input
                    name="com_email"
                    className="form-control"
                    placeholder="Entrer un email"
                    type={"text"}
                    onChange={validation.handleChange}
                    onBlur={validation.handleBlur}
                    value={validation.values.com_email || ""}
                    invalid={
                      validation.touched.com_email && validation.errors.com_email ? true : false
                    }
                  />
                  {validation.touched.com_email && validation.errors.com_email ? (
                    <FormFeedback type="invalid">{validation.errors.com_email}</FormFeedback>
                  ) : null}

                </Col>
                <Col lg={6} className="mb-3">
                  <Label htmlFor="email" className="form-label">Téléphone</Label>
                  <Input
                    name="com_phone"
                    className="form-control"
                    placeholder="Entrer un téléphone"
                    type={"text"}
                    onChange={validation.handleChange}
                    onBlur={validation.handleBlur}
                    value={validation.values.com_phone || ""}
                    invalid={
                      validation.touched.com_phone && validation.errors.com_phone ? true : false
                    }
                  />
                  {validation.touched.com_phone && validation.errors.com_phone ? (
                    <FormFeedback type="invalid">{validation.errors.com_phone}</FormFeedback>
                  ) : null}

                </Col>
                <Col lg={4} className="mb-3">
                  <Label htmlFor="email" className="form-label">Code NAF</Label>
                  <Input
                    name="com_naf"
                    className="form-control"
                    placeholder="Entrer votre code NAF"
                    type={"text"}
                    onChange={validation.handleChange}
                    onBlur={validation.handleBlur}
                    value={validation.values.com_naf || ""}
                    invalid={
                      validation.touched.com_naf && validation.errors.com_naf ? true : false
                    }
                  />
                  {validation.touched.com_naf && validation.errors.com_naf ? (
                    <FormFeedback type="invalid">{validation.errors.com_naf}</FormFeedback>
                  ) : null}

                </Col>
                <Col lg={8} className="mb-3">
                  <Label htmlFor="email" className="form-label">Siren</Label>
                  <Input
                    name="com_siren"
                    className="form-control"
                    placeholder="Entrer votre Siren"
                    type={"text"}
                    onChange={validation.handleChange}
                    onBlur={validation.handleBlur}
                    value={validation.values.com_siren || ""}
                    invalid={
                      validation.touched.com_siren && validation.errors.com_siren ? true : false
                    }
                  />
                  {validation.touched.com_siren && validation.errors.com_siren ? (
                    <FormFeedback type="invalid">{validation.errors.com_siren}</FormFeedback>
                  ) : null}

                </Col>
                <Col lg={6} className="mb-3">
                  <Label htmlFor="email" className="form-label">Nom de convention</Label>
                  <Input
                    name="com_conv_name"
                    className="form-control"
                    placeholder="Entrer un mot de passe"
                    type={"text"}
                    onChange={validation.handleChange}
                    onBlur={validation.handleBlur}
                    value={validation.values.com_conv_name || ""}
                    invalid={
                      validation.touched.com_conv_name && validation.errors.com_conv_name ? true : false
                    }
                  />
                  {validation.touched.com_conv_name && validation.errors.com_conv_name ? (
                    <FormFeedback type="invalid">{validation.errors.com_conv_name}</FormFeedback>
                  ) : null}

                </Col>
                <Col lg={6} className="mb-3">
                  <Label htmlFor="email" className="form-label">Numéro de convention</Label>
                  <Input
                    name="com_conv_num"
                    className="form-control"
                    placeholder="Entrer un mot de passe"
                    type={"text"}
                    onChange={validation.handleChange}
                    onBlur={validation.handleBlur}
                    value={validation.values.com_conv_num || ""}
                    invalid={
                      validation.touched.com_conv_num && validation.errors.com_conv_num ? true : false
                    }
                  />
                  {validation.touched.com_conv_num && validation.errors.com_conv_num ? (
                    <FormFeedback type="invalid">{validation.errors.com_conv_num}</FormFeedback>
                  ) : null}
                </Col>


              </Row>


              <div className="mt-4">
                <Button color="success" /*disabled={error ? null : loading ? true : false}*/ className="btn btn-success w-100" type="submit">
                  {/* {loading ? <Spinner size="sm" className='me-2'> Loading... </Spinner> : null} */}
                    Valider les informations
                </Button>
              </div>

            </Form>
          </div>
        </CardBody>
      </Card>
    </React.Fragment>
  );
};

export default CompanyStep;