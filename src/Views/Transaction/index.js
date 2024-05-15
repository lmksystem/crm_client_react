import React, { useEffect, useState, useCallback, useMemo } from "react";
import moment from "moment";
import { api } from "../../config";
// import process from "process";
import { Col, Container, Row, Card, CardBody, Label, Input, Form, ListGroup, ListGroupItem, Modal, ModalHeader, ModalBody } from "reactstrap";

import BreadCrumb from "../../Components/Common/BreadCrumb";

//Import actions
import { getTransactionBank as onGetTransactionBank, getAchatLinkTransaction as onGetAchatLinkTransaction, updateJustifyTransactionBank as onUpdateJustifyTransactionBank, linkTransToAchat as onLinkTransToAchat, updateMatchAmount as onUpdateMatchAmount } from "../../slices/thunks";
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

const TransactionBank = () => {
  const dispatch = useDispatch();
  const userProfile = getLoggedinUser();
  const { isTransactionBankSuccess, error, transactions, achats, devise } = useSelector((state) => ({
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

  const [transaction, setTransaction] = useState({});
  const [doc, setDoc] = useState(null);
  const [priceMatchAmount, setPriceMatchAmount] = useState(0);
  const [oldPriceAmount, setOldPriceAmount] = useState(0);
  const [achatActif, setAchatActif] = useState(null);

  const [show, setShow] = useState(false);
  const [modal, setModal] = useState(false);
  const [achatFilter, setAchatFilter] = useState({
    data: [],
    searchTerm: ""
  });

  const oneIsSelected = achatFilter?.data?.filter((ele) => ele.type == "assoc" || (ele.old == 1 && ele.type !== "dissoc"));

  const [isFilterBy, setIsFilterBy] = useState("null");
  const filterAccounts = {
    by: " n° de compte ou libellé",
    handleChange: (e) => {
      setIsFilterBy(e.target.value);
    },
    data: transactions
      ? transactions
          ?.filter((transaction, index, self) => {
            return index === self.findIndex((t) => t.bua_account_id === transaction.bua_account_id);
          })
          .map((e) => {
            let tabVal = [];
            tabVal.push({ value: e.bua_account_id });
            if (e.bua_libelle?.length > 0) {
              tabVal.push({ value: e.bua_libelle });
            }
            return tabVal;
          })
          .reduce((acc, tableau) => {
            return acc.concat(tableau);
          }, [])
      : [],
    value: isFilterBy
  };

  const [TTD, setTTD] = useState([]);
  const toggle = useCallback(() => {
    if (show) {
      setShow(false);
      setAchatActif(null);
      setDoc(null);
      setAchatFilter({
        data: [],
        searchTerm: ""
      });
      setTransaction(null);
    } else {
      setShow(true);
    }
  }, [show]);

  const handleTransactionClick = useCallback(
    (arg) => {
      const transData = arg;
      setTransaction({
        id: transData.tba_id,
        tba_amount: transData.tba_amount,
        tba_justify: transData?.tba_justify == 1 ? false : true,
        file_justify: transData.ado_file_name,
        tba_rp: transData.tba_rp
      });
      dispatch(onGetAchatLinkTransaction(transData?.tba_id));
    },

    []
  );

  // validation
  const validation = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {
      nojustify: transaction && transaction?.tba_justify === 1 ? true : false,
      file_justify: (transaction && transaction.ado_file_name) || ""
    },
    onSubmit: (values) => {}
  });

  const matchAmount = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {
      amount: priceMatchAmount
    },
    validationSchema: Yup.object({
      amount: Yup.number().required("Veuillez choisir entrer un montant associé")
    }),
    onSubmit: (values) => {
      let copy_achatActif = { ...achatActif };
      copy_achatActif.oldPrice = parseFloat(oldPriceAmount);
      copy_achatActif.newPrice = parseFloat(priceMatchAmount);
      if (!copy_achatActif.tba_rp) {
        copy_achatActif.tba_rp = parseFloat(transaction.tba_rp);
      }
      copy_achatActif.tba_amount = parseFloat(transaction.tba_amount);
      dispatch(onUpdateMatchAmount(copy_achatActif));
      setAchatActif(null);
      setModal(false);
      // setDoc(null);
    }
  });
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
          console.log(cell.row.original?.bua_color);
          return (
            <div className="d-flex align-items-center">
              {cell.row.original?.bua_color ? (
                <span
                  class="d-inline-block"
                  style={{ marginLeft: "25%" }}
                  tabindex="0"
                  data-toggle="tooltip"
                  title={`${cell.value != null ? (cell.row.original?.bua_libelle ? cell.row.original?.bua_libelle + " / " : "") + cell.value : ""}`}>
                  <div
                    className="align-self-center"
                    style={{
                      backgroundColor: `${cell.row.original?.bua_color}`,
                      height: 20,
                      width: 20,
                      borderRadius: 50
                    }}></div>
                </span>
              ) : (
                <p className="p-0 m-0">{cell.value != null ? (cell.row.original?.bua_libelle ? cell.row.original?.bua_libelle + " / " : "") + cell.value : ""}</p>
              )}
            </div>
          );
        }
      },

      {
        Header: "Débit",
        accessor: "tba_debit",
        filterable: false,
        Cell: (cell) => {
          return (
            <div className="d-flex align-items-center">
              <p className="p-0 m-0">{cell.value != null ? customFormatNumber(parseFloat(cell.value)) + devise : ""}</p>
            </div>
          );
        }
      },
      {
        Header: "Crédit",
        accessor: "tba_credit",
        filterable: false,
        Cell: (cell) => {
          return (
            <div className="d-flex align-items-center">
              <p className="p-0 m-0">{cell.value != null ? customFormatNumber(parseFloat(cell.value)) + devise : ""}</p>
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

  const handleAssociateAchat = (ach) => {
    const newObj = { ...ach };
    newObj.tba_id = transaction.id;
    newObj.tba_amount = transaction.tba_amount;
    newObj.type = ach.old == 1 ? "disoc" : "assoc";
    dispatch(onLinkTransToAchat(newObj));
    setAchatEvol(!achatEvol);
  };

  const filterData = () => {
    let newArrayFiltred = achatFilter?.data?.map((achatItem) => {
      if (parseFloat(transaction.tba_amount) > 0 && achatItem.ach_type == "Revenu") {
        return achatItem;
      } else if (parseFloat(transaction.tba_amount) < 0 && achatItem.ach_type == "Charge") {
        return achatItem;
      } else {
        return {};
      }
    });

    return newArrayFiltred?.filter((item) => {
      // Définissez ici les propriétés sur lesquelles vous souhaitez effectuer la recherche
      const searchFields = [item.ach_lib, item.ach_rp, item.ach_date_create];
      return searchFields.some((field) => field?.toLowerCase()?.includes(achatFilter?.searchTerm?.toLowerCase()));
    });
  };

  function isSelected(id) {
    let obj = achatFilter?.data?.find((item) => item.ach_id === id);

    if (obj) {
      if ((obj.old === 1 && obj.type != "disoc") || (obj.old === 0 && obj.type == "assoc")) {
        return true;
      }
    }

    return false;
  }

  const filteredData = filterData();

  useEffect(() => {
    if (achats) {
      setAchatFilter({
        data: achats,
        searchTerm: ""
      });
    }
  }, [achats]);
  useEffect(() => {
    if (transaction?.id) {
      let searchNewTrans = transactions.filter((obj) => {
        return obj.tba_id == transaction?.id;
      });
      setTransaction(searchNewTrans[0]);
    }
  }, [dispatch]);

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
    dispatch(
      onGetTransactionBank({
        dateDebut: perdiodeCalendar.start ? moment(perdiodeCalendar.start).format("YYYY-MM-DD") : null,
        dateFin: perdiodeCalendar.end ? moment(perdiodeCalendar.end).format("YYYY-MM-DD") : null
      })
    );
  }, [dispatch, perdiodeCalendar, isFilterBy, achats]);

  useEffect(() => {
    if (transactions) {
      if (isFilterBy != "null") {
        let transFiltered = transactions
          ?.filter((tra) => {
            return tra.bua_account_id === isFilterBy || tra.bua_libelle === isFilterBy;
          })
          .map((tra) => tra);
        let tempProps = JSON?.parse(JSON.stringify(transFiltered));
        transFiltered = tempProps?.map((tra) => {
          if (tra.tba_rp == Math.abs(parseFloat(tra?.tba_amount))) {
            tra.tba_assoc = 0;
          } else if (tra.tba_rp == 0 || tra.tba_justify == 0) {
            tra.tba_assoc = 2;
          } else if (tra.tba_rp < Math.abs(parseFloat(tra?.tba_amount)) && tra.tba_rp > 0) {
            tra.tba_assoc = 1;
          } else {
            tra.tba_assoc = -1;
          }
          return tra;
        });
        setTTD(transFiltered);
        setShow(false);
        // setTransaction(null);
      } else {
        let tempProps = JSON.parse(JSON?.stringify(transactions));
        let newArrayTraAssoc = tempProps?.map((tra) => {
          if (tra.tba_rp == Math.abs(parseFloat(tra?.tba_amount))) {
            tra.tba_assoc = 0;
          } else if (tra.tba_rp == 0 || tra.tba_justify == 0) {
            tra.tba_assoc = 2;
          } else if (tra.tba_rp < Math.abs(parseFloat(tra?.tba_amount)) && tra.tba_rp > 0) {
            tra.tba_assoc = 1;
          } else {
            tra.tba_assoc = -1;
          }
          return tra;
        });
        setTTD(newArrayTraAssoc);
      }
    }
  }, [transactions, isFilterBy]);

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
                Document de transaction
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
                        matchAmount.handleSubmit();
                        return false;
                      }}>
                      <Row className="mb-4">
                        <Col lg={8}>
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
                            {matchAmount.touched.methode && matchAmount.errors.amount ? <FormFeedback type="invalid">{matchAmount.errors.amount}</FormFeedback> : null}
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
                        </Col>
                      </Row>
                    </Form>
                  </Col>
                  <Col
                    lg={12}
                    className="d-flex justify-content-center">
                    <iframe
                      style={{ width: "100%", height: 550 }}
                      lg={12}
                      src={
                        !process.env.NODE_ENV || process.env.NODE_ENV === "development"
                          ? // : `${api.API_PDF}/${userProfile.use_com_fk}/achat/${doc}`
                            `${api.API_URL}/v1/achat/doc/${doc}/${userProfile.use_com_fk}`
                          : `${api.API_PDF}/${userProfile.use_com_fk}/achat/${doc}`
                      }
                      title={doc}></iframe>
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
                    {isTransactionBankSuccess ? (
                      <TableContainer
                        columns={columns}
                        data={TTD || []}
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
                      <Form
                        className="tablelist-form"
                        onSubmit={(e) => {
                          e.preventDefault();
                          validation.handleSubmit();
                          return false;
                        }}>
                        <div className="p-3">
                          <Input
                            type="hidden"
                            id="id-field"
                          />

                          {oneIsSelected.length < 1 && (
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
                                  checked={transaction?.tba_justify || transaction?.tba_justify == 1}
                                  onChange={() => {
                                    dispatch(
                                      onUpdateJustifyTransactionBank({
                                        tba_id: transaction?.id,
                                        tba_justify: !transaction?.tba_justify == false ? 1 : 0
                                      })
                                    );
                                    setTransaction({
                                      ...transaction,
                                      tba_justify: !transaction?.tba_justify
                                    });
                                  }}
                                  onBlur={validation.handleBlur}
                                />
                                <Label
                                  htmlFor="nojustify-field"
                                  className="form-label mx-3">
                                  Pas de justificatif nécessaire
                                </Label>
                              </div>
                            </Col>
                          )}
                          {/* )} */}

                          {!transaction?.tba_justify && (
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
                                      {filteredData?.map((ach) => {
                                        return (
                                          <ListGroupItem
                                            data-id="1"
                                            key={ach.ach_id}
                                            onClick={() => {
                                              handleAssociateAchat(ach);
                                            }}
                                            className={` ${isSelected(ach.ach_id) ? "bg-light text-grey tit" : ""}`}>
                                            <div className="d-flex">
                                              <div className="flex-grow-1 ">
                                                <div className="d-flex">
                                                  <h5 className="fs-13 mb-1">{ach.ent_name}</h5>
                                                  {isSelected(ach.ach_id) ? <i className="las la-link mx-2"></i> : null}
                                                </div>

                                                <p
                                                  className="born timestamp text-muted mb-0"
                                                  data-timestamp="12345">
                                                  {moment(ach.ach_date_create).format("L")}
                                                </p>
                                              </div>
                                              <div className="flex-shrink-0 d-flex flex-md-column align-items-end">
                                                <div>
                                                  {ach.ach_type == "Charge" ? "- " : "+ "}
                                                  {isSelected(ach.ach_id) ? customFormatNumber(parseFloat(ach.aba_match_amount)) : customFormatNumber(parseFloat(ach.ach_rp))} {devise}
                                                </div>
                                                {isSelected(ach.ach_id) ? (
                                                  <button
                                                    style={{ zIndex: 15 }}
                                                    onClick={(e) => {
                                                      e.stopPropagation();
                                                      setDoc(ach.ado_file_name);
                                                      setOldPriceAmount(ach.aba_match_amount);
                                                      setPriceMatchAmount(ach.aba_match_amount);
                                                      setAchatActif(ach);
                                                      setModal(true);
                                                    }}
                                                    className="btn btn-secondary d-flex align-items-center mt-2">
                                                    <i className="las la-eye mx-2"></i>
                                                    <p className="m-0 font-weight-bold">{ach.ado_file_name}</p>
                                                  </button>
                                                ) : null}
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
                      </Form>
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
