import React, { useEffect, useState } from 'react';
import { Card, CardBody, Col, Container, Input, Label, Row, Button, Form, FormFeedback, Alert, Spinner } from 'reactstrap';
import ParticlesAuth from "../AuthenticationInner/ParticlesAuth";

//redux
import { useSelector, useDispatch } from "react-redux";

import { Link, useNavigate, useSearchParams } from "react-router-dom";
import withRouter from "../../Components/Common/withRouter";
// Formik validation
import * as Yup from "yup";
import { useFormik, validateYupSchema } from "formik";

import logoLight from "../../assets/images/logo_lmk.png";
import axios from 'axios';
import PasswordStep from './step/PasswordStep';
import CompanyStep from './step/CompanyStep';
import ValideStep from './step/ValideStep';

const FinalisationAccount = (props) => {

  document.title = "Finaliser création de compte | Countano";
  const navigate = useNavigate();

  const [searchParams, setSearchParams] = useSearchParams();
  const [giveAccess, setGiveAccess] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  const [user, setUser] = useState(null);
  const [company, setCompany] = useState(null);

  useEffect(() => {

    let token = searchParams.get("token");
 
    if (token) {
      axios.get(`/v1/user/token/${token}`).then((response) => {
        if (response.data) {
          // validation.setValues(response.data);
          setUser(response.data)
          setGiveAccess(true);
        } else {
          navigate('/erreur-404');
        }


      }).catch(() => {
        navigate('/erreur-404');
      })
    } else {
      navigate('/erreur-404');
    }
  }, [])



  const handlePassword = (value) => {
    setUser({ ...user, use_password: value });
  }

  const handleCompany = (value) => {
    setCompany(value)
  }

  const getPosDiv = (isStep, currentStep) => {
    let classAnimate = "";

    if (isStep == currentStep) {
      classAnimate = "centerState";
    }
    if (isStep > currentStep) {
      classAnimate = "rightState";
    }
    if (isStep < currentStep) {
      classAnimate = "leftState";
    }

    return classAnimate
  }

  const handleSubmit = () => {

    if ((company && user) || (user.use_rank == 1 || user.use_rank == 3)) {

      let data = {
        company: company,
        user: user
      }
      axios.post('/v1/company', data).then(() => {
        navigate('/login');
      })

    }
  }



  if (!giveAccess) {
    return null;
  }

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

                <PasswordStep shipNextStep={(user.use_rank == 1 || user.use_rank == 3)} position={getPosDiv(1, currentStep)} step={currentStep} setStep={setCurrentStep} handlePassword={handlePassword} />
              </Col>
              <Col md={12} lg={8} xl={10}>
                {(user.use_rank != 1 && user.use_rank != 3) ? <CompanyStep position={getPosDiv(2, currentStep)} step={currentStep} setStep={setCurrentStep} handleCompany={handleCompany} pays={user.use_pays} /> : null}
              </Col>
              <Col md={12} lg={8} xl={6}>
                <ValideStep position={getPosDiv(3, currentStep)} step={currentStep} handleSubmit={handleSubmit} />
              </Col>
            </Row>
          </Container>
        </div>
      </ParticlesAuth>
    </React.Fragment>
  );
};

export default withRouter(FinalisationAccount);