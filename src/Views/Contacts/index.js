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

const Contacts = () => {
  const dispatch = useDispatch();
  const { userProfile } = useProfile();
  const { contacts, collaborateurs, isContactSuccess, error } = useSelector((state) => ({
    contacts: state.Gestion.contacts,
    collaborateurs: state.Gestion.collaborateurs,
    isContactSuccess: state.Gestion.isContactSuccess,
    isCollaborateurSuccess: state.Gestion.isCollaborateurSuccess,
    error: state.Gestion.error
  }));

  useEffect(() => {
    dispatch(onGetContacts());
    dispatch(onGetCollaborateurs());
  }, [dispatch]);

  useEffect(() => {
    setContact(contacts);
  }, [contacts]);

  useEffect(() => {
    if (!isEmpty(contacts)) {
      setContact(contacts);
      setIsEdit(false);
    }
  }, [contacts]);

  const [isEdit, setIsEdit] = useState(false);
  const [contact, setContact] = useState([]);

  const [collaborateurList, setCollaborateurList] = useState([]);
  const [collaborateur, setCollaborateur] = useState(null);

  //delete Conatct
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteModalMulti, setDeleteModalMulti] = useState(false);

  const [show, setShow] = useState(false);

  const [modal, setModal] = useState(false);

  const toggle = useCallback(() => {
    if (modal) {
      setModal(false);
      setContact(null);
      setCollaborateur(null);
    } else {
      setModal(true);
    }
  }, [modal]);

  // Delete Data
  const handleDeleteContact = () => {
    if (contact) {
      dispatch(onDeleteContact(contact.epe_id));
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
      // img: (contact && contact.img) || '',
      lastname: (contact && contact.lastname) || "",
      firstname: (contact && contact.firstname) || "",
      email: (contact && contact.email) || "",
      phone: (contact && contact.phone) || "",
      job: (contact && contact.job) || "",
      info: (contact && contact.info) || ""
      // phone: (contact && contact.phone) || '',
      // lead_score: (contact && contact.lead_score) || '',
      // tags: (contact && contact.tags) || [],
    },
    validationSchema: Yup.object({
      // contactId: Yup.string().required("Please Enter Contact Id"),
      lastname: Yup.string().required("Veuillez entrer un nom"),
      firstname: Yup.string().required("Veuillez entrer un prénom"),
      email: Yup.string().required("Veuillez entrer un email"),
      phone: Yup.string().required("Veuillez entrer un téléphone"),
      job: Yup.string(),
      info: Yup.string()
    }),
    onSubmit: (values) => {
      if (isEdit) {
        const updateContact = {
          epe_id: contact ? contact.id : 0,
          epe_lastname: values.lastname,
          epe_firstname: values.firstname,
          epe_email: values.email,
          epe_phone: values.phone,
          epe_job: values.job,
          epe_info: values.info,
          epe_com_fk: userProfile.use_com_fk,
          epe_ent_fk: collaborateur?.value || null,
          ent_name: collaborateur?.label || null
        };

        // update Contact
        dispatch(onUpdateContact(updateContact));
        validation.resetForm();
      } else {
        const newContact = {
          epe_lastname: values["lastname"],
          epe_firstname: values["firstname"],
          epe_email: values["email"],
          epe_phone: values["phone"],
          epe_job: values["job"],
          epe_info: values["info"],
          epe_com_fk: userProfile.use_com_fk,
          epe_ent_fk: collaborateur?.value || null,
          ent_name: collaborateur?.label || null
        };

        // save new Contact
        dispatch(onAddNewContact(newContact));
        validation.resetForm();
      }
      toggle();
    }
  });

  // Update Data
  const handleContactClick = useCallback(
    (arg) => {
      const contact = arg;

      setContact({
        id: contact.epe_id,
        lastname: contact.epe_lastname,
        firstname: contact.epe_firstname,
        email: contact.epe_email,
        phone: contact.epe_phone,
        job: contact.epe_job,
        info: contact.epe_info
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
      dispatch(onDeleteContact(element.value));
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
          console.log(cellProps.row.original);
          return cellProps.row.original.ent_name ? cellProps.row.original.ent_name : <i style={{ color: "#9b9b9b" }}>non renseigné</i>;
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
        Header: "Email",
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
                  to={`tel:${info.epe_phone}`}
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

                        setCollaborateur(collaborateurList.filter((c) => c.value == contactData.epe_ent_fk)[0]);
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
    [handleContactClick, checkedAll, collaborateurList]
  );

  useEffect(() => {
    if (collaborateurs) {
      let firstChoice = { label: <i style={{ color: "#9b9b9b" }}>non renseigné</i>, value: null };
      let collaboList = collaborateurs.map((c) => ({ label: c.ent_name, value: c.ent_id }));
      setCollaborateurList([firstChoice, ...collaboList]);
    }
  }, [collaborateurs]);

  function handlestag(collaborateur) {
    setCollaborateur(collaborateur);
  }

  useEffect(() => {
    if (show) {
      setTimeout(() => {
        document.getElementById("start-anime").classList.add("show-cus");
      }, 350);
    } else {
      document.getElementById("start-anime").classList.remove("show-cus");
    }
  }, [show]);

  // SideBar Contact Deatail
  const [info, setInfo] = useState([]);

  // Export Modal
  const [isExportCSV, setIsExportCSV] = useState(false);

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
                            className="btn btn-soft-info"
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
                    {isContactSuccess ? (
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
                      <Loader error={error} />
                    )}
                  </div>

                  <Modal
                    id="showModal"
                    isOpen={modal}
                    toggle={toggle}
                    centered>
                    <ModalHeader
                      className="bg-soft-info p-3"
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
                                      src={process.env.API_URL + "v1/images/" + (info.image_src ? "company/" + info.image_src : "user-dummy-img.jpg")}
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
                                htmlFor="lastname-field"
                                className="form-label">
                                Nom
                              </Label>
                              <Input
                                name="lastname"
                                id="lastname-field"
                                className="form-control"
                                placeholder="Entrer un nom"
                                type="text"
                                validate={{
                                  required: { value: true }
                                }}
                                onChange={validation.handleChange}
                                onBlur={validation.handleBlur}
                                value={validation.values.lastname || ""}
                                invalid={validation.touched.lastname && validation.errors.lastname ? true : false}
                              />
                              {validation.touched.lastname && validation.errors.lastname ? <FormFeedback type="invalid">{validation.errors.lastname}</FormFeedback> : null}
                            </div>
                          </Col>
                          <Col lg={6}>
                            <div>
                              <Label
                                htmlFor="firstname-field"
                                className="form-label">
                                Prénom
                              </Label>
                              <Input
                                name="firstname"
                                id="firstname-field"
                                className="form-control"
                                placeholder="Entrer un prénom"
                                type="text"
                                validate={{
                                  required: { value: true }
                                }}
                                onChange={validation.handleChange}
                                onBlur={validation.handleBlur}
                                value={validation.values.firstname || ""}
                                invalid={validation.touched.firstname && validation.errors.firstname ? true : false}
                              />
                              {validation.touched.firstname && validation.errors.firstname ? <FormFeedback type="invalid">{validation.errors.firstname}</FormFeedback> : null}
                            </div>
                          </Col>

                          <Col lg={12}>
                            <div>
                              <Label
                                htmlFor="email_id-field"
                                className="form-label">
                                Email
                              </Label>

                              <Input
                                name="email"
                                id="email_id-field"
                                className="form-control"
                                placeholder="Entrer un email"
                                type="email"
                                validate={{
                                  required: { value: true }
                                }}
                                onChange={validation.handleChange}
                                onBlur={validation.handleBlur}
                                value={validation.values.email || ""}
                                invalid={validation.touched.email && validation.errors.email ? true : false}
                              />
                              {validation.touched.email && validation.errors.email ? <FormFeedback type="invalid">{validation.errors.email}</FormFeedback> : null}
                            </div>
                          </Col>
                          <Col lg={12}>
                            <div>
                              <Label
                                htmlFor="phone-field"
                                className="form-label">
                                Téléphone
                              </Label>

                              <Input
                                name="phone"
                                id="phone-field"
                                className="form-control"
                                placeholder="Entrer un téléphone"
                                type="text"
                                validate={{
                                  required: { value: true }
                                }}
                                onChange={validation.handleChange}
                                onBlur={validation.handleBlur}
                                value={validation.values.phone || ""}
                                invalid={validation.touched.phone && validation.errors.phone ? true : false}
                              />
                              {validation.touched.phone && validation.errors.phone ? <FormFeedback type="invalid">{validation.errors.phone}</FormFeedback> : null}
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
                                value={collaborateur}
                                onChange={(e) => {
                                  handlestag(e);
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
                                htmlFor="job-field"
                                className="form-label">
                                Poste
                              </Label>

                              <Input
                                name="job"
                                id="job-field"
                                className="form-control"
                                placeholder="Entrer un poste"
                                type="text"
                                validate={{
                                  required: { value: false }
                                }}
                                onChange={validation.handleChange}
                                onBlur={validation.handleBlur}
                                value={validation.values.job || ""}
                                invalid={validation.touched.job && validation.errors.job ? true : false}
                              />
                              {validation.touched.job && validation.errors.job ? <FormFeedback type="invalid">{validation.errors.job}</FormFeedback> : null}
                            </div>
                          </Col>
                          <Col lg={12}>
                            <div>
                              <Label
                                htmlFor="info-field"
                                className="form-label">
                                Information complémentaire
                              </Label>

                              <textarea
                                name="info"
                                id="info-field"
                                className="form-control"
                                placeholder="Information"
                                type="text"
                                validate={{
                                  required: { value: false }
                                }}
                                onChange={validation.handleChange}
                                onBlur={validation.handleBlur}
                                value={validation.values.info || ""}
                                invalid={validation.touched.info && validation.errors.info ? "true" : "false"}
                                rows={5}
                              />
                              {validation.touched.info && validation.errors.info ? <FormFeedback type="invalid">{validation.errors.info}</FormFeedback> : null}
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
                      src={process.env.API_URL + "v1/images/" + (info.image_src ? "company/" + info.image_src : "user-dummy-img.jpg")}
                      alt=""
                      className="avatar-lg rounded-circle img-thumbnail"
                    />
                    <span className="contact-active position-absolute rounded-circle bg-success">
                      <span className="visually-hidden"></span>
                    </span>
                  </div>
                  <h5 className="mt-4 mb-1">{info.epe_lastname + " " + info.epe_firstname}</h5>
                  <p className="text-muted">
                    <span className="badge badge-soft-primary me-1">{info.epe_job}</span>
                  </p>

                  <ul className="list-inline mb-0">
                    <li className="list-inline-item avatar-xs">
                      <Link
                        to={`tel:${info.epe_phone}`}
                        className="avatar-title bg-soft-success text-success fs-15 rounded">
                        <i className="ri-phone-line"></i>
                      </Link>
                    </li>
                    <li className="list-inline-item avatar-xs">
                      <Link
                        to={`mailto:${info.epe_email}`}
                        className="avatar-title bg-soft-danger text-danger fs-15 rounded">
                        <i className="ri-mail-line"></i>
                      </Link>
                    </li>
                  </ul>
                </CardBody>
                <CardBody>
                  <h6 className="text-muted text-uppercase fw-semibold mb-3">Information complémentaire</h6>
                  <p className="text-muted mb-4">{info.epe_info || "Non renseigné"}</p>
                  <div className="table-responsive table-card">
                    <Table className="table table-borderless mb-0">
                      <tbody>
                        <tr>
                          <td className="fw-medium">Entreprise</td>
                          <td>{info.ent_name}</td>
                        </tr>
                        <tr>
                          <td className="fw-medium">Poste</td>
                          <td>{info.epe_job}</td>
                        </tr>
                        <tr>
                          <td className="fw-medium">Email</td>
                          <td>{info.epe_email}</td>
                        </tr>
                        <tr>
                          <td className="fw-medium">Téléphone</td>
                          <td>{info.epe_phone}</td>
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
