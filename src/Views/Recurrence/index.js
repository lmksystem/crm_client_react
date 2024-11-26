import React, { useEffect, useState, useCallback, useMemo, useRef } from "react";
import { Link } from "react-router-dom";

import { Col, Container, Row, Card, CardHeader, CardBody, Label, Input, Modal, ModalHeader, ModalBody, Form, ModalFooter, FormFeedback } from "reactstrap";
import Select from "react-select";

import BreadCrumb from "../../Components/Common/BreadCrumb";
import DeleteModal from "../../Components/Common/DeleteModal";

//Import actions
import { getProducts as onGetProducts, addRecurrence as onAddRecurrence, getRecurrences as onGetRecurrences, getCollaborateurs as onGetCollaborateurs, deleteRecurrence as onDeleteRecurrence, getRecurrenceOfEntity as onGetRecurrenceOfEntity } from "../../slices/thunks";
//redux
import { useSelector, useDispatch } from "react-redux";
import TableContainer from "../../Components/Common/TableContainer";

// Formik
import * as Yup from "yup";
import { useFormik } from "formik";

import Loader from "../../Components/Common/Loader";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Export Modal
import ExportCSVModal from "../../Components/Common/ExportCSVModal";
import SimpleBar from "simplebar-react";
import moment from "moment";
import DataTable from "react-data-table-component";
import { customFormatNumber } from "../../utils/function";
import { removeRecurrenceById } from "../../slices/recurrence/reducer";
import Formulaire from "./Formulaire";

