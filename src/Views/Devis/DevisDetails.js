import React, { useEffect, useRef, useState } from "react";
import { CardBody, Row, Col, Card, Table, CardHeader, Container, Label, Input } from "reactstrap";
import BreadCrumb from "../../Components/Common/BreadCrumb";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import { api } from "../../config";
import { customFormatNumber, rounded } from "../../utils/function";
import DeleteModal from "../../Components/Common/DeleteModal";
import {
  deleteDevis as onDeleteDevis,
  SendDevisByEmail as onSendDevisByEmail,
  getCompany as onGetCompany,
  updateDevis as onUpdateDevis
} from "../../slices/thunks";
import ConfirmModal from "../../Components/Common/ConfirmModal";
import axios from "axios";
import FeatherIcon from "feather-icons-react/build/FeatherIcon";
import { getImage } from "../../utils/getImages";
import Select from "react-select";

const DevisDetails = () => {
  document.title = "Détail devis | Countano";

  let { id } = useParams();

  const { etatDevis, devisList, company } = useSelector((state) => ({
    devisList: state.Devis.devisList,
    etatDevis: state.Devis.etatDevis,
    company: state.Company.company[0]
  }));

  const dispatch = useDispatch();

  const navigate = useNavigate();

  const [devis, setDevis] = useState();

  const [deleteModal, setDeleteModal] = useState(false);

  const [selectedEtat, setSelectedEtat] = useState();

  const [activeChange, setActiveChange] = useState(false);

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showConfirmModal2, setShowConfirmModal2] = useState(false);

  const [image, setImage] = useState("");

  //Print the state
  const printInvoice = () => {
    window.print();
  };

  const downloadPdf = () => {
    axios.get(`${api.API_URL}/v1/pdf/download/devis/${devis.header.den_id}`, {
      mode: 'no-cors',
      responseType: 'blob'
    }).then((response) => {
      try {
        let elm = document.createElement('a');  // CREATE A LINK ELEMENT IN DOM
        elm.href = URL.createObjectURL(response);  // SET LINK ELEMENTS CONTENTS
        elm.setAttribute('download', devis.header.den_num + ".pdf"); // SET ELEMENT CREATED 'ATTRIBUTE' TO DOWNLOAD, FILENAME PARAM AUTOMATICALLY
        elm.click();                             // TRIGGER ELEMENT TO DOWNLOAD
        elm.remove();
      }
      catch (err) {
        console.log(err);
      }
    });
  }

  useEffect(() => {
    dispatch(onGetCompany());
  }, [])


  const handleDeleteDevis = (id) => {
    if (id) {
      dispatch(onDeleteDevis(id));
      navigate('/devis/liste');
      setDeleteModal(false);
    }
  };

  const sendDevisByEmail = () => {
    dispatch(onSendDevisByEmail(id))
    setShowConfirmModal(false);
  }

  const checkFactureAlreadyCreated = () => {
    axios.get('/v1/checkFactureFromDevisExist?den_id=' + devis.header.den_id).then((response) => {
      let isExist = response.data;
      if (isExist) {
        setShowConfirmModal2(true);
      } else {
        redirectToInvoice()
      }
    })
  }

  const redirectToInvoice = () => {
    navigate('/factures/creation', { state: { den_id: devis.header.den_id } })
  }

  useEffect(() => {

    if (company && company.com_logo) {
      let path = (company.com_id + "/" + company.com_logo).replaceAll('/', " ")
      getImage(path).then((response) => {
        setImage("data:image/png;base64," + response)
      })
    }
  }, [company])

  useEffect(() => {
    if (devisList) {
      setDevis(devisList?.find((d) => d?.header?.den_id == id))
    }
  }, [devisList])

  useEffect(() => {
    if (devis) {
      setSelectedEtat(etatDevis?.find((d) => d.det_id == devis?.header.den_etat)?.det_name)
    }
  }, [devis])


  if (!devis) {
    return null;
  }

  return (
    <div className="page-content">
      <Container fluid>
        <BreadCrumb className="d-print-none" title="Devis détaillé" pageTitle="Devis" />
        <ConfirmModal title={'Êtes-vous sûr ?'} text={"Êtes-vous sûr de vouloir envoyer le devis ?"} show={showConfirmModal} onCloseClick={() => setShowConfirmModal(false)} onActionClick={() => sendDevisByEmail()} />
        <ConfirmModal title={'Êtes-vous sûr ?'} text={"Ce devis a déjà été converti en facture, voulez-vous recommencer ?"} show={showConfirmModal2} onCloseClick={() => setShowConfirmModal2(false)} onActionClick={() => { redirectToInvoice() }} />
        <DeleteModal
          show={deleteModal}
          onDeleteClick={() => { handleDeleteDevis(devis.header.den_id) }}
          onCloseClick={() => setDeleteModal(false)}
        />
        <Row className="justify-content-center">
          <Col xxl={9}>
            {/* <Preview id={'jsx-template'}> */}
            <Card id="demo">
              <Row>

                <Col lg={12}>
                  <CardHeader className="border-bottom border-bottom-dashed">
                    <div className="d-flex">
                      <div className="flex-grow-1 d-flex align-items-center">
                        {image && <img src={image} className="card-logo card-logo-dark" alt="logo dark" width="260" />}

                      </div>
                      <div className="flex-shrink-0 mt-sm-0 mt-3">

                        {/* <h6><span className="text-muted fw-normal">Legal Registration No:</span><span id="legal-register-no">987654</span></h6> */}
                        <h6><span className="text-muted fw-normal">Email: </span><span id="email">{devis.contact.dco_email}</span></h6>
                        <h6><span className="text-muted fw-normal">Téléphone:</span>{devis.contact.dco_phone}</h6>
                        <h6><span className="text-muted fw-normal">Address: </span><span id="email">{devis.contact.dco_address}, {devis.contact.dco_city}</span></h6>
                        <h6><span className="text-muted fw-normal">code postal:</span>{devis.contact.dco_cp}</h6>

                        {/* <h6 className="mb-0"><span className="text-muted fw-normal">Contact No: </span><span id="contact-no"> +(01) 234 6789</span></h6> */}
                      </div>
                    </div>
                  </CardHeader>
                </Col>
                <Col lg={12}>
                  <CardBody className="p-4 border-bottom border-bottom-dashed">
                    <Row className="g-3">
                      <Col className="col-6 d-flex flex-column">
                        <h6 className="text-muted text-uppercase fw-semibold mb-3">{devis.header.den_sujet}</h6>
                      </Col>
                      <Col className="col-6 d-flex flex-column align-items-end">
                        <h6 className="text-muted text-uppercase fw-semibold mb-3">Information Client</h6>
                        <p className="fw-medium mb-2" id="billing-name">{devis.contact.dco_cus_name}</p>
                        <p className="text-muted mb-1" id="billing-address-line-1">{devis.contact.dco_cus_address}</p>
                        <p className="text-muted mb-1" id="billing-address-line-1">{devis.contact.dco_cus_cp}, {devis.contact.dco_cus_city}</p>
                        <p className="text-muted mb-1"><span>Téléphone: </span><span id="billing-phone-no">{devis.contact.dco_cus_phone}</span></p>
                        <p className="text-muted mb-0"><span>Email: </span><span id="billing-tax-no">{devis.contact.dco_cus_email}</span> </p>
                      </Col>
                    </Row>
                  </CardBody>

                </Col>
                <Col lg={12}>
                  <CardBody className="border-bottom border-bottom-dashed p-4">
                    <Row className="g-3">
                      <Col lg={2} className="col-6">
                        <p className="text-muted mb-2 text-uppercase fw-semibold">Devis N°</p>
                        <h5 className="fs-14 mb-0"><span id="devis-no">{devis.header.den_num}</span></h5>
                      </Col>
                      <Col lg={2} className="col-6">
                        <p className="text-muted mb-2 text-uppercase fw-semibold">Date de création</p>
                        <h5 className="fs-14 mb-0"><span id="invoice-date">{moment(devis.header.den_date_create).format('L')}</span> <small className="text-muted" id="invoice-time"></small></h5>
                      </Col>
                      <Col lg={2} className="col-6">
                        <p className="text-muted mb-2 text-uppercase fw-semibold">Date de validité</p>
                        <h5 className="fs-14 mb-0"><span id="devis-date">{moment(devis.header.den_date_valid).format('L')}</span> <small className="text-muted" id="devis-time"></small></h5>
                      </Col>
                      <Col lg={3} className="col-6">
                        <p className="text-muted mb-2 text-uppercase fw-semibold">état <FeatherIcon onClick={() => { setActiveChange(() => !activeChange) }} className={"mx-2 cursor-pointer"} size={13} icon={'edit-2'}></FeatherIcon></p>
                        {activeChange ?
                          <select
                            defaultValue={devis.header.den_etat}
                            onChange={(e) => {
                              let devisHeaderCopy = { ...devis.header }
                              devisHeaderCopy.den_etat = e.target.value
                              dispatch(onUpdateDevis(devisHeaderCopy))
                              setSelectedEtat(etatDevis?.find((d) => d.det_id == e.target.value)?.det_name)
                              setActiveChange(() => false);
                            }}
                            className="form-select"
                          >
                            {etatDevis.map((e) => {
                              return <option value={e.det_id}>{e.det_name}</option>
                            })}
                          </select>
                          :
                          <span className="badge badge-soft-success fs-11" id="payment-status">{selectedEtat}</span>
                        }

                      </Col>
                      <Col lg={3} className="col-6">
                        <p className="text-muted mb-2 text-uppercase fw-semibold">Total</p>
                        <h5 className="fs-14 mb-0"><span id="total-amount">{customFormatNumber(rounded(devis.header.den_total_ttc, 2))}</span>€</h5>
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
                          {devis?.ligne?.map((ligne, i) => (

                            <tr key={i}>
                              <th scope="row">{i + 1}</th>
                              <td className="text-start">
                                <span className="fw-medium">{ligne.dli_name}</span>
                                <p className="text-muted mb-0">{ligne.dli_detail}</p>
                              </td>
                              <td className="text-end">{ligne.dli_qty}</td>
                              <td className="text-end">{customFormatNumber(ligne.dli_unit_ht)}€</td>
                              <td className="text-end">{ligne.dli_pourcent_remise}%</td>
                              <td className="text-end">{ligne.dli_tva}%</td>
                              <td className="text-end">{customFormatNumber(rounded(ligne.dli_total_ttc, 2))}€</td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    </div>
                    <div className="border-top border-top-dashed mt-2">
                      <Table className="pagebreak table-borderless table-nowrap align-middle mb-0 ms-auto" style={{ width: "250px" }}>
                        <tbody>
                          <tr>
                            <td>Sous total HT</td>
                            <td className="text-end">{customFormatNumber(rounded(devis.header.den_total_ht, 2))}€</td>
                          </tr>
                          <tr>
                            <td>Total remise</td>
                            <td className="text-end">- {customFormatNumber(rounded(devis.header.den_total_remise, 2))}€</td>
                          </tr>
                          <tr>
                            <td>Total TVA <small className="text-muted"></small></td>
                            <td className="text-end">{customFormatNumber(rounded(devis.header.den_total_tva, 2))}€</td>
                          </tr>
                          {/* <tr>
                            <td></td>
                            <td className="text-end">{}</td>
                          </tr> */}
                          <tr className="border-top border-top-dashed fs-15">
                            <th scope="row">Total TTC</th>
                            <th className="text-end">{customFormatNumber(devis.header.den_total_ttc)}€</th>
                          </tr>
                        </tbody>
                      </Table>
                    </div>
                    <div className="mt-4">
                      <Label
                        for="exampleFormControlTextarea1"
                        className="form-label text-muted text-uppercase fw-semibold"
                      >
                        NOTES
                      </Label>
                      <p className="form-control alert alert-info">{devis.header.den_note ? devis.header.den_note : <i style={{ color: "#898989" }}>Non renseigner</i>}</p>
                    </div>
                    <div className="hstack gap-2 justify-content-end d-print-none mt-4">

                      <Link to={`/devis/edition/${devis.header.den_id}`} state={devis} className="btn btn-success"><i className="ri-ball-pen-line align-bottom me-1"></i> Editer</Link>
                      <Link onClick={() => setShowConfirmModal(true)} className="btn btn-success"><i className="ri-send-plane-fill align-bottom me-1"></i> Envoyer</Link>
                      <Link to="#" onClick={printInvoice} className="btn btn-success"><i className="ri-printer-line align-bottom me-1"></i> Imprimer</Link>

                      <Link onClick={() => downloadPdf()} className="btn btn-secondary"><i className="ri-download-2-line align-bottom me-1"></i> Télécharger</Link>
                      <Link onClick={() => { checkFactureAlreadyCreated(); }} /*to={'/factures/creation'}*/ state={{ den_id: devis.header.den_id }} className="btn btn-secondary"><i className="ri-file-copy-2-fill align-bottom me-1"></i> Facturer</Link>

                      <Link onClick={() => { setDeleteModal(true) }} state={devis} className="btn btn-danger"><i className="ri-ball-pen-line align-bottom me-1"></i> Supprimer</Link>
                    </div>
                  </CardBody>
                </Col>

              </Row>
            </Card>
            {/* </Preview> */}
          </Col>
        </Row>

      </Container>
    </div >
  );
};

export default DevisDetails;
