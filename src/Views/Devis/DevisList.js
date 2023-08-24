import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  CardBody,
  Row,
  Col,
  Card,
  Container,
  CardHeader,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";
import { Link } from "react-router-dom";
import * as moment from "moment";
import CountUp from "react-countup";
import BreadCrumb from "../../Components/Common/BreadCrumb";
import TableContainer from "../../Components/Common/TableContainer";
import DeleteModal from "../../Components/Common/DeleteModal";

//Import Icons
import FeatherIcon from "feather-icons-react";

import { invoiceWidgets } from "../../common/data/invoiceList";
//Import actions
import {
  getInvoices as onGetInvoices,
  deleteInvoice as onDeleteInvoice,
} from "../../slices/thunks";

//redux
import { useSelector, useDispatch } from "react-redux";

import Loader from "../../Components/Common/Loader";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import 'moment/locale/fr'  // without this line it didn't work
import { InvoiceListGlobalSearch } from "../../Components/Common/GlobalSearchFilter";
moment.locale('fr')

const InvoiceList = () => {
  document.title = "Liste facture  | Countano";
  console.log(window.location.href)
  const dispatch = useDispatch();

  const { invoices, isInvoiceSuccess, error } = useSelector((state) => ({
    invoices: state.Invoice.invoices,
    isInvoiceSuccess: state.Invoice.isInvoiceSuccess,
    error: state.Invoice.error,
  }));

  //delete invoice
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteModalMulti, setDeleteModalMulti] = useState(false);

  const [customFiltered, setCustomFiltered] = useState(null);

  const [invoice, setInvoice] = useState(null);

  useEffect(() => {
    if (invoices && !invoices.length) {
      dispatch(onGetInvoices());
    }
  }, [dispatch]);

  useEffect(() => {
    // filterByDate();
    // filterByEtat();
    setInvoice(invoices);
  }, [invoices]);

  // Delete Data
  const onClickDelete = (invoice) => {
    setInvoice(invoice);
    setDeleteModal(true);
  };

  const handleDeleteInvoice = () => {
    if (invoice) {
      dispatch(onDeleteInvoice(invoice._id));
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

  const deleteMultiple = () => {
    const checkall = document.getElementById("checkBoxAll");
    selectedCheckBoxDelete.forEach((element) => {
      dispatch(onDeleteInvoice(element.value));
      setTimeout(() => { toast.clearWaitingQueue(); }, 3000);
    });
    setIsMultiDeleteButton(false);
    checkall.checked = false;
  };

  const deleteCheckbox = () => {
    const ele = document.querySelectorAll(".invoiceCheckBox:checked");
    ele.length > 0 ? setIsMultiDeleteButton(true) : setIsMultiDeleteButton(false);
    setSelectedCheckBoxDelete(ele);
  };

  // Invoice Column
  const columns = useMemo(
    () => [
      {
        Header: <input type="checkbox" id="checkBoxAll" className="form-check-input" onClick={() => checkedAll()} />,
        Cell: (cellProps) => {
          return <input type="checkbox" className="invoiceCheckBox form-check-input" value={cellProps.row.original.fen_id} onChange={() => {/*deleteCheckbox()*/ }} />;
        },
        id: '#',
      },
      {
        Header: "ID",
        accessor: "fen_id",
        filterable: false,
        Cell: (cell) => {
          return <Link to="/apps-invoices-details" className="fw-medium link-primary">{cell.row.original.fen_id}</Link>;
        },
      },
      {
        Header: "Client",
        accessor: "fco_cus_name",
        Cell: (invoice) => {
          return (
            <>
              <div className="d-flex align-items-center">
                {invoice.row.original.img
                  ? <img
                    src={process.env.REACT_APP_API_URL + "/images/users/" + invoice.row.original.img}
                    alt=""
                    className="avatar-xs rounded-circle me-2"
                  />
                  : <div className="flex-shrink-0 avatar-xs me-2">
                    <div className="avatar-title bg-soft-success text-success rounded-circle fs-13">
                      {invoice.row.original?.fco_cus_name && invoice.row.original?.fco_cus_name.charAt(0) || ""}
                    </div>
                  </div>
                }
                {invoice.row.original.fco_cus_name}
              </div>
            </>
          )
        },
      },

      {
        Header: "EMAIL",
        accessor: "fco_cus_email",
        filterable: false,
      },
      {
        Header: "Sujet",
        accessor: "fen_sujet",
      },

      {
        Header: "DATE",
        accessor: "fen_date_create",
        Cell: (invoice) => (
          <>
            {moment(new Date(invoice.row.original.fen_date_create)).format("DD MMMM Y")}
            {/* <small className="text-muted">{handleValidTime(invoice.row.original.fen_date_create)}</small> */}
          </>
        ),
      },
      {
        Header: "Montant",
        accessor: "fen_total_ttc",
        filterable: false,
        Cell: (invoice) => (
          <>
            <div className="fw-semibold ff-secondary">{invoice.row.original.fen_total_ttc}€</div>
          </>
        ),
      },
      {
        Header: "État",
        accessor: "fen_etat",
        Cell: (cell) => {
          return <span className="badge text-uppercase badge-soft-success"> {cell.row.original.fen_etat} </span>
        }
      },
      {
        Header: "Action",
        Cell: (cellProps) => {
          return (
            <UncontrolledDropdown >
              <DropdownToggle
                href="#"
                className="btn btn-soft-secondary btn-sm dropdown"
                tag="button"
              >
                <i className="ri-more-fill align-middle"></i>
              </DropdownToggle>
              <DropdownMenu className="dropdown-menu-end">
                <DropdownItem href="/apps-invoices-details">
                  <i className="ri-eye-fill align-bottom me-2 text-muted"></i>{" "}
                  View
                </DropdownItem>

                {/* <DropdownItem href="/apps-invoices-create">
                  <i className="ri-pencil-fill align-bottom me-2 text-muted"></i>{" "}
                  Edit
                </DropdownItem> */}

                <DropdownItem href="/#">
                  <i className="ri-download-2-line align-bottom me-2 text-muted"></i>{" "}
                  Download
                </DropdownItem>

                <DropdownItem divider />

                <DropdownItem
                  href="#"
                  onClick={() => { const invoiceData = cellProps.row.original; onClickDelete(invoiceData); }}
                >
                  <i className="ri-delete-bin-fill align-bottom me-2 text-muted"></i>{" "}
                  Delete
                </DropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown>
          );
        },
      },
    ],
    [checkedAll]
  );

  return (
    <React.Fragment>
      <div className="page-content">
        <DeleteModal
          show={deleteModal}
          onDeleteClick={() => handleDeleteInvoice()}
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
          <BreadCrumb title="Factures" pageTitle="Liste" />
          <Row>
            {invoiceWidgets.map((invoicewidget, key) => (
              <React.Fragment key={key}>
                <Col xl={3} md={6}>
                  <Card className="card-animate">
                    <CardBody>
                      <div className="d-flex align-items-center">
                        <div className="flex-grow-1">
                          <p className="text-uppercase fw-medium text-muted mb-0">
                            {invoicewidget.label}
                          </p>
                        </div>
                        <div className="flex-shrink-0">
                          <h5
                            className={
                              "fs-14 mb-0 text-" + invoicewidget.percentageClass
                            }
                          >
                            <i className="ri-arrow-right-up-line fs-13 align-middle"></i>{" "}
                            {invoicewidget.percentage}
                          </h5>
                        </div>
                      </div>
                      <div className="d-flex align-items-end justify-content-between mt-4">
                        <div>
                          <h4 className="fs-22 fw-semibold ff-secondary mb-4">
                            <CountUp
                              start={0}
                              prefix={invoicewidget.prefix}
           
                              decimals="2"
                              end={invoicewidget.counter}
                              duration={4}
                              className="counter-value"
                            />
                          </h4>
                          <span className="badge bg-warning me-1">
                            {invoicewidget.badge}
                          </span>{" "}
                          <span className="text-muted">
                            {" "}
                            {invoicewidget.caption}
                          </span>
                        </div>
                        <div className="avatar-sm flex-shrink-0">
                          <span className="avatar-title bg-light rounded fs-3">
                            <FeatherIcon
                              icon={invoicewidget.feaIcon}
                              className="text-success icon-dual-success"
                            />
                          </span>
                        </div>
                      </div>
                    </CardBody>
                  </Card>
                </Col>
              </React.Fragment>
            ))}
          </Row>

          <Row>
            <Col lg={12}>
              <Card id="invoiceList">
                <CardHeader className="border-0">
                  <div className="d-flex align-items-center">
                    <h5 className="card-title mb-0 flex-grow-1">Factures</h5>
                    <div className="flex-shrink-0">
                      <div className='d-flex gap-2 flex-wrap'>
                        <Link
                          to={"/factures/creation"}
                          className="btn btn-secondary me-1"
                        >
                          <i className="ri-add-line align-bottom me-1"></i> Créer une facture
                        </Link>
                        {isMultiDeleteButton && <button className="btn btn-danger"
                          onClick={() => setDeleteModalMulti(true)}
                        ><i className="ri-delete-bin-2-line"></i></button>}
                      </div>
                    </div>
                  </div>
                </CardHeader>

                <CardBody className="pt-0">
                  <div>
                    <InvoiceListGlobalSearch origneData={invoices} data={customFiltered} setData={setCustomFiltered} />
                    {isInvoiceSuccess ? (
                      <TableContainer
                        columns={columns}
                        data={(customFiltered || invoice || [])}
                        isGlobalFilter={false}
                        isAddUserList={false}
                        customPageSize={10}
                        divClass="table-responsive table-card mb-2"
                        className="custom-header-css"
                        theadClass="text-muted text-uppercase"
                        isInvoiceListFilter={true}
                        SearchPlaceholder=''
                      />
                    ) : (<Loader error={error} />)
                    }
                  </div>
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

export default InvoiceList;