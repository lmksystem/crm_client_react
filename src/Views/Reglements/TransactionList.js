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
//Import actions
import {
  getCollaborateurs as onGetCollaborateurs,
  getInvoices as onGetInvoices,
  getTransactionList as onGetTransactionList
} from "../../slices/thunks";

//redux
import { useSelector, useDispatch } from "react-redux";

import Loader from "../../Components/Common/Loader";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import 'moment/locale/fr'  // without this line it didn't work
import { TransactionListGlobalSearch } from "../../Components/Common/GlobalSearchFilter";
import { rounded } from "../../utils/function";
import { api } from "../../config";
import TransactionCharts from "./TransactionCharts";


moment.locale('fr')

const TransactionList = () => {
  document.title = "Liste facture  | Countano";

  const dispatch = useDispatch();

  const { invoices, transactions, isTransactionsListSuccess, error, collaborateurs } = useSelector((state) => ({
    invoices: state.Invoice.invoices,
    transactions: state.Transaction.transactionsList,
    isTransactionsListSuccess: state.Transaction.isTransactionsListSuccess,
    error: state.Transaction.error,
    collaborateurs: state.Gestion.collaborateurs

  }));

  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    dispatch(onGetInvoices());
    dispatch(onGetTransactionList());
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
    (data) => {
      const getData = (id) => {
        return invoices.find((i) => i.header.fen_id == id);
      }

      return [
        {
          Header: <input type="checkbox" id="checkBoxAll" className="form-check-input" onClick={() => checkedAll()} />,
          Cell: (cellProps) => {
            return <input type="checkbox" className="invoiceCheckBox form-check-input" value={rounded(cellProps.row.original.tra_id)} onChange={() => {/*deleteCheckbox()*/ }} />;
          },
          id: '#',
        },
        {
          Header: "ID",
          accessor: "tra_id",
          filterable: false,
          // Cell: (cell) => {
          //   return <Link to={``} className="fw-medium link-primary">{cell.row.original.tra_id}</Link>;
          // },
        },
        {
          Header: "Client",
          accessor: "ent_name",
          Cell: (cell) => {
            return (
              <div className="d-flex align-items-center">
                <div className="flex-shrink-0 avatar-xs me-2">
                  <div className="avatar-title bg-soft-success text-success rounded-circle fs-13">
                    {cell.row.original.ent_name?.charAt(0) || ""}
                  </div>
                </div>
                <div>
                  {cell.row.original.ent_name}
                </div>
              </div>
            )
          },
        },

        {
          Header: "EMAIL",
          accessor: "ent_email",
          filterable: false,
        },
        {
          Header: "DATE",
          accessor: "tra_date",
          Cell: (cell) => (
            <>
              {moment(new Date(cell.row.original.tra_date)).format("DD MMMM Y")}
              {/* <small className="text-muted">{handleValidTime(invoice.row.original.fen_date_create)}</small> */}
            </>
          ),
        },
        {
          Header: "Montant",
          accessor: "tra_value",
          filterable: false,
          Cell: (cell) => (
            <>
              <div className="fw-semibold ff-secondary">{cell.row.original.tra_value}€</div>
            </>
          ),
        },
        {
          Header: "Liaison facture",
          accessor: "",
          Cell: (cell) => {
            return (cell.row.original.tra_fen_fk && <Link to={`/factures/detail/${cell.row.original.tra_fen_fk}`} className="fw-medium link-primary">Voir la facture</Link>) || "";
          },
        },

      ]
    },
    [checkedAll]
  );

  useEffect(() => {
    // let sortingByDateTransaction = [...transactions].sort((a, b) => new Date(b.tra_date) - new Date(a.tra_date))
    let transactionByMount = Array(12).fill(0)
    transactions.forEach((tra) => {
      let month = moment(tra.tra_date).format('M')
      transactionByMount[month - 1] += tra.tra_value

    });

    setChartData(transactionByMount)
  }, [transactions])


console.log(transactions);

  return (
    <React.Fragment>
      <div className="page-content">

        <Container fluid>
          <BreadCrumb title="Factures" pageTitle="Liste" />
          <h3>Statistique de l'année</h3>
          <Row>
            <div xl={12}>
              <TransactionCharts chartData={chartData} />
            </div>
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

                    {isTransactionsListSuccess ? (
                      <TableContainer
                        columns={columns}
                        data={(transactions || [])}
                        isGlobalFilter={true}
                        isAddUserList={false}
                        customPageSize={8}
                        className="custom-header-css"
                        divClass="table-responsive table-card mb-3"
                        tableClass="align-middle table-nowrap"
                        theadClass="table-light"
                        isContactsFilter={true}
                        SearchPlaceholder='Search for contact...'
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