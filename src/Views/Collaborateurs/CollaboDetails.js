import React from "react";
import BreadCrumb from "../../Components/Common/BreadCrumb";
import { Card, Col, Container, Row } from "reactstrap";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getDetailsCollabo as onGetDetailsCollabo } from "../../slices/thunks";
import moment from "moment";
moment.locale("fr");

document.title = "Détails Clients - Fournisseur | Countano";

const CollaboDetails = ({}) => {
  const dispatch = useDispatch();

  const { collaboDetails } = useSelector((state) => ({
    collaboDetails: state.Gestion.collaboDetails,
  }));

  // useEffect(()=>{
  //     dispatch(onGetDetailsCollabo())
  // },[])
  console.log(collaboDetails);
  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <BreadCrumb
            title="Détails Client / Fournisseur"
            pageTitle="Countano"
          />
          {collaboDetails && (
            <Row>
              <Col lg={6}>
                <Card>
                   <p>{collaboDetails?.infoBase?.ent_firstname}</p>
                   <p>{collaboDetails?.infoBase?.ent_lastname}</p>
                   <p>{collaboDetails?.infoBase?.ent_name}</p>
                   <p>{collaboDetails?.infoBase?.ent_adresse}{collaboDetails?.infoBase?.ent_ville && ", "+collaboDetails?.infoBase?.ent_ville} {collaboDetails?.infoBase?.ent_cp && collaboDetails?.infoBase?.ent_cp} {collaboDetails?.infoBase?.ent_pays && collaboDetails?.infoBase?.ent_pays}</p>
                   <p>{collaboDetails?.infoBase?.ent_email}</p>
                   <p>{collaboDetails?.infoBase?.ent_phone}</p>
                </Card>
              </Col>
            </Row>
          )}
        </Container>
      </div>
    </React.Fragment>
  );
};

export default CollaboDetails;
