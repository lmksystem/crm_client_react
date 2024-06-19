import React, { useEffect, useState, useCallback, useMemo } from "react";

import { Col, Row, Label, Input, Modal, ModalHeader, ModalBody, Form, ModalFooter, FormFeedback, ListGroupItem, ListGroup, Spinner } from "reactstrap";
import "react-toastify/dist/ReactToastify.css";
import SimpleBar from "simplebar-react";
import * as Yup from "yup";

import DropFileComponents from "./DropFileComponent";
import { getInvoices as onGetInvoices, getCategorieAchat as onGetCategorieAchat, createUpdateAchat as onCreateUpdateAchat } from "../../slices/thunks";
import { useDispatch, useSelector } from "react-redux";
import { useFormik } from "formik";
import makeAnimated from "react-select/animated";
import axios from "axios";
import FileService from "../../utils/FileService";
import { useNavigate } from "react-router-dom";
import Loader from "../../Components/Common/Loader";

const ModalCreate = ({ modal, toggle, setModal, setIsEdit, isEdit, setAchat }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [factures, setFactures] = useState([]);
  const [loader, setLoader] = useState(false);

  const { invoices, devise } = useSelector((state) => ({
    devise: state.Company.devise,
    invoices: state.Invoice.invoices
  }));

  function isInvoiceSelected(invoice_id) {
    let obj = createAchats?.values?.facturesExist?.find((item) => item.header.fen_id === invoice_id);
    if (obj) {
      return true;
    }

    return false;
  }

  const handleFacture = (invoice) => {
    let newArray = [...createAchats.values.facturesExist];
    let findIsInvoiceSelect = newArray.find((e) => e.header.fen_id == invoice.header.fen_id);
    console.log(findIsInvoiceSelect);
    if (findIsInvoiceSelect) {
      let index = newArray.findIndex((e) => e.header.fen_id == invoice.header.fen_id);
      newArray.splice(index, 1);
    } else {
      newArray.push(invoice);
    }
    createAchats.setValues({ ...createAchats.values, facturesExist: newArray });
  };

  const createAchatsDoc = async (data) => {
    axios.post("/v1/achat/doc", data).then((res) => {
      console.log(res);
    });
  };

  const createUpdateAchat = async (data) => {
    return axios.post("/v1/achatV2", data).then((res) => {
      return res;
    });
  };

  const createAchats = useFormik({
    enableReinitialize: true,

    initialValues: {
      type: "",
      files: [],
      facturesExist: []
    },
    validationSchema: Yup.object({
      type: Yup.string().required("Veuillez choisir un type")
      //files: Yup.array().min(1).required("Veuillez choisir un/plusieurs fichier(s)")
    }),
    onSubmit: async (values) => {
      setLoader(() => true);
      try {
        let navigateData = [];
        if (values?.files?.length > 0) {
          console.log(values?.files);
          for (let index = 0; index < values?.files.length; index++) {
            const file = values?.files[index];
            let res = await FileService.uploadFile([file]);

            if (res.fileName) {
              let newAchat = {
                ach_ent_fk: "",
                ach_date_create: res.ocrInfo.date.value || "",
                ach_date_expired: res.ocrInfo.dueDate.value || "",
                ach_total_amount: res.ocrInfo.totalAmount.value || 0,
                ach_rp: res.ocrInfo.totalAmount.value || 0,
                ach_total_tva: res.ocrInfo.totalTax.value || 0,
                ach_type: values.type || "",
                ach_lib: res.ocrInfo.supplierName.value || "",
                ach_num: res.ocrInfo.invoiceNumber.value || "",
                ach_met: ""
              };
              // save new Achat
              let result = await createUpdateAchat(newAchat);

              let docData = {
                ado_ach_fk: result.data.ach_id,
                ado_file_name: res.fileName
              };
              createAchatsDoc(docData);
              navigateData.push(result.data.ach_id);
            }
          }
        } else if (values?.facturesExist?.length > 0) {
          FileService.copyFiles(values?.facturesExist).then((res) => {
            let arrayUpdateAchat = [];

            if (res.status == 200) {
              for (let index = 0; index < res.data.length; index++) {
                const element = res.data[index];
                let newAchat = {
                  ach_ent_fk: element.header.fen_ent_fk,
                  ach_date_create: element.header.fen_date_create.slice(0, 10),
                  ach_date_expired: element.header.fen_date_expired,
                  ach_total_amount: parseFloat(element.header.fen_total_ttc),
                  ach_rp: parseFloat(element.header.fen_total_ttc),
                  ach_total_tva: parseFloat(element.header.fen_total_tva),
                  ado_file_name: element.newFileCopy,
                  ach_type: "Revenu",
                  ach_lib: element.header.fen_sujet,
                  ach_num: "",
                  ach_met: ""
                };
                arrayUpdateAchat.push(newAchat);
                navigateData.push(result.data.ach_id);
              }
              let objectDispatching = {
                invoices: arrayUpdateAchat
              };
              dispatch(onCreateUpdateAchat(objectDispatching));
            }
          });
        }

        if (navigateData.length > 0) {
          navigate("/achat/edition", { state: navigateData });
        }

        createAchats.resetForm();
        setLoader(() => false);
      } catch (error) { }
    }
  });

  const typesAchat = [
    {
      value: "Charge",
      label: "Charge"
    },
    {
      value: "Revenu",
      label: "Revenu"
    }
  ];

  useEffect(() => {
    if (createAchats.values.type == "Revenu") {
      dispatch(onGetInvoices()).then(() => {
        let totalInvoices = invoices.filter((fac) => fac.doc != null);
        setFactures(totalInvoices);
      });
    }
  }, [createAchats.values.type]);

  return (
    <>
      <Modal
        style={{ maxWidth: isEdit ? "90%" : "auto" }}
        id="showModal"
        isOpen={modal}
        toggle={toggle}
        centered>
        <ModalHeader
          className="bg-soft-info p-3"
          toggle={toggle}>
          {!!isEdit ? "Modifier le détail de l'achat" : "Ajouter une/plusieurs factures d'achat"}
        </ModalHeader>

        <Form
          className="tablelist-form"
          onSubmit={(e) => {
            e.preventDefault();
            console.log("sub");
            createAchats.handleSubmit();
          }}>
          <ModalBody>
            <Input
              type="hidden"
              id="id-field"
            />

            <Row className="g-3">
              <Col lg={12}>
                <div>
                  <Label
                    htmlFor="type-field"
                    className="form-label">
                    Type
                  </Label>

                  <Input
                    type="select"
                    className="form-select mb-0"
                    validate={{
                      required: { value: true }
                    }}
                    invalid={createAchats.touched.type && createAchats.errors.type ? true : false}
                    value={createAchats.values.type}
                    onChange={createAchats.handleChange}
                    onBlur={createAchats.handleBlur}
                    name="type"
                    id="type-field">
                    <option
                      disabled={true}
                      value={""}>
                      Choisir un type
                    </option>
                    {typesAchat.map((e, i) => (
                      <option
                        key={i}
                        value={e.value}>
                        {e.label}
                      </option>
                    ))}
                  </Input>
                  {createAchats.touched.type && createAchats.errors.type ? <FormFeedback type="invalid">{createAchats.errors.type}</FormFeedback> : null}
                </div>
              </Col>
              {createAchats.values.type == "Revenu" && createAchats.values.files < 1 && (
                <Col lg={12}>
                  <div>
                    <h5>Choisir des factures existantes</h5>
                  </div>
                  <SimpleBar
                    style={{ height: "150px" }}
                    className="mx-n3">
                    <ListGroup
                      className="list mb-0"
                      flush>
                      {factures?.map((fac, i) => {
                        return (
                          <ListGroupItem
                            key={i}
                            className={` ${isInvoiceSelected(fac.header.fen_id) ? "bg-light text-grey tit" : ""}`}
                            onClick={() => {
                              handleFacture(fac);
                            }}
                            data-id="1">
                            <div className={`d-flex justify-content-between`}>
                              <div className="d-flex  flex-column">
                                <p
                                  style={{ fontWeight: "bolder" }}
                                  className="p-0 m-0 font-weight-bold">
                                  {fac.contact.fco_name}
                                </p>
                                <p className="p-0 m-0">{fac.header.fen_date_create.slice(0, 10)}</p>
                              </div>
                              <div>
                                <p
                                  style={{ fontWeight: "bolder" }}
                                  className="p-0 m-0">
                                  {parseFloat(fac.header.fen_total_ttc).toFixed(2)} {devise} TTC
                                </p>
                              </div>
                            </div>
                          </ListGroupItem>
                        );
                      })}
                    </ListGroup>
                  </SimpleBar>
                </Col>
              )}
              {createAchats.values.type && createAchats.values.facturesExist < 1 && (
                <Col lg={12}>
                  <DropFileComponents
                    setValues={createAchats.setValues}
                    values={createAchats.values}
                    touched={createAchats.touched.files}
                    errors={createAchats.errors.files}
                  />
                </Col>
              )}
            </Row>
          </ModalBody>
          <ModalFooter>
            <div className="hstack gap-2 justify-content-end">
              <button
                type="button"
                className="btn btn-light"
                onClick={() => {
                  setModal(false);
                  setIsEdit(false);
                  setAchat({});
                }}>
                Fermer
              </button>
              <button
                disabled={loader}
                type="submit"
                className="btn btn-success"
                id="add-btn">
                {loader ?
                  <Spinner size={"sm"}></Spinner>
                  :
                  "Ajouter"
                }


              </button>
            </div>
          </ModalFooter>
        </Form>
      </Modal>

    </>
  );
};

export default ModalCreate;
