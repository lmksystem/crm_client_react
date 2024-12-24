import React, { useState, useEffect, useMemo, useCallback } from "react";
import { CardBody, Row, Col, Card, Container, CardHeader } from "reactstrap";
import { Link, useNavigate } from "react-router-dom";
import * as moment from "moment";
import BreadCrumb from "../../Components/Common/BreadCrumb";
import TableContainer from "../../Components/Common/TableContainer";
import DeleteModal from "../../Components/Common/DeleteModal";

//redux
import { useSelector } from "react-redux";

import Loader from "../../Components/Common/Loader";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import "moment/locale/fr"; // without this line it didn't work
import { DevisListGlobalSearch } from "../../Components/Common/GlobalSearchFilter";
import { customFormatNumber, rounded } from "../../utils/function";

import WidgetCountUp from "../../Components/Common/WidgetCountUp";
import { devisEtatColor } from "../../common/data/devisList";
import { DevisService } from "../../services";
import { useProfile } from "../../Components/Hooks/UserHooks";
moment.locale("fr");

const DevisList = () => {
  document.title = "Liste devis  | CRM LMK";
  const { userProfile } = useProfile();
  const navigate = useNavigate();
  const { devise } = useSelector((state) => ({
    devise: state.Company.devise
  }));

  //delete devis
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteModalMulti, setDeleteModalMulti] = useState(false);

  const [customFiltered, setCustomFiltered] = useState(null);

  const [devisList, setDevisList] = useState(null);
  const [devisWidgets, setDevisWidgets] = useState([]);
  const [etatDevis, setEtatDevis] = useState([]);

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

  // devis Column
  const columns = useMemo(
    () => [
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
              style={{ zIndex: 4000, position: "relative" }}
              type="checkbox"
              onClick={(e) => {
                e.stopPropagation();
                deleteCheckbox();
              }}
              className="invoiceCheckBox form-check-input"
              value={cellProps.row.original.header.den_id}
              onChange={() => {
                /*deleteCheckbox()*/
              }}
            />
          );
        },
        id: "#"
      },
      // {
      //   Header: "ID",
      //   accessor: "header.den_id",
      //   filterable: false,
      //   Cell: (cell) => {
      //     return <Link to={`/devis/detail/${cell.row.original.header.den_id}`} state={cell.row.original} className="fw-medium link-primary">{cell.row.original.header.den_id}</Link>;
      //   },
      // },
      {
        Header: "Numéro devis",
        accessor: "header.den_num",
        filterable: false,
        Cell: (cell) => {
          return (
            <Link
              to={`/devis/detail/${cell.row.original.header.den_id}`}
              state={cell.row.original}
              className="fw-medium link-primary">
              {cell.row.original.header.den_num}
            </Link>
          );
        }
      },
      {
        Header: "Client",
        accessor: "contact.dco_cus_name"
      },

      {
        Header: "EMAIL",
        accessor: "contact.dco_cus_email"
      },
      {
        Header: "Sujet",
        accessor: "header.den_sujet"
      },

      {
        Header: "DATE",
        accessor: "header.den_date_create",
        Cell: (devis) => <>{moment(devis.row.original.header.den_date_create).format("DD MMMM Y")}</>
      },
      {
        Header: "Montant",
        accessor: "header.den_total_ttc",
        filterable: false,
        Cell: (devis) => (
          <>
            <div className="fw-semibold ff-secondary">
              {customFormatNumber(rounded(devis.row.original.header.den_total_ttc, 2))}
              {devise}
            </div>
          </>
        )
      },
      {
        Header: "État",
        accessor: "header.det_name",
        Cell: (cell) => {
          return <span className={"badge text-uppercase badge-soft-" + devisEtatColor[parseInt(cell.row.original.header.den_etat) - 1]}> {etatDevis?.find((d) => d.det_id == cell.row.original.header.den_etat)?.det_name} </span>;
        }
      }
    ],
    [checkedAll, etatDevis, devisList]
  );

  useEffect(() => {
    DevisService.getEtatDevis().then((response) => {
      setEtatDevis(response);
    });
    DevisService.getEtatDevisByEntId(userProfile.ent_id).then((response) => {
      setDevisList(response);
    });
  }, []);

  return (
    <React.Fragment>
      <div className="page-content">
        <DeleteModal
          show={deleteModal}
          onDeleteClick={() => {
            handleDeleteDevis();
          }}
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
            title="Devis"
            pageTitle="Facturation"
          />

          <Row>
            <Col lg={12}>
              <Card id="invoiceList">
                <CardHeader className="border-0">
                  <div className="d-flex align-items-center"></div>
                </CardHeader>

                <CardBody className="pt-0">
                  <div>
                    <DevisListGlobalSearch
                      origneData={devisList || []}
                      data={customFiltered}
                      setData={setCustomFiltered}
                    />
                    {devisList ? (
                      <TableContainer
                        initialSortField={"den_date_create"}
                        columns={columns}
                        data={customFiltered || devisList || []}
                        isGlobalFilter={false}
                        isAddUserList={false}
                        customPageSize={10}
                        divClass="table-responsive table-card mb-2"
                        className="custom-header-css"
                        theadClass="text-muted text-uppercase"
                        SearchPlaceholder=""
                        actionItem={(row) => navigate("/devis/detail/" + row.original.header.den_id)}
                      />
                    ) : (
                      <Loader error={devisList} />
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

export default DevisList;
