import React, { useEffect, useState, useCallback, useMemo } from "react";
import { Link } from "react-router-dom";
import { isEmpty } from "lodash";

import {
  Col,
  Container,
  Row,
  Card,
  CardHeader,
  CardBody,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Label,
  Input,
  Modal,
  ModalHeader,
  ModalBody,
  Form,
  ModalFooter,
  Table,
  FormFeedback,
  ListGroup,
  ListGroupItem,
  Button,
} from "reactstrap";

import BreadCrumb from "../../Components/Common/BreadCrumb";
import DeleteModal from "../../Components/Common/DeleteModal";

//Import actions
import {
  getListBank as onGetListBank,
  insertBankAccount as onInsertBankAccount,
  getAccountBank as onGetAccountBank,
} from "../../slices/thunks";
//redux
import { useSelector, useDispatch } from "react-redux";

// Formik
import * as Yup from "yup";
import { useFormik } from "formik";

import Loader from "../../Components/Common/Loader";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SimpleBar from "simplebar-react";

const BankAccount = () => {
  const dispatch = useDispatch();
  const { isBankAccountSuccess, error, listBank, listAccountsBank } =
    useSelector((state) => ({
      isBankAccountSuccess: state.BankAccount.isBankAccountSuccess,
      error: state.BankAccount.error,
      listBank: state.BankAccount.listBank,
      listAccountsBank: state.BankAccount.listAccountsBank,
    }));
  const [isLoading, setIsLoading] = useState(false);
  const [modal, setModal] = useState(false);
  const [bankFilter, setBankFilter] = useState({
    data: [],
    searchTerm: "",
  });
  const handleSearchChange = (e) => {
    const { value } = e.target;
    setBankFilter({ ...bankFilter, searchTerm: value });
  };
  const filterData = (arrayBank) => {
    return arrayBank?.data?.filter((item) => {
      const searchFields = [item?.name];
      return searchFields.some((field) =>
        field?.toLowerCase()?.includes(arrayBank?.searchTerm?.toLowerCase())
      );
    });
  };

  const filteredData = filterData(bankFilter);

  useEffect(() => {
    dispatch(onGetListBank());
    dispatch(onGetAccountBank());
  }, [dispatch]);

  useEffect(() => {
    if (listBank) {
      setBankFilter({
        data: listBank || [],
        searchTerm: "",
      });
    }
  }, [listBank]);

  // SideBar Contact Deatail

  document.title = "Mes comptes bancaires | Countano";
  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <BreadCrumb
            title="Mes comptes bancaires"
            pageTitle="Banque / Achat"
          />
          <Row>
            <Modal
              id="showModal"
              isOpen={modal}
              toggle={() => {
                if (!isLoading) {
                  setModal(false);
                }
              }}
              centered
            >
              <ModalHeader
                toggle={() => {
                  if (!isLoading) {
                    setModal(false);
                  }
                }}
                className="bg-soft-info p-3"
              >
                Choisissez une banque
              </ModalHeader>
              <ModalBody>
                {!isLoading && (
                  <Row className="mt-1 d-flex flex-column">
                    <Row className="mb-2">
                      <Col lg={12}>
                        <div>
                          <input
                            className="search form-control"
                            placeholder="Chercher une banque"
                            value={bankFilter.searchTerm}
                            onChange={handleSearchChange}
                          />
                        </div>
                      </Col>
                    </Row>
                    <SimpleBar className="d-flex " style={{ height: "442px" }}>
                      <ListGroup className="list mb-0" flush>
                        {filteredData?.map((bankItem, i) => {
                          return (
                            <ListGroupItem
                              data-id="1"
                              key={i}
                              className={"list-group-item-action"}
                              onClick={() => {
                                setIsLoading(true);
                                console.log(bankItem);
                                dispatch(
                                  onInsertBankAccount({
                                    bac_instit_id: bankItem.id,
                                    bac_logo: bankItem.logo,
                                    bac_name: bankItem.name,
                                  })
                                );
                              }}
                            >
                              <div className="d-flex flex-row align-items-center justify-content-between">
                                <div className="d-flex flex-row align-items-center">
                                  <div className="w-25 p-3">
                                    <img
                                      src={bankItem.logo}
                                      alt={`logo banque ${bankItem.name}`}
                                      className="img-fluid"
                                    />
                                  </div>
                                  <p>{bankItem.name}</p>
                                </div>
                                <i></i>
                              </div>
                            </ListGroupItem>
                          );
                        })}
                      </ListGroup>
                    </SimpleBar>
                  </Row>
                )}

                {isLoading && <Loader />}
              </ModalBody>
            </Modal>
            <Col className="view-animate" xxl={12}>
              <Card id="contactList">
                <CardHeader>
                  <div className="d-flex align-items-center flex-wrap gap-2">
                    <div className="flex-grow-1">
                      <button
                        className="btn btn-info add-btn"
                        onClick={() => {
                          setModal(true);
                        }}
                      >
                        <i className="ri-add-fill me-1 align-bottom"></i>{" "}
                        Ajouter un ou plusieurs comptes bancaires
                      </button>
                    </div>
                  </div>
                </CardHeader>
                <CardBody className="pt-0">
                  <Col lg={12}>
                    <div>
                      <div id="users">
                        <SimpleBar
                          style={{ height: "542px" }}
                          className="mx-n3"
                        >
                          <ListGroup className="list mb-0" flush>
                            {listAccountsBank?.map((acc,i) => 
                             
                                <ListGroupItem
                                  data-id="1"
                                  key={i}
                                  className={"list-group-item-action"}
                                >
                                  <div className="d-flex flex-row align-items-center justify-content-between">
                                    <div className="d-flex flex-row align-items-center">
                                      <div style={{ width: 100 }}>
                                        <img
                                          src={acc.bac_logo}
                                          // alt={`logo banque ${bankItem.name}`}
                                          className="img-fluid"
                                        />
                                      </div>
                                      <div
                                        style={{
                                          display: "flex",
                                          flexDirection: "column",
                                          marginLeft: "5%",
                                          width: "90%",
                                        }}
                                      >
                                        <p>{acc.ba_name}</p>
                                        <p style={{ fontWeight: "bolder" }}>
                                          Numéro de compte :{" "}
                                          {acc.bua_account_id}
                                        </p>
                                      </div>
                                    </div>
                                    <button type="button" class="btn btn-outline-primary">Mettre à jour</button>
                                  </div>
                                </ListGroupItem>
                            
                          )}
                          </ListGroup>
                        </SimpleBar>
                      </div>
                    </div>
                  </Col>
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

export default BankAccount;
