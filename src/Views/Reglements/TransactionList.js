import React, { useState, useEffect, useMemo, useCallback } from "react";
import { CardBody, Row, Col, Card, Container, CardHeader, Modal, ModalHeader, ModalBody, Form, ModalFooter, FormFeedback, Input } from "reactstrap";
import { Link } from "react-router-dom";
import * as moment from "moment";
import BreadCrumb from "../../Components/Common/BreadCrumb";
import TableContainer from "../../Components/Common/TableContainer";
//Import actions
import { getCollaborateurs as onGetCollaborateurs, getInvoices as onGetInvoices, getTransactionList as onGetTransactionList, addNewTransaction as onAddNewTransaction, deleteTransaction as onDeleteTransaction } from "../../slices/thunks";

//redux
import { useSelector, useDispatch } from "react-redux";

import Loader from "../../Components/Common/Loader";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DeleteModal from "../../Components/Common/DeleteModal";

import "moment/locale/fr"; // without this line it didn't work
import { customFormatNumber, rounded } from "../../utils/function";
import TransactionCharts from "./TransactionCharts";
import { useFormik } from "formik";
import * as Yup from "yup";
import Select from "react-select";

moment.locale("fr");

const TransactionList = () => {
  document.title = "Encaissements | Countano";

  const dispatch = useDispatch();

  const { invoices, transactionsList, transactions, isTransactionsListSuccess, error, collaborateurs, devise } = useSelector((state) => ({
    invoices: state.Invoice.invoices,
    transactionsList: state.Transaction.transactionsList,
    transactions: state.Transaction.transactions,
    isTransactionsListSuccess: state.Transaction.isTransactionsListSuccess,
    error: state.Transaction.error,
    collaborateurs: state.Gestion.collaborateurs,
    devise: state.Company.devise
  }));

  const [chartData, setChartData] = useState([]);
  const [modal, setModal] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [selectedEntity, setSelectedEntity] = useState(null);
  const [encaissement, setEncaissement] = useState({});
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteModalMulti, setDeleteModalMulti] = useState(false);

  const toggle = () => {
    setModal(!modal);
  };

  useEffect(() => {
    dispatch(onGetInvoices());
    dispatch(onGetTransactionList());
    dispatch(onGetCollaborateurs());
  }, [dispatch, transactions]);

  // validation
  const validation = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {
      tra_date: moment().format("YYYY-MM-DD"),
      tra_value: 0,
      tra_desc: "",
      tra_fen_fk: null,
      tra_ent_fk: null
    },

    validationSchema: Yup.object({
      tra_value: Yup.number().required("Veuillez choisir entrer un montant"),
      tra_ent_fk: Yup.number().required("Veuillez choisir un client/fournisseur"),
      tra_fen_fk: Yup.number().required("Veuillez choisir une facture"),
      tra_desc: Yup.string().required("Veuillez entrer une description"),
      tra_date: Yup.date().required("Veuillez entrer une date")
    }),

    onSubmit: (values) => {
      dispatch(onAddNewTransaction(values));
      validation.resetForm();
      toggle();
    }
  });

  const onClickDelete = (encaiss) => {
    setEncaissement(encaiss);
    setDeleteModal(true);
  };

  const deleteMultiple = () => {
    const checkall = document.getElementById("checkBoxAll");
    selectedCheckBoxDelete.forEach((element) => {
      dispatch(onDeleteTransaction(element.value));
      setTimeout(() => {
        toast.clearWaitingQueue();
      }, 3000);
    });
    setIsMultiDeleteButton(false);
    checkall.checked = false;
  };

  const handleDeleteEncaiss = () => {
    if (encaissement) {
      dispatch(onDeleteTransaction(encaissement?.tra_id));
      setDeleteModal(false);
    }
  };

  // Checked All
  const checkedAll = useCallback(() => {
    const checkall = document.getElementById("checkBoxAll");
    const ele = document.querySelectorAll(".invoiceCheckBox");

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

  const deleteCheckbox = () => {
    const ele = document.querySelectorAll(".invoiceCheckBox:checked");
    ele.length > 0 ? setIsMultiDeleteButton(true) : setIsMultiDeleteButton(false);
    setSelectedCheckBoxDelete(ele);
  };

  // Invoice Column
  const columns = useMemo(() => {
    return [
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
              className="invoiceCheckBox form-check-input"
              value={rounded(cellProps.row.original?.tra_id)}
              onChange={() => {
                deleteCheckbox();
              }}
            />
          );
        },
        id: "#"
      },
      {
        Header: "Client",
        accessor: "ent_name",
        Cell: (cell) => {
          return (
            <div className="d-flex align-items-center">
              <div className="flex-shrink-0 avatar-xs me-2">
                <div className="avatar-title bg-soft-success text-success rounded-circle fs-13">{cell.row.original.ent_name?.charAt(0) || ""}</div>
              </div>
              <div>{cell.row.original.ent_name}</div>
            </div>
          );
        }
      },

      {
        Header: "Email",
        accessor: "ent_email",
        filterable: false
      },
      {
        Header: "Date",
        accessor: "tra_date",
        Cell: (cell) => <>{moment(new Date(cell.row.original.tra_date)).format("DD MMMM Y")}</>
      },
      {
        Header: "Montant",
        accessor: "tra_value",
        filterable: false,
        Cell: (cell) => (
          <>
            <div className="fw-semibold ff-secondary">
              {customFormatNumber(cell.row.original.tra_value)}
              {devise}
            </div>
          </>
        )
      },
      {
        Header: "Liaison facture",
        accessor: "fen_num_fac",
        Cell: (cell) => {
          return (
            (cell.row.original.tra_fen_fk && (
              <Link
                to={`/factures/detail/${cell.row.original.tra_fen_fk}`}
                className="fw-medium link-primary">
                Voir la facture ( ID : {cell.row.original.fen_num_fac} ){" "}
              </Link>
            )) ||
            ""
          );
        }
      },
      {
        Header: "",
        accessor: "tra_desc",
        Cell: (cell) => {
          return (
            <>
              <div className="d-flex align-items-center ">{cell.row.original.tra_desc.length > 0 && <i className="la-lg las la-sticky-note mx-3 text-primary"></i>}</div>
            </>
          );
        }
      },
      {
        Header: "Action",
        Cell: (cellProps) => {
          let encaiss = cellProps.row.original;
          // console.log(collaborateur);
          return (
            <ul className="list-inline hstack mb-0 mx-3">
              <li
                className="list-inline-item"
                title="Delete">
                <Link
                  className="remove-item-btn"
                  onClick={() => {
                    onClickDelete(encaiss);
                  }}
                  to="#">
                  <i className="ri-delete-bin-fill align-bottom text-danger"></i>
                </Link>
              </li>
            </ul>
          );
        }
      }
    ];
  }, [checkedAll]);

  useEffect(() => {
    // let sortingByDateTransaction = [...transactions].sort((a, b) => new Date(b.tra_date) - new Date(a.tra_date))
    let transactionByMount = Array(12).fill(0);
    transactionsList
      .filter((t) => moment(t.tra_date).format("YYYY") == moment().year())
      .forEach((tra) => {
        let month = moment(tra.tra_date).format("M");
        transactionByMount[month - 1] += tra.tra_value;
      });

    setChartData(transactionByMount);
  }, [transactionsList]);

  return (
    <React.Fragment>
      <div className="page-content">
        <DeleteModal
          show={deleteModal}
          onDeleteClick={handleDeleteEncaiss}
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
          <BreadCrumb
            title="Encaissements"
            pageTitle="Facturation"
          />
          <h3>Statistiques de l'année</h3>
          <Row>
            <div xl={12}>
              <TransactionCharts chartData={chartData} />
            </div>
          </Row>

          <Row>
            <Col lg={12}>
              <Card id="invoiceList">
                <CardHeader className="border-0">
                  <div className="d-flex flex-column">
                    <div
                      className="d-flex flex-row"
                      lg={12}>
                      <h5 className="card-title mb-3 flex-grow-1">Encaissements</h5>
                      <div className="hstack text-nowrap gap-2">
                        {isMultiDeleteButton && (
                          <button
                            className="btn btn-soft-danger"
                            onClick={() => setDeleteModalMulti(true)}>
                            <i className="ri-delete-bin-2-line"></i>
                          </button>
                        )}
                      </div>
                    </div>
                    <div className="flex-shrink-0">
                      <div className="d-flex gap-2 flex-wrap">
                        <button
                          onClick={toggle}
                          className="btn btn-secondary me-1">
                          <i className="ri-add-line align-bottom me-1"></i> Ajouter un encaissement
                        </button>
                      </div>
                    </div>
                  </div>
                </CardHeader>

                <CardBody className="pt-0">
                  <div>
                    {isTransactionsListSuccess ? (
                      <TableContainer
                        columns={columns}
                        data={transactionsList || []}
                        isGlobalFilter={true}
                        isAddUserList={false}
                        customPageSize={8}
                        className="custom-header-css"
                        divClass="table-responsive table-card mb-3"
                        tableClass="align-middle table-nowrap"
                        theadClass="table-light"
                        isContactsFilter={true}
                        SearchPlaceholder="Search for contact..."
                      />
                    ) : (
                      <Loader error={error} />
                    )}
                  </div>
                  <ToastContainer
                    closeButton={false}
                    limit={1}
                  />
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
        <Modal
          id="showModal"
          isOpen={modal}
          toggle={toggle}
          centered
          size="lg">
          <ModalHeader
            className="bg-soft-info p-3"
            toggle={toggle}>
            Ajouter un encaissement
          </ModalHeader>
          <Form
            className="tablelist-form"
            onSubmit={(e) => {
              e.preventDefault();
              validation.handleSubmit();
              return false;
            }}>
            <ModalBody>
              <input
                type="hidden"
                id="id-field"
              />
              <Row className="g-3">
                <Col lg={6}>
                  <Select
                    placeholder={"Selectionnez une facture"}
                    value={selectedInvoice}
                    onChange={(res) => {
                      setSelectedInvoice(res);
                      validation.setValues({
                        ...validation.values,
                        tra_fen_fk: res.value
                      });
                    }}
                    options={invoices.map((i) => ({
                      label: i.header.fen_num_fac + " - " + i.header.fen_sujet,
                      value: i.header.fen_id
                    }))}
                    name="choices-single-default"
                    id="idStatus"></Select>
                </Col>
                <Col lg={6}>
                  <Select
                    placeholder={"Selectionnez un client / fournisseur"}
                    value={selectedEntity}
                    onChange={(res) => {
                      setSelectedEntity(res);
                      validation.setValues({
                        ...validation.values,
                        tra_ent_fk: res.value
                      });
                    }}
                    options={collaborateurs.map((i) => ({
                      label: i.ent_name,
                      value: i.ent_id
                    }))}
                    name="choices-single-default"
                    id="idStatus"></Select>
                  {validation.errors?.tra_ent_fk && validation.touched?.tra_ent_fk ? <FormFeedback type="invalid">{validation.errors?.tra_date}</FormFeedback> : null}
                </Col>
                <Col lg={6}>
                  <Input
                    type="date"
                    className="form-control border-1"
                    id="tra_date"
                    name="tra_date"
                    value={validation.values?.tra_date || moment().format("YYYY-MM-DD")}
                    onBlur={validation.handleBlur}
                    onChange={validation.handleChange}
                    invalid={validation.errors?.tra_date && validation.touched?.tra_date ? true : false}
                  />
                  {validation.errors?.tra_date && validation.touched?.tra_date ? <FormFeedback type="invalid">{validation.errors?.tra_date}</FormFeedback> : null}
                </Col>
                <Col lg={6}>
                  <Input
                    type="text"
                    className="form-control border-1"
                    id="tra_desc"
                    name="tra_desc"
                    value={validation.values?.tra_desc || ""}
                    onBlur={validation.handleBlur}
                    onChange={validation.handleChange}
                    placeholder="Description"
                    invalid={validation.errors?.tra_desc && validation.touched?.tra_desc ? true : false}
                  />
                  {validation.errors?.tra_desc && validation.touched?.tra_desc ? <FormFeedback type="invalid">{validation.errors?.tra_desc}</FormFeedback> : null}
                </Col>
                <Col lg={6}>
                  <Input
                    type="number"
                    className="form-control border-1"
                    id="tra_value"
                    name="tra_value"
                    value={validation.values?.tra_value || ""}
                    onBlur={validation.handleBlur}
                    onChange={validation.handleChange}
                    placeholder="Montant de la transaction"
                    invalid={validation.errors?.tra_value && validation.touched?.tra_value ? true : false}
                  />
                  {validation.errors?.tra_value && validation.touched?.tra_value ? <FormFeedback type="invalid">{validation.errors?.tra_value}</FormFeedback> : null}
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
                  }}>
                  {" "}
                  Fermer{" "}
                </button>
                <button
                  type="submit"
                  className="btn btn-success"
                  id="add-btn">
                  {" "}
                  Ajouter
                </button>
              </div>
            </ModalFooter>
          </Form>
        </Modal>
      </div>
    </React.Fragment>
  );
};

export default TransactionList;
