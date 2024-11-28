import React, { useEffect, useState } from "react";
import { Button, Col, FormFeedback, Input, Label, Row } from "reactstrap";
import DropFileComponents from "./DropFileComponent";
import { Form, useFormik } from "formik";
import * as Yup from "yup";
import { EmployeeService, SalaryService } from "../../services";
import moment from "moment";

function Formulaire({ salId, onUpdate = () => {}, onClose = () => {} }) {
  const [employees, setEmployees] = useState([]);
  const [salary, setSalary] = useState();

  // validation
  const validation = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,
    initialValues: {
      sal_id: (salary && salary.sal_id) || 0,
      sal_use_fk: (salary && salary.sal_use_fk) || "",
      sal_net: (salary && salary.sal_net) || "",
      sal_brut: (salary && salary.sal_brut) || "",
      sal_bcharge: (salary && salary.sal_bcharge) || "",
      sal_date: (salary && salary.sal_date) || "",
      sal_pdf: (salary && salary.sal_pdf) || null
    },
    validationSchema: Yup.object({
      sal_use_fk: Yup.number().required("Veuillez sélectionner un employé"),
      sal_date: Yup.date().required("Veuillez entrer une date de versement"),
      sal_net: Yup.number().required("Veuillez entrer un salaire net"),
      sal_brut: Yup.number().required("Veuillez entrer un salaire brut"),
      sal_bcharge: Yup.number().required("Veuillez entrer un salaire brut chargé")
    }),
    onSubmit: async (values) => {
      let sal_pdf = values.sal_pdf;
      if (salary.sal_pdf != sal_pdf && sal_pdf) {
        sal_pdf = await SalaryService.upload(sal_pdf);
      }
      await SalaryService.createUpdateSalary({ ...values, sal_pdf }).then((res) => {
        onUpdate();
        validation.resetForm();
        onClose();
      });
    }
  });

  useEffect(() => {
    EmployeeService.getEmployees().then((res) => {
      setEmployees(res);
    });
  }, []);

  useEffect(() => {
    if (salId) {
      SalaryService.getOneSalary(salId).then((res) => {
        setSalary(res);
      });
    }
  }, [salId]);

  return (
    <>
      <Row className="m-2">
        <Col lg={6}>
          <Row className="g-3">
            <Col lg={6}>
              <div>
                <Label
                  htmlFor="sal_use_fk-field"
                  className="form-label">
                  Employé
                </Label>

                <Input
                  type="select"
                  className="form-select mb-0"
                  validate={{
                    required: { value: true }
                  }}
                  invalid={validation.touched.sal_use_fk && validation.errors.sal_use_fk ? true : false}
                  value={validation.values.sal_use_fk}
                  onChange={validation.handleChange}
                  onBlur={validation.handleBlur}
                  name="sal_use_fk"
                  id="sal_use_fk-field">
                  <option
                    disabled={true}
                    value={""}>
                    Choisir un employé
                  </option>
                  {employees?.map((e, i) => (
                    <option
                      key={i}
                      value={e.use_id}>
                      {e.use_lastname} {e.use_firstname}
                    </option>
                  ))}
                </Input>
                {validation.touched.sal_use_fk && validation.errors.sal_use_fk ? <FormFeedback type="invalid">{validation.errors.sal_use_fk}</FormFeedback> : null}
              </div>
            </Col>
            <Col lg={6}>
              <div>
                <Label
                  htmlFor="sal_date-field"
                  className="form-label">
                  Date versement
                </Label>

                <Input
                  name="sal_date"
                  id="sal_date-field"
                  className="form-control"
                  type="date"
                  validate={{
                    required: { value: true }
                  }}
                  onChange={validation.handleChange}
                  onBlur={validation.handleBlur}
                  value={moment(validation.values.sal_date).format("YYYY-MM-DD") || ""}
                  invalid={validation.touched.sal_date && validation.errors.sal_date ? true : false}
                />
                {validation.touched.sal_date && validation.errors.sal_date ? <FormFeedback type="invalid">{validation.errors.sal_date}</FormFeedback> : null}
              </div>
            </Col>
            <Col lg={4}>
              <div>
                <Label
                  htmlFor="sal_net-field"
                  className="form-label">
                  Salaire net
                </Label>
                <Input
                  name="sal_net"
                  id="sal_net-field"
                  className="form-control"
                  placeholder="Net"
                  type="number"
                  validate={{
                    required: { value: true }
                  }}
                  onChange={validation.handleChange}
                  onBlur={validation.handleBlur}
                  value={validation.values.sal_net || ""}
                  invalid={validation.touched.sal_net && validation.errors.sal_net ? true : false}
                />
                {validation.touched.sal_net && validation.errors.sal_net ? <FormFeedback type="invalid">{validation.errors.sal_net}</FormFeedback> : null}
              </div>
            </Col>
            <Col lg={4}>
              <div>
                <Label
                  htmlFor="salary-brut-field"
                  className="form-label">
                  Salaire brut
                </Label>
                <Input
                  name="sal_brut"
                  id="sal_brut-field"
                  className="form-control"
                  placeholder="Brut"
                  type="number"
                  validate={{
                    required: { value: true }
                  }}
                  onChange={validation.handleChange}
                  onBlur={validation.handleBlur}
                  value={validation.values.sal_brut || ""}
                  invalid={validation.touched.sal_brut && validation.errors.sal_brut ? true : false}
                />
                {validation.touched.sal_brut && validation.errors.sal_brut ? <FormFeedback type="invalid">{validation.errors.sal_brut}</FormFeedback> : null}
              </div>
            </Col>
            <Col lg={4}>
              <div>
                <Label
                  htmlFor="sal_bcharge-field"
                  className="form-label">
                  Salaire brut chargé
                </Label>
                <Input
                  name="sal_bcharge"
                  id="sal_bcharge-field"
                  className="form-control"
                  placeholder="Brut chargé"
                  type="number"
                  validate={{
                    required: { value: true }
                  }}
                  onChange={validation.handleChange}
                  onBlur={validation.handleBlur}
                  value={validation.values.sal_bcharge || ""}
                  invalid={validation.touched.sal_bcharge && validation.errors.sal_bcharge ? true : false}
                />
                {validation.touched.sal_bcharge && validation.errors.sal_bcharge ? <FormFeedback type="invalid">{validation.errors.sal_bcharge}</FormFeedback> : null}
              </div>
            </Col>
          </Row>
        </Col>
        <Col lg={6}>
          <Label className="from-label"> Ajouter bulletin(s) de salaire</Label>
          <DropFileComponents
            setValues={(val) => validation.setFieldValue("sal_pdf", val)}
            values={salId}
          />
        </Col>
      </Row>
      <div className="d-flex m-0 p-2 border-top border-light align-items-center justify-content-end gap-2">
        <Button
          className=""
          color="light"
          onClick={onClose}>
          Fermer
        </Button>
        <Button
          color="success"
          onClick={validation.handleSubmit}>
          Enregister
        </Button>
      </div>
    </>
  );
}

export default Formulaire;
