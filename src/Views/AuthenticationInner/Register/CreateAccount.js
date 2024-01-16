import React, { useEffect, useState } from "react";
import { Button, Card, CardBody, Col, Container, Form, FormFeedback, Input, Label, Row } from "reactstrap";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import { useDispatch } from "react-redux";
import moment from 'moment';
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { createOrUpdateUser as onCreateOrUpdateUser } from "../../../slices/thunks"
import { useNavigate } from "react-router-dom";
import ParticlesAuth from "../ParticlesAuth";
import { Link } from "feather-icons-react/build/IconComponents";
import logoLight from "../../../assets/images/logo_countano.png";
import paysData from "../../../Components/constants/paysPhone.json";

moment.locale('fr')

const CreateAccount = () => {
  document.title = "Création d'un compte | Countano";

  const navigate = useNavigate()
  const dispatch = useDispatch();

  const validation = useFormik({

    enableReinitialize: true,
    initialValues: {},

    validationSchema: Yup.object({

      use_lastname: Yup.string().required('Veuillez entrer un nom'),
      use_firstname: Yup.string().required('Veuillez entrer un prénom'),
      use_email: Yup.string().email("L'email doit être valide").test("email_async_validation", "Cette email est déjà utilisé", async (value, testContext) => {
        if (value && !validation.values.use_id) {
          let response = await axios.post('/v1/validation-email', { use_email: value })
          console.log(response.data);
          return response.data;
        }
      }).required('Veuillez entrer un email'),
    }),

    onSubmit: (values) => {
      values.use_rank = 0;

      dispatch(onCreateOrUpdateUser(values)).then(() => {
        navigate('/admin/users')
      });
    },
  });



  return (
    <React.Fragment>
      <ParticlesAuth>
        <div className="auth-page-content no-scroll-x">
          <Container>
            <Row>
              <Col lg={12}>
                <div className="text-center mt-sm-5 mb-4 text-white-50">
                  <div>
                    <Link to="/" className="d-inline-block auth-logo">
                      <img src={logoLight} alt="" height="20" />
                    </Link>
                  </div>
                  <p className="mt-3 fs-15 fw-medium"></p>
                </div>
              </Col>
            </Row>

            <Row className="justify-content-center position-relative">
              <Col md={12} lg={8} xl={6}>

                <Card className={`mt-4 position-absolute w-100 element`} >
                  <CardBody className="p-4">
                    <div className="text-center mt-2">
                      <h5 className="text-primary">Bienvenue !</h5>
                      <p className="text-muted">Passons à la création de votre compte !</p>
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
                          <Col lg={12}>

                          </Col>

                          <Col lg={6}>
                            <div>
                              <Label
                                htmlFor="use_lastname-field"
                                className="form-label"
                              >
                                Nom
                              </Label>

                              <Input
                                name="use_lastname"
                                id="use_lastname-field"
                                className="form-control"
                                placeholder="Entrer un nom"
                                type="text"
                                validate={{
                                  required: { value: true },
                                }}
                                onChange={validation.handleChange}
                                onBlur={validation.handleBlur}
                                value={validation.values.use_lastname || ""}
                                invalid={
                                  validation.touched.use_lastname &&
                                    validation.errors.use_lastname
                                    ? true
                                    : false
                                }
                              />
                              {validation.touched.use_lastname &&
                                validation.errors.use_lastname ? (
                                <FormFeedback type="invalid">
                                  {validation.errors.use_lastname}
                                </FormFeedback>
                              ) : null}
                            </div>
                          </Col>
                          <Col lg={6}>
                            <div>
                              <Label
                                htmlFor="use_firstname-field"
                                className="form-label"
                              >
                                Prénom
                              </Label>
                              <Input
                                name="use_firstname"
                                id="use_firstname-field"
                                className="form-control"
                                placeholder="Entrer un prénom"
                                type="text"
                                validate={{
                                  required: { value: true },
                                }}
                                onChange={validation.handleChange}
                                onBlur={validation.handleBlur}
                                value={validation.values.use_firstname || ""}
                                invalid={
                                  validation.touched.use_firstname &&
                                    validation.errors.use_firstname
                                    ? true
                                    : false
                                }
                              />
                              {validation.touched.use_firstname &&
                                validation.errors.use_firstname ? (
                                <FormFeedback type="invalid">
                                  {validation.errors.use_firstname}
                                </FormFeedback>
                              ) : null}
                            </div>
                          </Col>
                          <Col lg={6}>
                            <div>
                              <Label
                                htmlFor="use_email-field"
                                className="form-label"
                              >
                                Email
                              </Label>
                              <Input
                                name="use_email"
                                id="use_email-field"
                                className="form-control"
                                placeholder="Entrer un email"
                                type="text"
                                validate={{
                                  required: { value: true },
                                }}
                                onChange={validation.handleChange}
                                onBlur={validation.handleBlur}
                                value={validation.values.use_email || ""}
                                invalid={
                                  validation.touched.use_email &&
                                    validation.errors.use_email
                                    ? true
                                    : false
                                }
                              />
                              {validation.touched.use_email &&
                                validation.errors.use_email ? (
                                <FormFeedback type="invalid">
                                  {validation.errors.use_email}
                                </FormFeedback>
                              ) : null}
                            </div>
                          </Col>
                          <Col lg={6} className="mb-3">
                            <Label htmlFor="com_pays" className="form-label">
                              Pays
                            </Label>
                            <Input
                              type="select"
                              className="form-select"
                              invalid={
                                validation.touched.com_pays && validation.errors.com_pays
                                  ? true
                                  : false
                              }
                              onChange={(e) => {
                                const selectedValue = e.target.value;
                                const [paysName, dialCode] = selectedValue.split(",");
                                // console.log(paysName);
                                validation.setValues({
                                  ...validation.values,
                                  use_pays: paysName,
                                });
                              }}
                              onBlur={validation.handleBlur}
                              name="com_pays"
                              id="com_pays-field"
                            >
                              <option disabled={false} value={""}>
                                Choisissez un pays
                              </option>
                              {paysData.map((e, i) => (
                                <option key={i} value={`${e.name},${e.dial_code}`}>
                                  {e.name}
                                </option>
                              ))}
                            </Input>
                            {validation.touched.com_pays && validation.errors.com_pays ? (
                              <FormFeedback type="invalid">
                                {validation.errors.com_pays}
                              </FormFeedback>
                            ) : null}
                          </Col>
                        </Row>


                        <div className="mt-4">
                          <Button color="success" /*disabled={error ? null : loading ? true : false}*/ className="btn btn-success w-100" type="submit">
                            {/* {loading ? <Spinner size="sm" className='me-2'> Loading... </Spinner> : null} */}
                            Commençons
                          </Button>
                        </div>

                      </Form>
                    </div>
                  </CardBody>
                </Card>

              </Col>
            </Row>
          </Container>
        </div>
      </ParticlesAuth>
    </React.Fragment>
  );
};

export default CreateAccount;
