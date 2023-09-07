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

//Import Icons
import FeatherIcon from "feather-icons-react";

import { invoiceWidgets } from "../../common/data/invoiceList";
//Import actions
import {
  getCollaborateurs as onGetCollaborateurs,
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
import { rounded } from "../../utils/function";
import { api } from "../../config";


moment.locale('fr')

const TransactionList = () => {
  document.title = "Liste facture  | Countano";

  const dispatch = useDispatch();

  const { invoices, transactions, isTransactionsSuccess, error } = useSelector((state) => ({
    invoices: state.Invoice.invoices,
    transactions: state.Transaction.transactions,
    isTransactionsSuccess: state.Transaction.isTransactionsSuccess,
    error: state.Transaction.error

  }));

  const [customFiltered, setCustomFiltered] = useState(null);

  useEffect(() => {
    dispatch(onGetInvoices());
    dispatch(onGetTransaction());
    dispatch(onGetCollaborateurs());
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
      {
        Header: <input type="checkbox" id="checkBoxAll" className="form-check-input" onClick={() => checkedAll()} />,
        Cell: (cellProps) => {
          return <input type="checkbox" className="invoiceCheckBox form-check-input" value={cellProps.row.original.tra_id} onChange={() => {/*deleteCheckbox()*/ }} />;
        },
        id: '#',
      },
      {
        Header: "ID",
        accessor: "tra_id",
        filterable: false,
        Cell: (cell) => {
          return <Link to={`/factures/detail/${cell.value}`} className="fw-medium link-primary">{cell.row.original.tra_id}</Link>;
        },
      },
      {
        Header: "Client",
        accessor: "",
        Cell: (invoice) => {
          return (
            <>
              <div className="flex-shrink-0 avatar-xs me-2">
                <div className="avatar-title bg-soft-success text-success rounded-circle fs-13">
                  {"a".charAt(0) || ""}
                </div>
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
            {moment(new Date()).format("DD MMMM Y")}
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
            <div className="fw-semibold ff-secondary">{}€</div>
          </>
        ),
      },
      {
        Header: "Reste à payer",
        accessor: "",
        filterable: false,
        Cell: (invoice) => {
          return (
            <>
              <div className="fw-semibold ff-secondary">
                {rounded()}€
              </div>
            </>
          )
        },
      },
      {
        Header: "État",
        accessor: "header.fet_name",
        Cell: (cell) => {
          return <span className="badge text-uppercase badge-soft-success"> {} </span>
        }
      },

    ],
    [checkedAll]
  );



  return (
    <React.Fragment>
      <div className="page-content">

        <Container fluid>
          <BreadCrumb title="Factures" pageTitle="Liste" />
          <h3>Statistique de l'année</h3>
          <Row>
            mettre un graph
          </Row>

          <Row>
            <Col lg={12}>
              <Card id="invoiceList">
                <CardHeader className="border-0">
                  <div className="d-flex align-items-center">
                    <h5 className="card-title mb-0 flex-grow-1">Transactions</h5>
                    <div className="flex-shrink-0">
                      <div className='d-flex gap-2 flex-wrap'>
                        <Link
                          to={"/factures/creation"}
                          className="btn btn-secondary me-1"
                        >
                          <i className="ri-add-line align-bottom me-1"></i> Créer une transaction
                        </Link>

                      </div>
                    </div>
                  </div>
                </CardHeader>

                <CardBody className="pt-0">
                  <div>
                    <InvoiceListGlobalSearch origneData={transactions} data={customFiltered} setData={setCustomFiltered} />
                    {isTransactionsSuccess ? (
                      <TableContainer
                        columns={columns}
                        data={(customFiltered || transactions || [])}
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

export default TransactionList;