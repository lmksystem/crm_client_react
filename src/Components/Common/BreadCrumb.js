import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Col, Row } from "reactstrap";

const BreadCrumb = ({ title, pageTitle }) => {
  const navigate = useNavigate();
  // navigate("/devis/liste");
  return (
    <React.Fragment>
      <Row>
        <Col xs={12}>
          <div className="page-title-box d-sm-flex align-items-center justify-content-between">
            <h4 className="mb-sm-0">{title}</h4>

            <div className="page-title-right">
              <ol className="breadcrumb m-0">
                <li className="breadcrumb-item">
                  <Link to="#">{pageTitle}</Link>
                </li>
                <li className="breadcrumb-item active">{title}</li>
              </ol>
            </div>
          </div>
        </Col>
      </Row>
      <Row>
        <Col xs={12}>
          <div
            style={{ backgroundColor: "red" }}
            className="d-sm-flex page-title-box  align-items-center justify-content-between "
          >
            <h5 className="text-white mx-2 my-0">
              Veuillez mettre à jour vos comptes bancaires avant le 20/10/2023{" "}
            </h5>
            <button
              onClick={() => {
                navigate("/bankaccount");
              }}
              type="button"
              class="btn btn-light my-3"
            >
              Accéder aux comptes
            </button>
          </div>
        </Col>
      </Row>
    </React.Fragment>
  );
};

export default BreadCrumb;
