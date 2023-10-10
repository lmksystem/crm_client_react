import React, { useEffect, useState, useCallback, useMemo, useRef } from "react";
import { Link } from "react-router-dom";

import {
  Col,
  Container,
  Row,
  Card,
  CardHeader,
  CardBody,
  Label,
  Input,
  Modal,
  ModalHeader,
  ModalBody,
  Form,
  ModalFooter,
  FormFeedback
} from "reactstrap";
import Select from "react-select";

import BreadCrumb from "../../Components/Common/BreadCrumb";
import DeleteModal from "../../Components/Common/DeleteModal";

//Import actions
import {
  getProducts as onGetProducts,
  addRecurrence as onAddRecurrence,
  getRecurrences as onGetRecurrences,
  getCollaborateurs as onGetCollaborateurs,
  deleteRecurrence as onDeleteRecurrence,
  getRecurrenceOfEntity as onGetRecurrenceOfEntity
} from "../../slices/thunks";
//redux
import { useSelector, useDispatch } from "react-redux";
import TableContainer from "../../Components/Common/TableContainer";

// Formik
import * as Yup from "yup";
import { useFormik } from "formik";

import Loader from "../../Components/Common/Loader";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Export Modal
import ExportCSVModal from "../../Components/Common/ExportCSVModal";
import SimpleBar from "simplebar-react";
import moment from "moment";
import DataTable from "react-data-table-component";


