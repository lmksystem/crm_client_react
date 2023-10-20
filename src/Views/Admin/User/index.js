import React, { useEffect, useMemo, useState } from "react";
import { Card, CardBody, Col, Container, Row } from "reactstrap";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import { useDispatch, useSelector } from "react-redux";
import {
  getUser as onGetUser
} from "../../../slices/thunks";
import moment from 'moment';
import TableContainer from "../../../Components/Common/TableContainer";
import { rounded } from "../../../utils/function";
import { useNavigate } from "react-router-dom";


moment.locale('fr')

const UserAdmin = () => {
  document.title = "Accueil admin | Countano";
  const { users } = useSelector((state) => ({
    users: state.Admin.users
  }))

  const dispatch = useDispatch();
  let navigate = useNavigate();

  useEffect(() => {
    dispatch(onGetUser());
  }, [])



  // devis Column
  const columns = useMemo(
    () => [
      {
        Header: "ID",
        accessor: "use_id",
        filterable: false,

      },
      {
        Header: "Nom",
        accessor: "use_lastname",

      },

      {
        Header: "Prénom",
        accessor: "use_firstname",
        filterable: false,
      },
      {
        Header: "Email",
        accessor: "use_email",
      },

      {
        Header: "Date de création",
        accessor: "",
        Cell: (cell) => {
          console.log(cell);
          return moment(cell.row.original.use_created).format('DD MMM YYYY')
        }
      },
      {
        Header: "Entreprise",
        accessor: "com_name",
        filterable: false,
      },
      {
        Header: "Email Entreprise",
        accessor: "com_email",
      },
      {
        Header: "Action",
        Cell: (cell) => {
          return (
            <div>
              <div onClick={() => console.log('ok')}><i style={{ fontSize: 15, color: "red" }} className="ri-delete-bin-fill"></i></div>
            </div>
          )
        }
      },
    ],
    []
  );

  const navigateToEditForm = (row) => {
    navigate('/admin/user/' + row.original.use_id)
  }

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <BreadCrumb title="Utilisateurs" pageTitle="Countano" />
          <Row>
            <Col>
              <Card>
                <CardBody>
                  <button className="btn btn-primary add-btn" onClick={() => navigate('/admin/user/')}>
                    <i className="ri-add-fill me-1 align-bottom"></i>
                    Ajouter une utilisateur
                  </button>
                  <TableContainer
                    columns={columns}
                    data={users || []}
                    isGlobalFilter={true}
                    customPageSize={10}
                    divClass="table-responsive table-card mb-2"
                    className="custom-header-css"
                    theadClass="text-muted text-uppercase"
                    SearchPlaceholder=''

                  // actionItem={navigateToEditForm}
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

export default UserAdmin;
