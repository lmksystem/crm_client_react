import React, { useEffect, useRef, useState } from "react";
import { CardBody, Row, Col, Card, Table, CardHeader, Container, Label, Input, Button } from "reactstrap";
import BreadCrumb from "../../Components/Common/BreadCrumb";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import { customFormatNumber, rounded } from "../../utils/function";
import DeleteModal from "../../Components/Common/DeleteModal";
import { getCompany as onGetCompany } from "../../slices/thunks";
import ConfirmModal from "../../Components/Common/ConfirmModal";
import axios from "axios";
import FeatherIcon from "feather-icons-react/build/FeatherIcon";
import { getImage } from "../../utils/getImages";
import Select from "react-select";
import { ToastContainer, toast } from "react-toastify";
import { devisEtatColor } from "../../common/data/devisList";
import { CompanyService, DevisService, GestionService } from "../../services";
import { ArrowLeft } from "feather-icons-react/build/IconComponents";

const DevisDetails = () => {
  document.title = "Détail devis | CRM LMK";

  let { id } = useParams();

  const { devise } = useSelector((state) => ({
    devise: state.Company.devise
  }));

  const [devis, setDevis] = useState();

  const [selectedEtat, setSelectedEtat] = useState(null);

  const [image, setImage] = useState("");

  //Print the state
  const printInvoice = () => {
    window.print();
  };

  const downloadPdf = () => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/v1/pdf/download/devis/${devis?.header.den_id}`, {
        mode: "no-cors",
        responseType: "blob"
      })
      .then((response) => {
        try {
          let elm = document.createElement("a"); // CREATE A LINK ELEMENT IN DOM
          elm.href = URL.createObjectURL(response); // SET LINK ELEMENTS CONTENTS
          elm.setAttribute("download", devis?.header.den_num + ".pdf"); // SET ELEMENT CREATED 'ATTRIBUTE' TO DOWNLOAD, FILENAME PARAM AUTOMATICALLY
          elm.click(); // TRIGGER ELEMENT TO DOWNLOAD
          elm.remove();
        } catch (err) {
          console.log(err);
        }
      });
  };

  useEffect(() => {
    CompanyService.getCompany().then((company) => {
      console.log(company);

      if (company && company.com_logo) {
        let path = (company.com_id + "/" + company.com_logo).replaceAll("/", " ");
        getImage(path).then((response) => {
          setImage("data:image/png;base64," + response);
        });
      }
    });
  }, []);

  useEffect(() => {
    DevisService.getDevisById(id).then((devisData) => {
      DevisService.getEtatDevis().then((response) => {
        let etat = response?.find((d) => d.det_id == devisData?.header.den_etat);

        setSelectedEtat(etat.det_name);
        setDevis(devisData);
      });
    });
  }, []);

  return (
    <div className="page-content">
      <Container fluid>
        <ToastContainer
          closeButton={false}
          limit={1}
        />
        <BreadCrumb
          className="d-print-none"
          title="Devis détaillé"
          pageTitle="Devis"
        />
        <Link
          className="btn btn-primary"
          to={"/devis/liste"}>
          <ArrowLeft />
        </Link>
        <Row className="justify-content-center">
          <Col xxl={9}>
            <Card id="demo">
              <Row>
                <Col lg={12}>
                  <CardHeader className="border-bottom border-bottom-dashed">
                    <div className="d-flex">
                      <div className="flex-grow-1 d-flex align-items-center">
                        {image && (
                          <img
                            src={image}
                            className="card-logo card-logo-dark"
                            alt="logo dark"
                            width="260"
                          />
                        )}
                      </div>
                      <div className="flex-shrink-0 mt-sm-0 mt-3">
                        {/* <h6><span className="text-muted fw-normal">Legal Registration No:</span><span id="legal-register-no">987654</span></h6> */}
                        <h6>
                          <span className="text-muted fw-normal">Email: </span>
                          <span id="email">{devis?.contact?.dco_email}</span>
                        </h6>
                        <h6>
                          <span className="text-muted fw-normal">Téléphone: </span>
                          {devis?.contact?.dco_phone}
                        </h6>
                        <h6>
                          <span className="text-muted fw-normal">Adresse: </span>
                          <span id="email">
                            {devis?.contact?.dco_address}, {devis?.contact?.dco_city}
                          </span>
                        </h6>
                        <h6>
                          <span className="text-muted fw-normal">Code postal: </span>
                          {devis?.contact?.dco_cp}
                        </h6>

                        {/* <h6 className="mb-0"><span className="text-muted fw-normal">Contact No: </span><span id="contact-no"> +(01) 234 6789</span></h6> */}
                      </div>
                    </div>
                  </CardHeader>
                </Col>
                <Col lg={12}>
                  <CardBody className="p-4 border-bottom border-bottom-dashed">
                    <Row className="g-3">
                      <Col
                        xs={12}
                        md={6}
                        lg={4}
                        className="col-6 d-flex flex-column">
                        <h6 className="text-muted text-uppercase fw-semibold mb-3">{devis?.header.den_sujet}</h6>
                      </Col>
                      {devis?.header.den_ent_fk != null && (
                        <Col
                          xs={12}
                          md={6}
                          lg={8}
                          className="col-6 d-flex flex-column align-items-end">
                          <h6 className="text-muted text-uppercase fw-semibold mb-3">Information Client</h6>
                          <p
                            className="fw-medium mb-2"
                            id="billing-name">
                            {devis?.contact.dco_cus_name}
                          </p>
                          <p
                            className="text-muted mb-1"
                            id="billing-address-line-1">
                            {devis?.contact.dco_cus_address}
                          </p>
                          <p
                            className="text-muted mb-1"
                            id="billing-address-line-1">
                            {devis?.contact.dco_cus_cp}, {devis?.contact.dco_cus_city}
                          </p>
                          <p className="text-muted mb-1">
                            <span>Téléphone: </span>
                            <span id="billing-phone-no">{devis?.contact.dco_cus_phone}</span>
                          </p>
                          <p className="text-muted mb-0">
                            <span>Email: </span>
                            <span id="billing-tax-no">{devis?.contact.dco_cus_email}</span>{" "}
                          </p>
                        </Col>
                      )}
                    </Row>
                  </CardBody>
                </Col>
                <Col lg={12}>
                  <CardBody className="border-bottom border-bottom-dashed p-4">
                    <Row className="g-3">
                      <Col
                        lg={2}
                        className="col-6">
                        <p className="text-muted mb-2 text-uppercase fw-semibold">Devis N°</p>
                        <h5 className="fs-14 mb-0">
                          <span id="devis-no">{devis?.header.den_num}</span>
                        </h5>
                      </Col>
                      <Col
                        lg={2}
                        className="col-6">
                        <p className="text-muted mb-2 text-uppercase fw-semibold">Date de création</p>
                        <h5 className="fs-14 mb-0">
                          <span id="invoice-date">{moment(devis?.header.den_date_create).format("L")}</span>{" "}
                          <small
                            className="text-muted"
                            id="invoice-time"></small>
                        </h5>
                      </Col>
                      <Col
                        lg={2}
                        className="col-6">
                        <p className="text-muted mb-2 text-uppercase fw-semibold">Date de validité</p>
                        <h5 className="fs-14 mb-0">
                          <span id="devis-date">{moment(devis?.header.den_date_valid).format("L")}</span>{" "}
                          <small
                            className="text-muted"
                            id="devis-time"></small>
                        </h5>
                      </Col>
                      <Col
                        lg={3}
                        className="col-6">
                        <p className="text-muted mb-2 text-uppercase fw-semibold">
                          état
                          {/* <FeatherIcon
                            onClick={() => {
                              setActiveChange(() => !activeChange);
                            }}
                            className={"d-print-none mx-2 cursor-pointer"}
                            size={13}
                            icon={"edit-2"}></FeatherIcon> */}
                        </p>
                        <span
                          className={"fs-11 badge badge-soft-" + devisEtatColor[parseInt(devis?.header.den_etat) - 1]}
                          id="payment-status">
                          {selectedEtat || "null"}
                        </span>
                      </Col>
                      <Col lg={3}>
                        <p className="text-muted mb-2 text-uppercase fw-semibold">Total</p>
                        <h5 className="fs-14 mb-0">
                          <span id="total-amount">{customFormatNumber(rounded(devis?.header.den_total_ttc, 2))}</span>
                          {devise}
                        </h5>
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
                            <th
                              scope="col"
                              style={{ width: "50px" }}>
                              #
                            </th>
                            <th scope="col">Détails produit</th>
                            <th
                              scope="col"
                              className="text-end">
                              Quantité
                            </th>
                            <th
                              scope="col"
                              className="text-end">
                              Prix unitaire HT
                            </th>
                            <th
                              scope="col"
                              className="text-end">
                              Remise %
                            </th>
                            <th
                              scope="col"
                              className="text-end">
                              Tva %
                            </th>
                            <th
                              scope="col"
                              className="text-end">
                              Total TTC
                            </th>
                          </tr>
                        </thead>
                        <tbody id="products-list">
                          {devis?.ligne?.map((ligne, i) => (
                            <tr key={i}>
                              <th scope="row">{i + 1}</th>
                              <td className="text-center">
                                <span className="fw-medium">{ligne.dli_name}</span>
                                <p className="text-muted mb-0">{ligne.dli_detail}</p>
                              </td>
                              <td className="text-end">{ligne.dli_qty}</td>
                              <td className="text-end">
                                {customFormatNumber(ligne.dli_unit_ht)}
                                {devise}
                              </td>
                              <td className="text-end">{ligne.dli_pourcent_remise}%</td>
                              <td className="text-end">{ligne.dli_tva}%</td>
                              <td className="text-end">
                                {customFormatNumber(rounded(ligne.dli_total_ttc, 2))}
                                {devise}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    </div>
                    <div className="border-top border-top-dashed mt-2">
                      <Table
                        className="pagebreak table-borderless table-nowrap align-middle mb-0 ms-auto"
                        style={{ width: "250px" }}>
                        <tbody>
                          <tr>
                            <td>Sous total HT</td>
                            <td className="text-end">
                              {customFormatNumber(rounded(devis?.header.den_total_ht, 2))}
                              {devise}
                            </td>
                          </tr>
                          <tr>
                            <td>Total remise</td>
                            <td className="text-end">
                              - {customFormatNumber(rounded(devis?.header.den_total_remise, 2))}
                              {devise}
                            </td>
                          </tr>
                          <tr>
                            <td>
                              Total TVA <small className="text-muted"></small>
                            </td>
                            <td className="text-end">
                              {customFormatNumber(rounded(devis?.header.den_total_tva, 2))}
                              {devise}
                            </td>
                          </tr>
                          {/* <tr>
                            <td></td>
                            <td className="text-end">{}</td>
                          </tr> */}
                          <tr className="border-top border-top-dashed fs-15">
                            <th scope="row">Total TTC</th>
                            <th className="text-end">
                              {customFormatNumber(devis?.header.den_total_ttc)}
                              {devise}
                            </th>
                          </tr>
                        </tbody>
                      </Table>
                    </div>
                    <div className="mt-4">
                      <Label
                        for="exampleFormControlTextarea1"
                        className="form-label text-muted text-uppercase fw-semibold">
                        NOTES
                      </Label>
                      <p className="form-control alert alert-info">{devis?.header.den_note ? devis?.header.den_note : <i style={{ color: "#898989" }}>Non renseigner</i>}</p>
                    </div>
                    <div className="hstack gap-2 justify-content-end d-print-none mt-4">
                      <Link
                        to="#"
                        onClick={printInvoice}
                        className="btn btn-success">
                        <i className="ri-printer-line align-bottom me-1"></i> Imprimer
                      </Link>

                      <Link
                        onClick={() => downloadPdf()}
                        className="btn btn-secondary">
                        <i className="ri-download-2-line align-bottom me-1"></i> Télécharger
                      </Link>
                    </div>
                  </CardBody>
                </Col>
              </Row>
            </Card>
            {/* </Preview> */}
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default DevisDetails;