const Recurrence = () => {
  const dispatch = useDispatch();
  const { products, isProductSuccess, error, collaborateurs, recurrences, isRecurrenceAdd, recurrenceOfEntity, devise } = useSelector((state) => ({
    recurrenceOfEntity: state.Recurrence.recurrenceOfEntity,
    collaborateurs: state.Gestion.collaborateurs,
    products: state.Product.products,
    recurrences: state.Recurrence.recurrences,
    isProductSuccess: state.Product.isProductSuccess,
    isRecurrenceAdd: state.Recurrence.isRecurrenceAdd,
    error: state.Product.error,
    devise: state.Company.devise
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
  const [height, setHeight] = useState(0);

  const ref = useRef(null);

  useEffect(() => {
    if (isRecurrenceAdd) {
      dispatch(onGetRecurrences());
    }
  }, [dispatch, isRecurrenceAdd, recurrenceOfEntity]);

  useEffect(() => {
    dispatch(onGetProducts());
    dispatch(onGetRecurrences());
    dispatch(onGetCollaborateurs());
  }, [openList]);

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
        setOpenList(false);
      }
    }
  };

  const onClickDelete = (rec_id, is_last) => {
    setRecurrenceToDelete(rec_id);
    setDeleteModal(true);
    setIsLastRec(is_last);
  };

  // validation

  /**
   * Fonction de recherche d'un client lors de la sélection
   * @returns
   */
  const handleListClient = () => {
    let data = [...collaborateurs];

    if (searchValueClient != "") {
      data = data.filter((e) => e.ent_name?.toLowerCase()?.includes(searchValueClient.toLowerCase()) || e.ent_email?.toLowerCase()?.includes(searchValueClient.toLowerCase()) || e.ent_phone?.toLowerCase()?.includes(searchValueClient.toLowerCase()));
    }

    return data;
  };

  // Column
  const columns = useMemo(
    () => [
      {
        id: "hidden-id",
        accessor: "ent_id",
        hiddenColumns: true,
        Cell: (cell) => {
          return (
            <input
              type="hidden"
              value={cell.value}
            />
          );
        }
      },
      {
        Header: "Entreprise",
        accessor: "ent_name"
      },
      {
        Header: "Email",
        accessor: "ent_email"
      },
      {
        Header: "Montant total",
        accessor: "",
        Cell: (cell) => {
          let recurrenceMotantArray = cell.row.original.recurrences?.map((r) => r.rec_montant * r.rec_pro_qty);
          let montantTotal = recurrenceMotantArray.reduce((partialSum, a) => partialSum + a, 0);
          return (
            <>
              {customFormatNumber(montantTotal)}
              {devise}
            </>
          );
        }
      },
      {
        Header: "Nombre de produit récurrent",
        accessor: "pro_tva",

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
              <li
                className="list-inline-item"
                title="View">
                <Link
                  to="#"
                  onClick={() => {
                    setInfo(data);
                    setOpenList(true);
                  }}>
                  <i className="ri-eye-fill align-bottom text-primary"></i>
                </Link>
              </li>
            </ul>
          );
        }
      }
    ],
    []
  );
  const [idModif, setIdModif] = useState(null);
  const [newMontantValue, setNewMontantValue] = useState(0);

  let columns2 = [
    { name: "Produit", selector: (row) => row.rec_pro_name, sortable: true },
    { name: "Qté", selector: (row) => row.rec_pro_qty, sortable: true, width: "70px" },
    {
      name: "Montant/unit",
      selector: (row) => {
        if (idModif == row.rec_id) {
          return (
            <div className="input-group">
              <input
                type="number"
                value={newMontantValue}
                onChange={(e) => setNewMontantValue(e.target.value)}
                className="form-control"
              />
            </div>
          );
        }
        return row.rec_montant + devise;
      },
      sortable: true
    },
    { name: "Échéance", selector: (row) => moment(row.rec_date_create).format("D MMM"), sortable: true },
    {
      name: "",
      selector: (row) => {
        return (
          <i
            onClick={() => {
              if (idModif == row.rec_id) {
                setIdModif(null);
                dispatch(
                  onAddRecurrence({
                    rec_id: row.rec_id,
                    rec_montant: newMontantValue
                  })
                );
                setInfo({ ...info, rec_montant: newMontantValue });
              } else {
                setIdModif(row.rec_id);
                setNewMontantValue(row.rec_montant);
              }
            }}
            className={idModif == row.rec_id ? "ri-check-fill text-success fs-18" : "ri-pencil-fill"}></i>
        );
      },
      width: "50px"
    },
    {
      name: "",
      selector: (row) => {
        return (
          <i
            onClick={() => onClickDelete(row.rec_id, recurrenceOfEntity.length < 2)}
            className="text-danger ri-close-circle-fill"></i>
        );
      },
      width: "50px"
    }
  ];

  //  Internally, customStyles will deep merges your customStyles with the default styling.
  const customStyles = {
    headCells: {
      style: {
        paddingLeft: "2px", // override the cell padding for head cells
        paddingRight: "2px"
      }
    }
  };

  useEffect(() => {
    if (info) {
      dispatch(onGetRecurrenceOfEntity(info.ent_id));
    }
  }, [info]);

  // Export Modal
  const [isExportCSV, setIsExportCSV] = useState(false);
  document.title = "Récurrences | Countano";
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
          onCloseClick={() => {
            setDeleteModal(false);
            setIsLastRec(false);
          }}
        />

        <Container fluid>
          <BreadCrumb
            title="Récurrences"
            pageTitle="Facturation"
          />
          <Row>
            <Col lg={12}>
              <Card>
                <div className="mx-3 mt-3">
                  <Col lg={12}>
                    <div className="d-flex flex-grow-1 justify-content-start">
                      <button
                        className="btn btn-secondary add-btn"
                        onClick={() => setOpenCreate(true)}>
                        <i className="ri-add-fill me-1 align-bottom"></i>
                        Ajouter une facturation récurrente
                      </button>
                    </div>
                  </Col>
                </div>

                <CardBody className="pt-3">
                  <Row>
                    <Col xxl={12}>
                      <div>
                        {isProductSuccess ? (
                          <TableContainer
                            columns={columns}
                            data={recurrences || []}
                            isGlobalFilter={true}
                            isAddUserList={false}
                            customPageSize={7}
                            className="custom-header-css"
                            divClass="table-responsive table-card mb-2"
                            tableClass="align-middle table-nowrap"
                            theadClass="table-light"
                            isCompaniesFilter={false}
                            isProductsFilter={true}
                            SearchPlaceholder="Recherche..."
                            initialSortField={"rec_date_create"}
                          />
                        ) : (
                          <Loader error={error} />
                        )}
                      </div>
                    </Col>

                    <ToastContainer
                      closeButton={false}
                      limit={1}
                    />
                  </Row>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
        <Modal
          id="showModal"
          isOpen={openCreate}
          toggle={toggleModalCreate}
          size="lg"
          centered>
          <ModalHeader
            className="bg-soft-info p-3"
            toggle={toggleModalCreate}>
            Ajouter des récurrences
          </ModalHeader>
          <ModalBody className="p-2">
            <Formulaire />
          </ModalBody>
        </Modal>
        {/* <Modal
          id="showModal"
          isOpen={modalClient}
          toggle={toggleModalClient}
          centered>
          <ModalHeader
            className="bg-soft-info p-3"
            toggle={toggleModalClient}>
            Sélectionnez un client
          </ModalHeader>

          <ModalBody>
            <Row className="g-3">
              <Input
                type="text"
                className="form-control bg-light border-0"
                id="cart-total"
                placeholder="Recherche par nom, téléphone, email..."
                onChange={(e) => {
                  setSearchValueClient(e.target.value);
                }}
                value={searchValueClient}
              />
              <SimpleBar
                autoHide={false}
                style={{ maxHeight: "220px" }}
                className="px-3">
                {handleListClient()?.map((c, i) => {
                  return (
                    <div
                      key={i}
                      style={{ display: "flex", alignItems: "center", width: "100%", borderBottom: "0.5px solid #dddddd", margin: 3 }}>
                      <div className="flex-shrink-0">
                        {c.ent_img_url ? (
                          <img
                            src={process.env.REACT_APP_API_URL + "/images/" + c.ent_img_url}
                            alt=""
                            className="avatar-xxs rounded-circle"
                          />
                        ) : (
                          <div className="flex-shrink-0 avatar-xs me-2">
                            <div className="avatar-title bg-soft-success text-success rounded-circle fs-13">{c.ent_name.charAt(0)}</div>
                          </div>
                        )}
                      </div>
                      <div
                        style={{ cursor: "pointer", padding: 8, display: "flex", flexDirection: "column", width: "100%" }}
                        onClick={() => {
                          setModalClient(() => false);
                          validation.setValues({
                            ...validation.values,
                            recurrence_data: {
                              ...validation.values.recurrence_data,
                              rec_ent_fk: c.ent_id
                            },
                            clients: c
                          });
                        }}
                        key={i}>
                        <span>{c.ent_name}</span>
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                          <span>
                            <i>{c.ent_email}</i>
                          </span>{" "}
                          <span>
                            <i>{c.ent_phone}</i>
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </SimpleBar>
            </Row>
          </ModalBody>
          <ModalFooter>
            <div className="hstack gap-2 justify-content-end">
              <button
                type="button"
                className="btn btn-light"
                onClick={() => {
                  setModalClient(false);
                }}>
                {" "}
                Fermer{" "}
              </button>
              <button
                type="submit"
                className="btn btn-success"
                id="add-btn">
                {" "}
                Sélectionner{" "}
              </button>
            </div>
          </ModalFooter>
        </Modal> */}
        <Modal
          id="showModal"
          isOpen={openList}
          toggle={toggleModalList}
          centered>
          <ModalHeader
            className="bg-soft-info p-3"
            toggle={toggleModalList}>
            Liste des produits récurrents
          </ModalHeader>

          <ModalBody style={{}}>
            <Row className="g-3">
              <SimpleBar
                autoHide={false}
                style={{ maxHeight: "250px" }}
                className="px-3">
                <Col
                  lg={12}
                  className="">
                  <div>
                    <DataTable
                      columns={columns2}
                      data={recurrenceOfEntity}
                      tableStyle={{ minWidth: "60rem" }}
                      customStyles={customStyles}
                    />
                  </div>
                </Col>
              </SimpleBar>
            </Row>
          </ModalBody>
          <ModalFooter>
            <div className="hstack gap-2 justify-content-end">
              <button
                type="button"
                className="btn btn-light"
                onClick={() => {
                  setOpenList(false);
                }}>
                {" "}
                Fermer{" "}
              </button>
              {/* <button type="submit" className="btn btn-success" id="add-btn" > Séléetionner </button> */}
            </div>
          </ModalFooter>
        </Modal>
      </div>
    </React.Fragment>
  );
};

export default Recurrence;
