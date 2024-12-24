import React, { useState, useEffect, useMemo, useCallback } from "react";
import { CardBody, Row, Col, Card, Container, CardHeader, Modal, ModalHeader, ModalBody, Form, ModalFooter, FormFeedback, Input } from "reactstrap";
import { Link } from "react-router-dom";
import * as moment from "moment";
import BreadCrumb from "../../Components/Common/BreadCrumb";
import TableContainer from "../../Components/Common/TableContainer";
//Import actions
import { getInvoices } from "../../services/invoice";
//redux
import { useSelector } from "react-redux";

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
import { getTransactionList } from "../../services/transaction";
import { getCollaborateurs } from "../../services/gestion";
import { TransactionService } from "../../services";

moment.locale("fr");

const TransactionList = () => {
  document.title = "Encaissements | CRM LMK";

  const { devise } = useSelector((state) => ({
    devise: state.Company.devise
  }));

  const [transactionsList, setTransactionsList] = useState(null);

  // Invoice Column
  const columns = useMemo(() => {
    return [
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
      }
    ];
  }, []);

  useEffect(() => {
    TransactionService.getTransactionListByEntId().then((response) => {
      setTransactionsList(response);
    });
  }, []);

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <BreadCrumb
            title="Encaissements"
            pageTitle="Facturation"
          />

          <Row>
            <Col lg={12}>
              <Card id="invoiceList">
                <CardHeader className="border-0">
                  <div className="d-flex align-items-start flex-column">
                    <div
                      className="d-flex flex-row"
                      lg={12}>
                      <h5 className="card-title mb-3 flex-grow-1">Encaissements</h5>
                      <div className="hstack text-nowrap gap-2"></div>
                    </div>
                  </div>
                </CardHeader>

                <CardBody className="pt-0">
                  <div>
                    {transactionsList ? (
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
                        initialSortField={"tra_date"}
                      />
                    ) : (
                      <Loader error={transactionsList} />
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

export default TransactionList;
