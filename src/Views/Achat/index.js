import React, { useEffect, useState, useCallback, useMemo } from "react";
import { isEmpty } from "lodash";

import { Col, Container, Row, Card, CardHeader, CardBody } from "reactstrap";

import BreadCrumb from "../../Components/Common/BreadCrumb";
import DeleteModal from "../../Components/Common/DeleteModal";

//Import actions
import { getEmployees as onGetEmployees, getAchat as onGetAchat, getCollaborateurs as onGetCollaborateurs, deleteAchat as onDeleteAchat } from "../../slices/thunks";
//redux
import { useSelector, useDispatch } from "react-redux";
import TableContainer from "../../Components/Common/TableContainer";

// Formik
import * as Yup from "yup";
import { useFormik } from "formik";

import Loader from "../../Components/Common/Loader";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ModalCreate from "./ModalCreate";
import FileService from "../../utils/FileService";
import { customFormatNumber } from "../../utils/function";
import moment from "moment";
import { useNavigate } from "react-router-dom";

const Achats = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAchatSuccess, achats, error, transactions, collaborateurs } = useSelector((state) => ({
    isAchatSuccess: state.Achat.isAchatSuccess,
    achats: state.Achat.achats,
    error: state.Achat.error,
    collaborateurs: state.Gestion.collaborateurs,
    transactions: state.TransactionBank.transactionsBank
  }));

  const [achat, setAchat] = useState({});

  const [achatDisplay, setAchatDisplay] = useState([]);
  useEffect(() => {
    setAchatDisplay(achats);
  }, [achats]);

  const [isEdit, setIsEdit] = useState(false);

  const [transFilter, setTransFilter] = useState({
    data: [],
    searchTerm: ""
  });

  //delete Conatct
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteModalMulti, setDeleteModalMulti] = useState(false);

  const [show, setShow] = useState(false);

  const [modal, setModal] = useState(false);

  const toggle = useCallback(() => {
    if (modal) {
      setModal(false);
    } else {
      setModal(true);
    }
  }, [modal]);

  // Delete Data
  const handleDeleteContact = () => {
    if (achat) {
      dispatch(onDeleteAchat(achat?.ach_id));
      setDeleteModal(false);
    }
  };

  const onClickDelete = (achat) => {
    setAchat(achat);
    setDeleteModal(true);
  };

  // Checked All
  const checkedAll = useCallback(() => {
    const checkall = document.getElementById("checkBoxAll");
    const ele = document.querySelectorAll(".contactCheckBox");

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
      dispatch(onDeleteAchat(element.value));
      setTimeout(() => {
        toast.clearWaitingQueue();
      }, 3000);
    });
    setIsMultiDeleteButton(false);
    checkall.checked = false;
  };

  const deleteCheckbox = () => {
    const ele = document.querySelectorAll(".contactCheckBox:checked");
    ele.length > 0 ? setIsMultiDeleteButton(true) : setIsMultiDeleteButton(false);
    setSelectedCheckBoxDelete(ele);
  };

  // Column
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
              type="checkbox"
              className="contactCheckBox form-check-input"
              value={cellProps.row.original?.ach_id}
              onChange={() => deleteCheckbox()}
            />
          );
        },
        id: "checkDelete"
      },
      {
        Header: "",
        accessor: "ach_id",
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
        Header: "libelle",
        accessor: "ach_lib",
        filterable: false
      },
      {
        Header: "Client / Fournisseur",
        accessor: "ent_name",
        filterable: false
      },
      {
        Header: "Statut",
        filterable: false,
        Cell: (cell) => {
          let status = "";
          if (cell.row.original.ach_ent_fk == 0 || cell.row.original.ach_total_amount <= 0 || cell.row.original.ach_total_amount == null || cell.row.original.categories?.length == 0 || cell.row.original?.ach_date_create == "" || cell.row.original.ach_date_create == null) {
            status = "A traiter";
          } else if (parseFloat(cell.row.original.ach_rp) != 0) {
            status = "A associer";
          } else {
            status = "Validé";
          }
          return (
            <div className="d-flex align-items-center">
              <p className="m-0">{status}</p>
            </div>
          );
        }
      },
      {
        Header: "Montant",
        accessor: "ach_total_amount",
        filterable: false,
        Cell: (cell) => {
          return (
            <div className="d-flex align-items-center">
              <div>
                {cell.row.original.ach_type == "Charge" ? "- " : "+ "}
                {customFormatNumber(parseInt(cell.row.original.ach_total_amount))}
              </div>
            </div>
          );
        }
      },
      {
        Header: "Reste à pointer",
        accessor: "ach_rp",
        filterable: false,
        Cell: (cell) => {
          return (
            <div className="d-flex align-items-center">
              <div>{customFormatNumber(parseFloat(cell.row.original.ach_rp))}</div>
            </div>
          );
        }
      },
      {
        Header: "Date d'achat",
        accessor: "ach_date_create",
        filterable: false,
        Cell: (cell) => {
          return (
            <div className="d-flex align-items-center">
              <div>{moment(cell.value).isValid() ? moment(cell.value).format("L") : "Aucune date"}</div>
            </div>
          );
        }
      },
      {
        Header: "Echéance",
        accessor: "ach_date_expired",
        filterable: false,
        Cell: (cell) => {
          return (
            <div className="d-flex align-items-center">
              <div>{moment(cell.value).isValid() ? moment(cell.value).format("L") : "Aucune date"}</div>
            </div>
          );
        }
      },
      {
        Header: "Catégorie",
        accessor: "",
        filterable: false,
        Cell: (cell) => {
          let arrayColor = ["primary", "secondary", "success", "danger", "warning text-dark", "info text-dark", "light text-dark"];

          return cell.row.original?.categories.map((cat) => <span class={"mx-1 badge rounded-pill badge-soft-" + arrayColor[Math.floor(Math.random() * arrayColor.length)]}>{cat.aca_name}</span>);
        }
      },
      {
        Header: "Association",
        accessor: "assoc",
        filterable: false,
        Cell: (cell) => {
          let styleCSS = {};
          let elementDisplay = ``;
          if (parseFloat(cell.row.original.ach_rp) == 0 && parseFloat(cell.row.original.ach_total_amount) != 0) {
            styleCSS = {
              width: "15px",
              height: "15px",
              borderRadius: "50%",
              backgroundColor: "green",
              marginLeft: "15%"
            };
          } else if (parseFloat(cell.row.original.ach_rp) < Math.abs(parseFloat(cell.row.original.ach_total_amount)) && parseFloat(cell.row.original.ach_rp) > 0) {
            styleCSS = {
              width: "10px",
              height: "15px",
              borderBottomRightRadius: "10px",
              borderTopRightRadius: "10px",
              backgroundColor: "orange",
              // marginLeft:8,
              marginLeft: "16%"
            };
          } else {
            styleCSS = {
              width: "15px",
              height: "15px",
              borderRadius: "50%",
              border: "2px solid red",
              backgroundColor: "transparent",
              alignItems: "center",
              justifyContent: "center",
              display: "flex",
              marginLeft: "15%",
              overflow: "hidden"
            };
            elementDisplay = (
              <i
                style={{ color: "red" }}
                className="las la-times"></i>
            );
          }
          return (
            <div className="d-flex align-items-center">
              <div style={styleCSS}>{elementDisplay}</div>
            </div>
          );
        }
      },
      {
        Header: "Action",
        id: "Action",
        Cell: (cellProps) => {
          return (
            <div
              style={{
                display: "flex",
                justifyContent: "flex-start",
                alignItems: "center"
              }}>
              <i
                style={{ marginLeft: "14%" }}
                onClick={() => {
                  const achatData = cellProps.row.original;
                  onClickDelete(achatData);
                }}
                className="ri-delete-bin-fill align-bottom me-2 text-danger"></i>
            </div>
          );
        }
      }
    ],
    []
  );

  useEffect(() => {
    dispatch(onGetEmployees());
    dispatch(onGetAchat());
    dispatch(onGetCollaborateurs());
  }, [dispatch]);

  useEffect(() => {
    if (!isEmpty(achats)) {
      setAchat({});
      setIsEdit(false);
    }
  }, [achats]);

  useEffect(() => {
    if (show) {
      setTimeout(() => {
        document.getElementById("start-anime").classList.add("show-cus");
      }, 200);
    }
  }, []);

  document.title = "Factures Achats | Countano";
  return (
    <React.Fragment>
      <div className="page-content">
        <DeleteModal
          show={deleteModal}
          onDeleteClick={handleDeleteContact}
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
            title="Factures Achats"
            pageTitle="Banque / Achat"
          />
          <Row>
            <Col
              className="view-animate"
              xxl={show ? 9 : 12}>
              <Card id="contactList">
                <CardHeader>
                  <div className="d-flex align-items-center flex-wrap gap-2">
                    <div className="flex-grow-1">
                      <button
                        className="btn btn-secondary add-btn"
                        onClick={() => {
                          setModal(true);
                        }}>
                        <i className="ri-add-fill me-1 align-bottom"></i> Ajouter un achat
                      </button>
                    </div>
                    <div className="flex-shrink-0">
                      <div className="hstack text-nowrap gap-2">
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
                    {isAchatSuccess ? (
                      <TableContainer
                        initialSortField={"ach_date_create"}
                        columns={columns}
                        data={achatDisplay || []}
                        isGlobalFilter={true}
                        isAddUserList={false}
                        customPageSize={8}
                        className="custom-header-css"
                        divClass="table-responsive table-card mb-3"
                        tableClass="align-middle table-nowrap"
                        theadClass="table-light"
                        actionItem={(row) => {
                          const achatData = row.original;
                          // handleContactClick(achatData);
                          navigate("/achat/edition", { state: [achatData.ach_id] });
                        }}
                        // handleContactClick={handleContactClicks}
                        isContactsFilter={true}
                        SearchPlaceholder="Recherche..."
                      />
                    ) : (
                      <Loader error={error} />
                    )}
                  </div>
                  <ModalCreate
                    // validation={validation}
                    modal={modal}
                    toggle={toggle}
                    isEdit={isEdit}
                    setModal={setModal}
                    setIsEdit={setIsEdit}
                    setAchat={setAchat}
                    achat={achat}
                    transactions={transactions}
                    collaborateurs={collaborateurs}
                    transFilter={transFilter}
                    setTransFilter={setTransFilter}
                  />
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

export default Achats;
