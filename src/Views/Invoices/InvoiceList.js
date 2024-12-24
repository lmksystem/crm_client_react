import React, { useState, useEffect, useMemo, useCallback } from "react";
import { CardBody, Row, Col, Card, Container, CardHeader } from "reactstrap";
import { Link, useNavigate } from "react-router-dom";
import * as moment from "moment";
import BreadCrumb from "../../Components/Common/BreadCrumb";
import TableContainer from "../../Components/Common/TableContainer";
import { useSelector } from "react-redux";
import Loader from "../../Components/Common/Loader";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "moment/locale/fr"; // without this line it didn't work
import { InvoiceListGlobalSearch } from "../../Components/Common/GlobalSearchFilter";
import { customFormatNumber, rounded } from "../../utils/function";
import { invoiceEtatColor } from "../../common/data/invoiceList";
import { getInvoiceByEntId, getInvoices } from "../../services/invoice";
import { useProfile } from "../../Components/Hooks/UserHooks";

moment.locale("fr");

const InvoiceList = () => {
  document.title = "Liste facture  | CRM LMK";

  const navigate = useNavigate();
  const { userProfile } = useProfile();

  const { devise } = useSelector((state) => ({
    devise: state.Company.devise
  }));

  const [invoices, setInvoices] = useState(null);
  const [customFiltered, setCustomFiltered] = useState(null);

  useEffect(() => {
    getInvoiceByEntId(userProfile.ent_id).then((response) => {
      setInvoices(response);
    });
  }, []);

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
          return (
            <>
              <div className="fw-semibold ff-secondary">
                {customFormatNumber(invoice.row.original.header.solde_du)}
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

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <BreadCrumb
            title="Factures"
            pageTitle="Facturation"
          />

          <Row>
            <Col lg={12}>
              <Card id="invoiceList">
                <CardHeader className="border-0">
                  <div className="d-flex align-items-center">
                    {/* <h5 className="card-title mb-0 flex-grow-1">Factures</h5> */}
                    <div className="flex-shrink-0"></div>
                  </div>
                </CardHeader>

                <CardBody className="pt-0">
                  <div>
                    <InvoiceListGlobalSearch
                      origneData={invoices || []}
                      data={customFiltered}
                      setData={setCustomFiltered}
                    />
                    {invoices ? (
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
                        initialSortField={"fen_date_create"}
                        actionItem={(row) => {
                          navigate("/factures/detail/" + row.original.header.fen_id, { state: row.original });
                        }}
                      />
                    ) : (
                      <Loader error={invoices} />
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
