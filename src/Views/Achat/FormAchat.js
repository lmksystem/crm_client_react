import React, { useEffect, useState } from "react";
import { Alert, Button, Card, CardBody, Col, Container, Form, FormFeedback, Input, Label, ListGroup, ListGroupItem, Row } from "reactstrap";
import BreadCrumb from "../../Components/Common/BreadCrumb";
import { ToastContainer, toast } from "react-toastify";
import { useFormik } from "formik";
import * as Yup from "yup";
import Select from "react-select";
import CreatableSelect from "react-select/creatable";
import axios from "axios";
import SimpleBar from "simplebar-react";
import { getAccountsBankUser, getCollaborateurs } from "../../helpers/backend_helper";

import moment from "moment";
import { useSelector } from "react-redux";
import { getAchat } from "../../slices/thunks";
import ConfirmModal from "../../Components/Common/ConfirmModal";
import { useNavigate } from "react-router-dom";
import { getCategorieAchat } from "../../services/achat";

function FormAchat({ data, handleOneValidate }) {
  const navigate = useNavigate();

  const { devise } = useSelector((state) => ({
    devise: state.Company.devise
  }));

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [achatBank, setAchatBank] = useState([]);
  const [selectedCat, setSelectedCat] = useState([]);
  const [collaborateurs, setCollaborateurs] = useState(null);
  const [transactions, setTransactions] = useState(null);
  const [categoriesList, setCategoriesList] = useState([]);

  const [transactionFilter, setTransactionFilter] = useState("");

  const validation = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {
      ach_id: (data && data.ach_id) || "",
      ach_com_fk: (data && data.ach_com_fk) || "",
      ach_ent_fk: (data && data.ach_ent_fk) || "",
      ach_date_create: (data && moment(data.ach_date_create).format("YYYY-MM-DD")) || "",
      ach_date_expired: (data && moment(data.ach_date_expired).format("YYYY-MM-DD")) || "",
      ach_lib: (data && data.ach_lib) || "",
      ach_num: (data && data.ach_num) || "",
      ach_met: (data && data.ach_met) || "",
      ach_total_amount: (data && data.ach_total_amount) || "",
      ach_total_tva: (data && data.ach_total_tva) || "",
      ach_rp: (data && data.ach_rp) || "",
      ach_type: (data && data.ach_type) || ""
    },
    validationSchema: Yup.object({
      ach_total_amount: Yup.number().positive("Le total doit être positive").required("Veuillez choisir entrer un total")
    }),

    onSubmit: (values) => {
      axios.post("/v1/achatV2", values).then((res) => {
        submitCat(selectedCat).then(() => {
          handleOneValidate();
          toast.success("Achat valider");
        });
      });
    }
  });

  const previewAchat = (ach_id) => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/v1/pdf/download/achat/${ach_id}`, {
        mode: "no-cors",
        responseType: "blob"
      })
      .then((response) => {
        try {
          if (data.ado_file_name.split(".").pop() == "pdf") {
            let blob = new Blob([response], { type: "application/pdf" });
            var file = window.URL.createObjectURL(blob);
            document.querySelector("#iframe-" + data.ach_id).src = file;
          } else {
            let blob = new Blob([response], { type: "image/jpg" });
            var file = window.URL.createObjectURL(blob);
            document.querySelector(".image-achat-doc-" + data.ach_id).src = file;
          }
        } catch (err) {
          console.log(err);
        }
      });
  };

  const getCategorieByAchatId = async (ach_id) => {
    return axios.get("/v1/achat/categorie/" + ach_id).then((res) => {
      return res.data;
    });
  };

  /**
   * Permet d'ajouter et supprimer les categories
   * @param {*} arraySelected
   */
  const onChangeCategorie = (arraySelected) => {
    let selected = [];

    // // On retirer les categorie si l'user les a supprimer
    // let filterRemoved = selectedCat.filter((cat) => {console.log("is find ",cat,arraySelected.findIndex((e) => cat.aca_name == e.value) != -1);return arraySelected.findIndex((e) => cat.aca_name == e.value) > 0});
    // // console.log(filterRemoved);

    // Boucle sur les nouvelle valeur
    for (let i = 0; i < arraySelected.length; i++) {
      const element = arraySelected[i];

      // On recupere l'index des valeurs si elle sont déjà presente dans le state des categorie
      let index = selectedCat.findIndex((cat, i) => cat.aca_name == element.value);

      if (index != -1) {
        // Si on trouve la valeur on push dans le nouveau state les ancien valeur pour ne pas les perdre
        selected.push(selectedCat[index]);
      } else {
        // Si non on l'ajoute avec les valeur par defaut
        selected.push({ aca_name: element.value, aca_montant: 0, aca_tva: 0 });
      }
    }

    setSelectedCat(selected);
  };

  const submitCat = async (categories) => {
    let data = categories.map((cat) => ({ ...cat, aca_ach_fk: validation.values.ach_id }));

    if (data.length > 0) {
      await axios.post("/v1/achat/categorie", { data: data });
    } else {
      await axios.delete(`/v1/achat/categorie/${validation.values.ach_id}`);
    }
  };

  const getTransaction = async () => {
    return axios.get("/v1/transactionBank?type=" + data.ach_type).then((res) => {
      return res.data;
    });
  };

  const getAchatBank = async (ach_id) => {
    return axios.get(`/v1/achatBank?aba_ach_fk=${ach_id}`).then((res) => {
      return res.data;
    });
  };

  const associateAchatTransaction = (transaction, achat) => {
    transaction = { ...transaction };
    achat = { ...achat };

    let newAchatBank = { aba_ach_fk: data.ach_id, aba_tba_fk: transaction.tba_id, aba_com_fk: data.ach_com_fk };
    let resultat = parseFloat(validation.values.ach_rp) - parseFloat(transaction.tba_rp);
    if (resultat >= 0) {
      achat.ach_rp = resultat;
      newAchatBank.aba_match_amount = transaction.tba_rp;
      transaction.tba_rp = 0;
    } else {
      transaction.tba_rp = transaction.tba_rp - validation.values.ach_rp;
      newAchatBank.aba_match_amount = validation.values.ach_rp;
      achat.ach_rp = 0;
    }

    axios.post("/v1/achatBank", { achat, transaction, newAchatBank }).then((res) => {
      setTransactions(() => transactions.map((e) => (transaction.tba_id == e.tba_id ? { ...e, tba_rp: transaction.tba_rp } : e)));
      setAchatBank([...achatBank, res.data]);
      validation.setValues({ ...validation.values, ach_rp: achat.ach_rp });
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

    axios.delete("/v1/achatBank", { data: { achat, transaction, achatBank: achatBankSelected } }).then((res) => {
      setTransactions(() => transactions.map((e) => (transaction.tba_id == e.tba_id ? { ...e, tba_rp: transaction.tba_rp } : e)));
      setAchatBank(achatBank.filter((aba) => aba.aba_id != res.data));
      validation.setValues({ ...validation.values, ach_rp: achat.ach_rp });
    });
  };

  const onChangeTotal = () => {
    validation.handleChange;
  };

  const toggleShowConfirmModal = () => {
    setShowConfirmModal(() => !showConfirmModal);
  };

  useEffect(() => {
    if (data && data.ado_file_name) {
      previewAchat(data.ach_id);
      getCategorieByAchatId(data.ach_id).then((res) => {
        setSelectedCat(res);
      });
    }
  }, [data]);

  useEffect(() => {
    if (data && data.ado_file_name) {
      previewAchat(data.ach_id);
      getCategorieByAchatId(data.ach_id).then((res) => {
        setSelectedCat(res);
      });
      getAchatBank(data.ach_id)
        .then((res) => {
          setAchatBank(res);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [data]);

  useEffect(() => {
    getCollaborateurs().then((res) => {
      setCollaborateurs(res.data);
    });
    getTransaction().then((transactions) => {
      setTransactions(transactions);
    });
    getCategorieAchat().then((res) => {
      setCategoriesList(res.map((e) => ({ label: e.aca_name, value: e.aca_name })));
    });
  }, []);

  return (
    <React.Fragment>
      <ToastContainer
        closeButton={false}
        limit={1}
      />
      <ConfirmModal
        title={"Attention !"}
        text={"La modification du montant entraine la dissociation des transaction. Comfirmer ?"}
        textClose="Non"
        show={showConfirmModal}
        onCloseClick={() => {
          toggleShowConfirmModal();
        }}
        onActionClick={() => {
          toggleShowConfirmModal();
          onChangeTotal();
        }}
      />
      <Form
        onSubmit={(e) => {
          e.preventDefault();
          validation.handleSubmit();
        }}>
        <Row className="g-3">
          <Col lg={6}>
            <Row className="g-3">
              <Col lg={6}>
                <div>
                  <Label
                    htmlFor="ach_lib-field"
                    className="form-label">
                    Libellé
                  </Label>
                  <Input
                    name="ach_lib"
                    id="ach_lib-field"
                    className="form-control"
                    placeholder="Entrer un libellé"
                    type="text"
                    onChange={validation.handleChange}
                    onBlur={validation.handleBlur}
                    value={validation.values.ach_lib || ""}
                    invalid={validation.touched.ach_lib && validation.errors.ach_lib ? true : false}
                  />
                  {validation.touched.ach_lib && validation.errors.ach_lib ? <FormFeedback type="invalid">{validation.errors.ach_lib}</FormFeedback> : null}
                </div>
              </Col>
              <Col lg={6}>
                <div>
                  <Label
                    htmlFor="entity-field"
                    className="form-label">
                    Client/Fournisseur*
                  </Label>

                  <Select
                    defaultValue={data.ent_id ? { label: data.ent_name, value: data.ent_id } : { label: "Sélectionner...", value: null }}
                    invalid={(validation.touched.entity && validation.errors.entity) || (validation.touched.entityName && validation.errors.entityName) ? true : false}
                    placeholder={"Selectionnez un client/fournisseur"}
                    onChange={(res) => {
                      validation.setValues({
                        ...validation.values,
                        ach_ent_fk: res.value
                      });
                    }}
                    options={
                      collaborateurs &&
                      collaborateurs.map((i) => ({
                        label: i.ent_name,
                        value: i.ent_id
                      }))
                    }
                    name="choices-single-default"
                    id="entity"></Select>
                  {(validation.touched.entity && validation.errors.entity) || (validation.touched.entityName && validation.errors.entityName) ? (
                    <FormFeedback
                      type="invalid"
                      style={{ display: "block" }}>
                      {validation.errors.entityName}
                    </FormFeedback>
                  ) : null}
                </div>
              </Col>
              <Col lg={6}>
                <div>
                  <Label
                    htmlFor="ach_total_amount-field"
                    className="form-label">
                    Montant Total TTC
                  </Label>
                  <Input
                    name="ach_total_amount"
                    id="ach_total_amount-field"
                    className="form-control"
                    placeholder="Entrer le montant total"
                    type="number"
                    onChange={validation.handleChange}
                    onBlur={achatBank.length > 0 ? toggleShowConfirmModal : onChangeTotal}
                    value={validation.values.ach_total_amount || ""}
                    invalid={validation.touched.ach_total_amount && validation.errors.ach_total_amount ? true : false}
                  />
                  {validation.touched.ach_total_amount && validation.errors.ach_total_amount ? <FormFeedback type="invalid">{validation.errors.ach_total_amount}</FormFeedback> : null}
                </div>
              </Col>
              <Col lg={6}>
                <div>
                  <Label
                    htmlFor="ach_total_tva-field"
                    className="form-label">
                    Total TVA
                  </Label>
                  <Input
                    name="ach_total_tva"
                    id="ach_total_tva-field"
                    className="form-control"
                    placeholder="Entrer le total TVA"
                    type="number"
                    onChange={validation.handleChange}
                    onBlur={validation.handleBlur}
                    value={validation.values.ach_total_tva || ""}
                    invalid={validation.touched.ach_total_tva && validation.errors.ach_total_tva ? true : false}
                  />
                  {validation.touched.ach_total_tva && validation.errors.ach_total_tva ? <FormFeedback type="invalid">{validation.errors.ach_total_tva}</FormFeedback> : null}
                </div>
              </Col>

              <Col lg={6}>
                <div>
                  <Label
                    htmlFor="ach_date_create-field"
                    className="form-label">
                    Date d'achat
                  </Label>
                  <Input
                    name="ach_date_create"
                    id="ach_date_create-field"
                    className="form-control"
                    placeholder="Entrer une méthode"
                    type="date"
                    onChange={validation.handleChange}
                    onBlur={validation.handleBlur}
                    value={validation.values.ach_date_create || ""}
                    invalid={validation.touched.ach_date_create && validation.errors.ach_date_create ? true : false}
                  />
                  {validation.touched.ach_date_create && validation.errors.ach_date_create ? <FormFeedback type="invalid">{validation.errors.ach_date_create}</FormFeedback> : null}
                </div>
              </Col>
              <Col lg={6}>
                <div>
                  <Label
                    htmlFor="ach_date_expired-field"
                    className="form-label">
                    Date d'échéance
                  </Label>
                  <Input
                    name="ach_date_expired"
                    id="ach_date_expired-field"
                    className="form-control"
                    placeholder="Entrer une date d'échéance"
                    type="date"
                    onChange={validation.handleChange}
                    onBlur={validation.handleBlur}
                    value={validation.values.ach_date_expired || ""}
                    invalid={validation.touched.ach_date_expired && validation.errors.ach_date_expired ? true : false}
                  />
                  {validation.touched.ach_date_expired && validation.errors.ach_date_expired ? <FormFeedback type="invalid">{validation.errors.ach_date_expired}</FormFeedback> : null}
                </div>
              </Col>

              <Col lg={6}>
                <div>
                  <Label
                    htmlFor="ach_num-field"
                    className="form-label">
                    Numéro d'achat
                  </Label>
                  <Input
                    name="ach_num"
                    id="ach_num-field"
                    className="form-control"
                    placeholder="Entrer un numéro"
                    type="text"
                    onChange={validation.handleChange}
                    onBlur={validation.handleBlur}
                    value={validation.values.ach_num || ""}
                    invalid={validation.touched.ach_num && validation.errors.ach_num ? true : false}
                  />
                  {validation.touched.ach_num && validation.errors.ach_num ? <FormFeedback type="invalid">{validation.errors.ach_num}</FormFeedback> : null}
                </div>
              </Col>
              <Col lg={6}>
                <div>
                  <Label
                    htmlFor="ach_met-field"
                    className="form-label">
                    Méthode
                  </Label>
                  <Input
                    name="ach_met"
                    id="ach_met-field"
                    className="form-control"
                    placeholder="Entrer une méthode"
                    type="text"
                    onChange={validation.handleChange}
                    onBlur={validation.handleBlur}
                    value={validation.values.ach_met || ""}
                    invalid={validation.touched.ach_met && validation.errors.ach_met ? true : false}
                  />
                  {validation.touched.ach_met && validation.errors.ach_met ? <FormFeedback type="invalid">{validation.errors.ach_met}</FormFeedback> : null}
                </div>
              </Col>

              <Col lg={12}>
                <div>
                  <Label
                    htmlFor="categorie-field"
                    className="form-label">
                    Catégorie*
                  </Label>

                  <CreatableSelect
                    styles={{ zIndex: 5 }}
                    placeholder={"Ajouter vos catégories..."}
                    noOptionsMessage={() => "Aucune option (écrire pour en ajouter)"}
                    formatCreateLabel={(val) => `Créer "${val}"`}
                    isMulti
                    isClearable
                    closeMenuOnSelect={false}
                    options={[{ options: categoriesList }]}
                    onChange={onChangeCategorie}
                    value={selectedCat.map((c) => ({ label: c.aca_name, value: c.aca_name }))}
                  />

                  {validation.touched.categorie && validation.errors.categorie ? <FormFeedback type="invalid">{validation.errors.categorie}</FormFeedback> : null}
                  <p className="mt-2">Liste de catégories</p>
                  {selectedCat
                    ? selectedCat.map((cat, i) => (
                        <div
                          key={i}
                          className="d-flex flex-row">
                          <div style={{ alignItems: "center", display: "flex", width: "30%" }}>{cat.aca_name}</div>
                          <div className="mx-2 input-group">
                            <Input
                              name=""
                              id=""
                              style={{ flex: 1, height: 25, fontSize: 12, textAlign: "right" }}
                              className="form-control"
                              placeholder="TVA"
                              type="number"
                              onChange={(e) => {
                                let copy = [...selectedCat];
                                copy[i].aca_tva = e.target.value;
                                setSelectedCat(copy);
                              }}
                              value={cat.aca_tva || ""}
                            />
                            <Label
                              style={{ whiteSpace: "nowrap", zIndex: 0, height: 25, fontSize: 10 }}
                              className="btn btn-secondary btn-input-group">
                              %
                            </Label>
                          </div>
                          <div className="mx-2 input-group">
                            <Input
                              style={{ flex: 1, height: 25, fontSize: 12, textAlign: "right" }}
                              name=""
                              id=""
                              className="form-control"
                              placeholder="Montant"
                              type="number"
                              onChange={(e) => {
                                let copy = [...selectedCat];
                                copy[i].aca_montant = e.target.value;
                                setSelectedCat(copy);
                              }}
                              value={cat.aca_montant || ""}
                            />
                            <Label
                              style={{ whiteSpace: "nowrap", zIndex: 0, width: "auto", height: 25, fontSize: 10 }}
                              className="btn btn-secondary btn-input-group">
                              {devise}
                            </Label>
                          </div>
                        </div>
                      ))
                    : null}
                </div>
              </Col>
              <Col lg={12}>
                <div>
                  <p className="text-muted">Associer une/plusieurs transaction(s) à l'achat</p>
                  <div id="users">
                    <Row className="mb-2">
                      <Col lg={12}>
                        <div>
                          <input
                            className="search form-control"
                            placeholder="Chercher une transaction"
                            value={transactionFilter}
                            onChange={(e) => setTransactionFilter(e.target.value)}
                          />
                        </div>
                      </Col>
                    </Row>

                    <SimpleBar
                      style={{ height: "215px" }}
                      className="mx-n3">
                      <ListGroup
                        className="list mb-0"
                        flush>
                        {transactions?.length > 0 &&
                          transactions
                            ?.filter((trans) => trans.tba_desc?.toLowerCase()?.includes(transactionFilter) || trans.tba_amount?.toLowerCase()?.includes(transactionFilter))
                            ?.map((tra, i) => {
                              let achatBankSelected = achatBank && achatBank.find((a) => a.aba_tba_fk == tra.tba_id && a.aba_ach_fk == data.ach_id);

                              if (!achatBankSelected && tra.tba_rp <= 0) {
                                return;
                              }

                              return (
                                <ListGroupItem
                                  key={i}
                                  className={`${achatBankSelected ? "bg-light text-grey tit" : ""}`}
                                  onClick={() => {
                                    if (!achatBankSelected) {
                                      if (validation.values.ach_rp > 0) {
                                        associateAchatTransaction(tra, validation.values);
                                      }
                                    } else {
                                      dissociationAchatTransation(tra, validation.values, achatBankSelected);
                                    }
                                  }}
                                  data-id="1">
                                  <div
                                    className={`d-flex`}
                                    style={!achatBankSelected && validation.values.ach_rp == 0 ? { opacity: 0.5 } : {}}>
                                    <div className="flex-grow-1">
                                      <h5 className="fs-13 mb-1 text-dark">
                                        {achatBankSelected ? <i className="las la-link"></i> : null}
                                        {tra.bua_ach_lib?.length > 0 ? tra?.bua_ach_lib : tra?.bua_account_id}
                                      </h5>
                                      <h5 className="fs-13 mb-1 text-dark">{tra?.tba_desc?.length > 0 ? tra?.tba_desc : ""}</h5>
                                      <p
                                        className="born timestamp text-muted mb-0"
                                        data-timestamp="12345">
                                        {moment(tra.tba_bkg_date).format("L")}
                                      </p>
                                    </div>
                                    <div className="flex-shrink-0">
                                      <div>
                                        {parseFloat(tra.tba_amount)} {devise}
                                      </div>
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
            </Row>
          </Col>
          <Col lg={6}>
            {window.innerWidth > 992 ? (
              data && data.ado_file_name ? (
                data.ado_file_name.split(".").pop() == "pdf" ? (
                  <iframe
                    id={"iframe-" + data.ach_id}
                    style={{ width: "100%", height: "100%" }}
                    lg={12}
                    src={""}
                    title={data.ado_file_name}></iframe>
                ) : (
                  <div className="container-img-achat">
                    <img
                      className={"image-achat-doc-" + data.ach_id}
                      src={`${process.env.REACT_APP_API_URL}/public/pdf/${data?.ach_com_fk}/achat/${data.ado_date_create.split("-")[0]}/${data.ado_date_create.split("-")[1]}/${data?.ado_file_name}`}
                    />
                  </div>
                )
              ) : null
            ) : (
              ""
            )}
          </Col>
        </Row>
        <Button
          className="btn btn-primary"
          type="submit">
          Valider
        </Button>
      </Form>
    </React.Fragment>
  );
}

export default FormAchat;
