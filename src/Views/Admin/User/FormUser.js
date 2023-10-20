import React, { useEffect, useState } from "react";
import { Button, Card, CardBody, Col, Container, Form, FormFeedback, Input, Label, Row } from "reactstrap";
import BreadCrumb from "../../../Components/Common/BreadCrumb";

import { useDispatch } from "react-redux";
import moment from 'moment';
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";

import hmacSHA512 from "crypto-js/sha512";

import Base64 from "crypto-js/enc-base64";
import { genRandonString } from "../../../utils/function";

import { createOrUpdateUser as onCreateOrUpdateUser } from "../../../slices/thunks"
import { useNavigate } from "react-router-dom";

moment.locale('fr')

const FormUser = () => {
  document.title = "Accueil | Countano";

  const navigate = useNavigate()
  const dispatch = useDispatch();

  const [isAdmin, setIsAdmin] = useState(false);

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
      values.use_rank = isAdmin ? 1 : 0

      dispatch(onCreateOrUpdateUser(values)).then(() => {
        navigate('/admin/users')
      });
    },
  });



  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <BreadCrumb title="Création" pageTitle="Utilisateur" />
          <Card>
            <CardBody>
              <div class="alert alert-warning" role="alert">
                * Lors de l'enregistrement de l'utilisateur un email lui sera envoyé pour qu'il puisse créer son entreprise
              </div>
              <Row>
                <Col>
                  <Form
                    className="tablelist-form"
                    onSubmit={(e) => {
                      e.preventDefault();
                      validation.handleSubmit();
                      return false;
                    }}
                  >

                    <input type="hidden" id="id-field" />
                    <Row className="g-3">
                      <Col lg={12}>
                        <Row>
                          <Col xl={3}>
                            <input name="isAdmin" onClick={() => setIsAdmin(false)} className="form-check-input" type="radio" defaultChecked id="auth-remember-check" />
                            <Label className="form-check-label" htmlFor="auth-remember-check">Utilisateur</Label>
                          </Col>
                          <Col xl={3}>
                            <input name="isAdmin" onClick={() => setIsAdmin(true)} className="form-check-input" type="radio" id="auth-remember-check" />
                            <Label className="form-check-label" htmlFor="auth-remember-check">Admin</Label>
                          </Col>
                        </Row>
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
                            placeholder="Entrer un prénom"
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

                    </Row>

                    <button type="submit" className="btn btn-primary mt-3">
                      Enregister
                    </button>
                  </Form>
                </Col>
              </Row>
            </CardBody>
          </Card>

        </Container>
      </div>
    </React.Fragment>
  );
};

export default FormUser;
