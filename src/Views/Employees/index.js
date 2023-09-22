import React, { useEffect, useState, useCallback, useMemo } from "react";
import { Link } from "react-router-dom";
import { isEmpty } from "lodash";

import {
  Col,
  Container,
  Row,
  Card,
  CardHeader,
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
  Table,
  FormFeedback,
} from "reactstrap";

import BreadCrumb from "../../Components/Common/BreadCrumb";
import DeleteModal from "../../Components/Common/DeleteModal";

//Import actions
import {
  deleteEmployee as onDeleteEmployee,
  getEmployees as onGetEmployees,
  createUpdateEmployee as onCreateUpdateEmployee,
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

const Employees = () => {
  const dispatch = useDispatch();
  const { isEmployeSuccess, error, employees } = useSelector((state) => ({
    isEmployeSuccess: state.Employee.isEmployeSuccess,
    employees: state.Employee.employees,
    error: state.Employee.error,
  }));

  const [employee, setEmployee] = useState({});

  const [isEdit, setIsEdit] = useState(false);

  //delete Conatct
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteModalMulti, setDeleteModalMulti] = useState(false);

  const [show, setShow] = useState(false);

  const [modal, setModal] = useState(false);

  const [info, setInfo] = useState([]);

  const toggle = useCallback(() => {
    if (modal) {
      setModal(false);
      setEmployee({});
    } else {
      setModal(true);
    }
  }, [modal]);

  // Delete Data
  const handleDeleteContact = () => {
    if (employee) {
      dispatch(onDeleteEmployee(employee?.use_id));
      setDeleteModal(false);
    }
  };

  const onClickDelete = (employee) => {
    setEmployee(employee);
    setDeleteModal(true);
  };

  // validation
  const validation = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {
      lastname: (employee && employee.lastname) || "",
      firstname: (employee && employee.firstname) || "",
      email: (employee && employee.email) || "",
      date_entree: (employee && employee.date_entree) || "",
    },
    validationSchema: Yup.object({
      lastname: Yup.string().required("Veuillez entrer un nom"),
      firstname: Yup.string().required("Veuillez entrer un prénom"),
      email: Yup.string().required("Veuillez entrer un email"),
      date_entree: Yup.date().required("Veuillez entrer une date d'entrée"),
    }),
    onSubmit: (values) => {
      if (isEdit) {
        const updateEmployee = {
          use_id: employee.id ? employee.id : 0,
          use_lastname: values.lastname,
          use_firstname: values.firstname,
          use_email: values.email,
          usa_date_entree: values?.date_entree || null,
          use_password: "none",
        };

        // update Employee
        dispatch(onCreateUpdateEmployee(updateEmployee));
        validation.resetForm();
      } else {
        const newEmployee = {
          use_lastname: values["lastname"],
          use_firstname: values["firstname"],
          use_email: values["email"],
          use_password: "none",
          use_rank: 1,
          usa_date_entree: values?.date_entree || null,
        };

        // save new Contact
        dispatch(onCreateUpdateEmployee(newEmployee));
        validation.resetForm();
      }
      toggle();
    },
  });

  // Update Data
  const handleContactClick = useCallback(
    (arg) => {
      const employee = arg;

      setEmployee({
        id: employee?.use_id,
        lastname: employee.use_lastname,
        firstname: employee.use_firstname,
        email: employee.use_email,
        date_entree: employee?.usa_date_entree,
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
      console.log();
      dispatch(onDeleteEmployee(element.value));
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
    console.log(ele);
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
              value={cellProps.row.original.use_id}
              onChange={() => deleteCheckbox()}
            />
          );
        },
        id: "#",
      },
      {
        Header: "",
        accessor: "use_id",
        hiddenColumns: true,
        Cell: (cell) => {
          return <input type="hidden" value={cell.value} />;
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
        Header: "Email",
        accessor: "use_email",
        filterable: false,
      },
      {
        Header: "Date entrée",
        accessor: "usa_date_entree",
        filterable: false,
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
                      className="dropdown-item"
                      href="#"
                      onClick={() => {
                        const employeeData = cellProps.row.original;
                        setInfo(employeeData);
                        setShow(true);
                      }}
                    >
                      <i className="ri-eye-fill align-bottom me-2 text-muted"></i>{" "}
                      Voir
                    </DropdownItem>
                    <DropdownItem
                      className="dropdown-item edit-item-btn"
                      href="#"
                      onClick={() => {
                        const employeeData = cellProps.row.original;
                        handleContactClick(employeeData);
                      }}
                    >
                      <i className="ri-pencil-fill align-bottom me-2 text-muted"></i>{" "}
                      Modifier
                    </DropdownItem>
                    <DropdownItem
                      className="dropdown-item remove-item-btn"
                      href="#"
                      onClick={() => {
                        const employeeData = cellProps.row.original;
                        onClickDelete(employeeData);
                      }}
                    >
                      <i className="ri-delete-bin-fill align-bottom me-2 text-muted"></i>{" "}
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
    [handleContactClick, checkedAll, employee]
  );


  useEffect(() => {
    if (show) {
      setTimeout(() => {
        document.getElementById("start-anime").classList.add("show");
      }, 200);
    }
  }, [show]);

  useEffect(() => {
    dispatch(onGetEmployees());
  }, [dispatch]);


  useEffect(() => {
    if (!isEmpty(employees)) {
      setEmployee(employees);
      setIsEdit(false);
    }
  }, [employees]);

  // SideBar Contact Deatail

  document.title = "Liste employé | Countano";
  return (
    <React.Fragment>
      <div className="page-content">
        <DeleteModal
          show={deleteModal}
          onDeleteClick={handleDeleteContact}
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
          <BreadCrumb title="Liste employé" pageTitle="Employés" />
          <Row>
            <Col className="view-animate" xxl={show ? 9 : 12}>
              <Card id="contactList">
                <CardHeader>
                  <div className="d-flex align-items-center flex-wrap gap-2">
                    <div className="flex-grow-1">
                      <button
                        className="btn btn-info add-btn"
                        onClick={() => {
                          setModal(true);
                        }}
                      >
                        <i className="ri-add-fill me-1 align-bottom"></i>{" "}
                        Ajouter Employé
                      </button>
                    </div>
                    <div className="flex-shrink-0">
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
                </CardHeader>
                <CardBody className="pt-0">
                  <div>
                    {isEmployeSuccess ? (
                      <TableContainer
                        columns={columns}
                        data={employees || []}
                        isGlobalFilter={true}
                        isAddUserList={false}
                        customPageSize={8}
                        className="custom-header-css"
                        divClass="table-responsive table-card mb-3"
                        tableClass="align-middle table-nowrap"
                        theadClass="table-light"
                        // handleContactClick={handleContactClicks}
                        isContactsFilter={true}
                        SearchPlaceholder="Recherche..."
                      />
                    ) : (
                      <Loader error={error} />
                    )}
                  </div>

                  <Modal id="showModal" isOpen={modal} toggle={toggle} centered>
                    <ModalHeader className="bg-soft-info p-3" toggle={toggle}>
                      {!!isEdit ? "Modifier un employé" : "Ajouter un employé"}
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
                                validate={{
                                  required: { value: true },
                                }}
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
                                validate={{
                                  required: { value: true },
                                }}
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

                          <Col lg={12}>
                            <div>
                              <Label
                                htmlFor="email_id-field"
                                className="form-label"
                              >
                                Email
                              </Label>

                              <Input
                                name="email"
                                id="email_id-field"
                                className="form-control"
                                placeholder="Entrer un email"
                                type="email"
                                validate={{
                                  required: { value: true },
                                }}
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

                          <Col lg={12}>
                            <div>
                              <Label
                                htmlFor="date_entree-field"
                                className="form-label"
                              >
                                Date entrée dans l'entreprise
                              </Label>

                              <Input
                                name="date_entree"
                                id="date_entree-field"
                                className="form-control"
                                type="date"
                                validate={{
                                  required: { value: true },
                                }}
                                onChange={validation.handleChange}
                                onBlur={validation.handleBlur}
                                value={validation.values.date_entree || ""}
                                invalid={
                                  validation.touched.date_entree &&
                                  validation.errors.date_entree
                                    ? true
                                    : false
                                }
                              />
                              {validation.touched.date_entree &&
                              validation.errors.date_entree ? (
                                <FormFeedback type="invalid">
                                  {validation.errors.date_entree}
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
                              setIsEdit(false);
                              setEmployee({});
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

            <div id="start-anime">
              <Card id="contact-view-detail">
                <CardBody className="text-center">
                  <h5 className="mt-4 mb-1">
                    {info.use_lastname + " " + info.use_firstname}
                  </h5>
                  <ul className="list-inline mb-0">
                    <li className="list-inline-item avatar-xs">
                      <Link
                        to={`mailto:${info.use_email}`}
                        className="avatar-title bg-soft-danger text-danger fs-15 rounded"
                      >
                        <i className="ri-mail-line"></i>
                      </Link>
                    </li>
                  </ul>
                </CardBody>
                <CardBody>
                  <div className="table-responsive table-card">
                    <Table className="table table-borderless mb-0">
                      <tbody>
                        <tr>
                          <td className="fw-medium">Email</td>
                          <td>{info.use_email}</td>
                        </tr>
                      </tbody>
                    </Table>
                  </div>
                </CardBody>
              </Card>
            </div>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default Employees;
