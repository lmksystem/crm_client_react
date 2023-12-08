import React, { useEffect, useState, useCallback, useMemo } from "react";

import {
  Col,
  Container,
  Row,
  Card,
  CardBody,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Label,
  Input,
  Modal,
  ModalHeader,
  ModalBody,
  Form,
  ModalFooter,
  FormFeedback,
  ListGroup,
  ListGroupItem,
} from "reactstrap";

import BreadCrumb from "../../Components/Common/BreadCrumb";
import DeleteModal from "../../Components/Common/DeleteModal";

//Import actions
import {
  getEmployees as onGetEmployees,
  getSalary as onGetSalary,
  createUpdateSalary as onCreateUpdateSalary,
  deleteSalary as onDeleteSalary,
} from "../../slices/thunks";
//redux
import { useSelector, useDispatch } from "react-redux";
import TableContainer from "../../Components/Common/TableContainer";

// Formik
import * as Yup from "yup";
import { useFormik } from "formik";

import Loader from "../../Components/Common/Loader";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Cleave from "cleave.js/react";
import moment from "moment";
import { customFormatNumber } from "../../utils/function";

const Salary = () => {
  const dispatch = useDispatch();
  const { isSalarySuccess, error, employees, salaries } = useSelector(
    (state) => ({
      isSalarySuccess: state.Salary.isSalarySuccess,
      employees: state.Employee.employees,
      salaries: state.Salary.salaries,
      error: state.Employee.error,
    })
  );
  const yearActual = new Date().getFullYear().toString();

  const [salary, setSalary] = useState({}); //Objet salaire que l'ion sélectionne pour action
  const [dateFormat, setDateFormat] = useState(yearActual);
  const [isEdit, setIsEdit] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteModalMulti, setDeleteModalMulti] = useState(false);
  const [modal, setModal] = useState(false);
  const [dateMonthChoice, setDateMonthChoice] = useState(null);

  const toggle = useCallback(() => {
    if (modal) {
      setModal(false);
      setSalary({});
    } else {
      setModal(true);
    }
  }, [modal]);

  // Delete Data
  const handleDeleteSalary = () => {
    if (salary) {
      dispatch(onDeleteSalary(salary?.sal_id));
      setDeleteModal(false);
    }
  };

  const onClickDelete = (salary) => {
    setSalary(salary);
    setDeleteModal(true);
  };

  function onDateFormatChange(e) {
    setDateMonthChoice(null);
    setDateFormat(e.target.rawValue);
  }
  // Créez un objet de correspondance entre les noms des mois et leurs indices
  const moisIndices = {
    1: "Janvier",
    2: "Février",
    3: "Mars",
    4: "Avril",
    5: "Mai",
    6: "Juin",
    7: "Juillet",
    8: "Août",
    9: "Septembre",
    10: "Octobre",
    11: "Novembre",
    12: "Décembre",
  };

  // Créez un objet pour organiser les données par mois
  const [moisDonnees, setMoisDonnee] = useState({});
  const  MoisComponent = () => {
    // Affichez tous les mois de l'année, même ceux sans données
    return (
      <div>
        {Object.keys(moisIndices).map((moisIndex) => {
          const moisNom = moisIndices[moisIndex];
          let classBySelectMonth =
            moisNom === dateMonthChoice
              ? "list-group-item list-group-item-action list-group-item-info"
              : `list-group-item list-group-item-action ${
                  moisDonnees[moisNom]?.length > 0 ? " " : "disabled"
                }`;
          return (
            <button
              disabled={moisDonnees[moisNom]?.length <= 0 ? true : false}
              onClick={() => {
                setDateMonthChoice(moisNom);
              }}
              key={moisIndex}
              type="button"
              className={classBySelectMonth}
            >
              <p
                className={`p-0 m-0 ${
                  moisDonnees[moisNom]?.length > 0 ? "fw-bolder" : ""
                }`}
              >
                {moisNom}
              </p>
            </button>
          );
        })}
      </div>
    );
  }

  // validation
  const validation = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {
      salaray_use_id: (salary && salary.salaray_use_id) || "",
      salary_net: (salary && salary.salary_net) || "",
      salary_brut: (salary && salary.salary_brut) || "",
      salary_charge: (salary && salary.salary_charge) || "",
      salaray_date: (salary && salary.salaray_date) || "",
    },
    validationSchema: Yup.object({
      salaray_use_id: Yup.number().required("Veuillez sélectionner un employé"),
      salaray_date: Yup.date().required(
        "Veuillez entrer une date de versement"
      ),
      salary_net: Yup.number().required("Veuillez entrer un salaire net"),
      salary_brut: Yup.number().required("Veuillez entrer un salaire brut"),
      salary_charge: Yup.number().required(
        "Veuillez entrer un salaire brut chargé"
      ),
    }),
    onSubmit: (values) => {
      if (isEdit) {
        const updateSalary = {
          sal_id: salary.id ? salary.id : 0,
          sal_use_fk: values.salaray_use_id,
          sal_net: values.salary_net,
          sal_brut: values.salary_brut,
          sal_bcharge: values.salary_charge,
          sal_date: values.salaray_date,
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
        };
        // save new Salary
        dispatch(onCreateUpdateSalary(newSalary));
        validation.resetForm();
      }
      toggle();
    },
  });
  useEffect(() => {
    if (dateFormat?.length > 3 && salaries) {
        let moisData = {};
        for (let index = 0; index < salaries.length; index++) {
          const element = salaries[index];
          const moisNom = moisIndices[element?.mois];
          if (!moisData[moisNom]) {
            moisData[moisNom] = [];
          }
          moisData[moisNom].push(element);
        }
        setMoisDonnee(moisData);
    }
  }, [salaries])
  

  // Update Data Salaire
  const handleSalaryClick = useCallback(
    (arg) => {
      const salary = arg;
      setSalary({
        id: salary?.sal_id,
        salaray_use_id: salary.sal_use_fk,
        salary_net: salary.sal_net,
        salary_brut: salary.sal_brut,
        salary_charge: salary.sal_bcharge,
        salaray_date: salary.sal_date,
      });

      setIsEdit(true);
      toggle();
    },
    [toggle]
  );

  // Checked All
  const checkedAll = useCallback(() => {
    const checkall = document.getElementById("checkBoxAll");
    const ele = document.querySelectorAll(".contactCheckBox");

    if (checkall.checked) {
      ele.forEach((ele) => {
        ele.checked = true;
      });
    } else {
      ele.forEach((ele) => {
        ele.checked = false;
      });
    }
    deleteCheckbox();
  }, []);

  // Delete Multiple
  const [selectedCheckBoxDelete, setSelectedCheckBoxDelete] = useState([]);
  const [isMultiDeleteButton, setIsMultiDeleteButton] = useState(false);

  const deleteMultiple = () => {
    const checkall = document.getElementById("checkBoxAll");
    selectedCheckBoxDelete.forEach((element) => {
      dispatch(onDeleteSalary(element.value));
      setTimeout(() => {
        toast.clearWaitingQueue();
      }, 3000);
    });
    setIsMultiDeleteButton(false);
    checkall.checked = false;
  };

  const deleteCheckbox = () => {
    const ele = document.querySelectorAll(".contactCheckBox:checked");
    ele.length > 0
      ? setIsMultiDeleteButton(true)
      : setIsMultiDeleteButton(false);
    setSelectedCheckBoxDelete(ele);
  };

  // Column
  const columns = useMemo(
    () => [
      {
        Header: (
          <input
            type="checkbox"
            id="checkBoxAll"
            className="form-check-input"
            onClick={() => checkedAll()}
          />
        ),
        Cell: (cellProps) => {
          return (
            <input
              type="checkbox"
              className="contactCheckBox form-check-input"
              value={cellProps.row.original.sal_id}
              onChange={() => deleteCheckbox()}
            />
          );
        },
        id: "#",
      },
      {
        Header: "",
        accessor: "sal_id",
        hiddenColumns: true,
        Cell: (cell) => {
          return <input type="hidden" value={cell.row.original.sal_id} />;
        },
      },
      {
        Header: "Nom",
        accessor: "use_firstname",
        filterable: false,
      },
      {
        Header: "Prénom",
        accessor: "use_lastname",
        filterable: false,
      },
      {
        Header: "Net",
        accessor: "sal_net",
        filterable: false,
        Cell: (cell) => {
          return (
            <div className="d-flex align-items-center">
              <div >{customFormatNumber(parseFloat(cell.value))}€</div>
            </div>
          );
          }
      },
      {
        Header: "Brut",
        accessor: "sal_brut",
        filterable: false,
        Cell: (cell) => {
          return (
            <div className="d-flex align-items-center">
              <div >{customFormatNumber(parseFloat(cell.value))}€</div>
            </div>
          );
          }
      },
      {
        Header: "Brut chargé",
        accessor: "sal_bcharge",
        filterable: false,
        Cell: (cell) => {
          return (
            <div className="d-flex align-items-center">
              <div >{customFormatNumber(parseFloat(cell.value))}€</div>
            </div>
          );
          }
      },
      {
        Header: "Date versement",
        accessor: "sal_date",
        filterable: false,
        Cell: (cell) => {
          return (
            <div className="d-flex align-items-center">
              <div >{moment(cell.value).isValid()? moment(cell.value).format('D MMM YYYY'):"Aucune date"}</div>
            </div>
          );
          }
      },
      {
        Header: "Action",
        Cell: (cellProps) => {
          return (
            <ul className="list-inline hstack gap-2 mb-0">
              <li className="list-inline-item">
                <UncontrolledDropdown>
                  <DropdownToggle
                    href="#"
                    className="btn btn-soft-secondary btn-sm dropdown"
                    tag="button"
                  >
                    <i className="ri-more-fill align-middle"></i>
                  </DropdownToggle>
                  <DropdownMenu className="dropdown-menu-end">
                    <DropdownItem
                      className="dropdown-item edit-item-btn"
                      href="#"
                      onClick={() => {
                        const salaryData = cellProps.row.original;
                        handleSalaryClick(salaryData);
                      }}
                    >
                      <i className="ri-pencil-fill align-bottom me-2 text-primary"></i>{" "}
                      Modifier
                    </DropdownItem>
                    <DropdownItem
                      className="dropdown-item remove-item-btn"
                      href="#"
                      onClick={() => {
                        const salaryData = cellProps.row.original;
                        onClickDelete(salaryData);
                      }}
                    >
                      <i className="ri-delete-bin-fill align-bottom me-2 text-danger"></i>{" "}
                      Supprimer
                    </DropdownItem>
                  </DropdownMenu>
                </UncontrolledDropdown>
              </li>
            </ul>
          );
        },
      },
    ],
    [handleSalaryClick, checkedAll, salaries,moisDonnees]
  );

  //Récupération des employés pour le select du formulaire
  useEffect(() => {
    dispatch(onGetEmployees());
  }, [dispatch]);

  useEffect(() => {
    async function ChargeMoisDate(){
      if (dateFormat?.length > 3) {
        dispatch(onGetSalary(dateFormat))
          let moisData = {};
          for (let index = 0; index < salaries.length; index++) {
            const element = salaries[index];
            const moisNom = moisIndices[element?.mois];
            if (!moisData[moisNom]) {
              moisData[moisNom] = [];
            }
            moisData[moisNom].push(element);
          }
          setMoisDonnee(moisData);
      }
    }
    ChargeMoisDate()
  }, [dispatch, dateFormat, salary]);

  document.title = "Salaires | Countano";
  return (
    <React.Fragment>
      <div className="page-content">
        <DeleteModal
          show={deleteModal}
          onDeleteClick={handleDeleteSalary}
          onCloseClick={() => setDeleteModal(false)}
        />

        <DeleteModal
          show={deleteModalMulti}
          onDeleteClick={() => {
            deleteMultiple();
            setDeleteModalMulti(false);
          }}
          onCloseClick={() => setDeleteModalMulti(false)}
        />
        <Container fluid>
          <BreadCrumb title="Salaires" pageTitle="Employés" />
          <Row>
            <Col className="d-flex  justify-content-between" lg={12}>
              <div className="flex-grow-1">
                <button
                  className="btn btn-secondary add-btn"
                  onClick={() => {
                    setModal(true);
                  }}
                >
                  <i className="ri-add-fill me-1 align-bottom"></i> Ajouter un
                  salaire
                </button>
              </div>
              <div className="d-flex justify-content-end align-items-center flex-wrap gap-5 mb-2">
                <div className="flex-shrink-0 mr-8">
                  <div className="hstack text-nowrap gap-2">
                    {isMultiDeleteButton && (
                      <button
                        className="btn btn-danger"
                        onClick={() => setDeleteModalMulti(true)}
                      >
                        <i className="ri-delete-bin-2-line"></i>
                      </button>
                    )}
                  </div>
                </div>
              </div>
              <div className="mb-3 me-4">
                <Cleave
                  placeholder="Annéee"
                  options={{
                    date: true,
                    datePattern: ["Y"],
                    // limit: "2021",
                    dateMin: "2000", // Année minimale autorisée
                  }}
                  value={dateFormat}
                  onChange={(e) => onDateFormatChange(e)}
                  className="form-control"
                />
              </div>
            </Col>

            <Row>
              <Col className="view-animate">
                <Card id="contactList">
                  <CardBody className="pt-0">
                    <Row>
                      <Col lg={10} className="px-4">
                        {dateFormat?.length > 3 && dateMonthChoice && (
                          <div>
                            {isSalarySuccess ? (
                              <TableContainer
                                columns={columns}
                                data={moisDonnees[dateMonthChoice] || []}
                                isGlobalFilter={true}
                                customPageSize={8}
                                className="custom-header-css"
                                divClass="table-responsive table-card mb-3 "
                                tableClass="align-middle table-nowrap"
                                theadClass="table-light"
                                isContactsFilter={true}
                                SearchPlaceholder="Recherche..."
                              />
                            ) : (
                              <Loader error={error} />
                            )}
                          </div>
                        )}
                      </Col>
                      <Col lg={2}>
                        {dateFormat.length > 3 && (
                          <ListGroup className=" mt-3">
                            <ListGroupItem
                              tag="a"
                              to="#"
                              className="list-group-item-action active"
                            >
                              {dateFormat}
                            </ListGroupItem>
                            {MoisComponent()}
                          </ListGroup>
                        )}
                      </Col>
                    </Row>

                    <Modal
                      id="showModal"
                      isOpen={modal}
                      toggle={toggle}
                      centered
                    >
                      <ModalHeader className="bg-soft-info p-3" toggle={toggle}>
                        {!!isEdit
                          ? "Modifier un salaire"
                          : "Ajouter un salaire"}
                      </ModalHeader>

                      <Form
                        className="tablelist-form"
                        onSubmit={(e) => {
                          e.preventDefault();
                          validation.handleSubmit();
                          return false;
                        }}
                      >
                        <ModalBody>
                          <Input type="hidden" id="id-field" />
                          <Row className="g-3">
                            <Col lg={6}>
                              <div>
                                <Label
                                  htmlFor="salaray_use_id-field"
                                  className="form-label"
                                >
                                  Employé
                                </Label>

                                <Input
                                  type="select"
                                  className="form-select mb-0"
                                  validate={{
                                    required: { value: true },
                                  }}
                                  invalid={
                                    validation.touched.salaray_use_id &&
                                    validation.errors.salaray_use_id
                                      ? true
                                      : false
                                  }
                                  value={validation.values.salaray_use_id}
                                  onChange={validation.handleChange}
                                  onBlur={validation.handleBlur}
                                  name="salaray_use_id"
                                  id="salaray_use_id-field"
                                >
                                  <option disabled={true} value={""}>
                                    Choisir un employé
                                  </option>
                                  {employees?.map((e, i) => (
                                    <option key={i} value={e.use_id}>
                                      {e.use_lastname} {e.use_firstname}
                                    </option>
                                  ))}
                                </Input>
                                {validation.touched.salaray_use_id &&
                                validation.errors.salaray_use_id ? (
                                  <FormFeedback type="invalid">
                                    {validation.errors.salaray_use_id}
                                  </FormFeedback>
                                ) : null}
                              </div>
                            </Col>
                            <Col lg={6}>
                              <div>
                                <Label
                                  htmlFor="salaray_date-field"
                                  className="form-label"
                                >
                                  Date versement
                                </Label>

                                <Input
                                  name="salaray_date"
                                  id="salaray_date-field"
                                  className="form-control"
                                  type="date"
                                  validate={{
                                    required: { value: true },
                                  }}
                                  onChange={validation.handleChange}
                                  onBlur={validation.handleBlur}
                                  value={validation.values.salaray_date || ""}
                                  invalid={
                                    validation.touched.salaray_date &&
                                    validation.errors.salaray_date
                                      ? true
                                      : false
                                  }
                                />
                                {validation.touched.salaray_date &&
                                validation.errors.salaray_date ? (
                                  <FormFeedback type="invalid">
                                    {validation.errors.salaray_date}
                                  </FormFeedback>
                                ) : null}
                              </div>
                            </Col>
                            <Col lg={4}>
                              <div>
                                <Label
                                  htmlFor="salary_net-field"
                                  className="form-label"
                                >
                                  Salaire net
                                </Label>
                                <Input
                                  name="salary_net"
                                  id="salary_net-field"
                                  className="form-control"
                                  placeholder="Net"
                                  type="number"
                                  validate={{
                                    required: { value: true },
                                  }}
                                  onChange={validation.handleChange}
                                  onBlur={validation.handleBlur}
                                  value={validation.values.salary_net || ""}
                                  invalid={
                                    validation.touched.salary_net &&
                                    validation.errors.salary_net
                                      ? true
                                      : false
                                  }
                                />
                                {validation.touched.salary_net &&
                                validation.errors.salary_net ? (
                                  <FormFeedback type="invalid">
                                    {validation.errors.salary_net}
                                  </FormFeedback>
                                ) : null}
                              </div>
                            </Col>
                            <Col lg={4}>
                              <div>
                                <Label
                                  htmlFor="salary-brut-field"
                                  className="form-label"
                                >
                                  Salaire brut
                                </Label>
                                <Input
                                  name="salary_brut"
                                  id="salary_brut-field"
                                  className="form-control"
                                  placeholder="Brut"
                                  type="number"
                                  validate={{
                                    required: { value: true },
                                  }}
                                  onChange={validation.handleChange}
                                  onBlur={validation.handleBlur}
                                  value={validation.values.salary_brut || ""}
                                  invalid={
                                    validation.touched.salary_brut &&
                                    validation.errors.salary_brut
                                      ? true
                                      : false
                                  }
                                />
                                {validation.touched.salary_brut &&
                                validation.errors.salary_brut ? (
                                  <FormFeedback type="invalid">
                                    {validation.errors.salary_brut}
                                  </FormFeedback>
                                ) : null}
                              </div>
                            </Col>
                            <Col lg={4}>
                              <div>
                                <Label
                                  htmlFor="salary_charge-field"
                                  className="form-label"
                                >
                                  Salaire brut chargé
                                </Label>
                                <Input
                                  name="salary_charge"
                                  id="salary_charge-field"
                                  className="form-control"
                                  placeholder="Brut chargé"
                                  type="number"
                                  validate={{
                                    required: { value: true },
                                  }}
                                  onChange={validation.handleChange}
                                  onBlur={validation.handleBlur}
                                  value={validation.values.salary_charge || ""}
                                  invalid={
                                    validation.touched.salary_charge &&
                                    validation.errors.salary_charge
                                      ? true
                                      : false
                                  }
                                />
                                {validation.touched.salary_charge &&
                                validation.errors.salary_charge ? (
                                  <FormFeedback type="invalid">
                                    {validation.errors.salary_charge}
                                  </FormFeedback>
                                ) : null}
                              </div>
                            </Col>
                          </Row>
                        </ModalBody>
                        <ModalFooter>
                          <div className="hstack gap-2 justify-content-end">
                            <button
                              type="button"
                              className="btn btn-light"
                              onClick={() => {
                                setModal(false);
                              }}
                            >
                              {" "}
                              Fermer{" "}
                            </button>
                            <button
                              type="submit"
                              className="btn btn-success"
                              id="add-btn"
                            >
                              {" "}
                              {!!isEdit ? "Modifier" : "Ajouter"}{" "}
                            </button>
                          </div>
                        </ModalFooter>
                      </Form>
                    </Modal>
                    <ToastContainer closeButton={false} limit={1} />
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default Salary;
