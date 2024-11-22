import React, { useState } from "react";
import BreadCrumb from "../../Components/Common/BreadCrumb";
import { Card, CardHeader, Col, Container, ListGroup, ListGroupItem, Row } from "reactstrap";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getEmail as onGetEmail, getDevis as onGetDevis } from "../../slices/thunks";
import moment from "moment";
import SimpleBar from "simplebar-react";
import { Link, useNavigate } from "react-router-dom";
import { invoiceEtatColor } from "../../common/data/invoiceList";
import { getInvoices } from "../../services/invoice";
moment.locale("fr");

document.title = "Détails Clients - Fournisseur | Countano";

const CollaboDetails = ({}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [factures, setFactures] = useState([]);
  const [devis, setDevis] = useState([]);
  const [email, setEmail] = useState([]);

  const { collaboDetails, invoices, emails, devisList, devise } = useSelector((state) => ({
    collaboDetails: state.Gestion.collaboDetails,
    invoices: state.Invoice.invoices,
    emails: state.Email.emails,
    devisList: state.Devis.devisList,
    devise: state?.Company?.devise
  }));

  //5 derniers devis
  useEffect(() => {
    if (collaboDetails.infoBase) {
      dispatch(onGetDevis()).then(() => {
        let copyDevis = [...devisList];
        let arrayFiltered = copyDevis.filter((e) => e.header.den_ent_fk == collaboDetails.infoBase.ent_id);
        if (arrayFiltered.length > 0) {
          arrayFiltered.sort((a, b) => b.den_date_create - a.den_date_create);
          let lastFive = arrayFiltered.slice(0, 5);
          setDevis(lastFive);
          return;
        }
        setDevis(arrayFiltered);
      });
    }
  }, [collaboDetails]);

  //5 dernieres factures
  useEffect(() => {
    if (collaboDetails.infoBase) {
      getInvoices().then((data) => {
        let arrayFiltered = data.filter((e) => e.header.fen_ent_fk == collaboDetails.infoBase.ent_id);
        if (arrayFiltered.length > 0) {
          arrayFiltered.sort((a, b) => b.fen_date_create - a.fen_date_create);
          let lastFive = arrayFiltered.slice(0, 5);
          setFactures(lastFive);
          return;
        }
        setFactures(arrayFiltered);
      });
    }
  }, [collaboDetails]);

  //5 derniers emails
  useEffect(() => {
    if (collaboDetails.infoBase) {
      dispatch(onGetEmail()).then(() => {
        let copyEmails = [...emails];
        let arrayFiltered = copyEmails.filter((e) => e.ema_ent_fk == collaboDetails.infoBase.ent_id);
        if (arrayFiltered.length > 0) {
          arrayFiltered.sort((a, b) => b.ema_date_create - a.ema_date_create);
          let lastFive = arrayFiltered.slice(0, 5);
          setEmail(lastFive);
          return;
        }
        setEmail(arrayFiltered);
      });
    }
  }, [collaboDetails]);

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
                <CardHeader>
                  <h3 style={{ color: "rgb(0, 77, 133)" }}>Détails du client / fournisseur</h3>
                </CardHeader>
                <Card style={{ height: "250px" }}>
                  <p className="px-3 py-1 my-1">Prénom : {collaboDetails?.infoBase?.ent_firstname}</p>
                  <p className="px-3 py-1 my-1">Nom : {collaboDetails?.infoBase?.ent_lastname}</p>
                  <p className="px-3 py-1 my-1">Société : {collaboDetails?.infoBase?.ent_name}</p>
                  <p className="px-3 py-1 my-1">
                    Adresse : {collaboDetails?.infoBase?.ent_adresse}
                    {collaboDetails?.infoBase?.ent_ville && ", " + collaboDetails?.infoBase?.ent_ville} {collaboDetails?.infoBase?.ent_cp && collaboDetails?.infoBase?.ent_cp} {collaboDetails?.infoBase?.ent_pays && collaboDetails?.infoBase?.ent_pays}
                  </p>
                  <p className="px-3 py-1 my-1">Email : {collaboDetails?.infoBase?.ent_email}</p>
                  <p className="px-3 py-1 my-1">Téléphone : {collaboDetails?.infoBase?.ent_phone}</p>
                </Card>
                <CardHeader>
                  <h3 style={{ color: "rgb(0, 77, 133)" }}>5 derniers emails envoyés au client</h3>
                </CardHeader>
                <Card>
                  <ListGroup>
                    {email.map((ema, i) => {
                      return (
                        <ListGroupItem key={i}>
                          <div className="d-flex align-items-center justify-content-between">
                            <div className={`${ema.ema_status == 1 && "badge-soft-success p-1"} `}>{ema.ema_status == 1 ? `Envoyé le ${moment(ema.ema_date_create).format("ll")}` : "Non envoyé"}</div>
                            <div className="">{ema.ema_type.toUpperCase()}</div>
                          </div>
                        </ListGroupItem>
                      );
                    })}
                  </ListGroup>
                </Card>
              </Col>
              <Col lg={6}>
                <CardHeader>
                  <h3 style={{ color: "rgb(0, 77, 133)" }}>5 dernières factures attribuées au client</h3>
                </CardHeader>
                <Card>
                  <SimpleBar
                    forceVisible="y"
                    autoHide={false}
                    style={{ height: "250px" }}>
                    <ListGroup
                      className="list mb-0"
                      flush>
                      {factures.map((fac, i) => {
                        let classBadge = "";
                        switch (fac.header.fet_name) {
                          case "Impayées":
                            classBadge = "danger";
                            break;
                          case "Remboursées":
                            classBadge = "warning";
                            break;
                          case "Annulées":
                            classBadge = "dark";
                            break;
                          case "non":
                            classBadge = "dark";
                            break;
                          default:
                            classBadge = "success";
                            break;
                        }
                        return (
                          <ListGroupItem
                            className={"list-group-item-action"}
                            key={i}>
                            <Link
                              to={`/factures/detail/${fac.header.fen_id}`}
                              className="text-reset">
                              <div className="d-flex flex-row align-items-center justify-content-between">
                                <div className=" d-flex flex-column">
                                  <p className="m-0">
                                    {fac.header.fen_sujet} - Faite le {moment(fac.header.fen_date_create).format("ll")}
                                  </p>
                                  <p className="m-0">Expire le {moment(fac.header.fen_date_create).format("l")}</p>
                                </div>
                                <div className=" d-flex flex-column justify-content-center  align-items-center">
                                  <div className=" d-flex flex-row align-items-center">
                                    Statut : <p className={` p-2 mx-1 m-0 badge-soft-${invoiceEtatColor[fac.header.fet_id - 1]}`}>{fac.header.fet_name}</p>
                                  </div>

                                  <p className="m-0">
                                    Montant de {fac.header.fen_total_ttc}
                                    {devise}
                                  </p>
                                </div>
                              </div>
                            </Link>
                          </ListGroupItem>
                        );
                      })}
                    </ListGroup>
                  </SimpleBar>
                </Card>
                <CardHeader>
                  <h3 style={{ color: "rgb(0, 77, 133)" }}>5 derniers devis attribués au client</h3>
                </CardHeader>
                <Card>
                  <SimpleBar
                    forceVisible="y"
                    autoHide={false}
                    style={{ height: "250px" }}>
                    <ListGroup
                      className="list mb-0"
                      flush>
                      {devis.map((dev, i) => {
                        return (
                          <ListGroupItem
                            className={"list-group-item-action"}
                            key={i}>
                            <Link
                              to={`/devis/detail/${dev.header.den_id}`}
                              className="text-reset">
                              <div className="d-flex flex-row align-items-center justify-content-between">
                                <div className=" d-flex flex-column">
                                  <p className="m-0">
                                    {dev.header.fen_sujet} - Faite le {moment(dev.header.den_date_create).format("ll")}
                                  </p>
                                  <p className="m-0">Date de validité {moment(dev.header.den_date_valid).format("l")}</p>
                                </div>
                                <div className=" d-flex flex-column justify-content-center  align-items-center">
                                  <p className="m-0">
                                    Montant de {dev.header.den_total_ttc}
                                    {devise}
                                  </p>
                                </div>
                              </div>
                            </Link>
                          </ListGroupItem>
                        );
                      })}
                    </ListGroup>
                  </SimpleBar>
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
