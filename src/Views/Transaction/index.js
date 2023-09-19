import React, { useEffect, useState, useCallback, useMemo } from "react";
import { Link } from "react-router-dom";
import { isEmpty } from "lodash";
import * as moment from "moment";

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
  ListGroup,
  ListGroupItem,
} from "reactstrap";
import Flatpickr from "react-flatpickr";

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
import SimpleBar from "simplebar-react";

const TransactionBank = () => {
  const dispatch = useDispatch();
  const { isEmployeSuccess, error, employees } = useSelector((state) => ({
    isEmployeSuccess: state.Employee.isEmployeSuccess,
    employees: state.Employee.employees,
    error: state.Employee.error,
  }));

  useEffect(() => {
    dispatch(onGetEmployees());
  }, [dispatch]);

  useEffect(() => {
    if (!isEmpty(employees)) {
      setEmployee(employees);
      setIsEdit(false);
    }
  }, [employees]);

  const [employee, setEmployee] = useState({});

  const [isEdit, setIsEdit] = useState(false);

  const dataForceTransacBank = [
    {
      tba_id: 1,
      tba_date: "2023-02-01",
      tba_desc:
        "Lorem ipsum dolor sit amet, ut aliquip ex ea commodo consequat. ",
      ent_name: "Banque",
      tba_debit: 10.55,
      tba_credit: "",
      tba_assoc: "Validé",
    },
    {
      tba_id: 2,
      tba_date: "2023-02-01",
      tba_desc:
        "Lorem ipsum dolor sit amet, ut aliquip ex ea commodo consequat.",
      ent_name: "Client",
      tba_debit: "",
      tba_credit: 40.8,
      tba_assoc: "Effectué",
    },
  ];

  const [collaborateurList, setCollaborateurList] = useState([]);
  const [collaborateur, setCollaborateur] = useState(null);

  //delete Conatct
  const [deleteModal, setDeleteModal] = useState(false);

  const [show, setShow] = useState(false);

  const [modal, setModal] = useState(false);

  const toggle = useCallback(() => {
    console.log("modal", modal);
    if (modal) {
      setModal(false);
      setEmployee({});
      setCollaborateur(null);
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

  // validation
  const validation = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {
      //   lastname: (employee && employee.lastname) || "",
      //   firstname: (employee && employee.firstname) || "",
      //   email: (employee && employee.email) || "",
      //   date_entree: (employee && employee.date_entree) || "",
      nojustify: false,
      file_justify: "",
    },
    // validationSchema: Yup.object({
    //   lastname: Yup.string().required("Veuillez entrer un nom"),
    //   firstname: Yup.string().required("Veuillez entrer un prénom"),
    //   email: Yup.string().required("Veuillez entrer un email"),
    //   date_entree: Yup.date().required("Veuillez entrer une date d'entrée"),
    // }),
    onSubmit: (values) => {
      //   if (isEdit) {
      //     const updateEmployee = {
      //       use_id: employee.id ? employee.id : 0,
      //       use_lastname: values.lastname,
      //       use_firstname: values.firstname,
      //       use_email: values.email,
      //       usa_date_entree: values?.date_entree || null,
      //       use_password: "none",
      //     };
      //     // update Employee
      //     dispatch(onCreateUpdateEmployee(updateEmployee));
      //     validation.resetForm();
      //   } else {
      //     const newEmployee = {
      //       use_lastname: values["lastname"],
      //       use_firstname: values["firstname"],
      //       use_email: values["email"],
      //       use_password: "none",
      //       use_rank: 1,
      //       usa_date_entree: values?.date_entree || null,
      //     };
      //     // console.log(newEmployee)
      //     // save new Contact
      //     dispatch(onCreateUpdateEmployee(newEmployee));
      //     validation.resetForm();
      //   }
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

  // Column
  const columns = useMemo(
    () => [
      {
        Header: "",
        accessor: "tba_id",
        hiddenColumns: true,
        Cell: (cell) => {
          return <input type="hidden" value={cell.value} />;
        },
      },
      {
        Header: "Date",
        accessor: "tba_date",
        filterable: false,
      },
      {
        Header: "Description",
        accessor: "tba_desc",
        filterable: false,
      },
      {
        Header: "Fournisseur/Client",
        accessor: "ent_name",
        filterable: false,
      },
      {
        Header: "Débit",
        accessor: "tba_debit",
        filterable: false,
      },
      {
        Header: "Crédit",
        accessor: "tba_credit",
        filterable: false,
      },
      {
        Header: "Association",
        accessor: "tba_assoc",
        filterable: false,
      },
    ],
    [handleContactClick, collaborateurList, employee]
  );

  useEffect(() => {
    if (show) {
      setTimeout(() => {
        document.getElementById("start-anime").classList.add("show");
      }, 400);
    } else {
      // setTimeout(() => {
      document.getElementById("start-anime").classList.remove("show");
      //   }, 200);
    }
  }, [show]);

  // SideBar Contact Deatail
  const [info, setInfo] = useState([]);

  const partiesDuChemin = validation?.values?.file_justify.split("\\"); // Divise le chemin en morceaux en fonction de "\"
  const nomDuFichier = partiesDuChemin[partiesDuChemin.length - 1];
  document.title = "Transactions bancaires | Countano";
  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <BreadCrumb
            title="Transactions bancaires"
            pageTitle="Banque / Achat"
          />
          <Row>
            <div className="mt-3 mt-lg-0">
              <form action="#">
                <Row className="g-3 mb-0 align-items-center">
                  <div className="col-sm-auto">
                    <div className="input-group">
                      <Flatpickr
                        className="form-control border-0 fs-13 dash-filter-picker shadow"
                        options={{
                          locale: "fr",
                          mode: "range",
                          dateFormat: "d M, Y",
                          // defaultDate: [perdiodeCalendar?.start,perdiodeCalendar?.end]
                        }}
                        onChange={(periodDate) => {
                          console.log(periodDate);

                          if (periodDate.length == 2) {
                            setPeriodeCalendar({
                              start: moment(periodDate[0]).format("YYYY-MM-DD"),
                              end: moment(periodDate[1]).format("YYYY-MM-DD"),
                            });
                          } else if (periodDate.length == 1) {
                            setPeriodeCalendar({
                              start: moment(periodDate[0]).format("YYYY-MM-DD"),
                              end: moment(periodDate[0]).format("YYYY-MM-DD"),
                            });
                          } else {
                            setPeriodeCalendar({
                              start: null,
                              end: null,
                            });
                          }
                        }}
                      />
                      <div className="input-group-text bg-secondary border-secondary text-white">
                        <i className="ri-calendar-2-line"></i>
                      </div>
                    </div>
                  </div>
                  {/* <div className="col-auto">
                                        <button type="button" className="btn btn-soft-success"><i className="ri-add-circle-line align-middle me-1"></i> Add Product</button>
                                    </div>
                                    <div className="col-auto">
                                        <button type="button" className="btn btn-soft-info btn-icon waves-effect waves-light layout-rightside-btn" onClick={props.rightClickBtn} ><i className="ri-pulse-line"></i></button>
                                    </div> */}
                </Row>
              </form>
            </div>
            <Col className="view-animate" xxl={show ? 7 : 12}>
              <Card id="contactList">
                <CardBody className="pt-0">
                  <div>
                    {isEmployeSuccess ? (
                      <TableContainer
                        columns={columns}
                        data={dataForceTransacBank || []}
                        actionItem={(row) => {
                          const transData = row.original;
                          setInfo(transData);
                          setShow(true);
                        }}
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
                  <ToastContainer closeButton={false} limit={1} />
                </CardBody>
              </Card>
            </Col>
            <Col xxl={show ? 5 : 0}>
              <div id="start-anime">
                <Card id="contact-view-detail">
                  <div
                    onClick={() => {
                      setShow(false);
                    }}
                  >
                    <i className="las la-chevron-circle-left la-2x m-2"></i>
                  </div>

                  <CardBody className="text-center">
                    <h5 className=" mb-1">Détail transaction</h5>
                  </CardBody>
                  <CardBody>
                    <div className="table-responsive table-card">
                      <Form
                        className="tablelist-form"
                        onSubmit={(e) => {
                          e.preventDefault();
                          validation.handleSubmit();
                          return false;
                        }}
                      >
                        <div className="p-3">
                          <Input type="hidden" id="id-field" />

                          {validation?.values?.file_justify === "" && (
                            <Col lg={8} className="mt-3">
                              <div className="form-switch">
                                <Input
                                  name="nojustify"
                                  id="nojustify-field"
                                  className="form-check-input"
                                  type="checkbox"
                                  role="switch"
                                  checked={validation.values.nojustify || false}
                                  onChange={validation.handleChange}
                                  onBlur={validation.handleBlur}
                                />
                                <Label
                                  htmlFor="nojustify-field"
                                  className="form-label mx-3"
                                >
                                  Pas de justificatif nécessaire
                                </Label>
                              </div>
                            </Col>
                          )}

                          {validation?.values?.file_justify !== "" && (
                            <Row className="mt-3">
                            <Col lg={3}>
                              <p>{nomDuFichier}</p>
                            </Col>
                            <Col lg={3} >
                                <i className="lab la-readme la-lg mx-2"></i>
                                <i className="ri-delete-bin-fill text-muted la-lg  mx-2"></i>                                
                            </Col>
                            </Row>
                          )}

                          {!validation?.values?.nojustify && validation?.values?.file_justify === "" && (
                            <Col lg={11} className="mt-4">
                              <div>
                                <p className="text-muted">
                                  Sélectionner un justificatif d'achat /
                                  Importer le depuis vos fichiers
                                </p>
                                <div id="users">
                                  <Row className="mb-2">
                                    <Col lg={5}>
                                      <div>
                                        <input
                                          className="search form-control"
                                          placeholder="Chercher justificatif"
                                        />
                                      </div>
                                    </Col>
                                    <Col lg={1} className="my-auto ">
                                      <p className="text-align-center">ou</p>
                                    </Col>
                                    <Col lg={6} className="col-auto">
                                      <Input
                                        name="file_justify"
                                        id="file_justify-field"
                                        className="form-control"
                                        type="file"
                                        onChange={validation.handleChange}
                                        onBlur={validation.handleBlur}
                                        value={
                                          validation.values.file_justify || ""
                                        }
                                        accept=".pdf"
                                      />
                                    </Col>
                                  </Row>

                                  <SimpleBar
                                    style={{ height: "242px" }}
                                    className="mx-n3"
                                  >
                                    <ListGroup className="list mb-0" flush>
                                      <ListGroupItem data-id="1">
                                        <div className="d-flex">
                                          <div className="flex-grow-1">
                                            <h5 className="fs-13 mb-1">
                                              <Link
                                                to="#"
                                                className="link name text-dark"
                                              >
                                                Banque
                                              </Link>
                                            </h5>
                                            <p
                                              className="born timestamp text-muted mb-0"
                                              data-timestamp="12345"
                                            >
                                              2023-05-05
                                            </p>
                                          </div>
                                          <div className="flex-shrink-0">
                                            <div>€ -25.00</div>
                                          </div>
                                        </div>
                                      </ListGroupItem>
                                      <ListGroupItem data-id="1">
                                        <div className="d-flex">
                                          <div className="flex-grow-1">
                                            <h5 className="fs-13 mb-1">
                                              <Link
                                                to="#"
                                                className="link name text-dark"
                                              >
                                                Banque
                                              </Link>
                                            </h5>
                                            <p
                                              className="born timestamp text-muted mb-0"
                                              data-timestamp="12345"
                                            >
                                              2023-05-05
                                            </p>
                                          </div>
                                          <div className="flex-shrink-0">
                                            <div>€ -25.00</div>
                                          </div>
                                        </div>
                                      </ListGroupItem>
                                      <ListGroupItem data-id="1">
                                        <div className="d-flex">
                                          <div className="flex-grow-1">
                                            <h5 className="fs-13 mb-1">
                                              <Link
                                                to="#"
                                                className="link name text-dark"
                                              >
                                                Banque
                                              </Link>
                                            </h5>
                                            <p
                                              className="born timestamp text-muted mb-0"
                                              data-timestamp="12345"
                                            >
                                              2023-05-05
                                            </p>
                                          </div>
                                          <div className="flex-shrink-0">
                                            <div>€ -25.00</div>
                                          </div>
                                        </div>
                                      </ListGroupItem>
                                      <ListGroupItem data-id="1">
                                        <div className="d-flex">
                                          <div className="flex-grow-1">
                                            <h5 className="fs-13 mb-1">
                                              <Link
                                                to="#"
                                                className="link name text-dark"
                                              >
                                                Banque
                                              </Link>
                                            </h5>
                                            <p
                                              className="born timestamp text-muted mb-0"
                                              data-timestamp="12345"
                                            >
                                              2023-05-05
                                            </p>
                                          </div>
                                          <div className="flex-shrink-0">
                                            <div>€ -25.00</div>
                                          </div>
                                        </div>
                                      </ListGroupItem>
                                      <ListGroupItem data-id="1">
                                        <div className="d-flex">
                                          <div className="flex-grow-1">
                                            <h5 className="fs-13 mb-1">
                                              <Link
                                                to="#"
                                                className="link name text-dark"
                                              >
                                                Banque
                                              </Link>
                                            </h5>
                                            <p
                                              className="born timestamp text-muted mb-0"
                                              data-timestamp="12345"
                                            >
                                              2023-05-05
                                            </p>
                                          </div>
                                          <div className="flex-shrink-0">
                                            <div>€ -25.00</div>
                                          </div>
                                        </div>
                                      </ListGroupItem>
                                      <ListGroupItem data-id="1">
                                        <div className="d-flex">
                                          <div className="flex-grow-1">
                                            <h5 className="fs-13 mb-1">
                                              <Link
                                                to="#"
                                                className="link name text-dark"
                                              >
                                                Banque
                                              </Link>
                                            </h5>
                                            <p
                                              className="born timestamp text-muted mb-0"
                                              data-timestamp="12345"
                                            >
                                              2023-05-05
                                            </p>
                                          </div>
                                          <div className="flex-shrink-0">
                                            <div>€ -25.00</div>
                                          </div>
                                        </div>
                                      </ListGroupItem>
                                    </ListGroup>
                                  </SimpleBar>
                                </div>
                              </div>
                            </Col>
                          )}
                          {

                          }
                        </div>
                      </Form>
                    </div>
                  </CardBody>
                </Card>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default TransactionBank;
