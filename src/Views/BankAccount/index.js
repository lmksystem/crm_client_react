import React, { useEffect, useState, useCallback, useMemo } from "react";
import { Col, Container, Row, Card, CardHeader, CardBody, Modal, ModalHeader, ModalBody, ListGroup, ListGroupItem, Input } from "reactstrap";

import BreadCrumb from "../../Components/Common/BreadCrumb";
import paysData from "../../Components/constants/paysPhone.json";
//Import actions
import { getListBank as onGetListBank, insertBankAccount as onInsertBankAccount, getBankUserAccount, removeBankAccountApi } from "../../slices/thunks";
//redux
import { useSelector, useDispatch } from "react-redux";
import Loader from "../../Components/Common/Loader";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SimpleBar from "simplebar-react";
import ItemBank from "./ItemBank";
import axios from "axios";

const BankAccount = () => {
  const dispatch = useDispatch();
  const { isBankAccountSuccess, error, listBank, listAccountsBank } = useSelector((state) => ({
    isBankAccountSuccess: state.BankAccount.isBankAccountSuccess,
    error: state.BankAccount.error,
    listBank: state.BankAccount.listBank,
    listAccountsBank: state.BankAccount.listAccountsBank
  }));
  const [listAccountsBankState, setListAccountsBankState] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [modal, setModal] = useState(false);
  const [pays, setPays] = useState("");

  const [bankFilter, setBankFilter] = useState({
    data: [],
    searchTerm: ""
  });
  const handleSearchChange = (e) => {
    const { value } = e.target;
    setBankFilter({ ...bankFilter, searchTerm: value });
  };
  const filterData = (arrayBank) => {
    return arrayBank?.data?.filter((item) => {
      const searchFields = [item?.name];
      return searchFields.some((field) => field?.toLowerCase()?.includes(arrayBank?.searchTerm?.toLowerCase()));
    });
  };

  const filteredData = filterData(bankFilter);

  const removeBankAccount = (id) => {
    removeBankAccountApi(id).then(() => {
      setListAccountsBankState(listAccountsBankState.filter((e) => e.bua_id != id));
    });
  };

  useEffect(() => {
    // dispatch(onGetAccountBank("null"));
    getBankUserAccount()
      .then((res) => {
        setListAccountsBankState(res);
      })
      .catch((err) => {
        console.log(err);
        toast.error("Erreur de récupération des listes de banque", { autoClose: 3000 });
      });
  }, []);

  useEffect(() => {
    if (pays?.length > 0) {
      setBankFilter({
        data: [],
        searchTerm: ""
      });
      dispatch(onGetListBank(pays));
    } else {
      setBankFilter({
        data: [],
        searchTerm: ""
      });
    }
  }, [dispatch, pays]);

  useEffect(() => {
    if (listBank && pays?.length > 0) {
      setBankFilter({
        data: listBank || [],
        searchTerm: ""
      });
    }
  }, [listBank]);

  // SideBar Contact Deatail

  document.title = "Mes comptes bancaires | Countano";
  return (
    <React.Fragment>
      <div className="page-content">
        <Container
          fluid
          className="mx-0 gx-0">
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
              centered>
              <ModalHeader
                toggle={() => {
                  if (!isLoading) {
                    setModal(false);
                  }
                }}
                className="bg-soft-info p-3">
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
                    <SimpleBar
                      className="d-flex "
                      style={{ height: "442px" }}>
                      <Input
                        type="select"
                        className="form-select mb-0"
                        value={pays}
                        onChange={(e) => {
                          setPays(e.target.value);
                        }}
                        // onBlur={createAchats.handleBlur}
                        name="type"
                        id="type-field">
                        <option
                          disabled={true}
                          value={""}>
                          Choisir un pays
                        </option>
                        {paysData?.map((e, i) => (
                          <option
                            key={i}
                            value={e.code}>
                            {e.name}
                          </option>
                        ))}
                      </Input>
                      <ListGroup
                        className="list mb-0"
                        flush>
                        {filteredData?.map((bankItem, i) => {
                          return (
                            <ListGroupItem
                              data-id="1"
                              key={i}
                              className={"list-group-item-action"}
                              onClick={() => {
                                setIsLoading(true);
                                dispatch(
                                  onInsertBankAccount({
                                    bac_instit_id: bankItem.id,
                                    bac_logo: bankItem.logo,
                                    bac_name: bankItem.name
                                  })
                                );
                              }}>
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
            <Col xxl={12}>
              <Card id="contactList">
                <CardHeader>
                  <div className="d-flex align-items-center flex-wrap gap-2">
                    <div className="flex-grow-1">
                      <button
                        className="btn btn-secondary add-btn"
                        onClick={() => {
                          setModal(true);
                        }}>
                        <i className="ri-add-fill me-1 align-bottom"></i> Ajouter un ou plusieurs comptes bancaires
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
                          className="mx-n3">
                          <ListGroup
                            className="list mb-0"
                            flush>
                            {listAccountsBankState?.map((acc, i) => {
                              console.log("acc");
                              return (
                                <ItemBank
                                  remove={removeBankAccount}
                                  item={acc}
                                  key={i}
                                />
                              );
                            })}
                          </ListGroup>
                        </SimpleBar>
                      </div>
                    </div>
                  </Col>
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

export default BankAccount;
