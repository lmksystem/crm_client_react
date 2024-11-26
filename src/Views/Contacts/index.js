import React, { useEffect, useState, useCallback, useMemo } from "react";
import { Link } from "react-router-dom";
import { isEmpty } from "lodash";

import { Col, Container, Row, Card, CardHeader, CardBody, UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem, Label, Input, Modal, ModalHeader, ModalBody, Form, ModalFooter, Table, FormFeedback } from "reactstrap";
import Select from "react-select";

import BreadCrumb from "../../Components/Common/BreadCrumb";
import DeleteModal from "../../Components/Common/DeleteModal";

//Import actions
import { getContacts as onGetContacts, addNewContact as onAddNewContact, updateContact as onUpdateContact, deleteContact as onDeleteContact, getCollaborateurs as onGetCollaborateurs } from "../../slices/thunks";
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

import { useProfile } from "../../Components/Hooks/UserHooks";
import { GestionService } from "../../services";

const Contacts = () => {
  const [contacts, setContacts] = useState(null);
  const [collaborateurs, setCollaborateurs] = useState(null);
  const [isEdit, setIsEdit] = useState(false);
  const [contact, setContact] = useState([]);
  const [epe_info, setInfo] = useState([]);
  const [isExportCSV, setIsExportCSV] = useState(false);
  const [collaborateurList, setCollaborateurList] = useState([]);
  const [collaborateur, setCollaborateur] = useState(null);
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteModalMulti, setDeleteModalMulti] = useState(false);
  const [show, setShow] = useState(false);
  const [modal, setModal] = useState(false);

  const toggle = useCallback(() => {
    if (modal) {
      setModal(false);
      setContact(null);
    } else {
      setModal(true);
    }
  }, [modal]);

  // Delete Data
  const handleDeleteContact = () => {
    if (contact) {
      GestionService.deleteContact(contact.epe_id);
      setContacts(contacts.filter((c) => c.epe_id != contact.epe_id));
      setDeleteModal(false);
    }
  };

  const onClickDelete = (contact) => {
    setContact(contact);
    setDeleteModal(true);
  };

  // Add Data
  const handleContactClicks = () => {
    setContact("");
    setIsEdit(false);
    toggle();
  };

  // validation
  const validation = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {
      // contactId: (contact && contact.contactId) || '',
      epe_id: (contact && contact.epe_id) || 0,
      epe_lastname: (contact && contact.epe_lastname) || "",
      epe_firstname: (contact && contact.epe_firstname) || "",
      epe_email: (contact && contact.epe_email) || "",
      epe_phone: (contact && contact.epe_phone) || "",
      epe_job: (contact && contact.epe_job) || "",
      epe_info: (contact && contact.epe_info) || "",
      epe_com_fk: (contact && contact.epe_com_fk) || 0,
      epe_ent_fk: (contact && contact.epe_ent_fk) || 0
    },
    validationSchema: Yup.object({
      epe_lastname: Yup.string().required("Veuillez entrer un nom"),
      epe_firstname: Yup.string().required("Veuillez entrer un prénom"),
      epe_email: Yup.string().required("Veuillez entrer un epe_email"),
      epe_phone: Yup.string().required("Veuillez entrer un téléphone"),
      epe_com_fk: Yup.number().required(),
      epe_job: Yup.string(),
      epe_info: Yup.string()
    }),
    onSubmit: (values) => {
      if (isEdit) {
        GestionService.updateContact(values);
        setContacts(contacts.map((c) => (c.epe_id == values.epe_id ? values : c)));
      } else {
        // save new Contact
        GestionService.addNewContact(values).then((response) => {
          setContacts([...contacts, response]);
        });
      }

      validation.resetForm();
      toggle();
    }
  });

  // Update Data
  const handleContactClick = useCallback(
    (arg) => {
      const contact = arg;
      setContact(contact);
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
      GestionService.deleteContact(element.value);
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
              value={cellProps.row.original.epe_id}
              onChange={() => deleteCheckbox()}
            />
          );
        },
        id: "#"
      },
      {
        Header: "",
        accessor: "epe_id",
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
        accessor: "ent_name",
        filterable: false,
        Cell: (cellProps) => {
          let epe_ent_fk = cellProps.row.original.epe_ent_fk;
          let entity = collaborateurList.find((c) => c.value == epe_ent_fk);

          return cellProps.row.original.ent_name ? entity?.label : <i style={{ color: "#9b9b9b" }}>non renseigné</i>;
        }
      },
      {
        Header: "Nom",
        accessor: "epe_lastname",
        filterable: false
      },
      {
        Header: "Prénom",
        accessor: "epe_firstname",
        filterable: false
      },
      {
        Header: "epe_email",
        accessor: "epe_email",
        filterable: false
      },
      {
        Header: "Téléphone",
        accessor: "epe_phone",
        filterable: false
        // Cell: (cell) => (
        //   <>
        //     {handleValidDate(cell.value)}
        //   </>
        // ),
      },
      {
        Header: "Poste",
        accessor: "epe_job",
        Cell: (cell) => {
          return <span className="badge text-uppercase badge-soft-success"> {cell.value} </span>;
        }
      },
      {
        Header: "Action",
        Cell: (cellProps) => {
          return (
            <ul className="list-inline hstack gap-2 mb-0">
              <li
                className="list-inline-item edit"
                title="Call">
                <Link
                  to={`tel:${epe_info.epe_phone}`}
                  className="text-primary d-inline-block">
                  <i className="ri-phone-line fs-16"></i>
                </Link>
              </li>
              <li className="list-inline-item">
                <UncontrolledDropdown>
                  <DropdownToggle
                    href="#"
                    className="btn btn-soft-secondary btn-sm dropdown"
                    tag="button">
                    <i className="ri-more-fill align-middle"></i>
                  </DropdownToggle>
                  <DropdownMenu className="dropdown-menu-end">
                    <DropdownItem
                      className="dropdown-item"
                      href="#"
                      onClick={() => {
                        const contactData = cellProps.row.original;
                        setInfo(contactData);
                        setShow(true);
                      }}>
                      <i className="ri-eye-fill align-bottom me-2 text-primary"></i> Voir
                    </DropdownItem>
                    <DropdownItem
                      className="dropdown-item edit-item-btn"
                      href="#"
                      onClick={() => {
                        const contactData = cellProps.row.original;

                        // setCollaborateur(collaborateurList.filter((c) => c.value == contactData.epe_ent_fk)[0]);
                        handleContactClick(contactData);
                      }}>
                      <i className="ri-pencil-fill align-bottom me-2 text-primary"></i> Modifier
                    </DropdownItem>
                    <DropdownItem
                      className="dropdown-item remove-item-btn"
                      href="#"
                      onClick={() => {
                        const contactData = cellProps.row.original;
                        onClickDelete(contactData);
                      }}>
                      <i className="ri-delete-bin-fill align-bottom me-2 text-danger "></i> Supprimer
                    </DropdownItem>
                  </DropdownMenu>
                </UncontrolledDropdown>
              </li>
            </ul>
          );
        }
      }
    ],
    [handleContactClick, checkedAll, contacts, collaborateurList]
  );

  useEffect(() => {
    if (show) {
      setTimeout(() => {
        document.getElementById("start-anime").classList.add("show-cus");
      }, 350);
    } else {
      document.getElementById("start-anime").classList.remove("show-cus");
    }
  }, [show]);

  useEffect(() => {
    GestionService.getContacts().then((response) => {
      setContacts(response);
    });

    GestionService.getCollaborateurs().then((response) => {
      setCollaborateurList(response.map((ent) => ({ label: ent.ent_name, value: ent.ent_id })));
    });
  }, []);

  useEffect(() => {
    if (!isEmpty(contacts)) {
      setContact(contacts);
      setIsEdit(false);
    }
  }, [contacts]);

  document.title = "Contacts | Countano";
  return (
    <React.Fragment>
      <div className="page-content">
        <ExportCSVModal
          show={isExportCSV}
          onCloseClick={() => setIsExportCSV(false)}
          data={contacts}
        />

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
            title="Contacts"
            pageTitle="Gestion"
          />
          {/* <Row> */}
          <Col lg={12}>
            <Card>
              <CardHeader>
                <div className="d-flex align-items-center flex-wrap gap-2">
                  <div className="flex-grow-1">
                    <button
                      className="btn btn-secondary add-btn"
                      onClick={() => {
                        setModal(true);
                      }}>
                      <i className="ri-add-fill me-1 align-bottom"></i> Ajouter un contact
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

                      <button
                        className="btn btn-soft-success"
                        onClick={() => setIsExportCSV(true)}>
                        Export
                      </button>

                      {/* <UncontrolledDropdown>
                          <DropdownToggle
                            href="#"
                            className="btn btn-soft-epe_info"
                            tag="button"
                          >
                            <i className="ri-more-2-fill"></i>
                          </DropdownToggle>
                        </UncontrolledDropdown> */}
                    </div>
                  </div>
                </div>
              </CardHeader>
            </Card>
          </Col>
          <Row>
            <Col
              className="view-animate"
              xxl={show ? 9 : 12}>
              <Card id="contactList">
                <CardBody className="pt-0">
                  <div>
                    {contacts ? (
                      <TableContainer
                        initialSortField={"ent_name"}
                        columns={columns}
                        data={contacts || []}
                        isGlobalFilter={true}
                        isAddUserList={false}
                        customPageSize={8}
                        className="custom-header-css"
                        divClass="table-responsive table-card mb-3"
                        tableClass="align-middle table-nowrap"
                        theadClass="table-light"
                        handleContactClick={handleContactClicks}
                        isContactsFilter={true}
                        SearchPlaceholder="Recherche..."
                      />
                    ) : (
                      <Loader error={contacts} />
                    )}
                  </div>

                  <Modal
                    id="showModal"
                    isOpen={modal}
                    toggle={toggle}
                    centered>
                    <ModalHeader
                      className="bg-soft-epe_info p-3"
                      toggle={toggle}>
                      {!!isEdit ? "Modifier un contact" : "Ajouter un contact"}
                    </ModalHeader>

                    <Form
                      className="tablelist-form"
                      onSubmit={(e) => {
                        e.preventDefault();
                        validation.handleSubmit();
                        return false;
                      }}>
                      <ModalBody>
                        <Input
                          type="hidden"
                          id="id-field"
                        />
                        <Row className="g-3">
                          <Col lg={12}>
                            <div className="text-center">
                              <div className="position-relative d-inline-block">
                                <div className="position-absolute  bottom-0 end-0"></div>
                                <div className="avatar-lg p-1">
                                  <div className="avatar-title bg-light rounded-circle">
                                    <img
                                      src={process.env.REACT_APP_API_URL + "v1/images/" + (epe_info.image_src ? "company/" + epe_info.image_src : "user-dummy-img.jpg")}
                                      alt="dummyImg"
                                      id="customer-img"
                                      className="avatar-md rounded-circle object-cover"
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </Col>
                          <Col lg={6}>
                            <div>
                              <Label
                                htmlFor="epe_lastname-field"
                                className="form-label">
                                Nom
                              </Label>
                              <Input
                                name="epe_lastname"
                                id="epe_lastname-field"
                                className="form-control"
                                placeholder="Entrer un nom"
                                type="text"
                                validate={{
                                  required: { value: true }
                                }}
                                onChange={validation.handleChange}
                                onBlur={validation.handleBlur}
                                value={validation.values.epe_lastname || ""}
                                invalid={validation.touched.epe_lastname && validation.errors.epe_lastname ? true : false}
                              />
                              {validation.touched.epe_lastname && validation.errors.epe_lastname ? <FormFeedback type="invalid">{validation.errors.epe_lastname}</FormFeedback> : null}
                            </div>
                          </Col>
                          <Col lg={6}>
                            <div>
                              <Label
                                htmlFor="epe_firstname-field"
                                className="form-label">
                                Prénom
                              </Label>
                              <Input
                                name="epe_firstname"
                                id="epe_firstname-field"
                                className="form-control"
                                placeholder="Entrer un prénom"
                                type="text"
                                validate={{
                                  required: { value: true }
                                }}
                                onChange={validation.handleChange}
                                onBlur={validation.handleBlur}
                                value={validation.values.epe_firstname || ""}
                                invalid={validation.touched.epe_firstname && validation.errors.epe_firstname ? true : false}
                              />
                              {validation.touched.epe_firstname && validation.errors.epe_firstname ? <FormFeedback type="invalid">{validation.errors.epe_firstname}</FormFeedback> : null}
                            </div>
                          </Col>

                          <Col lg={12}>
                            <div>
                              <Label
                                htmlFor="email_id-field"
                                className="form-label">
                                epe_email
                              </Label>

                              <Input
                                name="epe_email"
                                id="email_id-field"
                                className="form-control"
                                placeholder="Entrer un epe_email"
                                type="epe_email"
                                validate={{
                                  required: { value: true }
                                }}
                                onChange={validation.handleChange}
                                onBlur={validation.handleBlur}
                                value={validation.values.epe_email || ""}
                                invalid={validation.touched.epe_email && validation.errors.epe_email ? true : false}
                              />
                              {validation.touched.epe_email && validation.errors.epe_email ? <FormFeedback type="invalid">{validation.errors.epe_email}</FormFeedback> : null}
                            </div>
                          </Col>
                          <Col lg={12}>
                            <div>
                              <Label
                                htmlFor="epe_phone-field"
                                className="form-label">
                                Téléphone
                              </Label>

                              <Input
                                name="epe_phone"
                                id="epe_phone-field"
                                className="form-control"
                                placeholder="Entrer un téléphone"
                                type="text"
                                validate={{
                                  required: { value: true }
                                }}
                                onChange={validation.handleChange}
                                onBlur={validation.handleBlur}
                                value={validation.values.epe_phone || ""}
                                invalid={validation.touched.epe_phone && validation.errors.epe_phone ? true : false}
                              />
                              {validation.touched.epe_phone && validation.errors.epe_phone ? <FormFeedback type="invalid">{validation.errors.epe_phone}</FormFeedback> : null}
                            </div>
                          </Col>
                          <Col lg={6}>
                            <div>
                              <Label
                                htmlFor="taginput-choices"
                                className="form-label font-size-13">
                                Entreprise
                              </Label>
                              <Select
                                defaultValue={{ label: "Sélectionner...", value: null }}
                                value={collaborateurList.find((c) => validation.values.epe_ent_fk == c.value)}
                                onChange={(e) => {
                                  validation.setFieldValue("epe_ent_fk", e.value);
                                }}
                                className="select-style mb-0"
                                options={collaborateurList}
                                id="taginput-choices"></Select>

                              {validation.touched.tags && validation.errors.tags ? <FormFeedback type="invalid">{validation.errors.tags}</FormFeedback> : null}
                            </div>
                          </Col>
                          <Col lg={6}>
                            <div>
                              <Label
                                htmlFor="epe_job-field"
                                className="form-label">
                                Poste
                              </Label>

                              <Input
                                name="epe_job"
                                id="epe_job-field"
                                className="form-control"
                                placeholder="Entrer un poste"
                                type="text"
                                validate={{
                                  required: { value: false }
                                }}
                                onChange={validation.handleChange}
                                onBlur={validation.handleBlur}
                                value={validation.values.epe_job || ""}
                                invalid={validation.touched.epe_job && validation.errors.epe_job ? true : false}
                              />
                              {validation.touched.epe_job && validation.errors.epe_job ? <FormFeedback type="invalid">{validation.errors.epe_job}</FormFeedback> : null}
                            </div>
                          </Col>
                          <Col lg={12}>
                            <div>
                              <Label
                                htmlFor="epe_info-field"
                                className="form-label">
                                Information complémentaire
                              </Label>

                              <textarea
                                name="epe_info"
                                id="epe_info-field"
                                className="form-control"
                                placeholder="Information"
                                type="text"
                                validate={{
                                  required: { value: false }
                                }}
                                onChange={validation.handleChange}
                                onBlur={validation.handleBlur}
                                value={validation.values.epe_info || ""}
                                invalid={validation.touched.epe_info && validation.errors.epe_info ? "true" : "false"}
                                rows={5}
                              />
                              {validation.touched.epe_info && validation.errors.epe_info ? <FormFeedback type="invalid">{validation.errors.epe_info}</FormFeedback> : null}
                            </div>
                          </Col>
                        </Row>
                      </ModalBody>
                      <ModalFooter>
                        <div className="hstack gap-2 justify-content-end">
                          <button
                            type="button"
                            className="btn btn-light"
                            onClick={() => {
                              setModal(false);
                            }}>
                            {" "}
                            Fermer{" "}
                          </button>
                          <button
                            type="submit"
                            className="btn btn-success"
                            id="add-btn">
                            {" "}
                            {!!isEdit ? "Modifier" : "Ajouter"}{" "}
                          </button>
                        </div>
                      </ModalFooter>
                    </Form>
                  </Modal>
                  <ToastContainer
                    closeButton={false}
                    limit={1}
                  />
                </CardBody>
              </Card>
            </Col>

            <div id="start-anime">
              <Card id="contact-view-detail">
                <CardBody className="text-center">
                  <div style={{ position: "absolute", right: 10, top: 5 }}>
                    <i
                      onClick={() => setShow(false)}
                      className="ri-close-fill"
                      style={{ cursor: "pointer", fontSize: "20px" }}></i>
                  </div>
                  <div className="position-relative d-inline-block">
                    <img
                      src={process.env.REACT_APP_API_URL + "v1/images/" + (epe_info.image_src ? "company/" + epe_info.image_src : "user-dummy-img.jpg")}
                      alt=""
                      className="avatar-lg rounded-circle img-thumbnail"
                    />
                    <span className="contact-active position-absolute rounded-circle bg-success">
                      <span className="visually-hidden"></span>
                    </span>
                  </div>
                  <h5 className="mt-4 mb-1">{epe_info.epe_lastname + " " + epe_info.epe_firstname}</h5>
                  <p className="text-muted">
                    <span className="badge badge-soft-primary me-1">{epe_info.epe_job}</span>
                  </p>

                  <ul className="list-inline mb-0">
                    <li className="list-inline-item avatar-xs">
                      <Link
                        to={`tel:${epe_info.epe_phone}`}
                        className="avatar-title bg-soft-success text-success fs-15 rounded">
                        <i className="ri-phone-line"></i>
                      </Link>
                    </li>
                    <li className="list-inline-item avatar-xs">
                      <Link
                        to={`mailto:${epe_info.epe_email}`}
                        className="avatar-title bg-soft-danger text-danger fs-15 rounded">
                        <i className="ri-mail-line"></i>
                      </Link>
                    </li>
                  </ul>
                </CardBody>
                <CardBody>
                  <h6 className="text-muted text-uppercase fw-semibold mb-3">Information complémentaire</h6>
                  <p className="text-muted mb-4">{epe_info.epe_info || "Non renseigné"}</p>
                  <div className="table-responsive table-card">
                    <Table className="table table-borderless mb-0">
                      <tbody>
                        <tr>
                          <td className="fw-medium">Entreprise</td>
                          <td>{epe_info.ent_name}</td>
                        </tr>
                        <tr>
                          <td className="fw-medium">Poste</td>
                          <td>{epe_info.epe_job}</td>
                        </tr>
                        <tr>
                          <td className="fw-medium">epe_email</td>
                          <td>{epe_info.epe_email}</td>
                        </tr>
                        <tr>
                          <td className="fw-medium">Téléphone</td>
                          <td>{epe_info.epe_phone}</td>
                        </tr>
                      </tbody>
                    </Table>
                  </div>
                </CardBody>
              </Card>
            </div>

            {/* </Row> */}
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default Contacts;
