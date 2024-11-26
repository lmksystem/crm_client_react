import React from "react";
import { Form } from "react-router-dom";
import { Col, Input, Label, Row } from "reactstrap";
import DropFileComponents from "./DropFileComponent";

function Formulaire() {
  const validation = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {
      salaray_use_id: (salary && salary.salaray_use_id) || "",
      salary_net: (salary && salary.salary_net) || "",
      salary_brut: (salary && salary.salary_brut) || "",
      salary_charge: (salary && salary.salary_charge) || "",
      salaray_date: (salary && salary.salaray_date) || "",
      sal_pdf: (salary && salary.sal_pdf) || ""
    },
    validationSchema: Yup.object({
      salaray_use_id: Yup.number().required("Veuillez sélectionner un employé"),
      salaray_date: Yup.date().required("Veuillez entrer une date de versement"),
      salary_net: Yup.number().required("Veuillez entrer un salaire net"),
      salary_brut: Yup.number().required("Veuillez entrer un salaire brut"),
      salary_charge: Yup.number().required("Veuillez entrer un salaire brut chargé")
    }),
    onSubmit: async (values) => {
      let sal_pdf = salary.sal_pdf;
      if (values.sal_pdf != salary.sal_pdf) {
        sal_pdf = await SalaryService.upload(values.sal_pdf);
      }
      if (isEdit) {
        const updateSalary = {
          sal_id: salary.id ? salary.id : 0,
          sal_use_fk: values.salaray_use_id,
          sal_net: values.salary_net,
          sal_brut: values.salary_brut,
          sal_bcharge: values.salary_charge,
          sal_date: values.salaray_date,
          sal_pdf: sal_pdf
        };

        // update Salaire
        dispatch(onCreateUpdateSalary(updateSalary));
        validation.resetForm();
      } else {
        const newSalary = {
          sal_use_fk: values.salaray_use_id,
          sal_net: values.salary_net,
          sal_brut: values.salary_brut,
          sal_bcharge: values.salary_charge,
          sal_date: values.salaray_date,
          sal_pdf: sal_pdf
        };
        // save new Salary
        dispatch(onCreateUpdateSalary(newSalary));
        validation.resetForm();
      }
      toggle();
    }
  });

  return (
    <Form
      className="tablelist-form"
      onSubmit={(e) => {
        e.preventDefault();
        validation.handleSubmit();
        return false;
      }}>
      <Input
        type="hidden"
        id="id-field"
      />
      <Row>
        <Col lg={6}>
          <Row className="g-3">
            <Col lg={6}>
              <div>
                <Label
                  htmlFor="salaray_use_id-field"
                  className="form-label">
                  Employé
                </Label>

                <Input
                  type="select"
                  className="form-select mb-0"
                  validate={{
                    required: { value: true }
                  }}
                  invalid={validation.touched.salaray_use_id && validation.errors.salaray_use_id ? true : false}
                  value={validation.values.salaray_use_id}
                  onChange={validation.handleChange}
                  onBlur={validation.handleBlur}
                  name="salaray_use_id"
                  id="salaray_use_id-field">
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
                {validation.touched.salaray_use_id && validation.errors.salaray_use_id ? <FormFeedback type="invalid">{validation.errors.salaray_use_id}</FormFeedback> : null}
              </div>
            </Col>
            <Col lg={6}>
              <div>
                <Label
                  htmlFor="salaray_date-field"
                  className="form-label">
                  Date versement
                </Label>

                <Input
                  name="salaray_date"
                  id="salaray_date-field"
                  className="form-control"
                  type="date"
                  validate={{
                    required: { value: true }
                  }}
                  onChange={validation.handleChange}
                  onBlur={validation.handleBlur}
                  value={validation.values.salaray_date || ""}
                  invalid={validation.touched.salaray_date && validation.errors.salaray_date ? true : false}
                />
                {validation.touched.salaray_date && validation.errors.salaray_date ? <FormFeedback type="invalid">{validation.errors.salaray_date}</FormFeedback> : null}
              </div>
            </Col>
            <Col lg={4}>
              <div>
                <Label
                  htmlFor="salary_net-field"
                  className="form-label">
                  Salaire net
                </Label>
                <Input
                  name="salary_net"
                  id="salary_net-field"
                  className="form-control"
                  placeholder="Net"
                  type="number"
                  validate={{
                    required: { value: true }
                  }}
                  onChange={validation.handleChange}
                  onBlur={validation.handleBlur}
                  value={validation.values.salary_net || ""}
                  invalid={validation.touched.salary_net && validation.errors.salary_net ? true : false}
                />
                {validation.touched.salary_net && validation.errors.salary_net ? <FormFeedback type="invalid">{validation.errors.salary_net}</FormFeedback> : null}
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
                  name="salary_brut"
                  id="salary_brut-field"
                  className="form-control"
                  placeholder="Brut"
                  type="number"
                  validate={{
                    required: { value: true }
                  }}
                  onChange={validation.handleChange}
                  onBlur={validation.handleBlur}
                  value={validation.values.salary_brut || ""}
                  invalid={validation.touched.salary_brut && validation.errors.salary_brut ? true : false}
                />
                {validation.touched.salary_brut && validation.errors.salary_brut ? <FormFeedback type="invalid">{validation.errors.salary_brut}</FormFeedback> : null}
              </div>
            </Col>
            <Col lg={4}>
              <div>
                <Label
                  htmlFor="salary_charge-field"
                  className="form-label">
                  Salaire brut chargé
                </Label>
                <Input
                  name="salary_charge"
                  id="salary_charge-field"
                  className="form-control"
                  placeholder="Brut chargé"
                  type="number"
                  validate={{
                    required: { value: true }
                  }}
                  onChange={validation.handleChange}
                  onBlur={validation.handleBlur}
                  value={validation.values.salary_charge || ""}
                  invalid={validation.touched.salary_charge && validation.errors.salary_charge ? true : false}
                />
                {validation.touched.salary_charge && validation.errors.salary_charge ? <FormFeedback type="invalid">{validation.errors.salary_charge}</FormFeedback> : null}
              </div>
            </Col>
          </Row>
        </Col>
        <Col lg={6}>
          <Label className="from-label"> Ajouter bulletin(s) de salaire</Label>
          <DropFileComponents
            setValues={(val) => validation.setFieldValue("sal_pdf", val)}
            values={salary.id}
            showData={true}
          />
        </Col>
      </Row>
    </Form>
  );
}

export default Formulaire;
