import React, { useEffect, useState, useCallback, useMemo } from "react";
import {
  Col,
  Container,
  Row,
  Card,
  CardBody,
  Form,
  Input,
  Label,
  FormFeedback,
} from "reactstrap";

import BreadCrumb from "../../../Components/Common/BreadCrumb";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useProfile } from "../../../Components/Hooks/UserHooks";
import axios from "axios";
import { useDispatch } from "react-redux";
import { createOrUpdateUser as onCreateOrUpdateUser } from "../../../slices/thunks"
import { getLoggedinUser } from "../../../helpers/api_helper";
const Profile = () => {
  const { userProfile } = useProfile();
  const dispatch = useDispatch();

  // validation
  const validation = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,
    initialValues: {
      id: userProfile.use_id,
      firstname: userProfile.use_firstname,
      lastname: userProfile.use_lastname,
      email: userProfile.use_email,
    },
    validationSchema: Yup.object({
      firstname: Yup.string().required("Veuillez entrer un prénom"),
      lastname: Yup.string().required("Veuillez entrer un nom"),
      email: Yup.string()
        .email("L'email doit être valide")
        .test(
          "email_async_validation",
          "Cette email est déjà utilisé",
          async (value, testContext) => {
            if (value && value != userProfile.use_email) {
              let response = await axios.post("/v1/validation-email", {
                use_email: value,
              });
              return response.data;
            }
            return true
          }
        )
        .required("Veuillez entrer un email"),
    }),

    onSubmit: (values) => {
        let newUpdateValue={
            use_id:values.id,
            use_firstname:values.firstname,
            use_lastname:values.lastname,
            use_email:values.email,
        }
        dispatch(onCreateOrUpdateUser(newUpdateValue)).then(()=>{
            let oldUser = JSON.parse(localStorage.getItem("authUser")) ;
            oldUser.use_firstname = values.firstname;
            oldUser.use_lastname = values.lastname;
            oldUser.use_email = values.email;
            localStorage.setItem("authUser", JSON.stringify(oldUser));
            getLoggedinUser();
            toast.success("Profil mis à jour !", { autoClose: 3000 });
        })
    },
  });



  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <BreadCrumb title="Profil" pageTitle="Countano" />
          <Row>
            <Col xxl={12}>
              <Card id="contactList">
                <CardBody className="pt-10">
                  <Col lg={12}>
                    <Form
                      className="tablelist-form"
                      onSubmit={(e) => {
                        e.preventDefault();
                        validation.handleSubmit();
                        return false;
                      }}
                    >
                      <Input type="hidden" id="id-field" />
                      <Row className="g-3">
                        <Col lg={6}>
                          <div>
                            <Label
                              htmlFor="firstname-field"
                              className="form-label"
                            >
                              Prénom
                            </Label>
                            <Input
                              name="firstname"
                              id="firstname-field"
                              className="form-control"
                              placeholder="Entrer un prénom"
                              type="text"
                              onChange={validation.handleChange}
                              onBlur={validation.handleBlur}
                              value={validation.values.firstname || ""}
                              invalid={
                                validation.touched.firstname &&
                                validation.errors.firstname
                                  ? true
                                  : false
                              }
                            />
                            {validation.touched.firstname &&
                            validation.errors.firstname ? (
                              <FormFeedback type="invalid">
                                {validation.errors.firstname}
                              </FormFeedback>
                            ) : null}
                          </div>
                        </Col>
                        <Col lg={6}>
                          <div>
                            <Label
                              htmlFor="lastname-field"
                              className="form-label"
                            >
                              Nom
                            </Label>
                            <Input
                              name="lastname"
                              id="lastname-field"
                              className="form-control"
                              placeholder="Entrer un nom"
                              type="text"
                              onChange={validation.handleChange}
                              onBlur={validation.handleBlur}
                              value={validation.values.lastname || ""}
                              invalid={
                                validation.touched.lastname &&
                                validation.errors.lastname
                                  ? true
                                  : false
                              }
                            />
                            {validation.touched.lastname &&
                            validation.errors.lastname ? (
                              <FormFeedback type="invalid">
                                {validation.errors.lastname}
                              </FormFeedback>
                            ) : null}
                          </div>
                        </Col>

                        <Col lg={6}>
                          <div>
                            <Label htmlFor="email-field" className="form-label">
                              Email
                            </Label>
                            <Input
                              name="email"
                              id="email-field"
                              className="form-control"
                              placeholder="Entrer un email"
                              type="email"
                              onChange={validation.handleChange}
                              onBlur={validation.handleBlur}
                              value={validation.values.email || ""}
                              invalid={
                                validation.touched.email &&
                                validation.errors.email
                                  ? true
                                  : false
                              }
                            />
                            {validation.touched.email &&
                            validation.errors.email ? (
                              <FormFeedback type="invalid">
                                {validation.errors.email}
                              </FormFeedback>
                            ) : null}
                          </div>
                        </Col>
                      </Row>
                      <div className="mt-4 justify-content-end">
                        <button
                          type="submit"
                          className="btn btn-secondary"
                          id="add-btn"
                        >
                          {" "}
                          Modifier
                        </button>
                      </div>
                    </Form>
                  </Col>
                  <ToastContainer closeButton={false} limit={1} />
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default Profile;
