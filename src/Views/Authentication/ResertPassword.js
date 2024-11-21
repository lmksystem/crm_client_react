import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import { Row, Col, Alert, Card, CardBody, Container, FormFeedback, Input, Label, Form, Button } from "reactstrap";

//redux
import { useSelector, useDispatch } from "react-redux";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import withRouter from "../../Components/Common/withRouter";

// Formik Validation
import * as Yup from "yup";
import { useFormik } from "formik";

// action
import { userForgetPassword } from "../../slices/thunks";

// import images
import logoLight from "../../assets/images/logo_lmk.png";

// import profile from "../../assets/images/bg.png";
// import logoLight from "../../assets/images/logo-light.png";
import ParticlesAuth from "../AuthenticationInner/ParticlesAuth";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";

const ResetPassword = props => {
  document.title = "Mot de passe oublié | Countano";
  let { token } = useParams();

  let navigate = useNavigate();

  const dispatch = useDispatch();

  const [passwordShow, setPasswordShow] = useState(false);

  const [passwordShow1, setPasswordShow1] = useState(false);

  const validation = useFormik({
    enableReinitialize: true,
    initialValues: {
      newpassword: "",

    },

    validationSchema: Yup.object({
      newpassword: Yup.string().required('Mot de passe obligatoire'),
      passwordConfirmation: Yup.string().required('Mot de passe obligatoire')
        .oneOf([Yup.ref('newpassword'), null], 'Les mots de passes doivent correspondre')
    }),

    onSubmit: (values) => {
      axios.post(`/v1/user/reset-password/${token}`, { newPassword: values.newpassword })
        .then((res) => {
          toast.success("Mot de passe modifié !");
          navigate('/login');
        })
        .catch((err) => {
          if (err.status != 200) {
            toast.error(err.message);
          }
        })

    }
  })

  /**
   * Vérification du token de réinitialisation
   */
  const verifTokenExpiration = async () => {

    await axios.get(`/v1/user/reset-password/${token}`).catch((err) => {
      if (err.status != 200) {
        navigate('/login');
      }
    });

  }

  useEffect(() => {
    verifTokenExpiration();
  }, [])


  return (
    <ParticlesAuth>
      <ToastContainer />
      <div className="auth-page-content">
        <Container>
          <Row>
            <Col lg={12}>
              <div className="text-center mt-sm-5 mb-4 text-white-50">
                <div>
                  <Link to="/" className="d-inline-block auth-logo">
                    <img src={logoLight} alt="" height="70" />
                  </Link>
                </div>
                <p className="mt-3 fs-15 fw-medium"></p>
              </div>
            </Col>
          </Row>

          <Row className="justify-content-center">
            <Col md={8} lg={6} xl={5}>
              <Card className="mt-4">

                <CardBody className="p-4">
                  <div className="text-center mt-2">
                    <h5 className="text-primary">Mot de passe oublié ?</h5>
                    <p className="text-muted">Réinitialisé le mot de passe</p>

                    <lord-icon
                      src="https://cdn.lordicon.com/rhvddzym.json"
                      trigger="loop"
                      colors="primary:#0ab39c"
                      className="avatar-xl"
                      style={{ width: "120px", height: "120px" }}
                    >
                    </lord-icon>

                  </div>

                  <div className="p-2">
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

              <div className="mt-4 text-center">
                <p className="mb-0">Je me rappel de mon mot de passe... <Link to="/login" className="fw-semibold text-primary text-decoration-underline"> Cliquez ici</Link> </p>
              </div>

            </Col>
          </Row>
        </Container>
      </div>
    </ParticlesAuth>
  );
};

export default withRouter(ResetPassword);
