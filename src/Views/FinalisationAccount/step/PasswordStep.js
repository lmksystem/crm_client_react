import React, { useEffect, useState } from 'react';
import { Card, CardBody, Col, Container, Input, Label, Row, Button, Form, FormFeedback, Alert, Spinner } from 'reactstrap';

//redux
import { useSelector, useDispatch } from "react-redux";

import { Link, useNavigate, useSearchParams } from "react-router-dom";
// Formik validation
import * as Yup from "yup";
import { useFormik } from "formik";

import axios from 'axios';

const PasswordStep = ({ handlePassword, setStep, step, position, shipNextStep }) => {
  let isStep = 1;

  const [passwordShow, setPasswordShow] = useState(false);

  const [passwordShow1, setPasswordShow1] = useState(false);

  const validation = useFormik({
    enableReinitialize: true,
    initialValues: {
      newpassword: "",

    },

    validationSchema: Yup.object({
      newpassword: Yup.string().required('Mot de passe obligatoire'),
      passwordConfirmation: Yup.string()
        .oneOf([Yup.ref('newpassword'), null], 'Les mots de passes doivent correspondre')
    }),

    onSubmit: (values) => {
      setStep(step + (shipNextStep ? 2 : 1))
      handlePassword(values.newpassword);
    }
  })

  return (
    <React.Fragment>
      <Card className={`mt-4 position-absolute w-100 ${position} element`} >
        <CardBody className="p-4">
          <div className="text-center mt-2">
            <h5 className="text-primary">Bienvenue !</h5>
            <p className="text-muted">Pour finaliser votre incription changer le mot de passe !</p>
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
                  <Label htmlFor="email" className="form-label">Mot de passe</Label>
                  <div className="position-relative auth-pass-inputgroup mb-3">
                    <Input
                      name="newpassword"
                      className="form-control"
                      placeholder="Entrer un mot de passe"
                      type={passwordShow1 ? "text" : "password"}
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={validation.values.newpassword || ""}
                      invalid={
                        validation.touched.newpassword && validation.errors.newpassword ? true : false
                      }
                    />
                    {validation.touched.newpassword && validation.errors.newpassword ? (
                      <FormFeedback type="invalid">{validation.errors.newpassword}</FormFeedback>
                    ) : null}
                    <button className="btn btn-link position-absolute end-0 top-0 text-decoration-none text-muted" type="button" id="password-addon" onClick={() => setPasswordShow1(!passwordShow1)}><i className="ri-eye-fill align-middle"></i></button>
                  </div>
                </Col>

                <Col lg={12} className="mb-3">
                  <Label className="form-label" htmlFor="password-input">Confirmer mot de passe</Label>
                  <div className="position-relative auth-pass-inputgroup mb-3">
                    <Input
                      name="passwordConfirmation"
                      value={validation.values.passwordConfirmation || ""}
                      type={passwordShow ? "text" : "password"}
                      className="form-control pe-5"
                      placeholder="Confirmer le mot de passe"
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      invalid={
                        validation.touched.passwordConfirmation && validation.errors.passwordConfirmation ? true : false
                      }
                    />
                    {validation.touched.passwordConfirmation && validation.errors.passwordConfirmation ? (
                      <FormFeedback type="invalid">{validation.errors.passwordConfirmation}</FormFeedback>
                    ) : null}
                    <button className="btn btn-link position-absolute end-0 top-0 text-decoration-none text-muted" type="button" id="password-addon" onClick={() => { setPasswordShow(!passwordShow) }}><i className="ri-eye-fill align-middle"></i></button>
                  </div>
                </Col>
              </Row>


              <div className="mt-4">
                <Button color="success" /*disabled={error ? null : loading ? true : false}*/ className="btn btn-success w-100" type="submit">
                  {/* {loading ? <Spinner size="sm" className='me-2'> Loading... </Spinner> : null} */}
                  Changer le mot de passe
                </Button>
              </div>

            </Form>
          </div>
        </CardBody>
      </Card>
    </React.Fragment>
  );
};

export default PasswordStep;