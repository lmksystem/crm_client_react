import React, { useEffect, useState, useCallback, useMemo } from "react";
import moment from "moment";
import { api } from "../../config";
// import process from "process";
import { Col, Container, Row, Card, CardBody, Label, Input, Form, ListGroup, ListGroupItem, Modal, ModalHeader, ModalBody } from "reactstrap";

import BreadCrumb from "../../Components/Common/BreadCrumb";

//Import actions
import { getCollaborateurs as onGetCollaborateur, getAchatLinkTransaction as onGetAchatLinkTransaction, updateJustifyTransactionBank as onUpdateJustifyTransactionBank, linkTransToAchat as onLinkTransToAchat, updateMatchAmount as onUpdateMatchAmount, getBankUserAccount } from "../../slices/thunks";
//redux
import { useSelector, useDispatch } from "react-redux";
import TableContainer from "../../Components/Common/TableContainer";

// Formik
import * as Yup from "yup";
import { useFormik } from "formik";

import Loader from "../../Components/Common/Loader";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SimpleBar from "simplebar-react";
import { getLoggedinUser } from "../../helpers/api_helper";
import { customFormatNumber } from "../../utils/function";
import axios from "axios";
import { getAccountsBankUser, getTransactionBank } from "../../helpers/backend_helper";

