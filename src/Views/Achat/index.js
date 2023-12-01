import React, { useEffect, useState, useCallback, useMemo } from "react";
import { isEmpty } from "lodash";

import {
  Col,
  Container,
  Row,
  Card,
  CardHeader,
  CardBody,
} from "reactstrap";

import BreadCrumb from "../../Components/Common/BreadCrumb";
import DeleteModal from "../../Components/Common/DeleteModal";

//Import actions
import {
  getEmployees as onGetEmployees,
  getAchat as onGetAchat,
  getTransactionBankAchat as onGetTransactionBankAchat,
  createUpdateAchat as onCreateUpdateAchat,
  getCollaborateurs as onGetCollaborateurs,
  deleteAchat as onDeleteAchat,
} from "../../slices/thunks";
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

const Achats = () => {
  const dispatch = useDispatch();
  const { isAchatSuccess, achats, error, transactions, collaborateurs } =
    useSelector((state) => ({
      isAchatSuccess: state.Achat.isAchatSuccess,
      achats: state.Achat.achats,
      error: state.Achat.error,
      collaborateurs: state.Gestion.collaborateurs,
      transactions: state.TransactionBank.transactionsBank,
    }));

  const [achat, setAchat] = useState({});

  const [achatDisplay, setAchatDisplay] = useState([]);
  useEffect(() => {
    setAchatDisplay(achats);
  }, [achats]);

  const [isEdit, setIsEdit] = useState(false);

  const [filesSelected, setFilesSelected] = useState([]);

  const [facsExist, setFacsExist] = useState([]);


  const [transFilter, setTransFilter] = useState({
    data: [],
    searchTerm: "",
  });

  //delete Conatct
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteModalMulti, setDeleteModalMulti] = useState(false);

  const [show, setShow] = useState(false);

  const [modal, setModal] = useState(false);


  function setInfosModal() {
    setFilesSelected([]);
    setFacsExist([]);
  }

  const toggle = useCallback(() => {
    if (modal) {
      if (!isEdit) {
        setInfosModal();
      }
      setAchat({});
      setTransFilter({
        data: [],
        searchTerm: "",
      });
      setModal(false);
      setIsEdit(false);
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

  const createAchats = useFormik({
    enableReinitialize: true,

    initialValues: {
      type: "",
      files: filesSelected,
      facturesExist:facsExist,
    },
    validationSchema: Yup.object({
      type: Yup.string().required("Veuillez choisir un type"),
      // files: Yup.array()
      //   .min(1)
      //   .required("Veuillez choisir un/plusieurs fichier(s)"),
    }),
    onSubmit: (values) => {
      if (!isEdit) {

        if(values?.files?.length> 0){
          FileService.uploadFile(values.files).then((res) => {
            if (res.fileName) {
              const newAchat = {
                ach_type: values.type,
                files: res.fileName,
              };
              // save new Achat
              dispatch(onCreateUpdateAchat(newAchat));
            }
          });
        }else if(values?.facturesExist?.length>0){
          FileService.copyFiles(values?.facturesExist).then((res) => {
            let arrayUpdateAchat =[];
            for (let index = 0; index < res.data.length; index++) {
              const element = res.data[index];
              let newAchat ={
                ach_ent_fk:element.header.fen_ent_fk,
                ach_date_create: element.header.fen_date_create.slice(0,10),
                ach_date_expired: element.header.fen_date_expired,
                ach_categorie: element.header.fen_sujet,
                ach_total_amount:parseFloat(element.header.fen_total_ttc),
                ach_rp:parseFloat(element.header.fen_total_ttc),
                ach_total_tva:parseFloat(element.header.fen_total_tva),
                ado_file_name:element.newFileCopy,
                ach_type:"Revenu",
                ach_lib:"",
                ach_num:"",
                ach_met:"",
              }
              arrayUpdateAchat.push(newAchat);
            }
            let objectDispatching ={
              invoices:arrayUpdateAchat
            }
            dispatch(onCreateUpdateAchat(objectDispatching));
          
          });
        }
       

        createAchats.resetForm();
      }
      toggle();
    },
  });

  
  // validation
  const validation = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {
      id: (achat && achat.id) || "",
      montant: (achat && achat.montant) || 0.0,
      tva: (achat && achat.tva) || 0.0,
      libelle: (achat && achat.libelle) || "",
      categorie: (achat && achat.categorie) || "",
      methode: (achat && achat.methode) || "",
      dateAchat: (achat && achat.dateAchat) || "",
      dateEcheance: (achat && achat.dateEcheance) || "",
      numero: (achat && achat.numero) || "",
      justificatif: (achat && achat.justificatif) || "",
      transactionAssoc: (achat && achat.transactionAssoc) || [],
      entity: (achat && achat.entity) || "",
      rp: (achat && achat.rp) || 0.0,
    },
    validationSchema: Yup.object({
      montant: Yup.number().required("Veuillez choisir entrer un montant"),
      categorie: Yup.string().required("Veuillez choisir entrer une catégorie"),
      entity: Yup.number().required("Veuillez choisir un client/fournisseur"),
    }),
   
    onSubmit: (values) => {
      if (isEdit) {
        let TRANS_ASSOC_DISOC =
          transFilter?.data?.filter(
            (item) => item.type === "assoc" || item.type == "disoc" || item.old==1
          ) || [];
        let newTransAssoc = TRANS_ASSOC_DISOC?.map((trAss) => {
          let newItem = {
            aba_ach_fk: values.id,
            aba_tba_fk: trAss.tba_id,
            aba_match_amount: Math.abs(trAss.tba_amount),
            type: trAss.type,
            tba_amount:trAss.tba_amount,

          };
          if (trAss.old == 1 && trAss.type == "disoc" && trAss.aba_id) {
            newItem.aba_id = trAss.aba_id;
          }
          return newItem;
        });
        const updateAchat = {
          dataUp: {
            ach_id: achat?.id ? achat.id : 0,
            ach_date_create: values.dateAchat,
            ach_ent_fk: values.entity,
            ach_date_expired: values.dateEcheance,
            ach_total_amount: values.montant,
            ach_total_tva: values.tva,
            ach_categorie: values.categorie,
            ach_lib: values.libelle,
            ach_met: values.methode,
            ach_num: values.numero,
            ach_rp: values.rp,
          },
          associate: newTransAssoc,
        };
        dispatch(onCreateUpdateAchat(updateAchat));
        validation.resetForm();
      }
      toggle();
    },
  });

  // Update Data
  const handleContactClick = useCallback(
    (arg) => {
      const achatH = arg;
      if (achatH?.ach_id) {
        dispatch(onGetTransactionBankAchat(achatH?.ach_id));
      }
      setAchat({
        id: achatH?.ach_id,
        montant: achatH?.ach_total_amount,
        tva: achatH?.ach_total_tva,
        libelle: achatH.ach_lib,
        categorie: achatH.ach_categorie,
        methode: achatH.ach_met,
        dateEcheance: achatH.ach_date_expired,
        dateAchat: achatH.ach_date_create,
        numero: achatH.ach_num,
        justificatif: achatH.ado_file_name,
        entity: achatH.ach_ent_fk,
        rp: achatH?.ach_rp,
        type:achatH?.ach_type,
      });
      setIsEdit(true);
      toggle();
    },
    [toggle]
  );

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
    ele.length > 0
      ? setIsMultiDeleteButton(true)
      : setIsMultiDeleteButton(false);
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
        id: "checkDelete",
      },
      {
        Header: "",
        accessor: "ach_id",
        hiddenColumns: true,
        Cell: (cell) => {
          return <input type="hidden" value={cell.value} />;
        },
      },
      {
        Header: "Titre",
        accessor: "ent_name",
        filterable: false,
      },
      {
        Header: "Statut",
        // accessor: "ach_status",
        filterable: false,
        Cell: (cell) => {
          let status = "";
          if (
            cell.row.original.ach_total_amount <= 0 ||
            cell.row.original.ach_total_amount == null ||
            cell.row.original.ach_categorie?.length == 0 ||
            cell.row.original?.ach_date_create == "" ||
            cell.row.original.ach_date_create == null
          ) {
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
        },
      },
      {
        Header: "Montant",
        accessor: "ach_total_amount",
        filterable: false,
        Cell: (cell) => {
        return (
          <div className="d-flex align-items-center">
            <div >{cell.row.original.ach_type == "Charge"?"- ":"+ "}{customFormatNumber(parseInt(cell.row.original.ach_total_amount))}</div>
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
            <div >{customFormatNumber(parseInt(cell.row.original.ach_rp))}</div>
          </div>
        );
        }
      },
      {
        Header: "Date d'achat",
        accessor: "ach_date_create",
        filterable: false,
      },
      {
        Header: "Echéance",
        accessor: "ach_date_expired",
        filterable: false,
      },
      {
        Header: "Catégorie",
        accessor: "ach_categorie",
        filterable: false,
      },
      {
        Header: "Association",
        accessor: "assoc",
        filterable: false,
        Cell: (cell) => {
          let styleCSS = {};
          let elementDisplay = ``;
          if (
            parseFloat(cell.row.original.ach_rp) == 0 &&
            parseFloat(cell.row.original.ach_total_amount) != 0
          ) {
            styleCSS = {
              width: "15px",
              height: "15px",
              borderRadius: "50%",
              backgroundColor: "green",
              marginLeft: "15%",
            };
          } else if (
            parseFloat(cell.row.original.ach_rp) <
              Math.abs(parseFloat(cell.row.original.ach_total_amount)) &&
            parseFloat(cell.row.original.ach_rp) > 0
          ) {
            styleCSS = {
              width: "10px",
              height: "15px",
              borderBottomRightRadius: "10px",
              borderTopRightRadius: "10px",
              backgroundColor: "orange",
              // marginLeft:8,
              marginLeft: "16%",
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
              overflow: "hidden",
            };
            elementDisplay = (
              <i style={{ color: "red" }} className="las la-times"></i>
            );
          }
          return (
            <div className="d-flex align-items-center">
              <div style={styleCSS}>{elementDisplay}</div>
            </div>
          );
        },
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
                alignItems: "center",
              }}
            >
              <i
                style={{ marginLeft: "14%" }}
                onClick={() => {
                  const achatData = cellProps.row.original;
                  onClickDelete(achatData);
                }}
                className="ri-delete-bin-fill align-bottom me-2 text-danger"
              ></i>
            </div>
          );
        },
      },
    ],
    []
  );

  useEffect(() => {
    dispatch(onGetEmployees());
    dispatch(onGetAchat());

    dispatch(onGetCollaborateurs());
  }, [dispatch]);

  // useEffect(() => {
  //   if(achat.id){
  //     dispatch(
  //       onGetTransactionBankAchat(achat.id)
  //     );
  //   }
  // }, [achat])

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
          <BreadCrumb title="Factures Achats" pageTitle="Banque / Achat" />
          <Row>
            <Col className="view-animate" xxl={show ? 9 : 12}>
              <Card id="contactList">
                <CardHeader>
                  <div className="d-flex align-items-center flex-wrap gap-2">
                    <div className="flex-grow-1">
                      <button
                        className="btn btn-secondary add-btn"
                        onClick={() => {
                          setModal(true);
                        }}
                      >
                        <i className="ri-add-fill me-1 align-bottom"></i>{" "}
                        Ajouter un achat
                      </button>
                    </div>
                    <div className="flex-shrink-0">
                      <div className="hstack text-nowrap gap-2">
                        {isMultiDeleteButton && (
                          <button
                            className="btn btn-danger"
                            onClick={() => setDeleteModalMulti(true)}
                          >
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
                          handleContactClick(achatData);
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
                    validation={validation}
                    modal={modal}
                    toggle={toggle}
                    isEdit={isEdit}
                    setModal={setModal}
                    setIsEdit={setIsEdit}
                    setAchat={setAchat}
                    achat={achat}
                    transactions={transactions}
                    createAchats={createAchats}
                    filesSelected={createAchats.values}
                    setFilesSelected={createAchats.setValues}
                    collaborateurs={collaborateurs}
                    transFilter={transFilter}
                    setTransFilter={setTransFilter}
                  />
                  <ToastContainer closeButton={false} limit={1} />
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
