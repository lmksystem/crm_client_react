import React, { useEffect, useMemo, useState } from "react";
import { Card, CardBody, Col, Container, Row } from "reactstrap";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import { useDispatch, useSelector } from "react-redux";
import { getUser as onGetUser } from "../../../slices/thunks";
import moment from "moment";
import TableContainer from "../../../Components/Common/TableContainer";
import { rounded } from "../../../utils/function";
import { useNavigate } from "react-router-dom";
import DeleteModal from "../../../Components/Common/DeleteModal";
import { deleteUser as onDeleteUser } from "../../../slices/thunks";
import { APIClient } from "../../../helpers/api_helper";
import { ToastContainer, toast } from "react-toastify";
import * as url from "../../../helpers/url_helper";
import axios from "axios";

moment.locale("fr");

const EntrepriseAdmin = () => {
  document.title = "Entreprise admin | Countano";

  const [companyListe, setCompanyListe] = useState(null);

  let navigate = useNavigate();

  const getCompanyListe = () => {
    axios
      .get("/v1/admin/company")
      .then((res) => {
        console.log(res);
        setCompanyListe(res);
      })
      .catch((err) => {
        toast.error("Une erreur s'est produite");
        setCompanyListe([]);
      });
  };

  useEffect(() => {}, []);

  // devis Column
  const columns = useMemo(
    () => [
      {
        Header: "ID",
        accessor: "com_id",
        filterable: false
      },
      {
        Header: "Entreprise",
        accessor: "com_name"
      },

      {
        Header: "Email",
        accessor: "com_email",
        filterable: false
      },
      {
        Header: "Téléphone",
        accessor: "com_phone"
      },

      {
        Header: "Adresse",
        accessor: "",
        Cell: (cell) => {
          return `${cell.row.original.com_adresse} ${cell.row.original.com_ville} ${cell.row.original.com_cp}`;
          // return moment(cell.row.original.use_created).format("DD MMM YYYY");
        }
      },
      {
        Header: "Création",
        accessor: "",
        Cell: (cell) => {
          return moment(cell.row.original.use_created).format("DD MMM YYYY");
        }
      },
      {
        Header: "Offre",
        accessor: "",
        Cell: (cell) => {
          return (
            <div
              style={{ backgroundColor: "#FF9F00", color: "white", paddingInline: 15, paddingBlock: 8, borderRadius: 20, whiteSpace: "nowrap", textAlign: "center", fontWeight: 800, letterSpacing: 2 }}
              className="offert">
              {cell.row.original.mod_name}
            </div>
          );
        }
      }
    ],
    []
  );

  useEffect(() => {
    getCompanyListe();
  }, []);

  return (
    <React.Fragment>
      <ToastContainer
        closeButton={false}
        limit={1}
      />
      <div className="page-content">
        <Container fluid>
          <BreadCrumb
            title="Entreprises"
            pageTitle="Admin"
          />

          <Row>
            <Col>
              <Card>
                <CardBody>
                  <TableContainer
                    initialSortField={"com_date_create"}
                    columns={columns}
                    data={companyListe || []}
                    isGlobalFilter={true}
                    customPageSize={10}
                    divClass="table-responsive table-card mb-2"
                    className="custom-header-css"
                    theadClass="text-muted text-uppercase"
                    SearchPlaceholder=""
                    actionItem={(item) => {
                      navigate(`/admin/entreprise/${item.values.com_id}`);
                    }}
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

export default EntrepriseAdmin;