const Recurrence = () => {
  const dispatch = useDispatch();
  const { products, isProductSuccess, error, collaborateurs, recurrences, isRecurrenceAdd, recurrenceOfEntity } = useSelector((state) => ({
    recurrenceOfEntity: state.Recurrence.recurrenceOfEntity,
    collaborateurs: state.Gestion.collaborateurs,
    products: state.Product.products,
    recurrences: state.Recurrence.recurrences,
    isProductSuccess: state.Product.isProductSuccess,
    isRecurrenceAdd: state.Recurrence.isRecurrenceAdd,
    error: state.Product.error,
  }));

  const [searchValueProduct, setSearchValueProduct] = useState("");
  const [openList, setOpenList] = useState(false);
  const [searchValueClient, setSearchValueClient] = useState("");
  const [recurrenceToDelete, setRecurrenceToDelete] = useState(null);
  const [modalProduct, setModalProduct] = useState(false);
  const [modalClient, setModalClient] = useState(false);
  const [openCreate, setOpenCreate] = useState(false);
  const [show, setShow] = useState(false);
  const [info, setInfo] = useState(null);
  const [isLastRec, setIsLastRec] = useState(false);
  const [height, setHeight] = useState(0)

  const ref = useRef(null)

  useEffect(() => {
    if (isRecurrenceAdd) {
      dispatch(onGetRecurrences())
    }
  }, [dispatch, isRecurrenceAdd, recurrenceOfEntity]);

  useEffect(() => {

    dispatch(onGetProducts());
    dispatch(onGetRecurrences())
    dispatch(onGetCollaborateurs());

  }, []);

  //delete Conatct
  const [deleteModal, setDeleteModal] = useState(false);

  const toggleModalProduct = useCallback(() => {
    if (modalProduct) {
      setModalProduct(false);
    } else {
      setModalProduct(true);
    }
  }, [modalProduct]);

  const toggleModalCreate = useCallback(() => {
    if (openCreate) {
      setOpenCreate(false);
    } else {
      setOpenCreate(true);
    }
  }, [openCreate]);

  const toggleModalClient = useCallback(() => {
    if (modalClient) {
      setModalClient(false);
    } else {
      setModalClient(true);
    }
  }, [modalClient]);

  const toggleModalList = useCallback(() => {
    if (openList) {
      setOpenList(false);
      setInfo(null);
    } else {
      setOpenList(true);
    }
  }, [openList]);

  // Delete Data
  const handleDeleteRecurrence = () => {
    if (recurrenceToDelete) {
      dispatch(onDeleteRecurrence(recurrenceToDelete));
      setDeleteModal(false);
      if (isLastRec) {
        setShow(false);
      }
    }
  };

  const onClickDelete = (rec_id, is_last) => {
    setRecurrenceToDelete(rec_id);
    setDeleteModal(true);
    setIsLastRec(is_last);
  };

  // validation
  const validation = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {
      products: [],
      clients: {},
      recurrence_data: {
        rec_ent_fk: "",
        rec_desc: "",
        rec_date_echeance: "",
        rec_nb: 1,
        rec_quand: 0,
        rec_repetition: 1,
      }

    },
    validationSchema: Yup.object({
      recurrence_data: Yup.object({
        rec_ent_fk: Yup.number().required("Veuillez entrer un client"),
        rec_date_echeance: Yup.string().required("Veuillez entrer une date"),
        rec_nb: Yup.number().required("Champs obligatoire"),
        rec_quand: Yup.string().required("Champs obligatoire"),
        rec_repetition: Yup.string().required("Champs obligatoire"),

      }),
      products: Yup.array().min(1, "Ajouter au moins un produit")
    }),
    onSubmit: (values) => {
      for (let index = 0; index < values.products.length; index++) {
        const element = values.products[index];
        let data = { ...element, ...values.recurrence_data };
        delete data.pro_id;
        dispatch(onAddRecurrence(data));
      }
      setOpenCreate(false);
      setShow(false);
      validation.resetForm();
    },
  });

  /**
  * Fonction de recherche d'un client lors de la séléction
  * @returns 
  */
  const handleListClient = () => {
    let data = [...collaborateurs];

    if (searchValueClient != "") {
      data = data.filter(e =>
        e.ent_name?.toLowerCase()?.includes(searchValueClient.toLowerCase()) ||
        e.ent_email?.toLowerCase()?.includes(searchValueClient.toLowerCase()) ||
        e.ent_phone?.toLowerCase()?.includes(searchValueClient.toLowerCase())
      );
    }

    return data
  }

  // Column
  const columns = useMemo(
    () => [

      {
        id: "hidden-id",
        accessor: 'ent_id',
        hiddenColumns: true,
        Cell: (cell) => {
          return <input type="hidden" value={cell.value} />;
        }
      },
      {
        Header: "Entreprise",
        accessor: "ent_name",
      },
      {
        Header: "Email",
        accessor: "ent_email",
        filterable: false,
      },
      {
        Header: "Montant total",
        accessor: "",
        filterable: false,
        Cell: (cell) => {
          let recurrenceMotantArray = cell.row.original.recurrences?.map((r) => r.rec_montant * r.rec_pro_qty);
          let montantTotal = recurrenceMotantArray.reduce((partialSum, a) => partialSum + a, 0);
          return <div>{montantTotal}€</div>;
        }
      },
      {
        Header: "Nombre de produit récurrent",
        accessor: "pro_tva",
        filterable: false,
        Cell: (cell) => {
          let recurrences = cell.row.original.recurrences;
          return <div>{recurrences.length}</div>;
        }
      },
      {
        Header: "Action",
        Cell: (cellProps) => {
          let data = cellProps.row.original;
          return (
            <ul className="list-inline hstack gap-2 mb-0">
              <li className="list-inline-item" title="View">
                <Link to="#"
                  onClick={() => {
                    setInfo(data);
                    setOpenList(true);

                  }}
                >
                  <i className="ri-eye-fill align-bottom text-muted"></i>
                </Link>
              </li>
            </ul>
          );
        },
      },
    ],
    []
  );

  let columns2 = [
    { name: "Produit", selector: row => row.rec_pro_name, sortable: true, },
    { name: "Qté", selector: row => row.rec_pro_qty, sortable: true, width: "70px" },
    { name: "Montant/unit", selector: row => row.rec_montant + "€", sortable: true },
    { name: "Échéance", selector: row => moment(row.rec_date_echeance).format('D MMM'), sortable: true },
    {
      name: "", selector: (row) => {
        return (
          <i onClick={() => onClickDelete(row.rec_id, recurrenceOfEntity.length < 2)} className="text-danger ri-close-circle-fill"></i>
        )
      },
      width: "50px"
    }]

  //  Internally, customStyles will deep merges your customStyles with the default styling.
  const customStyles = {

    headCells: {
      style: {
        paddingLeft: '2px', // override the cell padding for head cells
        paddingRight: '2px',
      },
    },

  };

  useEffect(() => {

    if (info) {
      dispatch(onGetRecurrenceOfEntity(info.ent_id));
    }
  }, [info])

  // Export Modal
  const [isExportCSV, setIsExportCSV] = useState(false);

  document.title = "Produits | Countano";
  return (
    <React.Fragment>
      <div className="page-content">
        <ExportCSVModal
          show={isExportCSV}
          onCloseClick={() => setIsExportCSV(false)}
          data={products}
        />

        <DeleteModal
          show={deleteModal}
          onDeleteClick={handleDeleteRecurrence}
          onCloseClick={() => { setDeleteModal(false); setIsLastRec(false); }}
        />

        <Container fluid>
          <BreadCrumb title="Produit" pageTitle="Gestion" />
          <Row>
            <Col lg={12}>
              <Card>
                <CardHeader>

                  <Col lg={12}>
                    <div className="d-flex flex-grow-1 justify-content-end">

                      <button className="btn btn-info add-btn" onClick={() => setOpenCreate(true)}>
                        <i className="ri-add-fill me-1 align-bottom"></i>
                        Ajouter une facturation récurrente
                      </button>
                    </div>

                  </Col>
                </CardHeader>


                <CardBody className="pt-3">
                  <Row>
                    <Col xxl={12}>
                      <div>

                        {isProductSuccess ? (

                          <TableContainer
                            columns={columns}
                            data={(recurrences || [])}
                            isGlobalFilter={true}
                            isAddUserList={false}
                            customPageSize={7}
                            className="custom-header-css"
                            divClass="table-responsive table-card mb-2"
                            tableClass="align-middle table-nowrap"
                            theadClass="table-light"
                            isCompaniesFilter={false}
                            isProductsFilter={true}
                            SearchPlaceholder='Recherche...'
                          />

                        ) : (<Loader error={error} />)
                        }
                      </div>
                    </Col>


                    <ToastContainer closeButton={false} limit={1} />
                  </Row>

                </CardBody>

              </Card>
            </Col>

          </Row>
        </Container>
        <Modal id="showModal" isOpen={modalProduct} toggle={toggleModalProduct} centered>
          <ModalHeader className="bg-soft-info p-3" toggle={toggleModalProduct}>
            Séléctionner un produit
          </ModalHeader>


          <ModalBody>

            <Row className="g-3">
              <Input type="text"
                className="form-control bg-light border-0"
                id="cart-total"
                placeholder="Recherche par nom"

                onChange={(e) => { setSearchValueProduct(e.target.value) }}
                value={searchValueProduct}
              />
              <SimpleBar autoHide={false} style={{ maxHeight: "220px" }} className="px-3">
                <div style={{ cursor: "pointer", zIndex: 5000, padding: 8, borderBottom: "0.5px solid #dddddd" }}>
                  <Row>
                    <Col lg={6}><b>Nom</b></Col>
                    <Col className="text-end" lg={2}><b>Tva</b></Col>
                    <Col className="text-end" lg={4}><b>Prix</b></Col>
                  </Row>
                </div>
                {
                  products.filter((product) => product.pro_name.includes(searchValueProduct))?.map((p, key) => {

                    let isSelected = validation.values.products.filter((s) => s.pro_id == p.pro_id).length > 0 ? true : false;
                    let fixedStyle = { cursor: "pointer", zIndex: 5000, padding: 8, marginTop: 1 };
                    let styleSelected = isSelected ? { border: "3px solid #004D8560", borderRadius: 3, backgroundColor: "#004D8530" } : { borderBottom: "0.5px solid #dddddd" };

                    return (
                      <div
                        style={{ ...styleSelected, ...fixedStyle }}
                        onClick={() => {
                          let isSelected = validation.values.products.filter((s) => s.pro_id == p.pro_id).length > 0 ? true : false;
                          if (isSelected) {
                            validation.setValues({ ...validation.values, products: validation.values.products.filter((s) => s.pro_id != p.pro_id) })
                          } else {
                            validation.setValues({ ...validation.values, products: [...validation.values.products, { pro_id: p.pro_id, rec_pro_name: p.pro_name, rec_pro_qty: 1, rec_montant: p.pro_prix }] })
                          }
                        }}
                        key={key}
                      >
                        <Row>
                          <Col lg={6}>{p.pro_name}</Col>
                          <Col className="text-end" lg={2}>{p.pro_tva}%</Col>
                          <Col className="text-end" lg={4}>{p.pro_prix}€</Col>
                        </Row>
                      </div>
                    )
                  })


                }
              </SimpleBar>
            </Row>
          </ModalBody>
          <ModalFooter>
            <div className="hstack gap-2 justify-content-end">
              <button type="button" className="btn btn-light" onClick={() => {
                // validation.setValues({ ...validation.values, products: validation.values.products.filter((p) => selectedProducts.find((e) => e.pro_id == p.pro_id)) });
                setModalProduct(false);
              }}> Valider </button>
            </div>
          </ModalFooter>

        </Modal>
        <Modal id="showModal" isOpen={openCreate} toggle={toggleModalCreate} centered>
          <ModalHeader className="bg-soft-info p-3" toggle={toggleModalCreate}>
            Ajouter des récurrences
          </ModalHeader>
          <Form className="tablelist-form" onSubmit={(e) => {
            e.preventDefault();
            validation.handleSubmit();
            return false;
          }}>

            <ModalBody>
              <Row>


                <Col lg={12}>
                  <div className="w-10 d-flex input-group mb-2 position-relative">
                    <Input
                      style={{ flex: 1 }}
                      type="text"
                      autoComplete="off"
                      className="form-control border-1"
                      placeholder="Ajouter un client"
                      onChange={() => { }}
                      value={validation.values.clients.ent_name || ""}
                      disabled
                      required
                      invalid={validation.errors?.recurrence_data?.rec_ent_fk && validation.touched?.recurrence_data?.rec_ent_fk ? true : false}
                    />
                    <button onClick={() => { toggleModalClient(); }} className="btn btn-primary" type="button" id="button-addon2">+</button>
                    {validation.errors?.recurrence_data?.rec_ent_fk && validation.touched?.recurrence_data?.rec_ent_fk ? (
                      <FormFeedback type="invalid">{validation.errors?.recurrence_data?.rec_ent_fk}</FormFeedback>
                    ) : null}
                  </div>
                </Col>


                <Col lg={12}>
                  <Label>Description</Label>
                  <div className="w-10 d-flex input-group mb-2 position-relative">

                    <Input
                      style={{ flex: 1 }}
                      type="text"
                      name={`recurrence_data.rec_desc`}
                      className="form-control border-1"
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                      value={validation.values.recurrence_data.rec_desc || ""}
                    />
                  </div>
                </Col>


                <Col lg={12}>
                  <div className="mb-2">
                    <Label for="date-field">Date de la prochaine échéance</Label>
                    <Input
                      type="date"
                      name="recurrence_data.rec_date_echeance"
                      id="date-field"
                      className="form-control"
                      placeholder="Selectionnez une date"
                      onBlur={validation.handleBlur}
                      onChange={validation.handleChange}
                      invalid={validation.errors?.recurrence_data?.rec_date_echeance && validation.touched?.recurrence_data?.rec_date_echeance ? true : false}
                    />
                    {validation.errors?.recurrence_data?.rec_date_echeance && validation.touched?.recurrence_data?.rec_date_echeance ? (
                      <FormFeedback type="invalid">{validation.errors?.recurrence_data?.rec_date_echeance}</FormFeedback>
                    ) : null}
                  </div>
                </Col>


                <Label for="date-field">Créer la facture toute les</Label>
                <Col lg={12} className="d-flex">

                  <div className="mb-2 input-group position-relative">
                    <Input
                      type="number"
                      name="recurrence_data.rec_repetition"
                      id="date-field"
                      className="form-control w-5"
                      placeholder=""

                      onBlur={validation.handleBlur}
                      onChange={validation.handleChange}
                      value={validation.values.recurrence_data.rec_repetition}
                      invalid={validation.errors?.recurrence_data?.rec_repetition && validation.touched?.recurrence_data?.rec_repetition ? true : false}

                    />
                    <Input
                      type="select"
                      name="recurrence_data.rec_quand"
                      id="date-field"
                      className="w-75 form-control"
                      placeholder="Select a date"
                      onBlur={validation.handleBlur}
                      onChange={validation.handleChange}
                      value={validation.values.recurrence_data.rec_quand}
                      invalid={validation.errors?.recurrence_data?.rec_quand && validation.touched?.recurrence_data?.rec_quand ? true : false}

                    >
                      <option>Séléctionnez une répétition...</option>
                      <option value={1} >Jours</option>
                      <option value={2}>Semaines</option>
                      <option value={3}>Mois</option>
                      <option value={4}>Trimestres</option>
                    </Input>

                  </div>
                  {validation.values.recurrence_data.rec_nb != 0 ?
                    <div className="mb-2 ms-2 d-flex align-items-center">
                      <span className="me-2">répéter</span>
                      <Input
                        type="number"
                        name="recurrence_data.rec_nb"
                        id="date-field"
                        className="form-control w-5"
                        placeholder=""
                        onBlur={validation.handleBlur}
                        onChange={validation.handleChange}
                        value={validation.values.recurrence_data.rec_nb}
                        invalid={validation.errors?.recurrence_data?.rec_nb && validation.touched?.recurrence_data?.rec_nb ? true : false}

                      />
                    </div> : ""
                  }

                </Col>
                <Col xl={12}>
                  <Input onChange={(e) => validation.setValues({ ...validation.values, recurrence_data: { ...validation.values.recurrence_data, rec_nb: e.target.checked ? 0 : 1 } })} type="checkbox" />
                  <Label>ne pas définir un nombre de répétition</Label>
                </Col>


                <Col lg={6}>
                  <div>
                    <Label htmlFor="pro_name-field" className="form-label"                      >
                      <button onClick={() => { toggleModalProduct(); }} className="btn btn-primary" type="button" id="button-addon2">+ Ajouter des produits</button>
                    </Label>
                  </div>
                </Col>
                <Col lg={12}>
                  <div className="d-flex">
                    <div style={{ flex: 2 }}><Label>Nom</Label></div>
                    <div style={{ flex: 1 }}><Label>Qté</Label></div>
                    <div style={{ flex: 1 }}><Label>Prix unit ht</Label></div>
                  </div>
                  {validation.values.products.length
                    ? validation?.values?.products?.map((product, i) => (
                      <div key={i} className="d-flex">
                        <div className="w-75 d-flex input-group mb-2 position-relative">
                          <Input
                            style={{ flex: 1 }}
                            type="text"
                            className="form-control border-1"
                            placeholder="Nom du produit"
                            value={product.rec_pro_name}
                            disabled
                            required
                          />
                          <div className="input-step">
                            <button type="button" className="minus" onClick={(e) => {
                              if (product.rec_pro_qty > 1) {
                                validation.setValues({ ...validation.values, products: validation.values.products?.map((e) => e.pro_id == product.pro_id ? { ...e, rec_pro_qty: e.rec_pro_qty - 1 } : e) })
                              }
                            }}>
                              –
                            </button>
                            <Input
                              type="number"
                              placeholder="0"
                              className="product-quantity"
                              id="product-qty-1"
                              value={product?.rec_pro_qty}
                              onChange={(e) => { }}
                              // onBlur={validation.handleBlur}
                              required
                            />
                            <button type="button" className="plus" onClick={(e) => {
                              validation.setValues({ ...validation.values, products: validation.values.products?.map((e) => e.pro_id == product.pro_id ? { ...e, rec_pro_qty: e.rec_pro_qty + 1 } : e) })
                            }}>
                              +
                            </button>
                          </div>
                        </div>
                        <div style={{ width: "30%", display: "flex", }} className="input-group mb-2 ms-2">

                          <Input
                            name={`products[${i}].rec_montant`}
                            type="number"
                            className="form-control border-1"
                            value={product.rec_montant}
                            onChange={validation.handleChange}
                            onBlur={validation.handleBlur}
                            required
                            min={1}
                          />


                          <label className="btn btn-primary btn-input-group form-label">€</label>
                        </div>

                      </div>
                    ))
                    : <i>Aucun produit ajouté</i>}
                  {validation.errors?.products ? (
                    <div type="invalid" style={{ width: "100%", marginTop: "0.25rem", fontSize: "0.875em", color: "#fa896b", backgroundImage: 'url("data:image/svg+xml,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 12 12%27 width=%2712%27 height=%2712%27 fill=%27none%27 stroke=%27%23fa896b%27%3e%3ccircle cx=%276%27 cy=%276%27 r=%274.5%27/%3e%3cpath stroke-linejoin=%27round%27 d=%27M5.8 3.6h.4L6 6.5z%27/%3e%3ccircle cx=%276%27 cy=%278.2%27 r=%27.6%27 fill=%27%23fa896b%27 stroke=%27none%27/%3e%3c/svg%3e")', backgroundRepeat: 'no-repeat', backgroundSize: 'contain', backgroundPositionX: "0", paddingLeft: "20px" }}>{validation.errors?.products}</div>
                  ) : null}
                </Col>





              </Row>
            </ModalBody>
            <ModalFooter>
              <div className="d-flex flex-grow-1 justify-content-end">

                <button className="btn btn-info add-btn" type="submit">
                  <i className="ri-add-fill me-1 align-bottom"></i>
                  Ajouter une facturation récurrente
                </button>
              </div>
            </ModalFooter>
          </Form>
        </Modal>
        <Modal id="showModal" isOpen={modalClient} toggle={toggleModalClient} centered>
          <ModalHeader className="bg-soft-info p-3" toggle={toggleModalClient}>
            Séléctionner un client
          </ModalHeader>


          <ModalBody>

            <Row className="g-3">
              <Input type="text"
                className="form-control bg-light border-0"
                id="cart-total"
                placeholder="Recherche par nom, téléphone, email..."

                onChange={(e) => { setSearchValueClient(e.target.value) }}
                value={searchValueClient}
              />
              <SimpleBar autoHide={false} style={{ maxHeight: "220px" }} className="px-3">
                {handleListClient()?.map((c, i) => {
                  return (
                    <div key={i} style={{ display: "flex", alignItems: "center", width: "100%", borderBottom: "0.5px solid #dddddd", margin: 3 }}>
                      <div className="flex-shrink-0">
                        {c.ent_img_url ? <img
                          src={api.API_URL + "/images/" + c.ent_img_url}
                          alt=""
                          className="avatar-xxs rounded-circle"
                        /> :
                          <div className="flex-shrink-0 avatar-xs me-2">
                            <div className="avatar-title bg-soft-success text-success rounded-circle fs-13">
                              {c.ent_name.charAt(0)}
                            </div>
                          </div>
                        }
                      </div>
                      <div style={{ cursor: "pointer", padding: 8, display: "flex", flexDirection: "column", width: "100%" }} onClick={() => {
                        setModalClient(() => false);
                        validation.setValues({
                          ...validation.values, recurrence_data: {
                            ...validation.values.recurrence_data,
                            rec_ent_fk: c.ent_id
                          },
                          clients: c
                        })
                      }} key={i}>

                        <span>{c.ent_name}</span>
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                          <span><i>{c.ent_email}</i></span>  <span><i>{c.ent_phone}</i></span>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </SimpleBar>
            </Row>
          </ModalBody>
          <ModalFooter>
            <div className="hstack gap-2 justify-content-end">
              <button type="button" className="btn btn-light" onClick={() => { setModalClient(false); }} > Fermer </button>
              <button type="submit" className="btn btn-success" id="add-btn" > Séléctionner </button>
            </div>
          </ModalFooter>

        </Modal>
        <Modal id="showModal" isOpen={openList} toggle={toggleModalList} centered>
          <ModalHeader className="bg-soft-info p-3" toggle={toggleModalList}>
            Liste des produits récurrents
          </ModalHeader>


          <ModalBody style={{}}>

            <Row className="g-3">

              <SimpleBar autoHide={false} style={{ maxHeight: "220px" }} className="px-3">
                <Col lg={12} className="">
                  <div style={{}}>
                    <DataTable columns={columns2} data={recurrenceOfEntity} tableStyle={{ minWidth: '60rem' }} customStyles={customStyles} />

                  </div>
                </Col>
              </SimpleBar>
            </Row>
          </ModalBody>
          <ModalFooter>
            <div className="hstack gap-2 justify-content-end">
              <button type="button" className="btn btn-light" onClick={() => { setOpenList(false); }} > Fermer </button>
              <button type="submit" className="btn btn-success" id="add-btn" > Séléctionner </button>
            </div>
          </ModalFooter>

        </Modal>
      </div >
    </React.Fragment >
  );
};

export default Recurrence;
