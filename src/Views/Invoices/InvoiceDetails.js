import React, { useEffect } from "react";
import { CardBody, Row, Col, Card, Table, CardHeader, Container } from "reactstrap";
import BreadCrumb from "../../Components/Common/BreadCrumb";
import { Link, useParams } from "react-router-dom";

import logoDark from "../../assets/images/logo-dark.png";
import logoLight from "../../assets/images/logo-light.png";
import { useDispatch, useSelector } from "react-redux";
import { getInvoiceById } from "../../slices/thunks";
import moment from "moment";

const InvoiceDetails = () => {
  document.title = "Détail facture | Countano";

  let { id } = useParams();

  const { invoice, isInvoiceSuccess, error } = useSelector((state) => ({
    invoice: state.Invoice.invoice,
    isInvoiceSuccess: state.Invoice.isInvoiceSuccess,
    error: state.Invoice.error,
  }));

  const dispatch = useDispatch();

  console.log(invoice);

  //Print the Invoice
  const printInvoice = () => {
    window.print();
  };

  useEffect(() => {
    if (id) {
      dispatch(getInvoiceById(id))
    }

  }, [dispatch, id])


  return (
    <div className="page-content">
      <Container fluid>
        <BreadCrumb title="Invoice Details" pageTitle="Invoices" />
        <Row className="justify-content-center">
          <Col xxl={9}>
            <Card id="demo">
              <Row>
                <Col lg={12}>
                  <CardHeader className="border-bottom border-bottom-dashed">
                    <div className="d-flex">
                      <div className="flex-grow-1 d-flex align-items-center">
                        <img src={logoDark} className="card-logo card-logo-dark" alt="logo dark" height="40" />

                      </div>
                      <div className="flex-shrink-0 mt-sm-0 mt-3">
                        {/* <h6><span className="text-muted fw-normal">Legal Registration No:</span><span id="legal-register-no">987654</span></h6> */}
                        <h6><span className="text-muted fw-normal">Email: </span><span id="email">{invoice.fco_email}</span></h6>
                        <h6><span className="text-muted fw-normal">Téléphone:</span>{invoice.fco_phone}</h6>
                        <h6><span className="text-muted fw-normal">Address: </span><span id="email">{invoice.fco_address}, {invoice.fco_city}</span></h6>
                        <h6><span className="text-muted fw-normal">code postal:</span>{invoice.fco_cp}</h6>

                        {/* <h6 className="mb-0"><span className="text-muted fw-normal">Contact No: </span><span id="contact-no"> +(01) 234 6789</span></h6> */}
                      </div>
                    </div>
                  </CardHeader>
                </Col>
                <Col lg={12}>
                  <CardBody className="p-4 border-bottom border-bottom-dashed">
                    <Row className="g-3">
                      <Col className="col-6">
                        <h6 className="text-muted text-uppercase fw-semibold mb-3">Information Client</h6>
                        <p className="fw-medium mb-2" id="billing-name">{invoice.fco_cus_name}</p>
                        <p className="text-muted mb-1" id="billing-address-line-1">{invoice.fco_cus_address}</p>
                        <p className="text-muted mb-1" id="billing-address-line-1">{invoice.fco_cus_cp}, {invoice.fco_cus_city}</p>
                        <p className="text-muted mb-1"><span>Téléphone: </span><span id="billing-phone-no">{invoice.fco_cus_phone}</span></p>
                        <p className="text-muted mb-0"><span>Email: </span><span id="billing-tax-no">{invoice.fco_cus_email}</span> </p>
                      </Col>
                    </Row>
                  </CardBody>
                </Col>
                <Col lg={12}>
                  <CardBody className="border-bottom border-bottom-dashed p-4">
                    <Row className="g-3">
                      <Col lg={3} className="col-6">
                        <p className="text-muted mb-2 text-uppercase fw-semibold">Facture N°</p>
                        <h5 className="fs-14 mb-0"><span id="invoice-no">{invoice.fen_num_fac}</span></h5>
                      </Col>
                      <Col lg={3} className="col-6">
                        <p className="text-muted mb-2 text-uppercase fw-semibold">Date d'échéance</p>
                        <h5 className="fs-14 mb-0"><span id="invoice-date">{moment(invoice.fen_date_expired).format('L')}</span> <small className="text-muted" id="invoice-time"></small></h5>
                      </Col>
                      <Col lg={3} className="col-6">
                        <p className="text-muted mb-2 text-uppercase fw-semibold">état paiement</p>
                        <span className="badge badge-soft-success fs-11" id="payment-status">{invoice.fen_etat}</span>
                      </Col>
                      <Col lg={3} className="col-6">
                        <p className="text-muted mb-2 text-uppercase fw-semibold">Total</p>
                        <h5 className="fs-14 mb-0"><span id="total-amount">{invoice.fen_total_ttc}</span>€</h5>
                      </Col>
                    </Row>
                  </CardBody>
                </Col>

                <Col lg={12}>
                  <CardBody className="p-4">
                    <div className="table-responsive">
                      <Table className="table-borderless text-center table-nowrap align-middle mb-0">
                        <thead>
                          <tr className="table-active">
                            <th scope="col" style={{ width: "50px" }}>#</th>
                            <th scope="col">Détails produit</th>
                            <th scope="col" className="text-end">Quantité</th>
                            <th scope="col" className="text-end">Prix unitaire HT</th>
                            <th scope="col" className="text-end">Remise %</th>
                            <th scope="col" className="text-end">Tva %</th>
                            <th scope="col" className="text-end">Total TTC</th>
                          </tr>
                        </thead>
                        <tbody id="products-list">
                          {invoice?.ligne?.map((ligne, i) => (
                            <>
                              <tr>
                                <th scope="row">{i + 1}</th>
                                <td className="text-start">
                                  <span className="fw-medium">{ligne.fli_name}</span>
                                  <p className="text-muted mb-0">{ligne.fli_detail}</p>
                                </td>
                                <td className="text-end">{ligne.fli_qty}</td>
                                <td className="text-end">{ligne.fli_unit_ht}€</td>
                                <td className="text-end">{ligne.fli_pourcent_remise}%</td>
                                <td className="text-end">{ligne.fli_tva}%</td>
                                <td className="text-end">{ligne.fli_total_ttc}€</td>
                              </tr>
                            </>))}
                        </tbody>
                      </Table>
                    </div>
                    <div className="border-top border-top-dashed mt-2">
                      <Table className="pagebreak table-borderless table-nowrap align-middle mb-0 ms-auto" style={{ width: "250px" }}>
                        <tbody>
                          <tr>
                            <td>Sous total HT</td>
                            <td className="text-end">{invoice.fen_total_ht}€</td>
                          </tr>
                          <tr>
                            <td>Total remise</td>
                            <td className="text-end">- {invoice.fen_total_remise}€</td>
                          </tr>
                          <tr>
                            <td>Total TVA <small className="text-muted"></small></td>
                            <td className="text-end">{invoice.fen_total_tva}</td>
                          </tr>
                          {/* <tr>
                            <td></td>
                            <td className="text-end">{}</td>
                          </tr> */}
                          <tr className="border-top border-top-dashed fs-15">
                            <th scope="row">Total TTC</th>
                            <th className="text-end">{invoice.fen_total_ttc}</th>
                          </tr>
                        </tbody>
                      </Table>
                    </div>

                    <div className="hstack gap-2 justify-content-end d-print-none mt-4">
                      <Link to="#" onClick={printInvoice} className="btn btn-success"><i className="ri-printer-line align-bottom me-1"></i> Print</Link>
                      <Link to="#" className="btn btn-primary"><i className="ri-download-2-line align-bottom me-1"></i> Download</Link>
                    </div>
                  </CardBody>
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default InvoiceDetails;
