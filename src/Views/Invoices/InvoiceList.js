import React, { useState, useEffect, useMemo, useCallback } from "react";
import { CardBody, Row, Col, Card, Container, CardHeader } from "reactstrap";
import { Link, useNavigate } from "react-router-dom";
import * as moment from "moment";
import BreadCrumb from "../../Components/Common/BreadCrumb";
import TableContainer from "../../Components/Common/TableContainer";

//Import actions
import { getTransaction as onGetTransaction } from "../../slices/thunks";
//redux
import { useSelector, useDispatch } from "react-redux";
import { getLoggedinUser } from "../../helpers/api_helper";

import Loader from "../../Components/Common/Loader";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import "moment/locale/fr"; // without this line it didn't work
import { InvoiceListGlobalSearch } from "../../Components/Common/GlobalSearchFilter";
import { customFormatNumber, rounded } from "../../utils/function";

import WidgetCountUp from "../../Components/Common/WidgetCountUp";
import { invoiceEtatColor } from "../../common/data/invoiceList";
import { getInvoices, getWidgetInvoices } from "../../services/invoice";
moment.locale("fr");

const InvoiceList = () => {
  document.title = "Liste facture  | Countano";

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { transactions, error, devise } = useSelector((state) => ({
    transactions: state.Transaction.transactions,
    devise: state.Company.devise
  }));

  const [invoices, setInvoices] = useState([]);
  const [invoiceWidgets, setInvoiceWidgets] = useState(null);
  const [customFiltered, setCustomFiltered] = useState(null);

  useEffect(() => {
    getWidgetInvoices().then((response) => {
      setInvoiceWidgets(response);
    });
    getInvoices().then((response) => {
      setInvoices(response);
    });
    dispatch(onGetTransaction());
  }, [dispatch]);

  // Invoice Column
  const columns = useMemo(
    () => [
      {
        Header: "Numéro facture",
        accessor: "header.fen_num_fac",
        filterable: false,
        Cell: (cell) => {
          return (
            <Link
              to={`/factures/detail/${cell.row.original.header.fen_id}`}
              className="fw-medium link-primary">
              {cell.row.original.header.fen_num_fac}
            </Link>
          );
        }
      },
      {
        Header: "Client",
        accessor: "contact.fco_cus_name",
        Cell: (invoice) => {
          return (
            <>
              <div className="d-flex align-items-center">
                {invoice.row.original.img ? (
                  <img
                    src={process.env.REACT_APP_API_URL + "/images/users/" + invoice.row.original.img}
                    alt=""
                    className="avatar-xs rounded-circle me-2"
                  />
                ) : (
                  <div className="flex-shrink-0 avatar-xs me-2">
                    <div className="avatar-title bg-soft-success text-success rounded-circle fs-13">{(invoice.row.original?.contact?.fco_cus_name && invoice.row.original?.contact?.fco_cus_name.charAt(0)) || ""}</div>
                  </div>
                )}
                {invoice.row.original.contact?.fco_cus_name}
              </div>
            </>
          );
        }
      },

      {
        Header: "EMAIL",
        accessor: "contact.fco_cus_email",
        filterable: false
      },
      {
        Header: "Sujet",
        accessor: "header.fen_sujet"
      },

      {
        Header: "DATE",
        accessor: "header.fen_date_create",
        Cell: (invoice) => (
          <>
            {moment(new Date(invoice.row.original.header.fen_date_create)).format("DD MMMM Y")}
            {/* <small className="text-muted">{handleValidTime(invoice.row.original.fen_date_create)}</small> */}
          </>
        )
      },
      {
        Header: "Montant",
        accessor: "header.fen_total_ttc",
        filterable: false,
        Cell: (invoice) => (
          <>
            <div className="fw-semibold ff-secondary">
              {customFormatNumber(rounded(invoice.row.original.header.fen_total_ttc, 2))}
              {devise}
            </div>
          </>
        )
      },
      {
        Header: "Reste à payer",
        accessor: "",
        filterable: false,
        Cell: (invoice) => {
          let transactionOfFac = transactions.filter((t) => t.tra_fen_fk == invoice.row.original.header.fen_id);
          return (
            <>
              <div className="fw-semibold ff-secondary">
                {customFormatNumber(
                  rounded(
                    transactionOfFac.reduce((previousValue, currentValue) => parseFloat(previousValue) - parseFloat(currentValue.tra_value), parseFloat(invoice.row.original.header.fen_total_ttc)),
                    2
                  )
                )}
                {devise}
              </div>
            </>
          );
        }
      },
      {
        Header: "État",
        filterable: false,
        accessor: "header.fet_name",
        Cell: (cell) => {
          return <span className={"badge text-uppercase badge-soft-" + invoiceEtatColor[cell.row.original.header.fet_id - 1]}> {cell.row.original.header.fet_name} </span>;
        }
      }
    ],
    [invoices]
  );
  console.log(invoices);

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <BreadCrumb
            title="Factures"
            pageTitle="Facturation"
          />
          <h3>Statistiques de l'année</h3>
          <Row className="d-flex  justify-content-around ">
            {invoiceWidgets
              ?.filter((e) => e.icon != "none")
              ?.map((widget, i) => {
                let data = { ...widget };
                data.name = widget.name + "s";
                return (
                  <WidgetCountUp
                    key={i}
                    data={data}
                    type={"Factures"}
                  />
                );
              })}
          </Row>

          <Row>
            <Col lg={12}>
              <Card id="invoiceList">
                <CardHeader className="border-0">
                  <div className="d-flex align-items-center">
                    {/* <h5 className="card-title mb-0 flex-grow-1">Factures</h5> */}
                    <div className="flex-shrink-0">
                      <div className="d-flex gap-2 flex-wrap">
                        <button
                          onClick={() => {
                            navigate("/factures/creation");
                          }}
                          className="btn btn-secondary me-1">
                          <i className="ri-add-line align-bottom me-1"></i> Créer une facture
                        </button>
                      </div>
                    </div>
                  </div>
                </CardHeader>

                <CardBody className="pt-0">
                  <div>
                    <InvoiceListGlobalSearch
                      origneData={invoices}
                      data={customFiltered}
                      setData={setCustomFiltered}
                    />
                    {invoices.length ? (
                      <TableContainer
                        columns={columns}
                        data={customFiltered || invoices || []}
                        isGlobalFilter={false}
                        isAddUserList={false}
                        customPageSize={10}
                        divClass="table-responsive table-card mb-2"
                        className="custom-header-css"
                        theadClass="text-muted text-uppercase"
                        isInvoiceListFilter={true}
                        SearchPlaceholder=""
                        // pathToDetail={`/factures/detail/`}
                        // initialSortField={"fen_date_create"}
                        actionItem={(row) => {
                          navigate("/factures/detail/" + row.original.header.fen_id, { state: row.original });
                        }}
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
      </div>
    </React.Fragment>
  );
};

export default InvoiceList;
