import React, { useState, useCallback, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";

import {
  Col,
  Container,
  Row,
  Card,
  CardBody,
  Modal,
  ModalHeader,
  ModalBody,
} from "reactstrap";

import BreadCrumb from "../../Components/Common/BreadCrumb";

//Import actions
//redux
import { useSelector } from "react-redux";
import TableContainer from "../../Components/Common/TableContainer";

// Formik

import Loader from "../../Components/Common/Loader";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Export Modal
import { customFormatNumber } from "../../utils/function";
import Formulaire from "./Formulaire";
import { RecurrenceService } from "../../services";

const Recurrence = () => {
  const { devise } = useSelector((state) => ({
    devise: state.Company.devise,
  }));

  const [openCreate, setOpenCreate] = useState(false);
  const [recurrences, setReccurences] = useState([]);

  //delete Conatct

  const toggleModalCreate = useCallback(() => {
    if (openCreate) {
      setOpenCreate(false);
    } else {
      setOpenCreate(true);
    }
  }, [openCreate]);

  // validation

  // Column
  const columns = useMemo(
    () => [
      {
        id: "hidden-id",
        accessor: "ent_id",
        hiddenColumns: true,
        Cell: (cell) => {
          return <input type="hidden" value={cell.value} />;
        },
      },
      {
        Header: "Entreprise",
        accessor: "ent_name",
      },
      {
        Header: "Email",
        accessor: "ent_email",
      },
      {
        Header: "Montant total",
        accessor: "",
        Cell: (cell) => {
          let recurrenceMotantArray = cell.row.original.recurrences?.map(
            (r) => r.rec_montant * r.rec_pro_qty
          );
          let montantTotal = recurrenceMotantArray.reduce(
            (partialSum, a) => partialSum + a,
            0
          );
          return (
            <>
              {customFormatNumber(montantTotal)}
              {devise}
            </>
          );
        },
      },
      {
        Header: "Nombre de produit récurrent",
        accessor: "pro_tva",

        Cell: (cell) => {
          let recurrences = cell.row.original.recurrences;
          return <div>{recurrences.length}</div>;
        },
      },
      {
        Header: "Action",
        Cell: ({row}) => {
          return (
            <ul className="list-inline hstack gap-2 mb-0">
              <li className="list-inline-item" title="View">
                <Link to={`/recurrence/entity/${row.original?.ent_id}`}>
                  <i className="ri-eye-fill align-bottom text-primary"></i>
                </Link>
              </li>
            </ul>
          );
        },
      },
    ],
    []
  );

  useEffect(() => {
    RecurrenceService.getRecurrences().then((res) => {
      console.log(res);
      setReccurences(res);
    });
  }, []);

  document.title = "Récurrences | Countano";
  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <BreadCrumb title="Récurrences" pageTitle="Facturation" />
          <Row>
            <Col lg={12}>
              <Card>
                <div className="mx-3 mt-3">
                  <Col lg={12}>
                    <div className="d-flex flex-grow-1 justify-content-start">
                      <button
                        className="btn btn-secondary add-btn"
                        onClick={() => setOpenCreate(true)}
                      >
                        <i className="ri-add-fill me-1 align-bottom"></i>
                        Ajouter une facturation récurrente
                      </button>
                    </div>
                  </Col>
                </div>

                <CardBody className="pt-3">
                  <Row>
                    <Col xxl={12}>
                      <div>
                        {recurrences.length > 0 ? (
                          <TableContainer
                            columns={columns}
                            data={recurrences || []}
                            isGlobalFilter={true}
                            isAddUserList={false}
                            customPageSize={7}
                            className="custom-header-css"
                            divClass="table-responsive table-card mb-2"
                            tableClass="align-middle table-nowrap"
                            theadClass="table-light"
                            isCompaniesFilter={false}
                            isProductsFilter={true}
                            SearchPlaceholder="Recherche..."
                            initialSortField={"rec_date_create"}
                          />
                        ) : (
                          <Loader />
                        )}
                      </div>
                    </Col>

                    <ToastContainer closeButton={false} limit={1} />
                  </Row>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
        <Modal
          id="showModal"
          isOpen={openCreate}
          toggle={toggleModalCreate}
          size="lg"
          centered
        >
          <ModalHeader className="bg-soft-info p-3" toggle={toggleModalCreate}>
            Ajouter des récurrences
          </ModalHeader>
          <ModalBody className="p-2">
            <Formulaire />
          </ModalBody>
        </Modal>
      </div>
    </React.Fragment>
  );
};

export default Recurrence;
