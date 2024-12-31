import React, { useState, useEffect, useMemo } from "react";
import { CardBody, Row, Col, Card, Container, CardHeader } from "reactstrap";
import BreadCrumb from "../../Components/Common/BreadCrumb";
import TableContainer from "../../Components/Common/TableContainer";
import { useSelector } from "react-redux";
import Loader from "../../Components/Common/Loader";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { DomaineService } from "../../services";
import moment from "moment";

const Domaines = () => {
  document.title = "Domaines | CRM LMK";

  const { devise } = useSelector((state) => ({
    devise: state.Company.devise
  }));

  const [domainesList, setDomainesList] = useState(null);

  const columns = useMemo(() => {
    return [
      {
        Header: "Nom",
        accessor: "dom_name",

        Cell: (cell) => {
          return (
            <div className="d-flex align-items-center">
              <div className="flex-shrink-0 avatar-xs me-2">
                <div className="avatar-title bg-soft-success text-success rounded-circle fs-13">{cell.row.original.dom_name?.charAt(0) || ""}</div>
              </div>
              <div>{cell.row.original.dom_name}</div>
            </div>
          );
        }
      },
      {
        Header: "Date d'expiration",
        accessor: "dom_expiration",
        Cell: (cell) => <>{moment(cell.row.original.dom_date_creation).format("DD/MM/YYYY")}</>
      }
    ];
  }, []);

  useEffect(() => {
    DomaineService.getDomaineList().then((response) => {
      setDomainesList(response);
    });
  }, []);

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <BreadCrumb
            title="Domaines"
            pageTitle="Gestion"
          />

          <Row>
            <Col lg={12}>
              <Card id="domaineList">
                <CardHeader className="border-0">
                  <div className="d-flex align-items-start flex-column">
                    <div
                      className="d-flex flex-row"
                      lg={12}>
                      <h5 className="card-title mb-3 flex-grow-1">Domaines</h5>
                      <div className="hstack text-nowrap gap-2"></div>
                    </div>
                  </div>
                </CardHeader>

                <CardBody className="pt-0">
                  <div>
                    {domainesList ? (
                      <TableContainer
                        columns={columns}
                        data={domainesList || []}
                        isGlobalFilter={true}
                        isAddUserList={false}
                        customPageSize={8}
                        className="custom-header-css"
                        divClass="table-responsive table-card mb-3"
                        tableClass="align-middle table-nowrap"
                        theadClass="table-light"
                        isContactsFilter={true}
                        SearchPlaceholder="Search for domaine..."
                      />
                    ) : (
                      <Loader error={domainesList} />
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

export default Domaines;