const TransactionBank = () => {
  const dispatch = useDispatch();
  const userProfile = getLoggedinUser();
  const { isTransactionBankSuccess, error, devise, collaborateurs } = useSelector((state) => ({
    collaborateurs: state.Gestion.collaborateurs,
    isTransactionBankSuccess: state.TransactionBank.isTransactionBankSuccess,
    transactions: state.TransactionBank.transactionsBank,
    error: state.Employee.error,
    achats: state.Achat.achats,
    devise: state.Company.devise
  }));
  const [achatEvol, setAchatEvol] = useState(false);
  const dateActuelle = moment(); // Obtenir la date actuelle
  const dateNow = moment(dateActuelle, "DD MMM YYYY");
  const premiereDateAnnee = dateActuelle.startOf("year"); // Obtenir la première date de l'année
  const formattedDate = premiereDateAnnee.format("DD MMM YYYY"); // Formatage de la date
  const [perdiodeCalendar, setPeriodeCalendar] = useState({
    start: formattedDate.replace(/\./g, ","),
    end: dateNow
  });

  const [userAccount, setUserAccount] = useState([]);
  const [achatBankActif, setAchatBankActif] = useState(null);
  const [achatBank, setAchatBank] = useState([]);
  const [transactions, setTransactions] = useState(null);
  const [transaction, setTransaction] = useState(null);
  const [doc, setDoc] = useState(null);
  const [priceMatchAmount, setPriceMatchAmount] = useState(0);
  const [oldPriceAmount, setOldPriceAmount] = useState(0);
  const [achatActif, setAchatActif] = useState(null);
  const [achats, setAchats] = useState(null);

  const [show, setShow] = useState(false);
  const [modal, setModal] = useState(false);
  const [achatFilter, setAchatFilter] = useState({
    data: [],
    searchTerm: ""
  });

  const [isFilterBy, setIsFilterBy] = useState("null");

  const filterAccounts = {
    by: " n° de compte ou libellé",
    handleChange: (e) => {
      setIsFilterBy(e.target.value);
    },
    data: userAccount ? userAccount.map((e) => ({ label: e.bua_libelle, value: e.bua_id })) : [],
    value: isFilterBy
  };

  const previewAchat = (ach_id) => {
    axios
      .get(`${api.API_URL}/v1/pdf/download/achat/${ach_id}`, {
        mode: "no-cors",
        responseType: "blob"
      })
      .then((response) => {
        console.log(response);
        try {
          if (data.ado_file_name.split(".").pop() == "pdf") {
            let blob = new Blob([response], { type: "application/pdf" });
            var file = window.URL.createObjectURL(blob);
            document.querySelector("#iframe-doc").src = file;
          } else {
            let blob = new Blob([response], { type: "image/jpg" });
            var file = window.URL.createObjectURL(blob);
            document.querySelector("#image-doc").src = file;
          }
        } catch (err) {
          console.log(err);
        }
      });
  };

  const toggle = useCallback(() => {
    if (show) {
      setShow(false);
      setAchatActif(null);
      setAchatBankActif(null);
      setDoc(null);
      setTransaction(null);
    } else {
      setShow(true);
    }
  }, [show]);

  const handleTransactionClick = useCallback((arg) => {
    const transData = arg;
    setTransaction(transData);
    dispatch(onGetAchatLinkTransaction(transData?.tba_id));
  }, []);

  // const matchAmount = useFormik({
  //   // enableReinitialize : use this flag when initial values needs to be changed
  //   enableReinitialize: true,

  //   initialValues: {
  //     amount: priceMatchAmount
  //   },
  //   validationSchema: Yup.object({
  //     amount: Yup.number().required("Veuillez choisir un montant à associé")
  //   }),
  //   onSubmit: (values) => {
  //     let achat = { ...achatActif };
  //     let transactionBank = { ...transaction };
  //     let achatBankSelected = { ...achatBankActif };

  //     dissociationAchatTransation(transactionBank, achat, achatBankSelected);

  //     achat.ach_rp = parseFloat(values.amount);
  //     console.log(achat.ach_rp);
  //     associateAchatTransaction(transactionBank, achat);

  //     setAchatActif(null);
  //     setAchatBankActif(null);
  //     setModal(false);
  //     // setDoc(null);
  //   }
  // });

  // Column
  const columns = useMemo(
    () => [
      {
        accessor: "tba_id",
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
        Header: "Compte bancaire",
        accessor: "bua_iban",
        filterable: false,
        Cell: (cell) => {
          return (
            <div className="d-flex align-items-center">
              {cell.row.original?.bua_libelle ? cell.row.original?.bua_libelle : cell.row.original?.bua_iban}
              <span
                className="d-inline-block"
                style={{ marginLeft: "25%" }}
                tabIndex="0"
                data-toggle="tooltip">
                <div
                  className="align-self-center"
                  style={{
                    backgroundColor: `rgba(3,14,255,1)`,
                    height: 20,
                    width: 20,
                    borderRadius: 50
                  }}></div>
              </span>
            </div>
          );
        }
      },
      {
        Header: "Montant",
        accessor: "tba_amount",
        filterable: false,
        Cell: (cell) => {
          return cell.row.original.tba_type == "Revenu" ? (
            <div className="d-flex align-items-center">
              <p className="fw-bold text-success p-0 m-0">{"+ " + customFormatNumber(parseFloat(cell.value)) + " " + devise}</p>
            </div>
          ) : (
            <div className="d-flex align-items-center">
              <p className="fw-bold text-danger p-0 m-0">{"- " + customFormatNumber(parseFloat(cell.value)) + " " + devise}</p>
            </div>
          );
        }
      },
      {
        Header: "Reste à pointer",
        accessor: "tba_rp",
        filterable: false,
        Cell: (cell) => {
          return (
            <div className="d-flex align-items-center">
              <p className="p-0 m-0">{cell.value != null ? (cell.row.original?.tba_justify == 0 ? "0.00" : customFormatNumber(parseFloat(cell.value))) + devise : ""}</p>
            </div>
          );
        }
      },

      {
        Header: "Association",
        accessor: "tba_assoc",
        filterable: true,

        Cell: (cell) => {
          let styleCSS = {};
          if (cell.row.original.tba_rp == 0 || cell.row.original?.tba_justify == 0) {
            styleCSS = {
              width: "20px",
              height: "20px",
              borderRadius: "50%",
              backgroundColor: "green"
            };
          } else if (cell.row.original.tba_rp == Math.abs(parseFloat(cell.row.original.tba_amount))) {
            styleCSS = {
              width: "20px",
              height: "20px",
              borderRadius: "50%",
              border: "2px solid red",
              backgroundColor: "transparent",
              alignItems: "center",
              justifyContent: "center",
              display: "flex"
            };
          } else if (cell.row.original.tba_rp < Math.abs(parseFloat(cell.row.original.tba_amount)) && cell.row.original.tba_rp > 0) {
            styleCSS = {
              width: "10px",
              height: "20px",
              borderBottomRightRadius: "10px",
              borderTopRightRadius: "10px",
              backgroundColor: "orange",
              marginLeft: 8
            };
          }
          return (
            <div className="d-flex align-items-center mx-4">
              <div style={styleCSS}>
                {cell.row.original.tba_rp == Math.abs(parseFloat(cell.row.original.tba_amount)) && cell.row.original?.tba_justify == 1 && (
                  <i
                    style={{ color: "red" }}
                    className="las la-times"></i>
                )}
              </div>
            </div>
          );
        }
      },
      {
        Header: "Date",
        accessor: "tba_bkg_date",
        filterable: false,
        Cell: (cell) => {
          return (
            <div className="d-flex align-items-center">
              <p className="p-0 m-0">{cell.value != null ? moment(cell.value).format("L") : ""}</p>
            </div>
          );
        }
      },
      {
        Header: "Description",
        accessor: "tba_desc",
        filterable: false
      }
    ],
    [transactions, achatEvol]
  );

  const handleSearchChange = (e) => {
    const { value } = e.target;
    setAchatFilter({ ...achatFilter, searchTerm: value });
  };
  const setterDate = (value, showPartClose = false) => {
    setPeriodeCalendar(value);
    if (showPartClose) {
      setShow(false);
    }
  };

  const changeColorSelectedRow = () => {
    let oldSelected = document.querySelectorAll(`.selected-row`);

    for (let index = 0; index < oldSelected.length; index++) {
      const element = oldSelected[index];
      element.classList.remove("selected-row");
    }

    let input = document.querySelector(`tr td input[value="${transaction?.tba_id}"]:first-child`);

    if (input) {
      let td = input.parentNode;
      if (td) {
        let tr = td.parentNode;
        if (tr) {
          tr.classList.add("selected-row");
        }
      }
    }
  };

  /**
   * permet d'associer des transactiona vec les facture d'achat
   * @param {*} transaction
   * @param {*} achat
   */
  const associateAchatTransaction = (transaction, achat) => {
    transaction = { ...transaction };
    achat = { ...achat };

    let newAchatBank = { aba_ach_fk: achat.ach_id, aba_tba_fk: transaction.tba_id, aba_com_fk: achat.ach_com_fk };

    let newAchatRp = achat.ach_rp - transaction.tba_rp;
    let newTransaRp = transaction.tba_rp - achat.ach_rp;

    newAchatBank.aba_match_amount = newAchatRp > 0 ? transaction.tba_rp : achat.ach_rp;

    achat.ach_rp = newAchatRp > 0 ? newAchatRp : 0;
    transaction.tba_rp = newTransaRp > 0 ? newTransaRp : 0;
    console.log(achat, transaction);
    axios.post("/v1/achatBank", { achat, transaction, newAchatBank }).then((res) => {
      setTransactions(() => transactions.map((e) => (transaction.tba_id == e.tba_id ? { ...e, tba_rp: transaction.tba_rp } : e)));
      setTransaction(() => ({ ...transaction, tba_rp: transaction.tba_rp }));
      setAchatBank([...achatBank, res.data]);
    });
  };

  /**
   * Permet de disocier la trasaction de l'achat
   * @param {*} transaction
   * @param {*} achat
   * @param {*} achatBankSelected Achat bank à supprimer
   */
  const dissociationAchatTransation = (transaction, achat, achatBankSelected) => {
    transaction = { ...transaction };
    achat = { ...achat };

    achat.ach_rp = parseFloat(achat.ach_rp) + parseFloat(achatBankSelected.aba_match_amount);
    transaction.tba_rp = parseFloat(transaction.tba_rp) + parseFloat(achatBankSelected.aba_match_amount);
    console.log(achat, transaction, achatBankSelected);
    axios.delete("/v1/achatBank", { data: { achat, transaction, achatBank: achatBankSelected } }).then((res) => {
      setTransactions(() => transactions.map((e) => (transaction.tba_id == e.tba_id ? { ...e, tba_rp: transaction.tba_rp } : e)));
      setTransaction(() => ({ ...transaction, tba_rp: transaction.tba_rp }));
      setAchatBank(achatBank.map((aba) => aba.aba_id != res.data));
    });
  };

  const getAchatByType = async (type) => {
    return axios.get("/v1/achatV2?type=" + type).then((res) => {
      return res.data;
    });
  };

  const getAchatBank = async (tba_id) => {
    return axios.get(`/v1/achatBank?aba_tba_fk=${tba_id}`).then((res) => {
      return res.data;
    });
  };

  useEffect(() => {
    if (show) {
      setTimeout(() => {
        document.getElementById("start-anime").classList.add("show-cus");
      }, 400);
    } else {
      document.getElementById("start-anime").classList.remove("show-cus");
    }
  }, [show]);

  useEffect(() => {
    getTransactionBank({
      dateDebut: perdiodeCalendar.start ? moment(perdiodeCalendar.start).format("YYYY-MM-DD") : null,
      dateFin: perdiodeCalendar.end ? moment(perdiodeCalendar.end).format("YYYY-MM-DD") : null
    }).then((res) => {
      setTransactions(res.data);
    });
    dispatch(onGetCollaborateur());
  }, [perdiodeCalendar]);

  useEffect(() => {
    if (transaction) {
      changeColorSelectedRow();
      getAchatByType(transaction.tba_type).then((achats) => {
        setAchats(achats);
      });

      getAchatBank(transaction.tba_id)
        .then((res) => {
          console.log(res);
          setAchatBank(res);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [transaction]);

  useEffect(() => {
    if (achatActif) {
      previewAchat(achatActif.ach_id);
    }
  }, [achatActif]);

  useEffect(() => {
    getBankUserAccount().then((bankAccount) => {
      setUserAccount(bankAccount);
    });
  }, []);

  document.title = "Transactions bancaires | Countano";
  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <BreadCrumb
            title="Transactions bancaires"
            pageTitle="Banque / Achat"
          />
          <Row>
            <Modal
              id="showModal"
              isOpen={modal}
              toggle={() => {
                setModal(false);
                setDoc(null);
                setPriceMatchAmount(0);
              }}
              centered>
              <ModalHeader
                toggle={() => {
                  setModal(false);
                  setDoc(null);
                  setPriceMatchAmount(0);
                }}
                className="bg-soft-info p-3">
                Document achat
              </ModalHeader>
              <ModalBody>
                <Row className="mt-1 d-flex flex-column">
                  <Col
                    lg={12}
                    className="d-flex flex-row align-items-center">
                    <Form
                      className="tablelist-form"
                      onSubmit={(e) => {
                        e.preventDefault();
                        // matchAmount.handleSubmit();
                        return false;
                      }}>
                      <Row className="mb-4">
                        {/* <Col lg={8}>
                           <div>
                            <Label
                              htmlFor="amount-field"
                              className="form-label">
                              Montant associé
                            </Label>
                            <Input
                              name="amount"
                              id="amount-field"
                              className="form-control"
                              placeholder="Entrer un montant associé"
                              type="number"
                              onChange={(e) => {
                                setPriceMatchAmount(e.target.value);
                              }}
                              onBlur={matchAmount.handleBlur}
                              value={matchAmount.values.amount || ""}
                              invalid={matchAmount.touched.amount && matchAmount.errors.amount ? true : false}
                            />
                          </div> 
                        </Col>
                        <Col
                          className="d-flex align-items-end"
                          lg={4}>
                          <button
                            type="submit"
                            className="btn btn-success"
                            id="add-btn">
                            Valider
                          </button>
                        </Col>*/}
                      </Row>
                    </Form>
                  </Col>
                  <Col
                    lg={12}
                    className="d-flex justify-content-center">
                    <iframe
                      id="iframe-doc"
                      style={{ width: "100%", height: 550 }}
                      lg={12}></iframe>
                  </Col>
                </Row>
              </ModalBody>
            </Modal>
            <Col
              className="view-animate"
              xxl={show ? 7 : 12}>
              <Card id="contactList">
                <CardBody className="pt-0">
                  <div>
                    {console.log(isFilterBy)}
                    {transactions != null ? (
                      <TableContainer
                        columns={columns}
                        data={transactions.filter((a) => (isFilterBy != "null" ? a.tba_bua_fk == isFilterBy : true)) || []}
                        perdiodeCalendar={perdiodeCalendar}
                        setPeriodeCalendar={setterDate}
                        actionItem={(row) => {
                          const transData = row.original;
                          setShow(true);
                          setDoc(null);
                          handleTransactionClick(transData);
                        }}
                        isGlobalFilter={true}
                        isAddUserList={false}
                        customPageSize={8}
                        className="custom-header-css"
                        divClass="table-responsive table-card mb-3"
                        tableClass="align-middle table-nowrap"
                        theadClass="table-light"
                        isContactsFilter={true}
                        SearchPlaceholder="Recherche..."
                        selectFilter={filterAccounts}
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
            <Col xxl={show ? 5 : 0}>
              <div id="start-anime">
                <Card id="contact-view-detail">
                  <div
                    onClick={() => {
                      if (doc) {
                        setDoc(null);
                      } else {
                        toggle();
                      }
                    }}>
                    <i className="las la-chevron-circle-left la-2x m-2"></i>
                  </div>

                  <CardBody className="text-center d-flex flex-column">
                    <h5 className=" mb-1">Détail transaction</h5>
                  </CardBody>
                  <CardBody>
                    <div className="table-responsive table-card">
                      <div className="p-3">
                        <Form className="tablelist-form">
                          {achatBank.length < 1 && (
                            <Col
                              lg={8}
                              className="mt-3 mb-3">
                              <div className="form-switch">
                                <Input
                                  name="nojustify"
                                  id="nojustify-field"
                                  className="form-check-input"
                                  type="checkbox"
                                  role="switch"
                                  checked={transaction?.tba_justify == 0}
                                  onChange={() => {
                                    let isJustify = transaction?.tba_justify == 0 ? 1 : 0;
                                    dispatch(
                                      onUpdateJustifyTransactionBank({
                                        tba_id: transaction?.tba_id,
                                        tba_justify: isJustify
                                      })
                                    );
                                    setTransaction({
                                      ...transaction,
                                      tba_justify: isJustify
                                    });

                                    setTransactions(transactions.map((tra) => (tra.tba_id == transaction.tba_id ? { ...tra, tba_justify: isJustify } : tra)));
                                  }}
                                />
                                <Label
                                  htmlFor="nojustify-field"
                                  className="form-label mx-3">
                                  Pas de justificatif nécessaire
                                </Label>
                              </div>
                            </Col>
                          )}
                        </Form>
                        {transaction?.tba_justify == 1 && (
                          <Col lg={11}>
                            <div>
                              <p className="text-muted">Associer la transaction à un/plusieurs achat(s)</p>
                              <div id="users">
                                <Row className="mb-2">
                                  <Col lg={12}>
                                    <div>
                                      <input
                                        className="search form-control"
                                        placeholder="Chercher un achat"
                                        value={achatFilter.searchTerm}
                                        onChange={handleSearchChange}
                                      />
                                    </div>
                                  </Col>
                                </Row>

                                <SimpleBar
                                  style={{ height: "242px" }}
                                  className="mx-n3">
                                  <ListGroup
                                    className="list mb-0"
                                    flush>
                                    {achats
                                      ?.filter((a) => (achatFilter.searchTerm ? a.ach_lib.toLowerCase().includes(achatFilter.searchTerm.toLowerCase()) || a.ach_rp.toLowerCase().includes(achatFilter.searchTerm.toLowerCase()) : true))
                                      ?.map((ach) => {
                                        let achatBankSelected = achatBank && achatBank.find((a) => a.aba_tba_fk == transaction.tba_id && a.aba_ach_fk == ach.ach_id);
                                        let collabo = collaborateurs && collaborateurs.find((c) => c.ent_id == ach.ach_ent_fk);

                                        if (!achatBankSelected && ach.ach_rp == 0) {
                                          return;
                                        }

                                        return (
                                          <ListGroupItem
                                            data-id="1"
                                            key={ach.ach_id}
                                            onClick={() => {
                                              if (!achatBankSelected) {
                                                if (transaction.tba_rp > 0) {
                                                  associateAchatTransaction(transaction, ach);
                                                }
                                              } else {
                                                dissociationAchatTransation(transaction, ach, achatBankSelected);
                                              }
                                            }}
                                            className={` ${achatBankSelected ? "bg-light text-grey tit" : ""}`}>
                                            <div
                                              className="d-flex"
                                              style={!achatBankSelected && transaction.tba_rp == 0 ? { opacity: 0.5 } : {}}>
                                              <div className="flex-grow-1 ">
                                                <div className="d-flex align-items-center">
                                                  <h5 className="fs-13 mb-1">
                                                    {collabo?.ent_name} {ach.ach_lib}
                                                  </h5>
                                                  <div>
                                                    {achatBankSelected ? (
                                                      <i
                                                        className="cursor-pointer text-primary las la-file-pdf fs-3"
                                                        onClick={(e) => {
                                                          e.stopPropagation();
                                                          //setDoc(ach.ado_file_name);
                                                          // setOldPriceAmount(ach.aba_match_amount);
                                                          // setPriceMatchAmount(ach.aba_match_amount);
                                                          // setAchatActif(ach);
                                                          // setAchatBankActif(achatBankSelected);
                                                          setModal(true);
                                                        }}></i>
                                                    ) : null}
                                                  </div>
                                                </div>
                                                <p
                                                  className="born timestamp text-muted mb-0"
                                                  data-timestamp="12345">
                                                  {moment(ach.ach_date_create).format("L")}
                                                </p>
                                              </div>

                                              <div className="flex-shrink-0 d-flex flex-md-column align-items-end">
                                                <div className="">
                                                  Reste à pointer : {ach.ach_type == "Charge" ? "- " : "+ "} {customFormatNumber(parseFloat(ach.ach_rp))} {devise}
                                                </div>
                                                <div> {achatBankSelected && "Lié : " + customFormatNumber(parseFloat(achatBankSelected.aba_match_amount)) + " " + devise}</div>
                                              </div>
                                            </div>
                                          </ListGroupItem>
                                        );
                                      })}
                                  </ListGroup>
                                </SimpleBar>
                              </div>
                            </div>
                          </Col>
                        )}
                      </div>
                    </div>
                  </CardBody>
                </Card>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default TransactionBank;
