import React, { useState, useEffect, useMemo, useCallback } from "react";
import { CardBody, Row, Col, Card, Container, CardHeader } from "reactstrap";
import { Link } from "react-router-dom";
import * as moment from "moment";
import BreadCrumb from "../../Components/Common/BreadCrumb";
import TableContainer from "../../Components/Common/TableContainer";
import DeleteModal from "../../Components/Common/DeleteModal";

//Import actions
import { getDevis as onGetDevis, deleteDevis as onDeleteDevis, getDevisWidgets as onGetDevisWidgets, getEtatDevis as onGetEtatDevis } from "../../slices/thunks";

//redux
import { useSelector, useDispatch } from "react-redux";

import Loader from "../../Components/Common/Loader";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import "moment/locale/fr"; // without this line it didn't work
import { DevisListGlobalSearch } from "../../Components/Common/GlobalSearchFilter";
import { customFormatNumber, rounded } from "../../utils/function";
import { api } from "../../config";
import WidgetCountUp from "../../Components/Common/WidgetCountUp";
import { devisEtatColor } from "../../common/data/devisList";
moment.locale("fr");

const DevisList = () => {
  document.title = "Liste devis  | Countano";

  const dispatch = useDispatch();

  const { devisWidgets, devisRedux, isDevisSuccess, error, etatDevis, devise } = useSelector((state) => ({
    devisRedux: state.Devis.devisList,
    isDevisSuccess: state.Devis.isDevisSuccess,
    error: state.Devis.error,
    devisWidgets: state.Devis.widgets,
    etatDevis: state.Devis.etatDevis,
    devise: state.Company.devise
  }));

  //delete devis
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteModalMulti, setDeleteModalMulti] = useState(false);

  const [customFiltered, setCustomFiltered] = useState(null);

  const [devisList, setDevisList] = useState([]);
  const [devis, setDevis] = useState([]);

  const handleDeleteDevis = (id) => {
    if (id) {
      dispatch(onDeleteDevis(id));
      setDeleteModal(false);
    }
  };

  // Checked All
  const checkedAll = useCallback(() => {
    const checkall = document.getElementById("checkBoxAll");
    const ele = document.querySelectorAll(".invoiceCheckBox");

    if (checkall.checked) {
      ele.forEach((ele) => {
        ele.checked = true;
      });
    } else {
      ele.forEach((ele) => {
        ele.checked = false;
      });
    }

    deleteCheckbox();
  }, []);

  // Delete Multiple
  const [selectedCheckBoxDelete, setSelectedCheckBoxDelete] = useState([]);
  const [isMultiDeleteButton, setIsMultiDeleteButton] = useState(false);

  const deleteMultiple = () => {
    const checkall = document.getElementById("checkBoxAll");
    selectedCheckBoxDelete.forEach((element) => {
      setTimeout(() => {
        toast.clearWaitingQueue();
      }, 3000);
      handleDeleteDevis(element.value);
    });

    setIsMultiDeleteButton(false);
    checkall.checked = false;
  };

  const deleteCheckbox = () => {
    const ele = document.querySelectorAll(".invoiceCheckBox:checked");
    ele.length > 0 ? setIsMultiDeleteButton(true) : setIsMultiDeleteButton(false);
    setSelectedCheckBoxDelete(ele);
  };

  // devis Column
  const columns = useMemo(
    () => [
      {
        Header: (
          <input
            type="checkbox"
            id="checkBoxAll"
            className="form-check-input"
            onClick={() => checkedAll()}
          />
        ),
        Cell: (cellProps) => {
          return (
            <input
              style={{ zIndex: 4000, position: "relative" }}
              type="checkbox"
              onClick={(e) => {
                e.stopPropagation();
                deleteCheckbox();
              }}
              className="invoiceCheckBox form-check-input"
              value={cellProps.row.original.header.den_id}
              onChange={() => {
                /*deleteCheckbox()*/
              }}
            />
          );
        },
        id: "#"
      },
      // {
      //   Header: "ID",
      //   accessor: "header.den_id",
      //   filterable: false,
      //   Cell: (cell) => {
      //     return <Link to={`/devis/detail/${cell.row.original.header.den_id}`} state={cell.row.original} className="fw-medium link-primary">{cell.row.original.header.den_id}</Link>;
      //   },
      // },
      {
        Header: "Numéro devis",
        accessor: "header.den_num",
        filterable: false,
        Cell: (cell) => {
          return (
            <Link
              to={`/devis/detail/${cell.row.original.header.den_id}`}
              state={cell.row.original}
              className="fw-medium link-primary">
              {cell.row.original.header.den_num}
            </Link>
          );
        }
      },
      {
        Header: "Client",
        accessor: "contact.dco_cus_name",
        Cell: (devis) => {
          return (
            <>
              <div className="d-flex align-items-center">
                {devis.row.original.img ? (
                  <img
                    src={api.API_URL + "/images/users/" + devis.row.original.img}
                    alt=""
                    className="avatar-xs rounded-circle me-2"
                  />
                ) : (
                  <div className="flex-shrink-0 avatar-xs me-2">
                    <div className="avatar-title bg-soft-success text-success rounded-circle fs-13">{(devis.row.original?.contact?.dco_cus_name && devis.row.original?.contact?.dco_cus_name.charAt(0)) || ""}</div>
                  </div>
                )}
                {devis.row.original.contact?.dco_cus_name}
              </div>
            </>
          );
        }
      },

      {
        Header: "EMAIL",
        accessor: "contact.dco_cus_email",
        filterable: false
      },
      {
        Header: "Sujet",
        accessor: "header.den_sujet"
      },

      {
        Header: "DATE",
        accessor: "header.den_date_create",
        Cell: (devis) => (
          <>
            {moment(new Date(devis.row.original.header.den_date_create)).format("DD MMMM Y")}
            {/* <small className="text-muted">{handleValidTime(devis.row.original.header.den_date_create)}</small> */}
          </>
        )
      },
      {
        Header: "Montant",
        accessor: "header.den_total_ttc",
        filterable: false,
        Cell: (devis) => (
          <>
            <div className="fw-semibold ff-secondary">
              {customFormatNumber(rounded(devis.row.original.header.den_total_ttc, 2))}
              {devise}
            </div>
          </>
        )
      },
      {
        Header: "État",
        accessor: "header.det_name",
        Cell: (cell) => {
          return <span className={"badge text-uppercase badge-soft-" + devisEtatColor[parseInt(cell.row.original.header.den_etat) - 1]}> {etatDevis?.find((d) => d.det_id == cell.row.original.header.den_etat)?.det_name} </span>;
        }
      }
    ],
    [checkedAll, dispatch, etatDevis, devis]
  );

  useEffect(() => {
    setDevis(devisRedux);
  }, [devisRedux]);

  useEffect(() => {
    // if (devis) {
    setDevisList(devis);
    // }
  }, [devis, etatDevis]);

  useEffect(() => {
    dispatch(onGetDevisWidgets());
    dispatch(onGetDevis());
    dispatch(onGetEtatDevis());
  }, [dispatch]);

  return (
    <React.Fragment>
      <div className="page-content">
        <DeleteModal
          show={deleteModal}
          onDeleteClick={() => {
            handleDeleteDevis();
          }}
          onCloseClick={() => setDeleteModal(false)}
        />
        <DeleteModal
          show={deleteModalMulti}
          onDeleteClick={() => {
            deleteMultiple();
            setDeleteModalMulti(false);
          }}
          onCloseClick={() => setDeleteModalMulti(false)}
        />

        <Container fluid>
          <BreadCrumb
            title="Devis"
            pageTitle="Facturation"
          />
          <h3>Statistiques de l'année</h3>
          <Row>
            {devisWidgets?.map((widget, i) => {
              let data = { ...widget };
              if (data.id != 3) {
                data.name = widget.name + "s";
              }

              return (
                <WidgetCountUp
                  key={i}
                  data={data}
                  type={"Devis"}
                />
              );
            })}
          </Row>

          <Row>
            <Col lg={12}>
              <Card id="invoiceList">
                <CardHeader className="border-0">
                  <div className="d-flex align-items-center">
                    {/* <h5 className="card-title mb-0 flex-grow-1">Devis</h5> */}
                    <div className="flex-shrink-0">
                      <div className="d-flex gap-2 flex-wrap">
                        <Link
                          to={"/devis/creation"}
                          className="btn btn-secondary me-1">
                          <i className="ri-add-line align-bottom me-1"></i> Créer un devis
                        </Link>
                        {isMultiDeleteButton && (
                          <button
                            className="btn btn-danger"
                            onClick={() => setDeleteModalMulti(true)}>
                            <i className="ri-delete-bin-2-line"></i>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </CardHeader>

                <CardBody className="pt-0">
                  <div>
                    <DevisListGlobalSearch
                      origneData={devis}
                      data={customFiltered}
                      setData={setCustomFiltered}
                    />
                    {isDevisSuccess ? (
                      <TableContainer
                        columns={columns}
                        data={customFiltered || devisList || []}
                        isGlobalFilter={false}
                        isAddUserList={false}
                        customPageSize={10}
                        divClass="table-responsive table-card mb-2"
                        className="custom-header-css"
                        theadClass="text-muted text-uppercase"
                        SearchPlaceholder=""
                        pathToDetail="/devis/detail/"
                      />
                    ) : (
                      <Loader error={error} />
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

export default DevisList;
