import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  CardBody,
  Row,
  Col,
  Card,
  Container,
  CardHeader,
} from "reactstrap";
import { Link } from "react-router-dom";
import * as moment from "moment";
import BreadCrumb from "../../Components/Common/BreadCrumb";
import TableContainer from "../../Components/Common/TableContainer";

//Import actions
import {
  getInvoices as onGetInvoices,
  getWidgetInvoices as onGetInvoiceWidgets,
  getTransaction as onGetTransaction
} from "../../slices/thunks";

//redux
import { useSelector, useDispatch } from "react-redux";

import Loader from "../../Components/Common/Loader";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import 'moment/locale/fr'  // without this line it didn't work
import { InvoiceListGlobalSearch } from "../../Components/Common/GlobalSearchFilter";
import { customFormatNumber, rounded } from "../../utils/function";
import { api } from "../../config";
import WidgetCountUp from "../../Components/Common/WidgetCountUp";

moment.locale('fr')

const InvoiceList = () => {
  document.title = "Liste facture  | Countano";

  const dispatch = useDispatch();

  const { invoiceWidgets, invoices, transactions, isInvoiceSuccess, error } = useSelector((state) => ({
    invoices: state.Invoice.invoices,
    isInvoiceSuccess: state.Invoice.isInvoiceSuccess,
    invoiceWidgets: state.Invoice.widgets,
    error: state.Invoice.error,
    transactions: state.Transaction.transactions

  }));

  const [customFiltered, setCustomFiltered] = useState(null);

  useEffect(() => {
    dispatch(onGetInvoiceWidgets());
    dispatch(onGetInvoices());
    dispatch(onGetTransaction());
  }, [dispatch]);

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
  const columns = useMemo(
    () => [
      // {
      //   Header: "ID",
      //   accessor: "header.fen_id",
      //   filterable: false,
      //   Cell: (cell) => {
      //     return <Link to={`/factures/detail/${cell.value}`} className="fw-medium link-primary">{cell.row.original.header.fen_id}</Link>;
      //   },
      // },
      {
        Header: "Numéro facture",
        accessor: "header.fen_num_fac",
        filterable: false,
        Cell: (cell) => {
          return <Link to={`/factures/detail/${cell.row.original.header.fen_id}`} className="fw-medium link-primary">{cell.row.original.header.fen_num_fac}</Link>;
        },
      },
      {
        Header: "Client",
        accessor: "header.fco_cus_name",
        Cell: (invoice) => {
          return (
            <>
              <div className="d-flex align-items-center">
                {invoice.row.original.img
                  ? <img
                    src={api.API_URL + "/images/users/" + invoice.row.original.img}
                    alt=""
                    className="avatar-xs rounded-circle me-2"
                  />
                  : <div className="flex-shrink-0 avatar-xs me-2">
                    <div className="avatar-title bg-soft-success text-success rounded-circle fs-13">
                      {invoice.row.original?.contact?.fco_cus_name && invoice.row.original?.contact?.fco_cus_name.charAt(0) || ""}
                    </div>
                  </div>
                }
                {invoice.row.original.contact?.fco_cus_name}
              </div>
            </>
          )
        },
      },

      {
        Header: "EMAIL",
        accessor: "contact.fco_cus_email",
        filterable: false,
      },
      {
        Header: "Sujet",
        accessor: "header.fen_sujet",
      },

      {
        Header: "DATE",
        accessor: "header.fen_date_create",
        Cell: (invoice) => (
          <>
            {moment(new Date(invoice.row.original.header.fen_date_create)).format("DD MMMM Y")}
            {/* <small className="text-muted">{handleValidTime(invoice.row.original.fen_date_create)}</small> */}
          </>
        ),
      },
      {
        Header: "Montant",
        accessor: "header.fen_total_ttc",
        filterable: false,
        Cell: (invoice) => (
          <>
            <div className="fw-semibold ff-secondary">{customFormatNumber(rounded(invoice.row.original.header.fen_total_ttc, 2))}{devise}</div>
          </>
        ),
      },
      {
        Header: "Reste à payer",
        accessor: "",
        filterable: false,
        Cell: (invoice) => {
          let transactionOfFac = transactions.filter((t) => t.tra_fen_fk == invoice.row.original.header.fen_id)
          return (
            <>
              <div className="fw-semibold ff-secondary">
                {customFormatNumber(rounded(transactionOfFac.reduce((previousValue, currentValue) => parseFloat(previousValue) - parseFloat(currentValue.tra_value), parseFloat(invoice.row.original.header.fen_total_ttc)), 2))}{devise}
              </div>
            </>
          )
        },
      },
      {
        Header: "État",
        accessor: "header.fet_name",
        Cell: (cell) => {
          return <span className="badge text-uppercase badge-soft-success"> {cell.row.original.header.fet_name} </span>
        }
      },

    ],
    [checkedAll, invoices]
  );



  return (
    <React.Fragment>
      <div className="page-content">

        <Container fluid>
          <BreadCrumb title="Factures" pageTitle="Facturation" />
          <h3>Statistiques de l'année</h3>
          <Row className="d-flex  justify-content-around ">
            {invoiceWidgets?.filter(e=>e.icon!="none")?.map((widget,i) => {
              console.log(widget)
              return <WidgetCountUp key={i} data={widget} type={"Factures"} />
            })}
          </Row>

          <Row>
            <Col lg={12}>
              <Card id="invoiceList">
                <CardHeader className="border-0">
                  <div className="d-flex align-items-center">
                    {/* <h5 className="card-title mb-0 flex-grow-1">Factures</h5> */}
                    <div className="flex-shrink-0">
                      <div className='d-flex gap-2 flex-wrap'>
                        <Link
                          to={"/factures/creation"}
                          className="btn btn-secondary me-1"
                        >
                          <i className="ri-add-line align-bottom me-1"></i> Créer une facture
                        </Link>

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
                        data={(customFiltered || invoices || [])}
                        isGlobalFilter={false}
                        isAddUserList={false}
                        customPageSize={10}
                        divClass="table-responsive table-card mb-2"
                        className="custom-header-css"
                        theadClass="text-muted text-uppercase"
                        isInvoiceListFilter={true}
                        SearchPlaceholder=''
                        pathToDetail={`/factures/detail/`}
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